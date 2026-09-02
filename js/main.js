document.addEventListener('DOMContentLoaded', async () => {
    // Load independent JSON-backed sections in parallel.
    const [configData] = await Promise.all([
        loadFeaturedProjects(),
        loadResearchData(),
        loadProfileData()
    ]);

    // Use the curated project configuration to filter GitHub API results.
    await fetchLatestProjects(configData);
});
