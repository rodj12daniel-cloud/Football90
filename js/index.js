document.addEventListener('DOMContentLoaded', () => {
  const featuredProducts = document.getElementById('featured-products');
  const newArrivals = document.getElementById('new-arrivals');
  const worldcupGrid = document.getElementById('worldcup-grid');

  if (worldcupGrid) {
    const countries = ['Brazil', 'Argentina', 'France', 'Germany', 'Spain', 'Portugal', 'England', 'Netherlands', 'Japan', 'Mexico'];

    worldcupGrid.innerHTML = countries.map((country) => {
      const product = FOOTBALL90_PRODUCTS.find((item) => item.team === country);
      const destination = product ? `product.html?id=${product.id}` : 'worldcup.html';
      return `
      <article class="country-card">
        <a href="${destination}">
          <img class="${nationalTeamLogo(country) ? 'national-team-image' : ''}" src="${nationalTeamLogo(country) || teamProductImage(country)}" alt="${country} logo" />
          <div class="country-body">
            <div class="meta-row">
              <span class="tag">${country}</span>
              <span class="tag">Home</span>
            </div>
            <h4>${country}</h4>
            <span class="shop-link">Shop Now</span>
          </div>
        </a>
      </article>
    `;
    }).join('');
  }

  const renderProducts = (container, items) => {
    if (!container) return;
    container.innerHTML = items.map((product) => `
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

    setupGlobalWishlistButtons();
    setupGlobalCartButtons();
  };

  renderProducts(featuredProducts, FOOTBALL90_PRODUCTS.slice(0, 8));
  renderProducts(newArrivals, FOOTBALL90_PRODUCTS.filter((product) => product.badge === 'New' || product.badge === 'Best Seller').slice(0, 8));
});
