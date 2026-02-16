import { showToast } from '../toast.js';

document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    import('./cartManager.js').then(({ cartManager }) => {
        cartButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const el = e.currentTarget;
                const product = {
                    id: el.dataset.id,
                    title: el.dataset.title,
                    price: parseFloat(el.dataset.price) || 0,
                    image: el.dataset.image.split('/').pop(),
                    quantity: 1,
                };

                const icon = el.querySelector('i');
                icon.className = 'bi bi-hourglass-split'; 

                try {
                    await cartManager.addItem(product);
                    showToast(`Added ${product.title} to your cart!`, 'success');
                    icon.className = 'bi bi-check-lg'; 
                } catch (err) {
                    showToast('Could not add item', 'error');
                    icon.className = 'bi bi-bag-plus';
                } finally {
                    setTimeout(() => {
                        icon.className = 'bi bi-bag-plus';
                    }, 2000);
                }
            });
        });
    });
});