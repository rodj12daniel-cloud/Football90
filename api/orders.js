const { getPool } = require('./auth/_helpers');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });
  const userId = Number(req.body?.userId);
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const total = Number(req.body?.total);
  if (!userId || !items.length || !Number.isFinite(total) || total < 0) return res.status(400).json({ message: 'Invalid order data.' });

  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO orders (user_id, name, email, phone, address, city, province, postal_code, payment, subtotal, shipping, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, req.body.name, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.province, req.body.postalCode, req.body.payment, Number(req.body.subtotal), Number(req.body.shipping), total, 'Order is being prepared']
    );
    for (const item of items) {
      await connection.execute('INSERT INTO order_items (order_id, product_id, product_name, size, quantity, price) VALUES (?, ?, ?, ?, ?, ?)', [result.insertId, Number(item.id), item.name, item.size, Number(item.quantity), Number(item.price)]);
    }
    await connection.commit();
    return res.status(201).json({ orderId: result.insertId, status: 'Order is being prepared' });
  } catch (error) {
    await connection.rollback();
    console.error('Order creation error:', error);
    return res.status(500).json({ message: 'Unable to save your order right now.' });
  } finally {
    connection.release();
  }
};
