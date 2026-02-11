import { cartManager } from "./cartManager.js";

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-list-container');
    const cartSubTotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    const cartTemplate = document.getElementById('cart-item-template');
    let shipping = 3.99;
    function renderCart() {
        if (!cartItemsContainer || !cartTemplate) return;

        cartItemsContainer.innerHTML = '';
        const items = cartManager.items;

        if (items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
            if (cartSubTotalElement) cartSubTotalElement.textContent = '0.00 €';
            return;
        }   

        document.querySelectorAll('input[name="shipping_method"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                console.log(e.target.value);
                updateShipping(e.target.value);
            });
        });

        function updateShipping(method){
            const cost = method === 'express' ? 9.99 : 3.99;
            document.getElementById('cart-shipping').textContent = `${cost.toFixed(2)} €`
            cartTotalElement.textContent = `${(cartManager.calculateTotal() + cost).toFixed(2)} €`;
        };       


        items.forEach(item => {
            const clone = cartTemplate.content.cloneNode(true);

            clone.querySelector('.cart-item-id').dataset.id = item.id;
            clone.querySelector('.cart-item-name').textContent = item.title || '';
            clone.querySelector('.cart-item-img').src = item.image || '';
            clone.querySelector('.cart-item-price').textContent = `${item.price.toFixed(2)} €`;
            clone.querySelector('.cart-item-quantity').value = item.quantity;

            const removeBtn = clone.querySelector('.remove-item-btn');
            removeBtn.onclick = () => {
                cartManager.removeItem(item.id);
                renderCart();
            };

            const quantityInput = clone.querySelector('.cart-item-quantity');
            quantityInput.onchange = (e) => {
                cartManager.updateQuantity(item.id, parseInt(e.target.value));
                renderCart();
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
});