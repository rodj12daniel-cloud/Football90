document.addEventListener('DOMContentLoaded', () => {
  const wishlistItems = document.getElementById('wishlistItems');
  if (!wishlistItems) return;

  function renderWishlist() {
    const wishlist = getWishlist();
    const items = wishlist.map((id) => getProductById(id)).filter(Boolean);

    if (!items.length) {
      wishlistItems.innerHTML = '<div class="empty-box">Your wishlist is empty. <a href="shop.html">Browse jerseys</a>.</div>';
      return;
    }

    wishlistItems.innerHTML = `
      <div class="wishlist-wrap">
        <div class="wishlist-items">
          ${items.map((product) => `
            <div class="cart-item">
              <img src="${product.image}" alt="${product.name}" />
              <div>
                <h4>${product.name}</h4>
                <div class="cart-meta">${product.team} • ${product.kitType}</div>
              </div>
              <div class="price-block-inline" style="font-weight: 800;">${formatCurrency(product.price)}</div>
              <button class="card-btn" data-add-to-cart="${product.id}" data-size="${product.sizes[0]}">Add to Cart</button>
              <button class="remove-link" data-remove-wishlist="${product.id}">Remove</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    setupGlobalCartButtons();
    document.querySelectorAll('[data-remove-wishlist]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = getWishlist().filter((id) => id !== Number(button.dataset.removeWishlist));
        saveWishlist(next);
        renderWishlist();
      });
    });
  }

  renderWishlist();
});
