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

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const target = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', target);
        localStorage.setItem('theme', target);
    });
}

const currentYear = document.getElementById('current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();
initTheme();

// --- Mobile Menu Logic ---
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

function updateMobileMenuText(isExpanded) {
    if (!mobileMenuBtn) return;
    const key = isExpanded ? 'nav.close' : 'nav.menu';
    mobileMenuBtn.textContent = i18nGet(key) || (isExpanded ? 'Close' : 'Menu');
}

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
        navLinks.classList.toggle('active');
        updateMobileMenuText(!isExpanded);
    });

    navLinks.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 600) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                updateMobileMenuText(false);
            }
        });
    });

    document.addEventListener('languagechange', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        updateMobileMenuText(isExpanded);
    });
}
