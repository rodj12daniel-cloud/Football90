const { getPool, requireAdmin } = require('./_helpers');

module.exports = async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const [rows] = await getPool().execute(`SELECT o.id, o.user_id, o.total, o.status, o.created_at, u.name, u.email
        FROM orders o LEFT JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC LIMIT 100`);
      return res.json({ orders: rows });
    }
    if (req.method === 'PATCH') {
      const id = Number(req.body?.id);
      const status = String(req.body?.status || '').trim();
      if (!id || !status || status.length > 80) return res.status(400).json({ message: 'Valid order ID and status are required.' });
      await getPool().execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
      return res.json({ message: 'Order status updated.' });
    }
    return res.status(405).json({ message: 'Method not allowed.' });
  } catch (error) {
    console.error('Order management error:', error);
    return res.status(500).json({ message: 'Unable to load orders right now.' });
  }
};
