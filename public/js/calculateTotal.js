document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalEl = document.getElementById('cart-total');

  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });

  function parseNumber(value) {
    const n = parseFloat(String(value).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }

  function calculateTotal() {
    let total = 0;
    const items = cartItemsContainer?.querySelectorAll('.cart-item') || [];
    items.forEach(item => {
      const price = parseNumber(item.dataset.price);
      const qtyInput = item.querySelector('.cart-qty');
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 0 : parseNumber(item.dataset.quantity || 0);
      total += price * qty;
    });

    totalEl.textContent = formatter.format(total);
    return total;
  }

  cartItemsContainer?.addEventListener('input', (e) => {
    if (e.target.matches('.cart-qty')) {
      if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
        e.target.value = 1;
      }
      calculateTotal();
    }
  });

  cartItemsContainer?.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-item');
    if (!btn) return;
    e.preventDefault();
    const itemEl = btn.closest('.cart-item');
    if (!itemEl) return;

    itemEl.remove();
    calculateTotal();
  });

  calculateTotal();

  window.recalculateCartTotal = calculateTotal;
});