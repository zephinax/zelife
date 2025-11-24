# Zelife

Zelife is a personal finance and task companion that keeps data local first and can optionally sync to your private GitHub Gist. It ships as an installable PWA (offline-first) with an in-app update prompt.

## Core Features
- Finance tracking with daily/monthly views, Jalali parsing, quick date navigation.
- Task manager with daily/monthly toggles.
- Optional GitHub Gist sync (token + gist ID + filename) for private backups.
- Manual/auto sync toggle, last sync status, and error reporting.
- PWA install, offline cache, and update prompt in Settings.
- Export financial data to clipboard (minified JSON).
- Language toggle (EN/FA); theme-aware UI.
- Full data reset (guarded by confirmation).

## Architecture
- UI: React 19 + TypeScript + Vite, Tailwind CSS utilities.
- State: Zustand with `persist` to `localStorage` (`finance-storage` key).
- PWA: `vite-plugin-pwa` with `registerType: "prompt"` and a custom `public/sw.js`.
- Routing: `BrowserRouter` with base `/` (custom domain `zelife.ir`).
- Build/dev: Bun scripts.

### Project Structure (high level)
- `src/` – app code (pages, components, hooks, store, utils).
- `public/` – static assets, `sw.js`, `offline.html`, `CNAME`.
- `vite.config.ts` – Vite + PWA setup (manifest, caching, base, scope).
- `.github/workflows/deploy.yml` – GitHub Pages build/deploy.

## Getting Started (local)
1) Install Bun: https://bun.sh
2) Install deps:
   ```bash
   bun install
   ```
3) Dev server (port 5050 by default):
   ```bash
   bun run dev
   ```
4) Build:
   ```bash
   bun run build
   ```
5) Preview production build:
   ```bash
   bun run preview
   ```

## GitHub Gist Sync (optional)
1) Create a PAT with **gist** scope: https://github.com/settings/tokens  
2) Create or pick a Gist; copy its ID.  
3) In Settings → “Sync Data” (edit icon), fill:
   - Token
   - Gist ID
   - Filename (e.g., `data.json`)
4) Enable the Sync toggle. Manual sync via the sync icon; last action and errors display under Sync Data.

## PWA & Update Flow
- SW registers immediately; updates use “prompt” mode (no auto `skipWaiting`).  
- When a new version is ready, Settings status shows “Update available.”  
- Click the status text (“Check for updates”) to force a check; choose “Update now” in the modal to activate the waiting SW.  
- Offline: assets cached by Workbox config in `vite.config.ts` and logic in `public/sw.js`.  
- Fallback: `404.html` (copied from `index.html` in CI) enables SPA routing on GitHub Pages.

## Deployment (GitHub Pages, custom domain)
- Output: `dist/` (includes `CNAME` for `zelife.ir`).  
- CI: `.github/workflows/deploy.yml` installs with Bun, builds, copies `dist/index.html` → `dist/404.html`, uploads artifact, and deploys via `actions/deploy-pages`.  
- DNS for `zelife.ir`:
  - `@` A → 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153
  - `www` CNAME → `<your-username>.github.io`
- GitHub → Settings → Pages: set custom domain `zelife.ir`, enforce HTTPS.

## Data Management
- Export financial data: Settings → “Export financial data” (clipboard JSON).  
- Reset all data: Settings → “Reset Data” (irreversible).  
- Storage: local-only by default (Zustand + localStorage); Gist sync is opt-in.

## Scripts
- `bun run dev` – start dev server
- `bun run build` – type-check then build for production
- `bun run preview` – serve the production build locally
- `bun run lint` – lint the codebase

## Troubleshooting
- **Updates not appearing**: open Settings and click the status (“Check for updates”); ensure the modal shows when a worker is waiting. Hard refresh if needed.
- **Sync errors**: verify PAT has `gist` scope, Gist ID/filename are correct, and you’re online.
- **Routing 404s on Pages**: ensure `dist/404.html` exists (CI step) and Pages is serving from the latest deploy.
