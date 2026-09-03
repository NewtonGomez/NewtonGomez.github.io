document.addEventListener('DOMContentLoaded', async () => {
    await window.i18nReady;

    const [configData] = await Promise.all([
        loadFeaturedProjects(),
        loadResearchData(),
        loadProfileData()
    ]);

    await fetchLatestProjects(configData);

    document.addEventListener('languagechange', async () => {
        await Promise.all([
            loadFeaturedProjects(),
            loadResearchData(),
            loadProfileData()
        ]);
    });
});
