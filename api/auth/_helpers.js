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

async function registerUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await getPool().execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, 'customer']
  );
  return { id: result.insertId, name, email, role: 'customer' };
}

module.exports = { getPool, registerUser, validateCredentials };
