const { clearAdminCookie, setAdminCookie } = require('./_helpers');
const bcrypt = require('bcrypt');

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '');
    if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ message: 'Admin password is not configured.' });
    if (username !== (process.env.ADMIN_USERNAME || 'admin123') || !(await bcrypt.compare(password, process.env.ADMIN_PASSWORD))) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }
    setAdminCookie(res);
    return res.json({ admin: { username } });
  }
  if (req.method === 'DELETE') {
    clearAdminCookie(res);
    return res.json({ message: 'Admin logged out.' });
  }
  return res.status(405).json({ message: 'Method not allowed.' });
};
