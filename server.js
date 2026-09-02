require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const { setCustomerCookie } = require('./api/auth/_helpers');
const ordersHandler = require('./api/orders');
const adminLoginHandler = require('./api/admin/login');
const adminUsersHandler = require('./api/admin/users');
const adminOrdersHandler = require('./api/admin/orders');
const adminStatsHandler = require('./api/admin/stats');

const app = express();
const port = Number(process.env.PORT) || 3000;
const sslOptions = process.env.DB_SSL === 'true' ? {
  rejectUnauthorized: true,
  ...(process.env.DB_SSL_CA ? {
    ca: process.env.DB_SSL_CA.includes('BEGIN CERTIFICATE')
      ? process.env.DB_SSL_CA.replace(/\\n/g, '\n')
      : fs.readFileSync(path.resolve(process.env.DB_SSL_CA))
  } : {})
} : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'football90',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  ssl: sslOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use((req, res, next) => { req.body = req.body || {}; next(); });

function validateCredentials(name, email, password) {
  if (!name || name.length < 2 || name.length > 100) return 'Name must be between 2 and 100 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (!password || password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const validationError = validateCredentials(name, email, password);

  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'customer']
    );
    const user = { id: result.insertId, name, email, role: 'customer' };
    setCustomerCookie(res, user);
    return res.status(201).json({ user });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'An account with that email already exists.' });
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Unable to create your account right now.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const [rows] = await pool.execute('SELECT id, name, email, password, role, is_active FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (user.is_active === 0 || user.is_active === false) return res.status(403).json({ message: 'This account is inactive.' });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    setCustomerCookie(res, safeUser);
    return res.json({ user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
});

app.post('/api/orders', ordersHandler);
app.all('/api/admin/login', adminLoginHandler);
app.all('/api/admin/users', adminUsersHandler);
app.all('/api/admin/orders', adminOrdersHandler);
app.all('/api/admin/stats', adminStatsHandler);

app.listen(port, () => {
  console.log(`Football 90 is running at http://localhost:${port}`);
});
