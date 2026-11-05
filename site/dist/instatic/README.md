# Scripts published to the Instatic site

The Instatic host enforces `script-src 'self'` (no CDN scripts) and cannot install
npm packages, so the site runs as:

- `lucaskimi-deps.js` — Lenis plus a proxy that starts the hero scene in a **Web
  Worker** (`worker-src blob:`). three.js and the scene travel as
  `assets/hero/packed/hero-worker.js.png` (images are allowed from any https host);
  all textures, the helmet and the HDR are decoded on the page and transferred in.
- `lucaskimi.js` — the page runtime (no three.js), which waits for the libraries
  the deps script publishes on `globalThis.__LK_LIBS__`.

Both files have no imports. They are byte-identical to the Instatic code assets
and are produced by `node worker-build.cjs <asset base url> <out dir>`.

Instatic-only CSS (its importer trims spaces inside `[ Garage → ]`):

```css
.mast-garage > span[aria-hidden]:first-child { margin-right: 0.3em; }
.mast-garage > span[aria-hidden]:last-child { margin-left: 0.3em; }
```
