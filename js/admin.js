document.addEventListener('DOMContentLoaded', () => {
  const login = document.getElementById('adminLogin');
  const dashboard = document.getElementById('adminDashboard');
  const message = document.getElementById('adminLoginMessage');
  const request = (url, options = {}) => fetch(url, { credentials: 'include', ...options }).then(async (response) => {
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Request failed.');
    return result;
  });
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  async function loadDashboard() {
    const [stats, users, orders] = await Promise.all([request('/api/admin/stats'), request('/api/admin/users'), request('/api/admin/orders')]);
    document.getElementById('adminStats').innerHTML = [['Total users', stats.stats.totalUsers], ['Total orders', stats.stats.totalOrders], ['Revenue', `₱${Number(stats.stats.revenue).toLocaleString('en-PH')}`], ['Pending orders', stats.stats.pendingOrders]].map(([label, value]) => `<div class="admin-stat"><span>${label}</span><strong>${value}</strong></div>`).join('');
    document.getElementById('usersTable').innerHTML = users.users.map((user) => `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td><select data-role="${user.id}" aria-label="Role for ${escapeHtml(user.email)}"><option ${user.role === 'customer' ? 'selected' : ''}>customer</option><option ${user.role === 'admin' ? 'selected' : ''}>admin</option></select></td><td>${user.is_active ? 'Active' : 'Inactive'}</td><td><button class="table-action" data-password="${user.id}">Change password</button><button class="table-action" data-deactivate="${user.id}" ${user.is_active ? '' : 'disabled'}>Deactivate</button></td></tr>`).join('') || '<tr><td colspan="5">No users found.</td></tr>';
    document.getElementById('ordersTable').innerHTML = orders.orders.map((order) => `<tr><td>${escapeHtml(order.name || order.email)}</td><td>₱${Number(order.total).toLocaleString('en-PH')}</td><td><select data-status="${order.id}" aria-label="Status for order ${order.id}"><option ${order.status === 'Order is being prepared' ? 'selected' : ''}>Order is being prepared</option><option ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option><option ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option><option ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option></select></td><td>${new Date(order.created_at).toLocaleDateString('en-PH')}</td><td><button class="table-action" data-cancel="${order.id}" data-cancel-name="${escapeHtml(order.name || order.email)}" ${order.status === 'Cancelled' ? 'disabled' : ''}>Cancel order</button></td></tr>`).join('') || '<tr><td colspan="5">No orders yet.</td></tr>';
  }

  async function showDashboard() {
    login.hidden = true; dashboard.hidden = false;
    try { await loadDashboard(); } catch (error) { login.hidden = false; dashboard.hidden = true; message.textContent = error.message; }
  }

  document.getElementById('adminLoginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); message.textContent = '';
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try { await request('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); await showDashboard(); } catch (error) { message.textContent = error.message; }
  });
  document.getElementById('adminLogout').addEventListener('click', async () => { await request('/api/admin/login', { method: 'DELETE' }); window.location.reload(); });
  document.getElementById('userSearch').addEventListener('input', async (event) => { try { const result = await request(`/api/admin/users?search=${encodeURIComponent(event.target.value)}`); document.getElementById('usersTable').innerHTML = result.users.map((user) => `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.role)}</td><td>${user.is_active ? 'Active' : 'Inactive'}</td><td></td></tr>`).join(''); } catch (error) { message.textContent = error.message; } });
  document.addEventListener('change', async (event) => {
    if (event.target.dataset.role) await request('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: event.target.dataset.role, role: event.target.value }) }).then(loadDashboard);
    if (event.target.dataset.status) await request('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: event.target.dataset.status, status: event.target.value }) }).then(loadDashboard);
  });
  document.addEventListener('click', async (event) => {
    if (event.target.dataset.deactivate) await request('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: event.target.dataset.deactivate }) }).then(loadDashboard);
    if (event.target.dataset.password) { const password = window.prompt('Enter a new password (8+ characters):'); if (password) await request('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: event.target.dataset.password, password }) }).then(() => window.alert('Password updated.')); }
    if (event.target.dataset.cancel) {
      const customerName = event.target.dataset.cancelName;
      if (!window.confirm(`Are you sure you want to cancel the order for "${customerName}"?`)) return;
      await request('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: event.target.dataset.cancel, status: 'Cancelled' }) }).then(loadDashboard);
    }
  });
});
