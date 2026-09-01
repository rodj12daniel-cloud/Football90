document.addEventListener('DOMContentLoaded', () => {
  const shopProducts = document.getElementById('shopProducts');
  const resultsCount = document.getElementById('resultsCount');
  const sortSelect = document.getElementById('sortSelect');
  const priceRange = document.getElementById('priceRange');
  const maxPriceDisplay = document.getElementById('maxPriceDisplay');
  const teamFilters = document.getElementById('teamFilters');
  const mobileFilterToggle = document.getElementById('mobileFilterToggle');
  const filters = document.querySelector('.filters');
  const filterCloseBtn = document.querySelector('.filter-close-btn');
  const mobileFilterBackdrop = document.getElementById('mobileFilterBackdrop');
  const closeFilterButtons = document.querySelectorAll('.mobile-close-filters');
  const applyFilterButtons = document.querySelectorAll('.mobile-apply-filters');

  const queryParams = new URLSearchParams(window.location.search);
  const selectedLeague = queryParams.get('league');
  const newOnly = queryParams.get('new') === '1';

  function renderTeamFilters() {
    const teams = window.getUniqueTeams();
    teamFilters.innerHTML = teams.map((team) => `
      <label class="check-item"><input type="checkbox" name="team" value="${team}" /> ${team}</label>
    `).join('');
  }

  function renderProducts(products) {
    if (!shopProducts) return;
    shopProducts.innerHTML = products.map((product) => `
      <article class="product-card">
        <a href="product.html?id=${product.id}" class="product-media" aria-label="View ${product.name}">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-badges">
            ${product.badge ? `<span class="badge ${product.badge.toLowerCase().replace(/\s+/g, '')}">${product.badge}</span>` : ''}
          </div>
        </a>
        <div class="product-body">
          <div class="product-meta">
            <span>${product.team}</span>
            <span>${product.kitType}</span>
          </div>
          <h4>${product.name}</h4>
          <div class="season">${product.season}</div>
          <div class="product-row">
            <span class="price">${formatCurrency(product.price)}</span>
            <span class="rating">★ ${product.rating.toFixed(1)}</span>
          </div>
          <div class="card-actions">
            <button class="wishlist-toggle" data-wishlist-id="${product.id}" aria-label="Add to wishlist">♡</button>
            <button class="card-btn" data-add-to-cart="${product.id}" data-size="${product.sizes[0]}">Add to Cart</button>
          </div>
        </div>
      </article>
    `).join('');

    resultsCount.textContent = products.length;
    setupGlobalWishlistButtons();
    setupGlobalCartButtons();
  }

  function getSelectedValues(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
  }

  function filterAndRender() {
    let products = [...FOOTBALL90_PRODUCTS];
    const selectedCategories = getSelectedValues('category');
    const selectedLeagues = getSelectedValues('league');
    const selectedTeams = getSelectedValues('team');
    const selectedKitTypes = getSelectedValues('kitType');
    const selectedSizes = getSelectedValues('size');
    const maxPrice = Number(priceRange.value);

    if (selectedCategories.length) {
      products = products.filter((product) => selectedCategories.includes(product.category));
    }
    if (selectedLeagues.length) {
      products = products.filter((product) => selectedLeagues.includes(product.league));
    }
    if (selectedTeams.length) {
      products = products.filter((product) => selectedTeams.includes(product.team));
    }
    if (selectedKitTypes.length) {
      products = products.filter((product) => selectedKitTypes.includes(product.kitType));
    }
    if (selectedSizes.length) {
      products = products.filter((product) => product.sizes.some((size) => selectedSizes.includes(size)));
    }
    products = products.filter((product) => product.price <= maxPrice);
    if (selectedLeague) {
      products = products.filter((product) => product.league === selectedLeague);
    }
    if (newOnly) {
      products = products.filter((product) => product.badge === 'New' || product.badge === 'Best Seller');
    }

    const sortValue = sortSelect.value;
    const sorted = [...products];
    switch (sortValue) {
      case 'newest':
        sorted.sort((a, b) => Number(b.season) - Number(a.season));
        break;
      case 'popular':
        sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    renderProducts(sorted);
  }

  function setMobileFiltersOpen(isOpen) {
    if (!filters || !mobileFilterBackdrop) return;
    filters.classList.toggle('open', isOpen);
    mobileFilterBackdrop.classList.toggle('show', isOpen);
    if (mobileFilterToggle) {
      mobileFilterToggle.textContent = isOpen ? 'Hide Categories' : 'All Categories';
      mobileFilterToggle.setAttribute('aria-expanded', String(isOpen));
    }
  }

  if (mobileFilterToggle && filters) {
    mobileFilterToggle.addEventListener('click', () => {
      const isOpen = !filters.classList.contains('open');
      setMobileFiltersOpen(isOpen);
    });
  }

  if (filterCloseBtn) {
    filterCloseBtn.addEventListener('click', () => setMobileFiltersOpen(false));
  }

  closeFilterButtons.forEach((button) => {
    button.addEventListener('click', () => setMobileFiltersOpen(false));
  });

  if (mobileFilterBackdrop) {
    mobileFilterBackdrop.addEventListener('click', () => setMobileFiltersOpen(false));
  }

  applyFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterAndRender();
      setMobileFiltersOpen(false);
    });
  });

  renderTeamFilters();
  maxPriceDisplay.textContent = formatCurrency(priceRange.value);
  priceRange.addEventListener('input', () => {
    maxPriceDisplay.textContent = formatCurrency(priceRange.value);
    filterAndRender();
  });
  sortSelect.addEventListener('change', filterAndRender);
  document.querySelectorAll('input[name="category"], input[name="league"], input[name="team"], input[name="kitType"], input[name="size"]').forEach((box) => {
    box.addEventListener('change', filterAndRender);
  });

  filterAndRender();
});
