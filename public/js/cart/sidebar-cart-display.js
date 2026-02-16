import { cartManager } from "./cartManager.js";

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('side-cart-list-container');
    const cartTotalElement = document.getElementById('side-cart-total');
    const cartTemplate = document.getElementById('side-cart-item-template');

    async function renderCart() {
        if (!cartItemsContainer || !cartTemplate) return;

        try {
            const cartData = await cartManager.getCart();
            const items = cartData.items || cartData; 
            cartItemsContainer.innerHTML = '';

            if (!items || items.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-center py-4">Your cart is empty.</p>';
                if (cartTotalElement) cartTotalElement.textContent = '0.00 €';
                return;
            }

            items.forEach(item => {
                const clone = cartTemplate.content.cloneNode(true);

                clone.querySelector('.side-cart-item-name').textContent = item.title || item.name;
                clone.querySelector('.side-cart-item-img').src = item.image.startsWith('http') 
                    ? item.image 
                    : `/images/products/${item.image}`;
                
                const price = parseFloat(item.price) || 0;
                clone.querySelector('.side-cart-item-price').textContent = `${price.toFixed(2)} €`;
                
                const quantityInput = clone.querySelector('.side-cart-item-quantity');
                quantityInput.value = item.quantity;

                quantityInput.onchange = (e) => {
                    const newQuantity = parseInt(e.target.value) || 0;
                    cartManager.updateQuantity(item.id, newQuantity);
                };

                const removeBtn = clone.querySelector('.side-remove-item-btn');
                removeBtn.onclick = () => {
                    cartManager.removeItem(item.id);
                };

                cartItemsContainer.appendChild(clone);
            });

            if (cartTotalElement) {
                const total = cartData.total !== undefined ? cartData.total : cartManager.calculateTotal();
                cartTotalElement.textContent = `${parseFloat(total).toFixed(2)} €`;
            }
        } catch (error) {
            console.error("Failed to render cart:", error);
        }
    }

    renderCart();

    document.addEventListener('cart:updated', renderCart);
});