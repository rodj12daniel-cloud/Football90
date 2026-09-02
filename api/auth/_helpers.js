const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

let pool;

function getSslOptions() {
  if (process.env.DB_SSL !== 'true') return undefined;

  const configuredCa = process.env.DB_SSL_CA;
  const ca = configuredCa && configuredCa.includes('BEGIN CERTIFICATE')
    ? configuredCa
    : configuredCa
      ? fs.readFileSync(path.resolve(process.cwd(), configuredCa))
      : undefined;

  return { rejectUnauthorized: true, ...(ca ? { ca } : {}) };
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: getSslOptions(),
      waitForConnections: true,
      connectionLimit: 2,
      queueLimit: 0
    });
  }
  return pool;
}

function validateCredentials(name, email, password) {
  if (!name || name.length < 2 || name.length > 100) return 'Name must be between 2 and 100 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (!password || password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function setCustomerCookie(res, user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET || process.env.DB_PASSWORD || 'change-this-secret').update(payload).digest('base64url');
  res.setHeader('Set-Cookie', `football90_user=${payload}.${signature}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}

async function registerUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await getPool().execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, 'customer']
  );
  return { id: result.insertId, name, email, role: 'customer' };
}

module.exports = { getPool, registerUser, setCustomerCookie, validateCredentials };
