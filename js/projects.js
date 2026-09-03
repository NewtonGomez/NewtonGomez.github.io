async function loadFeaturedProjects() {
    try {
        const response = await fetch('./data/projects.json');
        if (!response.ok) throw new Error("Could not load projects.json");
        const data = await response.json();
        
        const grid = document.getElementById('featured-projects-grid');
        if (!grid) return data;
        grid.replaceChildren();

        data.featuredProjects.forEach(proj => {
            const article = document.createElement('article');
            article.className = proj.isHero ? 'project-card hero-project' : 'project-card';
            
            const contentDiv = document.createElement('div');
            
            const type = document.createElement('span');
            type.className = 'project-type';
            type.textContent = localize(proj.category);
            
            const title = document.createElement('h3');
            title.className = 'project-title';
            title.textContent = localize(proj.name);
            
            const desc = document.createElement('p');
            desc.className = 'project-desc';
            desc.textContent = localize(proj.description);
            
            const techDiv = document.createElement('div');
            techDiv.className = 'project-tech mono-text';
            proj.technologies.forEach(t => {
                const span = document.createElement('span');
                span.textContent = t;
                techDiv.appendChild(span);
            });
            
            contentDiv.append(type, title, desc, techDiv);

            // --- Renderizado seguro de Evidencia Científica ---
            if (proj.evidence) {
                const evContainer = document.createElement('div');
                evContainer.className = 'project-evidence';

                if (localize(proj.evidence.title)) {
                    const evTitle = document.createElement('h4');
                    evTitle.className = 'evidence-title';
                    evTitle.textContent = localize(proj.evidence.title);
                    evContainer.appendChild(evTitle);
                }

                if (localize(proj.evidence.context)) {
                    const evCtx = document.createElement('p');
                    evCtx.className = 'evidence-context';
                    evCtx.textContent = localize(proj.evidence.context);
                    evContainer.appendChild(evCtx);
                }

                if (proj.evidence.type === 'metrics') {
                    const metricsGrid = document.createElement('div');
                    metricsGrid.className = 'evidence-metrics';
                    proj.evidence.items.forEach(item => {
                        const mBox = document.createElement('div');
                        const mVal = document.createElement('span');
                        mVal.className = 'ev-metric-val';
                        mVal.textContent = item.value;
                        const mLab = document.createElement('span');
                        mLab.className = 'ev-metric-lab';
                        mLab.textContent = localize(item.label);
                        mBox.append(mVal, mLab);
                        metricsGrid.appendChild(mBox);
                    });
                    evContainer.appendChild(metricsGrid);
                } 
                else if (proj.evidence.type === 'comparison') {
                    const compDiv = document.createElement('div');
                    compDiv.className = 'evidence-comparison mono-text';
                    
                    const headerRow = document.createElement('div');
                    headerRow.className = 'comp-row comp-header';
                    const hEmpty = document.createElement('span');
                    const hM1 = document.createElement('span');
                    hM1.textContent = proj.evidence.items[0].model;
                    const hM2 = document.createElement('span');
                    hM2.textContent = proj.evidence.items[1].model;
                    headerRow.append(hEmpty, hM1, hM2);

                    const dataRow = document.createElement('div');
                    dataRow.className = 'comp-row';
                    const dAcc = document.createElement('span');
                    dAcc.textContent = proj.evidence.metric ? localize(proj.evidence.metric) : (i18nGet('dynamic.accuracy') || 'Accuracy');
                    const dS1 = document.createElement('span');
                    dS1.textContent = localize(proj.evidence.items[0].score);
                    const dS2 = document.createElement('span');
                    dS2.textContent = localize(proj.evidence.items[1].score);
                    dataRow.append(dAcc, dS1, dS2);

                    compDiv.append(headerRow, dataRow);
                    evContainer.appendChild(compDiv);

                    if (proj.evidence.footer) {
                        const footerDiv = document.createElement('div');
                        footerDiv.className = 'evidence-footer';
                        proj.evidence.footer.forEach(f => {
                            const fSpan = document.createElement('span');
                            fSpan.textContent = localize(f);
                            footerDiv.appendChild(fSpan);
                        });
                        evContainer.appendChild(footerDiv);
                    }
                }
                else if (proj.evidence.type === 'capabilities') {
                    const capDiv = document.createElement('div');
                    capDiv.className = 'evidence-capabilities mono-text';
                    proj.evidence.items.forEach(item => {
                        const cap = document.createElement('span');
                        cap.textContent = localize(item);
                        capDiv.appendChild(cap);
                    });
                    evContainer.appendChild(capDiv);
                }
                else if (proj.evidence.type === 'flow') {
                    const flowDiv = document.createElement('div');
                    flowDiv.className = 'evidence-flow mono-text';
                    flowDiv.setAttribute('aria-label', i18nGet('dynamic.methodologyFlow') || 'Methodology flow');
                    proj.evidence.items.forEach((item, index) => {
                        const node = document.createElement('span');
                        node.className = 'ev-flow-node';
                        node.textContent = localize(item);
                        flowDiv.appendChild(node);
                        
                        if (index < proj.evidence.items.length - 1) {
                            const arrow = document.createElement('span');
                            arrow.className = 'ev-flow-arrow';
                            arrow.textContent = '↓';
                            flowDiv.appendChild(arrow);
                        }
                    });
                    evContainer.appendChild(flowDiv);
                }

                contentDiv.appendChild(evContainer);
            }

            const linksDiv = document.createElement('div');
            linksDiv.className = 'project-links';
            if (proj.github) {
                const a = document.createElement('a');
                a.href = proj.github;
                a.target = '_blank';
                a.rel = 'noopener';
                a.textContent = 'GitHub →';
                linksDiv.appendChild(a);
            }
            if (proj.pypi) {
                const a = document.createElement('a');
                a.href = proj.pypi;
                a.target = '_blank';
                a.rel = 'noopener';
                a.textContent = 'PyPI →';
                linksDiv.appendChild(a);
            }
            contentDiv.appendChild(linksDiv);
            
            if (proj.isHero) {
                const infoWrapper = document.createElement('div');
                infoWrapper.className = 'hero-project-info';
                infoWrapper.appendChild(contentDiv);
                article.appendChild(infoWrapper);
            } else {
                article.appendChild(contentDiv);
            }
            
            grid.appendChild(article);
        });
        
        return data;
    } catch (error) {
        console.error('Error loading projects data:', error);
        const grid = document.getElementById('featured-projects-grid');
        if (grid) {
            const fallback = document.createElement('p');
            fallback.className = 'mono-text';
            fallback.textContent = i18nGet('dynamic.projectUnavailable') || 'Project information is currently unavailable.';
            grid.replaceChildren(fallback);
        }
        return { excludedRepositories: [], featuredRepositories: [] };
    }
}