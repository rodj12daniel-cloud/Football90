document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutForm');
  const checkoutItems = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const shippingEl = document.getElementById('checkoutShipping');
  const totalEl = document.getElementById('checkoutTotal');

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
    form.addEventListener('submit', (event) => {
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

      saveCart([]);
      form.innerHTML = `
        <div class="empty-box">
          <h3>ORDER CONFIRMED</h3>
          <p>Thanks for being part of the game.</p>
          <a href="index.html" class="btn btn-primary">CONTINUE SHOPPING</a>
        </div>
      `;
      const summary = document.querySelector('.summary-box');
      if (summary) summary.innerHTML = '<h3>Order Summary</h3><div class="empty-box">Your order has been placed.</div>';
    });
  }
});
