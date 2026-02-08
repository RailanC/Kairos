document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('profile-toggle-btn');
    const sidebar = document.querySelector('.profile-sidebar');
    
    // Create overlay element dynamically
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        // Close sidebar when clicking the overlay
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
});