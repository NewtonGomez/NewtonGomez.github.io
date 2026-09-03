const GITHUB_API = 'https://api.github.com/users/NewtonGomez/repos?per_page=100';

let latestGithubRepos = [];

function renderGithubProjects(repos) {
    const grid = document.getElementById('latest-projects-grid');
    if (!grid) return;

    grid.replaceChildren();
    repos.forEach(repo => {
        const card = document.createElement('article');
        card.className = 'gh-card';

        const topDiv = document.createElement('div');
        topDiv.className = 'gh-card-top';

        const title = document.createElement('h3');
        title.className = 'gh-title';
        const aTitle = document.createElement('a');
        aTitle.href = repo.html_url;
        aTitle.target = '_blank';
        aTitle.rel = 'noopener';
        aTitle.textContent = repo.name;
        title.appendChild(aTitle);

        const lang = document.createElement('span');
        lang.className = 'gh-lang';
        lang.textContent = repo.language || 'Config';

        topDiv.append(title, lang);

        const desc = document.createElement('p');
        desc.className = 'gh-desc';
        // Repository descriptions come directly from GitHub and are preserved verbatim.
        desc.textContent = repo.description || i18nGet('dynamic.githubFallbackDescription') || 'Scientific computing repository.';

        card.append(topDiv, desc);
        grid.appendChild(card);
    });
}

async function fetchLatestProjects(configData) {
    const loading = document.getElementById('github-loading');

    try {
        const response = await fetch(GITHUB_API);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const repos = await response.json();

        const { excludedRepositories = [], featuredRepositories = [] } = configData || {};

        const validRepos = repos.filter(repo =>
            !repo.fork &&
            !repo.archived &&
            !repo.private &&
            !excludedRepositories.includes(repo.name) &&
            !featuredRepositories.includes(repo.name)
        );

        validRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        latestGithubRepos = validRepos.slice(0, 3);
        renderGithubProjects(latestGithubRepos);
    } catch (error) {
        console.warn('Graceful fallback for GitHub API:', error);
        if (loading) {
            loading.textContent = i18nGet('dynamic.githubUnavailable') ||
                'Latest repositories are temporarily unavailable. Please visit GitHub directly.';
        }
    }
}

document.addEventListener('languagechange', () => {
    if (latestGithubRepos.length > 0) renderGithubProjects(latestGithubRepos);
});
