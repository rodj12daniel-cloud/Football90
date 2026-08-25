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
    dashboardName.textContent = user ? user.name : 'Guest';
  }
});
