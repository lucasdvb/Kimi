# lucaskimi — Kimi Antonelli driver site

- `site/index.html` — the finished page: one self-contained HTML file (three.js and Lenis via an import map, everything else inline).
- `site/assets/` — every image, texture, model and HDR the page loads. `ASSET_BASE_URL` points here.
- `site/src/` — the modules `index.html` is built from (`npm install && npm run build` inside `site/`).
  `ASSET_BASE_URL=https://… OUT=hosted.html node build.mjs` builds a copy that loads its assets from a host.
- `source/` — the original Next.js project the page was recreated from.
