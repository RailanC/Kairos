import { cartManager } from "./cartManager.js";
import { showToast } from '../toast.js';

document.addEventListener('DOMContentLoaded', async function () {
    const widget = document.getElementById('payment-widget');
    const publicKey = widget.dataset.publicKey;
    const returnUrl = widget.dataset.returnUrl;
    let totalAmountInCents = (3.99 + cartManager.calculateTotal()) * 100;
    /*document.addEventListener('shippingChanged', (e) => {
        totalAmountInCents = e.detail.cost * 100;
    });*/

    
    if (!publicKey || !returnUrl) {
        console.error("Missing Stripe public key or return URL");
        return;
    }

    if (isNaN(totalAmountInCents) || totalAmountInCents <= 0) {
        totalAmountInCents = 1000;
    }

    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmountInCents })
    });

    const result = await response.json();

    if (result.error) {
        const messageContainer = document.querySelector('#checkout-message');
        messageContainer.textContent = result.error;
        messageContainer.classList.remove('d-none');
        return;
    }

    const stripe = Stripe(publicKey);

    const elements = stripe.elements({ clientSecret: result.clientSecret,
        appearance: { theme: 'stripe' }
    });

    const paymentOptions = {
        layout: "tabs",
        fields: {
            billingDetails: {
                name: 'never',
                email: 'never',
            }
        }
    }
    const paymentElement = elements.create("payment", paymentOptions);
    paymentElement.mount("#link-authentication-element");

    document.getElementById('checkout-submit').addEventListener('click', async function (e) {
        e.preventDefault();
        const form = document.getElementById('ajax-checkout-form');

        if(!form.checkValidity()){
            form.reportValidity();
            return;
        }            

        if (totalAmountInCents < 400) {
            showToast(`You need to have Items in the car`, 'error');
        }

        const submitBtn = e.target;
        submitBtn.disabled = true;
        submitBtn.innerText = "Processing...";
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: returnUrl,
                payment_method_data: {
                    billing_details: {
                        name: document.getElementById('full-name').value,
                        email: document.getElementById('email').value,
                    }
                }
            },
        });

        if (error) {
            const messageContainer = document.querySelector('#checkout-message');
            messageContainer.textContent = error.message;
            messageContainer.classList.remove('d-none');
        }
        
    });
});