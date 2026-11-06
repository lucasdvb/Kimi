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
and are produced by

    node worker-build.cjs /uploads <out dir> instatic-media.json

Every asset lives in the Instatic media library (same origin, `/uploads/...`), so the
live site loads nothing from GitHub or a CDN and the repository can be private.
Instatic gives each upload a generated name; `instatic-media.json` maps each asset
path to its upload, and each script embeds only the entries it uses. The page
markup's `<img>` tags and mask images point at the same uploads. The packed PNGs
(`*.js.png`, `*.glb.png`, `*.hdr.png`, `data.json.png`) survive the media library
losslessly; re-check that if they are ever re-uploaded.

Instatic-only CSS (its importer trims spaces inside `[ Garage → ]`):

```css
.mast-garage > span[aria-hidden]:first-child { margin-right: 0.3em; }
.mast-garage > span[aria-hidden]:last-child { margin-left: 0.3em; }
```
