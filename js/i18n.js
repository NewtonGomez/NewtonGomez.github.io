const I18N_DEFAULT_LANGUAGE = 'en';
const I18N_SUPPORTED_LANGUAGES = ['en', 'es'];

let i18nTranslations = {};
let currentLanguage = I18N_SUPPORTED_LANGUAGES.includes(localStorage.getItem('language'))
    ? localStorage.getItem('language')
    : I18N_DEFAULT_LANGUAGE;

function getCurrentLanguage() {
    return currentLanguage;
}

function localize(value, language = currentLanguage) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.map(item => localize(item, language));
    if (typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, language)) {
            return value[language];
        }
        if (Object.prototype.hasOwnProperty.call(value, I18N_DEFAULT_LANGUAGE)) {
            return value[I18N_DEFAULT_LANGUAGE];
        }
    }
    return value;
}

function i18nGet(path, language = currentLanguage) {
    return path.split('.').reduce((value, key) => value?.[key], i18nTranslations[language]);
}

function applyStaticTranslations(language = currentLanguage) {
    document.documentElement.lang = language;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const translated = i18nGet(element.dataset.i18n, language);
        if (translated !== undefined) element.textContent = translated;
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const translated = i18nGet(element.dataset.i18nAriaLabel, language);
        if (translated !== undefined) element.setAttribute('aria-label', translated);
    });

    const title = i18nGet('meta.title', language);
    if (title) document.title = title;

    const description = i18nGet('meta.description', language);
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && description) descriptionMeta.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) ogTitle.setAttribute('content', title);

    const ogDescription = i18nGet('meta.ogDescription', language);
    const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta && ogDescription) ogDescriptionMeta.setAttribute('content', ogDescription);

    document.querySelectorAll('#language-toggle, .mobile-language-toggle').forEach(languageToggle => {
        languageToggle.textContent = language === 'en' ? 'ES' : 'EN';
        languageToggle.setAttribute('aria-label', i18nGet('nav.languageAria', language) || 'Change language');
    });
}

async function initI18n() {
    try {
        const response = await fetch('./data/translations.json');
        if (!response.ok) throw new Error('Could not load translations.json');
        i18nTranslations = await response.json();
        applyStaticTranslations(currentLanguage);
    } catch (error) {
        console.warn('Translations could not be loaded; using English HTML fallbacks.', error);
        currentLanguage = I18N_DEFAULT_LANGUAGE;
        document.documentElement.lang = currentLanguage;
    }
}

function setLanguage(language) {
    if (!I18N_SUPPORTED_LANGUAGES.includes(language)) return;
    currentLanguage = language;
    localStorage.setItem('language', language);
    applyStaticTranslations(language);
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
}

function toggleLanguage() {
    setLanguage(currentLanguage === 'en' ? 'es' : 'en');
}

window.i18nReady = initI18n().then(() => {
    document.querySelectorAll('#language-toggle, .mobile-language-toggle').forEach(button => {
        button.addEventListener('click', toggleLanguage);
    });
});
