import { cartManager } from "./cartManager.js";
document.addEventListener('DOMContentLoaded', () => {
    const SHIPPING = 3.99;
    const currencyFormatter = value => `${Number(value).toFixed(2)} €`;
    async function renderCart(itemsContainer, totalElement, template) {
        try {
            const cartItemsContainer = document.getElementById(itemsContainer);
            const cartSubTotalElement = document.getElementById('cart-subtotal');
            const cartTotalElement = document.getElementById(totalElement);
            const cartTemplate = document.getElementById(template);

            if (!cartItemsContainer || !cartTemplate) return;

            const cartData = await cartManager.getCart();
            const items = Array.isArray(cartData) ? cartData : (cartData.items || []);

            cartItemsContainer.innerHTML = '';

            if (!items.length) {
                cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
                if (cartSubTotalElement) cartSubTotalElement.textContent = currencyFormatter(0);
                if (cartTotalElement) cartSubTotalElement.textContent = currencyFormatter(0);
                return;
            }   

            for(const item of items){
                const clone = cartTemplate.content.cloneNode(true);

                const nameElement = clone.querySelector('.cart-item-name');
                const imgElement = clone.querySelector('.cart-item-img');
                const priceElement = clone.querySelector('.cart-item-price');
                const quantityInput = clone.querySelector('.cart-item-quantity');
                const removeBtn = clone.querySelector('.remove-item-btn');
                const price = Number(item.price) || 0;

                if(nameElement) nameElement.textContent = item.title || item.name || 'Unnamed product';

                if(imgElement && item.image || '') {
                    imgElement.src = (item.image || '').startsWith('http') 
                        ? item.image 
                        : `/images/products/${item.image}`;
                    imgElement.alt = item.title || item.name || 'product';
                }

                if(priceElement) priceElement.textContent = currencyFormatter(price);

                if(quantityInput) {
                    quantityInput.value = Number(item.quantity) || 1;
                    quantityInput.addEventListener('change', async (event) =>{
                        const newQuantity = parseInt(event.target.value, 10) || 0;
                        try{
                            await cartManager.updateQuantity(item.id, newQuantity);
                            dispatchCartUpdated();
                        }catch (error){
                            console.error('Failed to update quantity', error);
                        }
                    });
                }

                if(removeBtn){
                    removeBtn.addEventListener('click', async () =>{
                        try{
                            await cartManager.removeItem(item.id);
                            dispatchCartUpdated();
                        }catch (error){
                            console.error('Failed to remove item', error);
                        }
                    });
                }
                cartItemsContainer.appendChild(clone);
            }

            const subtotal = (typeof cartManager.calculateTotal === 'function')
                ? await Promise.resolve(cartManager.calculateTotal())
                : (cartData.total || 0);

            if (cartSubTotalElement) cartSubTotalElement.textContent = currencyFormatter(subtotal);
            if (cartTotalElement) cartTotalElement.textContent = currencyFormatter(Number(subtotal) + SHIPPING);
        }catch(error){
            console.error('Error rendering cart:', error.message, error.stack);
        }
    }

    function dispatchCartUpdated() {
        document.dispatchEvent(new CustomEvent('cart:updated'));
    }

    const checkoutCartHandler = () => renderCart('cart-list-container', 'cart-total', 'cart-item-template');
    const sideCartHandler = () => renderCart('side-cart-list-container', 'side-cart-total', 'side-cart-item-template');

    checkoutCartHandler();
    sideCartHandler();

    document.addEventListener('cart:updated', checkoutCartHandler);
    document.addEventListener('cart:updated', sideCartHandler); 


    (function initBillingToggle() {
        const sameAddressCheckbox = document.getElementById('billing-same');
        const billingAddressSection = document.getElementById('billing-address');

        if (!sameAddressCheckbox || !billingAddressSection) return;

        function toggleBillingAddress() {
        billingAddressSection.classList.toggle('d-none', sameAddressCheckbox.checked);
        }

        sameAddressCheckbox.addEventListener('change', toggleBillingAddress);
        toggleBillingAddress();
    })();

    (function initPaymentMethodToggle() {
        const radios = document.querySelectorAll('input[name="payment_method"]');
        const cardDetails = document.getElementById('card-details');
        const paypalDetails = document.getElementById('paypal-details');

        if (radios.length === 0) return;

        const update = (value) => {
        if (cardDetails) cardDetails.classList.toggle('d-none', value !== 'card');
        if (paypalDetails) paypalDetails.classList.toggle('d-none', value !== 'paypal');
        };

        radios.forEach(radio => {
        radio.addEventListener('change', () => update(radio.value));
        if (radio.checked) update(radio.value);
        });
    })();
});