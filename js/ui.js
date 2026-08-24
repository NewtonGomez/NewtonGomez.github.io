// --- Theme Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');

function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
});

document.getElementById('current-year').textContent = new Date().getFullYear();
initTheme();


// --- Mobile Menu Logic ---
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    
    // Toggle Accessibility state
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle visual class
    navLinks.classList.toggle('active');
    
    // Cambiar el texto del botón
    mobileMenuBtn.textContent = isExpanded ? 'Menu' : 'Close';
});

// Cerrar el menú automáticamente cuando se hace clic en cualquier enlace
const navItems = navLinks.querySelectorAll('a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 600) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            mobileMenuBtn.textContent = 'Menu';
        }
    });
});