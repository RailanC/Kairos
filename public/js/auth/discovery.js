// public/js/auth/discovery.js
export async function checkEmail(email, checkUrl) {
    const response = await fetch(checkUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email })
    });
    
    return await response.json();
}

export function initDiscoveryForm() {
    const form = document.getElementById('emailVerificationForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value;
        const url = this.dataset.url;
        const btn = this.querySelector('button[type="submit"]');

        btn.disabled = true;
        btn.textContent = 'Checking...';

        try {
            const result = await checkEmail(email, url);
            
            document.querySelectorAll('.user-email-display').forEach(el => el.textContent = email);
            document.querySelectorAll('.user-email-input').forEach(el => el.value = email);
            const loginEmailInput = document.querySelector('#auth-login input[name="email"]');
            if (loginEmailInput) {
                loginEmailInput.value = email;
            }

            const registerEmailInput = document.querySelector('#auth-register input[name="email"]');
            if (registerEmailInput) {
                registerEmailInput.value = email;
            }

            document.getElementById('auth-discovery').classList.add('d-none');
            if (result.exists) {
                document.getElementById('auth-login').classList.remove('d-none');
                document.getElementById('authPassword')?.focus();
            } else {
                document.getElementById('auth-register').classList.remove('d-none');
            }
            window.toggleModalButtons(true);
        } catch (error) {
            alert('Error checking email. Please try again.');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Continue';
        }
    });
}