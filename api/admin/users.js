const { bcrypt, findUserById, getPool, requireAdmin } = require('./_helpers');

module.exports = async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const search = `%${String(req.query?.search || '').trim()}%`;
      const [rows] = await getPool().execute('SELECT id, name, email, role, is_active, created_at FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY created_at DESC', [search, search]);
      return res.json({ users: rows });
    }
    if (req.method === 'PATCH') {
      const id = Number(req.body?.id);
      const role = req.body?.role;
      const isActive = req.body?.is_active;
      const password = String(req.body?.password || '');
      if (!id || (role !== undefined && !['customer', 'admin'].includes(role))) return res.status(400).json({ message: 'Invalid user update.' });
      if (role !== undefined) await getPool().execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
      if (isActive !== undefined) await getPool().execute('UPDATE users SET is_active = ? WHERE id = ?', [Boolean(isActive), id]);
      if (password) {
        if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
        await getPool().execute('UPDATE users SET password = ? WHERE id = ?', [await bcrypt.hash(password, 12), id]);
      }
      return res.json({ user: await findUserById(id) });
    }
    if (req.method === 'DELETE') {
      const id = Number(req.body?.id);
      if (!id) return res.status(400).json({ message: 'User ID is required.' });
      await getPool().execute('UPDATE users SET is_active = 0 WHERE id = ?', [id]);
      return res.json({ message: 'User deactivated.' });
    }
    return res.status(405).json({ message: 'Method not allowed.' });
  } catch (error) {
    console.error('User management error:', error);
    return res.status(500).json({ message: 'Unable to update users right now.' });
  }
};
