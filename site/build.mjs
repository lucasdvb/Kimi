// Builds the single self-contained index.html.
//   node build.mjs                      → index.html, assets from ./assets
//   ASSET_BASE_URL=https://… OUT=x.html node build.mjs → a hosted copy
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { bodyMarkup } from "./src/markup.mjs";
import { PLATE_OUTLINE, PLATE_CLIP } from "./src/data/plate-shape.mjs";

const A = process.env.ASSET_BASE_URL || "./assets";
const OUT = process.env.OUT || "index.html";

const result = await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  format: "esm",
  write: false,
  target: "es2020",
  external: ["three", "three/addons/*", "lenis"],
  define: { __ASSET_BASE_URL__: JSON.stringify(A) },
  legalComments: "none",
  minifySyntax: true,
  minify: Boolean(process.env.MINIFY),
});
let script = result.outputFiles[0].text.replaceAll("</script", "<\\/script");
// Minified output keeps multi-line template literals (the shaders) verbatim;
// their whole-line GLSL comments can go.
if (process.env.MINIFY) script = script.split("\n").filter((l) => !/^\s*\/\//.test(l)).map((l) => l.replace(/^\s+/, "")).join("\n");
const css = readFileSync("src/styles.css", "utf8");

export const HEAD = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kimi Antonelli</title>
<meta name="description" content="Kimi Antonelli — driver_012 of GRIDO1 Racing Systems, rookie season with the Mercedes-AMG F1 Team.">
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/",
    "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs"
  }
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">`;

const html = `<!doctype html>
<html lang="en">
<head>
${HEAD}
<style>
${css}
</style>
</head>
<body>
${bodyMarkup(A, { PLATE_OUTLINE, PLATE_CLIP })}
<script type="module">
${script}
</script>
</body>
</html>
`;
writeFileSync(OUT, html);
if (process.env.SCRIPT_OUT) writeFileSync(process.env.SCRIPT_OUT, script);
console.log(`${OUT}: ${(html.length / 1024).toFixed(0)} KB, assets from ${A}`);
