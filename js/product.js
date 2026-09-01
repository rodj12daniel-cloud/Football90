document.addEventListener('DOMContentLoaded', () => {
  const detailContainer = document.getElementById('product-detail');
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id') || 1);
  const product = getProductById(productId) || FOOTBALL90_PRODUCTS[0];

const thumbnails = product.images && product.images.length
  ? product.images
  : [
      product.image,
      teamProductImage(product.team),
      teamProductImage(`${product.team} Away`),
      teamProductImage(product.league)
    ];

  detailContainer.innerHTML = `
    <div class="detail-back-row">
      <button type="button" class="detail-back-btn" id="backToShopBtn">← Back</button>
    </div>
    <div class="gallery-panel">
      <div class="main-image">
        <img src="${product.image}" alt="${product.name}" id="mainProductImage" />
      </div>
      <div class="thumb-list">
        ${thumbnails.map((image, index) => `
          <button type="button" class="thumb-btn ${index === 0 ? 'active' : ''}" data-image="${image}">
            <img src="${image}" alt="${product.name} view ${index + 1}" />
          </button>
        `).join('')}
      </div>
    </div>
    <div class="image-zoom-modal" id="imageZoomModal" aria-hidden="true">
      <div class="image-zoom-backdrop" data-close-zoom="true"></div>
      <div class="image-zoom-dialog" role="dialog" aria-modal="true" aria-label="Product image zoom">
        <button type="button" class="image-zoom-close" id="closeZoomModal" aria-label="Close zoom">×</button>
        <img src="${product.image}" alt="${product.name} zoom" id="zoomedProductImage" />
      </div>
    </div>
    <div class="detail-panel">
      <span class="eyebrow">${product.category}</span>
      <h1>${product.name}</h1>
      <div class="review-stars">★★★★★</div>
      <div class="price-block">
        <span class="price">${formatCurrency(product.price)}</span>
      </div>
      <p>${product.description}</p>
      <div class="meta-list">
        <div class="meta-item"><span>Team</span><strong>${product.team}</strong></div>
        <div class="meta-item"><span>League</span><strong>${product.league}</strong></div>
        <div class="meta-item"><span>Season</span><strong>${product.season}</strong></div>
      </div>

      <div class="size-group">
        <h4>SIZE</h4>
        <div class="option-row">
          ${product.sizes.map((size) => `<button type="button" class="option-chip ${size === product.sizes[0] ? 'active' : ''}" data-size="${size}">${size}</button>`).join('')}
        </div>
      </div>

      <div class="kit-type-wrap">
        <h4>KIT TYPE</h4>
        <div class="option-row">
          <button type="button" class="option-chip active" data-kit="${product.kitType}">${product.kitType}</button>
        </div>
      </div>

      <div class="qty-row">
        <h4>QUANTITY</h4>
        <div class="qty-box">
          <button type="button" id="decreaseQty">−</button>
          <span id="qtyValue">1</span>
          <button type="button" id="increaseQty">+</button>
        </div>
      </div>

      <div class="detail-actions">
        <button type="button" class="btn btn-primary" data-add-to-cart="${product.id}" data-size="${product.sizes[0]}">ADD TO CART</button>
        <button type="button" class="btn btn-secondary" data-wishlist-id="${product.id}">WISHLIST</button>
      </div>

      <div class="detail-section">
        <div class="info-box">
          <h4>Product details</h4>
          <p>Material: High-performance knit</p>
          <p>Fit: Athletic fit</p>
          <p>Season: ${product.season}</p>
          <p>Team: ${product.team}</p>
        </div>
        <div class="info-box">
          <h4>Shipping</h4>
          <p>Free shipping over ₱3,500</p>
          <p>Delivery in 3-5 days</p>
          <p>Returns accepted within 15 days</p>
        </div>
      </div>
    </div>
  `;

  let selectedSize = product.sizes[0];
  let quantity = 1;

  const backBtn = document.getElementById('backToShopBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (document.referrer && document.referrer.includes('shop.html')) {
        window.history.back();
      } else {
        window.location.href = 'shop.html';
      }
    });
  }

  document.querySelectorAll('.option-chip[data-size]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedSize = button.dataset.size;
      document.querySelectorAll('.option-chip[data-size]').forEach((node) => node.classList.toggle('active', node === button));
      const addButton = document.querySelector('[data-add-to-cart]');
      if (addButton) addButton.dataset.size = selectedSize;
    });
  });

  const mainImage = document.getElementById('mainProductImage');
  const imageZoomModal = document.getElementById('imageZoomModal');
  const zoomedProductImage = document.getElementById('zoomedProductImage');
  const closeZoomModal = document.getElementById('closeZoomModal');

  const openZoomModal = (imageUrl) => {
    zoomedProductImage.src = imageUrl;
    imageZoomModal.classList.add('show');
    imageZoomModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeImageZoomModal = () => {
    imageZoomModal.classList.remove('show');
    imageZoomModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  mainImage.addEventListener('click', () => openZoomModal(mainImage.src));
  document.querySelectorAll('.thumb-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.dataset.image;
      mainImage.src = image;
      document.querySelectorAll('.thumb-btn').forEach((node) => node.classList.toggle('active', node === button));
    });
  });
  document.querySelectorAll('.thumb-btn').forEach((button) => {
    button.addEventListener('dblclick', () => openZoomModal(button.dataset.image));
  });
  if (closeZoomModal) closeZoomModal.addEventListener('click', closeImageZoomModal);
  document.querySelector('[data-close-zoom]')?.addEventListener('click', closeImageZoomModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageZoomModal.classList.contains('show')) {
      closeImageZoomModal();
    }
  });

  document.getElementById('increaseQty').addEventListener('click', () => {
    quantity += 1;
    document.getElementById('qtyValue').textContent = quantity;
  });
  document.getElementById('decreaseQty').addEventListener('click', () => {
    if (quantity > 1) {
      quantity -= 1;
      document.getElementById('qtyValue').textContent = quantity;
    }
  });

  const addButton = document.querySelector('[data-add-to-cart]');
  addButton.addEventListener('click', () => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id && item.size === selectedSize);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: product.id, size: selectedSize, quantity });
    }
    saveCart(cart);
    showToast(`${product.name} added to cart`);
  });

  const wishlistBtn = document.querySelector('[data-wishlist-id]');
  if (wishlistBtn) {
    const syncStatus = () => {
      const exists = getWishlist().includes(product.id);
      wishlistBtn.classList.toggle('active', exists);
      wishlistBtn.textContent = exists ? 'ADDED' : 'WISHLIST';
    };

    syncStatus();
    wishlistBtn.addEventListener('click', () => {
      const result = toggleWishlistItem(product.id);
      syncStatus();
      showToast(result.exists ? 'Removed from wishlist' : 'Added to wishlist');
    });
  }
});
