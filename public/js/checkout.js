document.addEventListener('DOMContentLoaded', () => {
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