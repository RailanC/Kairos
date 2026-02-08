document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.getElementById('profile-toggle-btn');
    const cartBtn = document.getElementById('cart-toggle-btn');
    
    const profileSidebar = document.querySelector('.profile-sidebar');
    const cartSidebar = document.querySelector('.cart-sidebar');

    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    function closeAll() {
        profileSidebar?.classList.remove('active');
        cartSidebar?.classList.remove('active');
        overlay.classList.remove('active');
    }

    profileBtn?.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar?.classList.remove('active');
        profileSidebar.classList.toggle('active');
        overlay.classList.toggle('active', profileSidebar.classList.contains('active'));
    });

    cartBtn?.addEventListener('click', function(e) {
        e.preventDefault();
        profileSidebar?.classList.remove('active'); 
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active', cartSidebar.classList.contains('active'));
    });


    overlay.addEventListener('click', closeAll);

    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") closeAll();
    });
});