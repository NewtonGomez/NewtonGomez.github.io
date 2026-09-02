async function loadResearchData() {
    const container = document.getElementById('research-container');
    
    try {
        const response = await fetch('./data/research.json');
        if (!response.ok) throw new Error("Could not load research.json");
        const data = await response.json();
        
        container.innerHTML = ''; // Limpiamos el placeholder
        
        // 1. Header & Context
        const headerDiv = document.createElement('div');
        headerDiv.className = 'research-header';
        
        const title = document.createElement('h3');
        title.className = 'research-title';
        title.textContent = data.title;
        
        const subtitle = document.createElement('p');
        subtitle.className = 'research-subtitle mono-text';
        subtitle.textContent = data.subtitle;
        
        const desc = document.createElement('p');
        desc.className = 'research-desc';
        desc.textContent = data.description;
        
        const connection = document.createElement('div');
        connection.className = 'research-connection';
        const connectionText = document.createElement('p');
        connectionText.textContent = data.connection;
        connection.appendChild(connectionText);
        
        headerDiv.append(title, subtitle, desc, connection);
        container.appendChild(headerDiv);

        // 1b. Advisors & Institutional Affiliation
        if (data.advisors) {
            const advisorsDiv = document.createElement('div');
            advisorsDiv.className = 'research-advisors';

            const advHeading = document.createElement('h4');
            advHeading.className = 'research-block-heading mono-text';
            advHeading.textContent = data.advisors.heading;

            const advList = document.createElement('ul');
            advList.className = 'research-advisors-list mono-text';

            const directorLi = document.createElement('li');
            directorLi.textContent = `Director: ${data.advisors.director}`;
            advList.appendChild(directorLi);

            if (data.advisors.codirector) {
                const codirectorLi = document.createElement('li');
                codirectorLi.textContent = `Co-director: ${data.advisors.codirector}`;
                advList.appendChild(codirectorLi);
            }

            const affiliationP = document.createElement('p');
            affiliationP.className = 'research-advisors-affiliation';
            affiliationP.textContent = data.advisors.affiliation;

            advisorsDiv.append(advHeading, advList, affiliationP);

            if (data.advisors.linkedProject) {
                const linkedP = document.createElement('p');
                linkedP.className = 'research-advisors-linked mono-text';
                linkedP.textContent = data.advisors.linkedProject;
                advisorsDiv.appendChild(linkedP);
            }

            container.appendChild(advisorsDiv);
        }

        // 2. Levels Grid (Problem, Approach, Validation, Dissemination)
        const levelsGrid = document.createElement('div');
        levelsGrid.className = 'research-levels-grid';

        const sections = [data.problem, data.approach, data.validation, data.dissemination].filter(Boolean);
        sections.forEach(sec => {
            const block = document.createElement('div');
            block.className = 'research-block';
            
            const heading = document.createElement('h4');
            heading.className = 'research-block-heading mono-text';
            heading.textContent = sec.heading;
            
            const text = document.createElement('p');
            text.className = 'research-block-desc';
            text.textContent = sec.description;
            
            const list = document.createElement('ul');
            list.className = 'research-block-list mono-text';
            sec.points.forEach(pt => {
                const li = document.createElement('li');
                li.textContent = pt;
                list.appendChild(li);
            });
            
            block.append(heading, text, list);
            levelsGrid.appendChild(block);
        });
        
        container.appendChild(levelsGrid);

        // 3. Conceptual Architecture Flow
        const flowContainer = document.createElement('div');
        flowContainer.className = 'research-flow-container';
        flowContainer.setAttribute('aria-label', 'Conceptual methodology flow');
        
        data.flow.forEach((step, index) => {
            const node = document.createElement('span');
            node.className = 'flow-node-box';
            if (index === data.flow.length - 1) node.classList.add('highlight');
            node.textContent = step;
            flowContainer.appendChild(node);
            
            if (index < data.flow.length - 1) {
                const arrow = document.createElement('span');
                arrow.className = 'flow-node-arrow';
                arrow.textContent = '→';
                flowContainer.appendChild(arrow);
            }
        });
        
        container.appendChild(flowContainer);

    } catch (error) {
        console.error("Error loading research data:", error);
        container.innerHTML = '<p class="mono-text">Research information is currently unavailable.</p>';
    }
}