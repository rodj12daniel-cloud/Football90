document.addEventListener('DOMContentLoaded', () => {
  const documentEl = document.getElementById('invoiceDocument');
  const notFoundEl = document.getElementById('invoiceNotFound');
  const orderId = new URLSearchParams(window.location.search).get('id');
  const order = getOrders().find((entry) => String(entry.id) === String(orderId));

  if (!order) {
    notFoundEl.hidden = false;
    return;
  }

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value || '';
  };
  const orderDate = new Date(order.createdAt);
  const address = [order.address, order.city, order.province, order.postalCode].filter(Boolean).join(', ');

  setText('invoiceOrderId', order.id);
  setText('invoiceDate', orderDate.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }));
  setText('invoiceStatus', order.status || 'Order is being prepared');
  setText('invoiceCustomer', order.name);
  setText('invoiceContact', `${order.email}${order.phone ? ` | ${order.phone}` : ''}`);
  setText('invoiceAddress', address);
  setText('invoicePayment', order.payment || 'Payment method recorded at checkout');

  const itemsEl = document.getElementById('invoiceItems');
  itemsEl.innerHTML = (order.items || []).map((item) => `
    <tr>
      <th scope="row">${escapeHtml(item.name)}</th>
      <td>${escapeHtml(item.size || '-')}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  setText('invoiceSubtotal', formatCurrency(order.subtotal || 0));
  setText('invoiceShipping', formatCurrency(order.shipping || 0));
  setText('invoiceTotal', formatCurrency(order.total || 0));
  document.getElementById('printInvoice').addEventListener('click', () => window.print());
  documentEl.hidden = false;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
  }
});
