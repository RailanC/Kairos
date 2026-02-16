import { cartManager } from "./cartManager.js";
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-list-container');
    const cartSubTotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    const cartTemplate = document.getElementById('cart-item-template');
    let shipping = 3.99;
    async function renderCart() {
        if (!cartItemsContainer || !cartTemplate) return;
        const cartData = await cartManager.getCart();
        const items = cartData.items || cartData;

        cartItemsContainer.innerHTML = '';

        if (items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
            if (cartSubTotalElement) cartSubTotalElement.textContent = '0.00 €';
            return;
        }   

        items.forEach(item => {
            const clone = cartTemplate.content.cloneNode(true);

            clone.querySelector('.cart-item-name').textContent = item.title || item.name;
            clone.querySelector('.cart-item-img').src = item.image.startsWith('http') 
                    ? item.image 
                    : `/images/products/${item.image}`;
            const price = parseFloat(item.price) || 0;
            clone.querySelector('.cart-item-price').textContent = `${price.toFixed(2)} €`;
            clone.querySelector('.cart-item-quantity').value = item.quantity;

            const removeBtn = clone.querySelector('.remove-item-btn');
            removeBtn.onclick = () => {
                cartManager.removeItem(item.id);
            };

            const quantityInput = clone.querySelector('.cart-item-quantity');
            quantityInput.value = item.quantity;

            quantityInput.onchange = (e) => {
                const newQuantity = parseInt(e.target.value) || 0;
                cartManager.updateQuantity(item.id, newQuantity);
            };

            cartItemsContainer.appendChild(clone);
        });

        if(cartSubTotalElement) {
            cartSubTotalElement.textContent = `${cartManager.calculateTotal().toFixed(2)} €`;
        }

        if(cartTotalElement){
                cartTotalElement.textContent = `${(cartManager.calculateTotal() + shipping).toFixed(2)} €`;
        }
    }

    renderCart();

    document.addEventListener('cart:updated', renderCart);
    const sameAddressCheckbox = document.getElementById('billing-same');
    const billingAddressSection = document.getElementById('billing-address');
    function toggleBillingAddress() {
        if (sameAddressCheckbox.checked) {
            billingAddressSection.classList.add('d-none');
        } else {
            billingAddressSection.classList.remove('d-none');
        }
    }
    sameAddressCheckbox.addEventListener('change', toggleBillingAddress);
    toggleBillingAddress();

    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.getElementById('card-details').classList.toggle('d-none', this.value !== 'card');
            document.getElementById('paypal-details').classList.toggle('d-none', this.value !== 'paypal');
        });
    });
    
});