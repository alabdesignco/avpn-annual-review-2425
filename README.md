# AVPN Script (Webflow Integration)

**Author:** Alab Design Co.  
**Build System:** Vite  
**Output:** Single IIFE bundle (`bundle.min.js`) for Webflow custom code  

---

## 🧠 Overview
This repository contains modular JavaScript for the AVPN Webflow project.  
The code is written in ES modules under `/scripts` and compiled into a single production-ready file served via **jsDelivr CDN**.

---

## 🚀 Workflow

### 1. Develop Locally
Edit scripts under `scripts/`:
scripts/
├── animations/
├── utils/
├── config/
└── main.js

Run Vite locally:
```bash
npm run dev
```

### 2. Build for Production
Bundle your JS into dist/bundle.min.js:
```bash
npm run build
```

### 3. Push to GitHub
Commit and push to the main or dev branch:
```bash
git add .
git commit -m "Build new version"
git push
```

### 4. Load in Webflow (via jsDelivr CDN)
Production:
<script src="https://cdn.jsdelivr.net/gh/alabdesignco/avpn/dist/bundle.min.js"></script>

Development / QA:
<script src="https://cdn.jsdelivr.net/gh/alabdesignco/avpn@dev/dist/bundle.min.js"></script>

### 5. Versioning
When ready to tag a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

Use versioned CDN links for stability:
<script src="https://cdn.jsdelivr.net/gh/alabdesignco/avpn@v1.0.0/dist/bundle.min.js"></script>

---

## Libraries (Loaded via CDN in Webflow)
These vendor dependencies are loaded directly inside Webflow’s Before  section and excluded from the bundle:
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Observer.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.33/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js"></script>

---

## Folder Structure
avpn/
├── dist/                     # Compiled bundle for Webflow
│   └── bundle.min.js
├── scripts/                  # Modular ES modules
│   ├── animations/
│   ├── utils/
│   ├── config/
│   └── main.js
├── vite.config.js            # Vite configuration (IIFE output)
├── package.json              # Scripts & dependencies
├── .gitignore
└── README.md

---

## Author Notes
This repository follows Alab Design Co.’s modular script system:
	•	Organized by animations, config, and utils folders
	•	Bundled into a lightweight IIFE for Webflow
	•	Delivered via jsDelivr CDN for zero-latency performance

Maintained by: Neil Ryan Manalo
© 2025 Alab Design Co.