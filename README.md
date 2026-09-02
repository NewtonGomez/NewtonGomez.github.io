# Enrique Gómez - Scientific Software Engineering Portfolio

## Project Description

This project is a static, highly scalable, and professional web portfolio tailored for a Scientific Software Engineer and Machine Learning Researcher. Moving away from generic developer templates, it establishes a "Scientific Computing Lab" aesthetic. It emphasizes engineering rigor, reproducibility, and statistical evidence.

The architecture deliberately avoids heavy frontend frameworks, utilizing pure HTML5, CSS3, and ES6+ JavaScript. It features a modular structure where content is driven by JSON as a Single Source of Truth (SSOT). The portfolio integrates with the GitHub REST API to dynamically fetch open-source contributions while gracefully falling back to local data if rate-limited. Security and best practices are prioritized by employing strict DOM manipulation (avoiding `innerHTML` for dynamic content), semantic accessibility, and mobile-first responsive design.

---

## Features

* **No-Framework Architecture:** Built purely with Semantic HTML5, CSS3 (with CSS Variables), and vanilla ES6+ JavaScript.


* **Scientific Aesthetic:** Clean, minimalist design featuring monospaced typography, data matrices, and native HTML/CSS methodology flowcharts.


* **JSON-Driven Content (SSOT):** Featured projects, research methodologies, and statistical evidence are strictly decoupled from the UI and managed via `projects.json` and `research.json`.


* **GitHub API Integration:** Dynamically fetches and filters the latest open-source repositories from `@NewtonGomez` with built-in graceful degradation and error handling.


* **DOM Safety:** Eliminates Cross-Site Scripting (XSS) risks by using native `document.createElement()` and `textContent` for all dynamic data injections.


* **Contextual Evidence Rendering:** Project metrics (e.g., benchmark execution times, statistical p-values) are dynamically injected into project cards for immediate scientific context.


* **Theme Support:** Native Dark/Light mode leveraging `prefers-color-scheme` and `localStorage`.


* **CI/CD Deployment:** Automated deployment to GitHub Pages via GitHub Actions (`deploy.yml`).



## Project Structure

```text
/
├── index.html                  # Semantic structure and entry point
├── README.md                   # Project documentation
├── assets/
│   └── cv/
│       └── Enrique-Gomez-CV.pdf
├── css/
│   ├── variables.css           # Theme colors, fonts, layout variables
│   ├── main.css                # Global resets and typography
│   ├── components.css          # UI components (cards, navbar, grids, matrices)
│   └── responsive.css          # Media queries (mobile-first approach)
├── js/
│   ├── main.js                 # Entry point for async loading
│   ├── github.js               # GitHub API integration & safe rendering
│   ├── projects.js             # Parses projects.json and builds DOM cards
│   ├── research.js             # Parses research.json and builds methodology flow
│   └── ui.js                   # Theme toggling and UI interactions
├── data/
│   ├── profile.json            # Global profile configuration
│   ├── projects.json           # Featured work and experimental evidence
│   └── research.json           # Academic research structure (Problem, Approach, Validation)
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Pages deployment action

```

## Data Configuration

To maintain the portfolio without altering HTML/JS logic, simply update the JSON files in the `/data` directory:

### `data/projects.json`

Defines the curated "Selected Work". You can control which projects are visually dominant using the `isHero` flag and attach structured scientific evidence (metrics, capabilities, comparisons) via the `evidence` object.

### `data/research.json`

Contains ongoing academic research. It separates the narrative into three pillars: **The Problem**, **The Approach**, and **The Validation**, ensuring a clear and professional technical pitch.

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/NewtonGomez/NewtonGomez.github.io.git

```


2. Navigate to the project directory:
```bash
cd NewtonGomez.github.io

```


3. Serve the directory using any local web server. For example, with Python 3:
```bash
python -m http.server 8000

```


4. Open `http://localhost:8000` in your web browser.

## Deployment

This portfolio is configured for [**GitHub Pages**](https://newtongomez.github.io). Pushing changes to the `main` branch will automatically trigger the GitHub Actions workflow (`deploy.yml`) to build and deploy the static site.

## Author

**Enrique Gómez**

* Scientific Software Engineer | Machine Learning | Biomedical Computing
* GitHub: [@NewtonGomez](https://github.com/NewtonGomez)
* PyPI: [NewtonGomez](https://pypi.org/user/NewtonGomez/)

* Location: Aguascalientes, Mexico