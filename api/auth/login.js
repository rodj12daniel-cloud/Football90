const bcrypt = require('bcrypt');
const { getPool, setCustomerCookie } = require('./_helpers');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const [rows] = await getPool().execute(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (!user.is_active) return res.status(403).json({ message: 'This account is inactive.' });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    setCustomerCookie(res, safeUser);
    return res.json({ user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
};
