document.addEventListener('DOMContentLoaded', () => {
  const cartItems = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const totalEl = document.getElementById('total');

  function renderCart() {
    const cart = getCart();
    if (!cartItems) return;
    if (!cart.length) {
      cartItems.innerHTML = '<div class="empty-box">Your cart is empty. <a href="shop.html">Browse jerseys</a>.</div>';
      subtotalEl.textContent = formatCurrency(0);
      shippingEl.textContent = formatCurrency(0);
      totalEl.textContent = formatCurrency(0);
      return;
    }

    const items = cart.map((item) => {
      const product = getProductById(item.id);
      if (!product) return '';
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <h4>${product.name}</h4>
            <div class="cart-meta">${product.team} • ${item.size}</div>
          </div>
          <div class="qty-control">
            <button type="button" data-action="decrease" data-id="${product.id}" data-size="${item.size}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-id="${product.id}" data-size="${item.size}">+</button>
          </div>
          <div class="price-block-inline" style="font-weight: 800;">${formatCurrency(product.price * item.quantity)}</div>
          <button class="remove-link" data-remove="${product.id}" data-size="${item.size}">Remove</button>
        </div>
      `;
    }).join('');

    cartItems.innerHTML = items;

    const subtotal = cart.reduce((sum, item) => {
      const product = getProductById(item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    const shipping = subtotal > 0 ? (subtotal >= 3500 ? 0 : 250) : 0;
    const total = subtotal + shipping;

    subtotalEl.textContent = formatCurrency(subtotal);
    shippingEl.textContent = formatCurrency(shipping);
    totalEl.textContent = formatCurrency(total);

    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const cartData = getCart();
        const next = cartData.map((entry) => {
          if (entry.id === Number(button.dataset.id) && entry.size === button.dataset.size) {
            if (button.dataset.action === 'increase') return { ...entry, quantity: entry.quantity + 1 };
            return { ...entry, quantity: Math.max(0, entry.quantity - 1) };
          }
          return entry;
        }).filter((entry) => entry.quantity > 0);
        saveCart(next);
        renderCart();
      });
    });

    document.querySelectorAll('[data-remove]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = getCart().filter((entry) => !(entry.id === Number(button.dataset.remove) && entry.size === button.dataset.size));
        saveCart(next);
        renderCart();
      });
    });
  }

  renderCart();
});
