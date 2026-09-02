document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutForm');
  const checkoutItems = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const shippingEl = document.getElementById('checkoutShipping');
  const totalEl = document.getElementById('checkoutTotal');

  if (!getCurrentUser()) {
    window.location.href = 'login.html?redirect=checkout.html';
    return;
  }

  const currentUser = getCurrentUser();
  const accountProfile = getAccountProfile();
  const checkoutValues = {
    fullName: accountProfile.name || currentUser.name,
    email: accountProfile.email || currentUser.email,
    phone: accountProfile.phone,
    address: accountProfile.address,
    city: accountProfile.city,
    province: accountProfile.province,
    postalCode: accountProfile.postalCode
  };

  Object.entries(checkoutValues).forEach(([fieldName, value]) => {
    const field = form?.querySelector(`[name="${fieldName}"]`);
    if (field && value) field.value = value;
  });

  function renderOrderSummary() {
    const cart = getCart();
    if (!checkoutItems) return;
    if (!cart.length) {
      checkoutItems.innerHTML = '<div class="empty-box">Your cart is empty.</div>';
      subtotalEl.textContent = formatCurrency(0);
      shippingEl.textContent = formatCurrency(0);
      totalEl.textContent = formatCurrency(0);
      return;
    }

    const subtotal = cart.reduce((sum, item) => {
      const product = getProductById(item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    const shipping = subtotal >= 3500 ? 0 : 250;
    const total = subtotal + shipping;

    checkoutItems.innerHTML = cart.map((item) => {
      const product = getProductById(item.id);
      return product ? `<div class="summary-row"><span>${product.name} x ${item.quantity}</span><strong>${formatCurrency(product.price * item.quantity)}</strong></div>` : '';
    }).join('');

    subtotalEl.textContent = formatCurrency(subtotal);
    shippingEl.textContent = formatCurrency(shipping);
    totalEl.textContent = formatCurrency(total);
  }

  renderOrderSummary();

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = form.querySelector('[name="fullName"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const address = form.querySelector('[name="address"]').value.trim();
      const city = form.querySelector('[name="city"]').value.trim();
      const province = form.querySelector('[name="province"]').value.trim();
      const postalCode = form.querySelector('[name="postalCode"]').value.trim();

      if (!name || !email || !phone || !address || !city || !province || !postalCode) {
        showToast('Please fill in all required checkout fields.');
        return;
      }

      const cart = getCart();
      const subtotal = cart.reduce((sum, item) => {
        const product = getProductById(item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
      const shipping = subtotal >= 3500 ? 0 : 250;
      const orderId = `F90-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      const items = cart.map((item) => {
        const product = getProductById(item.id);
        return product ? { id: product.id, name: product.name, size: item.size, quantity: item.quantity, price: product.price } : null;
      }).filter(Boolean);
      const payment = form.querySelector('[name="payment"]:checked')?.value || '';
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: currentUser.id, name, email, phone, address, city, province, postalCode, payment, items, subtotal, shipping, total: subtotal + shipping })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Unable to save your order.');
      } catch (error) {
        showToast(error.message || 'Unable to save your order right now.');
        return;
      }
      const currentOrders = getOrders();
      const newOrder = {
        id: orderId,
        userId: currentUser.id,
        name,
        email,
        phone,
        address,
        city,
        province,
        postalCode,
        payment,
        items,
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: 'Order is being prepared',
        createdAt: new Date().toISOString()
      };
      saveOrders([...currentOrders, newOrder]);
      saveCart([]);
      window.location.href = `account.html?order=${encodeURIComponent(orderId)}`;
    });
  }
});
