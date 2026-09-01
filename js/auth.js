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

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (!name || !email || !password || password !== confirmPassword) {
        showToast('Please complete the form correctly.');
        return;
      }

      saveCurrentUser({ name, email });
      showToast('Account created successfully');
      window.location.href = 'account.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = formData.get('email');
      const password = formData.get('password');
      const user = getCurrentUser();
      if (user && user.email === email && password) {
        showToast('Login successful');
        window.location.href = 'account.html';
      } else {
        showToast('Demo login needs an account to be registered first.');
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
    const count = getOrders().length;
    ordersCount.textContent = count === 1 ? '1 order' : `${count} orders`;
  }

  const addressSummary = document.getElementById('addressSummary');
  if (addressSummary) {
    const profile = getAccountProfile();
    const text = [profile.address, profile.city, profile.province].filter(Boolean).join(', ');
    addressSummary.textContent = text || 'No saved address';
  }
});
