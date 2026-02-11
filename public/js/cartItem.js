document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (cartButtons.length === 0) return;

    import('./cartManager.js').then(({ cartManager }) => {
        cartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const el = e.currentTarget;
                const product = {
                    id: el.dataset.id,
                    title: el.dataset.title,
                    price: parseFloat(el.dataset.price) || 0,
                    image: el.dataset.image,
                };
                cartManager.addItem(product);
                alert(`Added "${product.title}" to cart!`);
            });
        });
    }).catch(err => {
        console.error('Failed to load cartManager', err);
    });
});