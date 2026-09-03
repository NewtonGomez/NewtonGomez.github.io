function el(tag, className = '', text = null) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== null && text !== undefined) node.textContent = text;
    return node;
}

async function loadResearchData() {
    const container = document.getElementById('research-container');
    if (!container) return null;

    try {
        const response = await fetch('./data/research.json');
        if (!response.ok) throw new Error('Could not load research.json');
        const data = await response.json();

        container.replaceChildren();

        // 1. Header & context
        const headerDiv = el('div', 'research-header');
        const title = el('h3', 'research-title', localize(data.title));
        const subtitle = el('p', 'research-subtitle mono-text', localize(data.subtitle));
        const desc = el('p', 'research-desc', localize(data.description));

        headerDiv.append(title, subtitle, desc);

        if (data.connection) {
            const connection = el('blockquote', 'research-connection', localize(data.connection));
            headerDiv.appendChild(connection);
        }

        container.appendChild(headerDiv);

        // 1b. Advisors & institutional affiliation
        if (data.advisors) {
            const advisorsDiv = el('div', 'research-advisors');
            const advHeading = el(
                'h4',
                'research-block-heading mono-text',
                localize(data.advisors.heading)
            );
            const advList = el('ul', 'research-advisors-list mono-text');

            if (data.advisors.director) {
                const directorLi = el('li');
                const directorRole = el('strong', '', i18nGet('dynamic.director') || 'Director:');
                directorLi.append(
                    directorRole,
                    document.createTextNode(` ${data.advisors.director}`)
                );
                advList.appendChild(directorLi);
            }

            if (data.advisors.codirector) {
                const codirectorLi = el('li');
                const codirectorRole = el('strong', '', i18nGet('dynamic.codirector') || 'Co-director:');
                codirectorLi.append(
                    codirectorRole,
                    document.createTextNode(` ${data.advisors.codirector}`)
                );
                advList.appendChild(codirectorLi);
            }

            advisorsDiv.append(advHeading, advList);

            if (localize(data.advisors.affiliation)) {
                advisorsDiv.appendChild(
                    el(
                        'p',
                        'research-advisors-affiliation',
                        localize(data.advisors.affiliation)
                    )
                );
            }

            if (localize(data.advisors.linkedProject)) {
                advisorsDiv.appendChild(
                    el(
                        'p',
                        'research-advisors-linked mono-text',
                        localize(data.advisors.linkedProject)
                    )
                );
            }

            container.appendChild(advisorsDiv);
        }

        // 2. Levels grid (Problem, Approach, Validation, Dissemination)
        const sections = [
            data.problem,
            data.approach,
            data.validation,
            data.dissemination
        ].filter(Boolean);

        if (sections.length) {
            const levelsGrid = el('div', 'research-levels-grid');

            sections.forEach(sec => {
                const block = el('div', 'research-block');
                const heading = el(
                    'h4',
                    'research-block-heading mono-text',
                    localize(sec.heading)
                );
                const text = el('p', 'research-block-desc', localize(sec.description));
                const list = el('ul', 'research-block-list mono-text');

                if (Array.isArray(sec.points)) {
                    sec.points.forEach(point => {
                        list.appendChild(el('li', '', localize(point)));
                    });
                }

                block.append(heading, text, list);
                levelsGrid.appendChild(block);
            });

            container.appendChild(levelsGrid);
        }

        // 3. Conceptual architecture flow
        if (Array.isArray(data.flow) && data.flow.length > 0) {
            const flowContainer = el('div', 'research-flow-container');
            flowContainer.setAttribute('aria-label', i18nGet('dynamic.conceptualFlow') || 'Conceptual methodology flow');

            data.flow.forEach((step, index) => {
                const node = el('span', 'flow-node-box', localize(step));
                if (index === data.flow.length - 1) {
                    node.classList.add('highlight');
                }
                flowContainer.appendChild(node);

                if (index < data.flow.length - 1) {
                    flowContainer.appendChild(el('span', 'flow-node-arrow', '→'));
                }
            });

            container.appendChild(flowContainer);
        }

        return data;
    } catch (error) {
        console.error('Error loading research data:', error);
        container.replaceChildren(
            el('p', 'mono-text', i18nGet('dynamic.researchUnavailable') || 'Research information is currently unavailable.')
        );
        return null;
    }
}
