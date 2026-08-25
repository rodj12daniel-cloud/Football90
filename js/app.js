const STORAGE_KEYS = {
  cart: 'football90_cart',
  wishlist: 'football90_wishlist',
  auth: 'football90_auth'
};

const formatCurrency = (value) => `₱${Number(value).toLocaleString('en-PH')}`;

function readStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
  return readStorage(STORAGE_KEYS.cart, []);
}

function saveCart(cart) {
  writeStorage(STORAGE_KEYS.cart, cart);
  updateCartCount();
}

function getWishlist() {
  return readStorage(STORAGE_KEYS.wishlist, []);
}

function saveWishlist(wishlist) {
  writeStorage(STORAGE_KEYS.wishlist, wishlist);
  updateWishlistCount();
}

function getCurrentUser() {
  return readStorage(STORAGE_KEYS.auth, null);
}

function saveCurrentUser(user) {
  writeStorage(STORAGE_KEYS.auth, user);
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll('.cart-count').forEach((node) => {
    node.textContent = totalItems;
  });
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  document.querySelectorAll('.wishlist-count').forEach((node) => {
    node.textContent = wishlist.length;
  });
}

function setActivePage() {
  const paths = window.location.pathname.split('/').filter(Boolean);
  const page = paths[paths.length - 1] || 'index.html';
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.includes(page)) {
      link.classList.add('active');
    }
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

function setupSearch() {
  const trigger = document.querySelector('.search-trigger');
  const overlay = document.querySelector('.search-overlay');
  const input = document.querySelector('#searchInput');
  const results = document.querySelector('#searchResults');
  if (!trigger || !overlay || !input || !results) return;

  const openSearch = () => {
    overlay.classList.add('active');
    input.focus();
  };

  const closeSearch = () => {
    overlay.classList.remove('active');
    input.value = '';
    results.innerHTML = '';
  };

  trigger.addEventListener('click', openSearch);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeSearch();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('active')) closeSearch();
  });

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      results.innerHTML = '';
      return;
    }

    const matches = FOOTBALL90_PRODUCTS.filter((product) => {
      const haystack = [
        product.name,
        product.team,
        product.country,
        product.category,
        product.kitType,
        product.season,
        product.league
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    }).slice(0, 6);

    results.innerHTML = matches.length
      ? matches.map((product) => `
        <div class="search-result-item" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <div class="meta">
            <strong>${product.name}</strong>
            <small>${product.team} • ${product.kitType}</small>
          </div>
          <strong>${formatCurrency(product.price)}</strong>
        </div>
      `).join('')
      : '<div class="search-result-item"><div class="meta"><strong>No jerseys found.</strong><small>Try “Brazil”, “Real Madrid” or “2026”</small></div></div>';

    results.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = Number(item.dataset.id);
        closeSearch();
        window.location.href = `product.html?id=${id}`;
      });
    });
  });
}

function setupGlobalWishlistButtons() {
  const wishlistButtons = document.querySelectorAll('[data-wishlist-id]');
  wishlistButtons.forEach((button) => {
    const id = Number(button.dataset.wishlistId);
    const active = getWishlist().includes(id);
    if (active) button.classList.add('active');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const wishlist = getWishlist();
      const exists = wishlist.includes(id);
      const next = exists ? wishlist.filter((item) => item !== id) : [...wishlist, id];
      saveWishlist(next);
      button.classList.toggle('active', !exists);
      if (window.location.pathname.endsWith('wishlist.html')) {
        if (typeof renderWishlistPage === 'function') renderWishlistPage();
      }
      showToast(exists ? 'Removed from wishlist' : 'Added to wishlist');
    });
  });
}

function setupGlobalCartButtons() {
  const buttons = document.querySelectorAll('[data-add-to-cart]');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const productId = Number(button.dataset.addToCart);
      const product = getProductById(productId);
      if (!product) return;
      const cart = getCart();
      const size = button.dataset.size || product.sizes[0];
      const existing = cart.find((item) => item.id === productId && item.size === size);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id: productId, size, quantity: 1 });
      }
      saveCart(cart);
      showToast(`${product.name} added to cart`);
    });
  });
}

function renderHeaderMeta() {
  updateCartCount();
  updateWishlistCount();
  const user = getCurrentUser();
  const accountLink = document.querySelector('[data-account-link]');
  if (accountLink) {
    const accountName = user ? (user.name || 'Account') : 'Account';
    accountLink.innerHTML = '&#128100;';
    accountLink.setAttribute('aria-label', accountName);
    accountLink.title = accountName;
  }
}

function initApp() {
  setActivePage();
  setupMobileMenu();
  setupSearch();
  renderHeaderMeta();
  setupGlobalWishlistButtons();
  setupGlobalCartButtons();
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

window.formatCurrency = formatCurrency;
window.getCart = getCart;
window.saveCart = saveCart;
window.getWishlist = getWishlist;
window.saveWishlist = saveWishlist;
window.getCurrentUser = getCurrentUser;
window.saveCurrentUser = saveCurrentUser;
