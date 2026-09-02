document.addEventListener('DOMContentLoaded', () => {
  const authTabs = document.querySelectorAll('[data-auth-tab]');
  const panels = document.querySelectorAll('.auth-panel');

  authTabs.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.authTab;
      authTabs.forEach((tab) => tab.classList.toggle('active', tab === button));
      panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === target));
    });
  });

  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const guestAccountPrompt = document.getElementById('guestAccountPrompt');
  const accountMemberContent = document.getElementById('accountMemberContent');

  if ((registerForm || loginForm) && getCurrentUser()) {
    window.location.replace('account.html');
    return;
  }

  if (guestAccountPrompt && accountMemberContent) {
    const isLoggedIn = Boolean(getCurrentUser());
    guestAccountPrompt.hidden = isLoggedIn;
    accountMemberContent.hidden = !isLoggedIn;
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim().toLowerCase();
      const password = String(formData.get('password') || '');
      const confirmPassword = String(formData.get('confirmPassword') || '');

      if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password !== confirmPassword) {
        showToast('Enter a valid name, email, and matching passwords (8+ characters).');
        return;
      }

      const submitButton = registerForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || 'Unable to create your account.');
        saveCurrentUser(result.user);
        showToast('Account created successfully.');
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect || 'account.html';
      } catch (error) {
        showToast(error.message || 'Unable to create your account right now.');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = String(formData.get('email') || '').trim().toLowerCase();
      const password = String(formData.get('password') || '');
      if (!email || !password) {
        showToast('Email and password are required.');
        return;
      }

      const submitButton = loginForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || 'Unable to log in.');
        saveCurrentUser(result.user);
        showToast('Login successful.');
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect || 'account.html';
      } catch (error) {
        showToast(error.message || 'Unable to log in right now.');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    const profile = getAccountProfile();
    const user = getCurrentUser();
    const nameField = document.getElementById('profileName');
    const emailField = document.getElementById('profileEmail');
    const phoneField = document.getElementById('profilePhone');
    const cityField = document.getElementById('profileCity');
    const addressField = document.getElementById('profileAddress');
    const provinceField = document.getElementById('profileProvince');
    const postalCodeField = document.getElementById('profilePostalCode');

    if (nameField) nameField.value = profile.name || user?.name || '';
    if (emailField) emailField.value = profile.email || user?.email || '';
    if (phoneField) phoneField.value = profile.phone || '';
    if (cityField) cityField.value = profile.city || '';
    if (addressField) addressField.value = profile.address || '';
    if (provinceField) provinceField.value = profile.province || '';
    if (postalCodeField) postalCodeField.value = profile.postalCode || '';

    profileForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(profileForm).entries());
      const cleaned = {
        name: (data.name || '').trim(),
        email: (data.email || '').trim(),
        phone: (data.phone || '').trim(),
        city: (data.city || '').trim(),
        address: (data.address || '').trim(),
        province: (data.province || '').trim(),
        postalCode: (data.postalCode || '').trim()
      };

      if (!cleaned.name || !cleaned.email || !cleaned.address) {
        showToast('Please fill in your name, email, and address.');
        return;
      }

      saveAccountProfile(cleaned);
      const dashboardName = document.getElementById('dashboardName');
      if (dashboardName) dashboardName.textContent = cleaned.name;
      const addressSummary = document.getElementById('addressSummary');
      if (addressSummary) {
        addressSummary.textContent = cleaned.address + (cleaned.city ? `, ${cleaned.city}` : '');
      }
      showToast('Your details were saved');
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      saveCurrentUser(null);
      window.location.href = 'index.html';
    });
  }

  const dashboardName = document.getElementById('dashboardName');
  if (dashboardName) {
    const user = getCurrentUser();
    const profile = getAccountProfile();
    dashboardName.textContent = profile.name || user?.name || 'Guest';
  }

  const ordersCount = document.getElementById('ordersCount');
  if (ordersCount) {
    const count = getOrders().filter((order) => !order.userId || !getCurrentUser()?.id || String(order.userId) === String(getCurrentUser().id)).length;
    ordersCount.textContent = count === 1 ? '1 order' : `${count} orders`;
  }

  const orderHistory = document.getElementById('orderHistory');
  if (orderHistory) {
    const user = getCurrentUser();
    const orders = getOrders()
      .filter((order) => !order.userId || !user?.id || String(order.userId) === String(user.id))
      .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
    orderHistory.innerHTML = orders.length ? orders.map((order) => `
      <article class="order-history-item${order.items?.[0] ? ' has-product-image' : ''}">
        ${order.items?.[0] ? `
          <a class="order-product-link" href="product.html?id=${encodeURIComponent(order.items[0].id)}" aria-label="View ${order.items[0].name}">
            <img src="${getProductById(order.items[0].id)?.image || ''}" alt="${order.items[0].name}">
          </a>
        ` : ''}
        <div>
          <h4>${order.items?.[0] ? `<a href="product.html?id=${encodeURIComponent(order.items[0].id)}">Order ${order.id}</a>` : `Order ${order.id}`}</h4>
          <p>${new Date(order.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div class="order-status" aria-label="Order status">${order.status || 'Order is being prepared'}</div>
        <strong>${formatCurrency(order.total || 0)}</strong>
        <a href="invoice.html?id=${encodeURIComponent(order.id)}" class="btn btn-secondary">VIEW INVOICE</a>
      </article>
    `).join('') : '<div class="empty-box">No orders yet.</div>';
  }

  const addressSummary = document.getElementById('addressSummary');
  if (addressSummary) {
    const profile = getAccountProfile();
    const text = [profile.address, profile.city, profile.province].filter(Boolean).join(', ');
    addressSummary.textContent = text || 'No saved address';
  }
});
