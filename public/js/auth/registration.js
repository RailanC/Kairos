const form = document.getElementById('ajax-registration-form');
export function initRegistrationForm() {
  const form = document.getElementById('ajax-registration-form');
  if (!form) return console.warn('Registration form not found');

  if (form._registrationInit) return;
  form._registrationInit = true;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const formData = new FormData(this);
    const errorDiv = document.getElementById('registration-errors');
    const btn = this.querySelector('button[type="submit"]');
    const container = document.getElementById('registration-container');
    const successDiv = document.getElementById('registration-success');

    btn.disabled = true;
    btn.textContent = 'Creating account...';
    errorDiv?.classList.add('d-none');

    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        container?.classList.add('d-none');
        successDiv?.classList.remove('d-none');
        if (window.toggleModalButtons) window.toggleModalButtons(false);
      } else {
        errorDiv.textContent = result.errors || 'An error occurred.';
        errorDiv.classList.remove('d-none');
      }
    } catch (err) {
      console.error('Registration fetch error', err);
      errorDiv.textContent = 'Connection error. Please try again.';
      errorDiv.classList.remove('d-none');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Agree and continue';
    }
  }, { passive: false });
}