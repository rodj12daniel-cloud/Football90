const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { getPool } = require('../auth/_helpers');

const cookieName = 'football90_admin';
const secret = process.env.ADMIN_SESSION_SECRET || process.env.DB_PASSWORD || 'change-this-secret';

function createToken() {
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function readCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
  }));
}

function isAdmin(req) {
  const token = readCookies(req)[cookieName];
  if (!token) return false;
  const [payload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  if (!payload || !signature || signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.role === 'admin' && data.exp > Date.now();
  } catch (error) {
    return false;
  }
}

function setAdminCookie(res) {
  res.setHeader('Set-Cookie', `${cookieName}=${createToken()}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}

function clearAdminCookie(res) {
  res.setHeader('Set-Cookie', `${cookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
}

function requireAdmin(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({ message: 'Admin authentication required.' });
    return false;
  }
  return true;
}

async function findUserById(id) {
  const [rows] = await getPool().execute('SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { bcrypt, clearAdminCookie, findUserById, getPool, isAdmin, requireAdmin, setAdminCookie };
