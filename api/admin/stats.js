const { getPool, requireAdmin } = require('./_helpers');

module.exports = async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed.' });
  try {
    const [[stats]] = await getPool().query(`SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COALESCE(SUM(total), 0) FROM orders) AS revenue,
      (SELECT COUNT(*) FROM orders WHERE status = 'Order is being prepared') AS pendingOrders`);
    return res.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ message: 'Unable to load dashboard statistics.' });
  }
};
