// public/js/auth/login.js

export function initLoginForm() {
    const form = document.querySelector('#auth-login form');
    if (!form) {
        return
    };


    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const btn = this.querySelector('button[type="submit"]');
        const errorDiv = document.getElementById('login-errors');

        btn.disabled = true;
        btn.textContent = 'Logging in...';

        try {
            const response = await fetch(this.action || '/login', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                redirect: 'follow'
            });
            if (response.ok && !response.url.includes('/login')) {
                window.location.href = response.url;
                return;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                console.log('Login Result:', result);
                
                if (result.success) {
                    window.location.href = result.targetPath || '/';
                    } else {
                    const errorDiv = document.getElementById('login-errors');
                    if (errorDiv) {
                        errorDiv.textContent = result.error || 'Invalid email or password.';
                        errorDiv.classList.remove('d-none');
                        errorDiv.classList.add('shake-animation');
                        setTimeout(() => {
                            errorDiv.classList.remove('shake-animation');
                        }, 500);
                    } else {
                        alert(result.error || 'Invalid email or password.');
                    }
                }
            } else {
                if (response.ok) {
                    window.location.href = response.url;
                } else {
                    alert('Invalid email or password.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Connection error. Please try again.');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Log in';
        }
    });
}