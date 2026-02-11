import { cartManager } from "./cartManager.js";

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('side-cart-list-container');
    const cartTotalElement = document.getElementById('side-cart-total');
    const cartTemplate = document.getElementById('side-cart-item-template');

    function renderCart() {
        if (!cartItemsContainer || !cartTemplate) return;

        cartItemsContainer.innerHTML = '';
        const items = cartManager.items;

        if (items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
            if (cartTotalElement) cartTotalElement.textContent = '0.00 €';
            return;
        }   

        items.forEach(item => {
            const clone = cartTemplate.content.cloneNode(true);

            clone.querySelector('.side-cart-item-id').dataset.id = item.id;
            clone.querySelector('.side-cart-item-name').textContent = item.title || '';
            clone.querySelector('.side-cart-item-img').src = item.image || '';
            clone.querySelector('.side-cart-item-price').textContent = `${item.price.toFixed(2)} €`;
            clone.querySelector('.side-cart-item-quantity').value = item.quantity;

            const removeBtn = clone.querySelector('.side-remove-item-btn');
            removeBtn.onclick = () => {
                cartManager.removeItem(item.id);
                renderCart();
            };

            const quantityInput = clone.querySelector('.side-cart-item-quantity');
            quantityInput.onchange = (e) => {
                cartManager.updateQuantity(item.id, parseInt(e.target.value));
                renderCart();
            };

            cartItemsContainer.appendChild(clone);
        });

        if(cartTotalElement) {
            cartTotalElement.textContent = `${cartManager.calculateTotal().toFixed(2)} €`;
        }
    }

    renderCart();

    document.addEventListener('cart:updated', renderCart);
});