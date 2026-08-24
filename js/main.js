document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar la data JSON (Curación Manual)
    const configData = await loadFeaturedProjects();
    // Cargar la sección de Research
    await loadResearchData();
    
    // 2. Ejecutar la API de GitHub para inyectar "Latest Projects"
    await fetchLatestProjects(configData);
});