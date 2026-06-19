# Mantel Design System

A static, deployable reference for Mantel's foundations and components — **one component per page**, with a dashboard home and search. No build step.

## View locally
```bash
cd site
python3 -m http.server 8080   # then open http://localhost:8080
```
…or just open `index.html` in a browser.

## Structure
```
site/
├── index.html              Dashboard — live thumbnails + search
├── components/<name>.html  One page per component / foundation
├── assets/
│   ├── kit.css             Design-system CSS (tokens + component styles)
│   ├── kit.js              Component interactivity (modals, tabs, …)
│   ├── shell.css / shell.js  Site chrome (sidebar nav, search, thumbnails)
└── tokens.json             Design tokens (Tailwind / Style Dictionary friendly)
```
Fonts load from Google Fonts (Geist), so every page is self-contained. This folder
is the **entire deliverable** — nothing outside `site/` is needed to run or deploy it.

## Deploy to Cloudflare Pages
**Direct upload (fastest preview):** Cloudflare dashboard → *Workers & Pages* → *Create* → *Pages* → *Upload assets* → drag the **`site/`** folder → *Deploy*. A `*.pages.dev` preview URL is generated.

**Connected to git:** in Pages → *Connect to Git*:
- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: **`/`** if this folder is the repo root · **`site`** if it's a subfolder

Every branch/PR gets its own preview URL automatically.

## Front-end handoff
The product app does **not** import this site — it's the visual reference. Give front-end:
- the Cloudflare preview/production URL, and
- **`tokens.json`** (machine-readable design tokens: Tailwind / Style Dictionary friendly).
