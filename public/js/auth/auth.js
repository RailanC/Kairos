import { initDiscoveryForm } from './discovery.js';
import { initLoginForm } from './login.js';
import { initRegistrationForm } from './registration.js';

window.toggleModalButtons = function(showBack) {
    const backBtn = document.getElementById('modalBackBtn');
    const closeBtn = document.getElementById('modalCloseBtn');

    if (showBack) {
        backBtn.classList.remove('d-none');
        closeBtn.classList.add('d-none');
    } else {
        backBtn.classList.add('d-none');
        closeBtn.classList.remove('d-none');
    }
};

window.goBackToDiscovery = function() {
    document.querySelectorAll('.auth-section').forEach(section => {
        section.classList.add('d-none');
    });
    document.getElementById('auth-discovery').classList.remove('d-none');
    document.getElementById('emailInput')?.focus();
    toggleModalButtons(false);
};

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');

    if (modal) {
        modal.addEventListener('shown.bs.modal', function() {
            initDiscoveryForm();
            initLoginForm();
            initRegistrationForm();
        });

        modal.addEventListener('hidden.bs.modal', function() {
            window.goBackToDiscovery();
        });
    }
});