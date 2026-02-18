import { cartManager } from "../cart/cartManager.js";

export function initLoginForm() {
    const form = document.querySelector('#auth-login form');
    if (!form) return;

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

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                if (result.success) {
                    const items = cartManager.items;
                    console.log('Items found in localStorage:', items);

                    if (items.length > 0) {
                        console.log('Sending sync request with items:', items);
                        try {
                            const syncResponse = await fetch('/api/cart/sync', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({ items })
                            });
                            console.log('Sync response status:', syncResponse.status);
                            const syncResult = await syncResponse.json();
                            console.log('Sync response body:', syncResult);

                            if (syncResponse.ok) {
                                cartManager.clear();
                                console.log('Cart synced and cleared.');
                            } else {
                                console.error('Server rejected sync request:', syncResult);
                            }
                        } catch (e) {
                            console.error('Network error during sync:', e);
                        }
                    }

                    window.location.href = result.targetPath || '/';
                } else {
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