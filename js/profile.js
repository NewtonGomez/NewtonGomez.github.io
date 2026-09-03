function formatProfileLanguages(languages) {
    const languageNames = {
        'Español': i18nGet('profile.spanish') || (getCurrentLanguage() === 'es' ? 'Español' : 'Spanish'),
        'Inglés': i18nGet('profile.english') || (getCurrentLanguage() === 'es' ? 'Inglés' : 'English'),
        'Chino mandarín': i18nGet('profile.mandarin') || (getCurrentLanguage() === 'es' ? 'Chino mandarín' : 'Mandarin Chinese')
    };

    const proficiencyLevels = {
        'Nativo': i18nGet('profile.native') || (getCurrentLanguage() === 'es' ? 'Nativo' : 'Native'),
        'Preparación para certificación HSK 1': i18nGet('profile.hsk') || (getCurrentLanguage() === 'es'
            ? 'Preparación para certificación HSK 1'
            : 'Preparing for HSK 1 certification')
    };

    return languages
        .filter(item => item && item.language)
        .map(item => {
            const language = languageNames[item.language] || item.language;
            const level = proficiencyLevels[item.level] || item.level;
            return level ? `${language} — ${level}` : language;
        })
        .join(' · ');
}

function hydrateEngineeringStack(skills) {
    if (!skills || typeof skills !== 'object') return;

    const stackMap = {
        languages: 'stack-languages',
        scientificComputing: 'stack-scientific-computing',
        machineLearning: 'stack-machine-learning',
        softwareEngineering: 'stack-software-engineering',
        biomedical: 'stack-biomedical',
        embedded: 'stack-embedded'
    };

    Object.entries(stackMap).forEach(([field, elementId]) => {
        const element = document.getElementById(elementId);
        const values = skills[field];
        if (element && Array.isArray(values) && values.length > 0) {
            element.textContent = values.map(value => localize(value)).join(' · ');
        }
    });
}

function hydrateLanguages(languages) {
    if (!Array.isArray(languages) || languages.length === 0) return;

    const aboutMeta = document.querySelector('.about-meta');
    if (!aboutMeta) return;

    const formatted = formatProfileLanguages(languages);
    if (!formatted) return;

    let block = document.getElementById('profile-languages');
    if (!block) {
        block = document.createElement('div');
        block.id = 'profile-languages';
        block.className = 'meta-block';

        const label = document.createElement('span');
        label.className = 'meta-label';
        label.dataset.i18n = 'about.languages';
        label.textContent = i18nGet('about.languages') || (getCurrentLanguage() === 'es' ? 'Idiomas' : 'Languages');

        const value = document.createElement('span');
        value.className = 'meta-value';
        value.id = 'profile-languages-value';

        block.append(label, value);
        aboutMeta.appendChild(block);
    }

    const value = document.getElementById('profile-languages-value');
    if (value) value.textContent = formatted;
}

function hydrateLinkedIn(contactLinks) {
    const linkedin = contactLinks?.linkedin;
    const container = document.querySelector('.contact-links');
    if (!linkedin || !container || document.getElementById('contact-linkedin')) return;

    const link = document.createElement('a');
    link.id = 'contact-linkedin';
    link.href = linkedin;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'LinkedIn';
    container.appendChild(link);
}

async function loadProfileData() {
    try {
        const response = await fetch('./data/profile.json');
        if (!response.ok) throw new Error('Could not load profile.json');
        const data = await response.json();

        hydrateEngineeringStack(data.skills);
        hydrateLanguages(data.languages);
        hydrateLinkedIn(data.contactLinks);

        return data;
    } catch (error) {
        console.warn('Profile data could not be loaded; using static fallbacks.', error);
        return null;
    }
}
