document.addEventListener('DOMContentLoaded', () => {
  const featureGrid = document.getElementById('worldcup-featured');
  const countryGrid = document.getElementById('worldcup-countries');
  const collectionGrid = document.getElementById('worldcup-collection');

  const countryList = ['Brazil', 'Argentina', 'France', 'Germany', 'Spain', 'Portugal', 'England', 'Netherlands', 'Japan', 'Mexico'];
  const worldCupProducts = countryList.flatMap((country) => {
    return FOOTBALL90_PRODUCTS.filter((product) => product.country === country && (product.category === 'World Cup' || product.category === 'International'));
  });

  function renderCardGrid(container, items) {
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
          <div class="product-meta"><span>${product.team}</span><span>${product.kitType}</span></div>
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
  }

  if (featureGrid) renderCardGrid(featureGrid, worldCupProducts.slice(0, 4));
  if (collectionGrid) renderCardGrid(collectionGrid, worldCupProducts);

  if (countryGrid) {
    countryGrid.innerHTML = countryList.map((country) => {
      const logo = nationalTeamLogo(country);
      const product = FOOTBALL90_PRODUCTS.find((item) => item.team === country);
      const destination = product ? `product.html?id=${product.id}` : `shop.html?search=${encodeURIComponent(country)}`;
      return `
      <article class="country-card">
        <a href="${destination}">
          <img class="${logo ? 'national-team-image' : ''}" src="${logo || product?.image || teamProductImage(country)}" alt="${country} logo" />
          <div class="country-body">
            <div class="meta-row"><span class="tag">${country}</span><span class="tag">Home</span></div>
            <h4>${country}</h4>
            <span class="shop-link">Shop Now</span>
          </div>
        </a>
      </article>
    `;
    }).join('');
  }
});
