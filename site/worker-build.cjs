// Builds the three artifacts for a strict-CSP host (Instatic), where the scene
// runs in a worker:
//   assets/hero/packed/hero-worker.js.png  — three.js + scene, PNG-packed
//   <scratch>/host.js                       — lucaskimi-deps.js (Lenis + host proxy)
//   <scratch>/runtime.js                    — lucaskimi.js (UI; no three)
// Both pasted scripts (host, runtime) end up with no bare imports, so Instatic
// resolves nothing and nothing loads as a cross-origin script.
//
//   node worker-build.cjs <assetBaseUrl> <scratchDir> [assetMap.json]
// The optional map (asset path -> URL) is for hosts that rename uploads, such
// as Instatic's media library (see instatic-media.json).
const { build, transform } = require("esbuild");
const { PNG } = require(process.env.PNGJS || "pngjs");
const fs = require("fs");
const path = require("path");

const [BASE, OUT, MAP_FILE] = process.argv.slice(2);
// Each script embeds only the map entries its own sources name.
const srcFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? srcFiles(path.join(dir, d.name)) : /\.(js|ts)$/.test(d.name) ? [path.join(dir, d.name)] : [],
  );
const mapFor = (files) => {
  if (!MAP_FILE) return "undefined";
  const text = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  const all = JSON.parse(fs.readFileSync(MAP_FILE, "utf8"));
  return JSON.stringify(Object.fromEntries(Object.entries(all).filter(([k]) => text.includes(`"${k}"`))));
};
const SRC = path.join(__dirname, "src");
const EXTRA_NODE = process.env.PNGJS ? path.dirname(process.env.PNGJS) : null;
const nodePaths = EXTRA_NODE ? [EXTRA_NODE] : undefined;

const packPng = (bytes, file) => {
  const total = bytes.length + 6;
  const width = 1024;
  const height = Math.ceil(Math.ceil(total / 3) / width);
  const png = new PNG({ width, height });
  const data = Buffer.alloc(width * height * 3);
  data.writeUIntBE(bytes.length, 0, 6);
  Buffer.from(bytes).copy(data, 6);
  for (let p = 0; p < width * height; p += 1) {
    png.data[p * 4] = data[p * 3];
    png.data[p * 4 + 1] = data[p * 3 + 1];
    png.data[p * 4 + 2] = data[p * 3 + 2];
    png.data[p * 4 + 3] = 255;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write(png, { colorType: 2, deflateLevel: 9 }));
};

// DRACOLoader's module has top-level `new URL(..., import.meta.url)`, which
// throws in a classic-worker IIFE (no import.meta). The worker never decodes
// Draco — the helmet arrives pre-decoded — so stub the addon out entirely.
const dracoStub = {
  name: "draco-stub",
  setup(b) {
    b.onResolve({ filter: /loaders\/DRACOLoader\.js$/ }, (args) => ({ path: args.path, namespace: "draco-stub" }));
    b.onLoad({ filter: /.*/, namespace: "draco-stub" }, () => ({
      contents: "export class DRACOLoader { setDecoderPath(){return this;} setDecoderConfig(){return this;} setWorkerLimit(){return this;} preload(){return this;} dispose(){} }",
      loader: "js",
    }));
  },
};

// The runtime must not bundle three: alias ./scene.ts to the forwarding stub.
const sceneStub = {
  name: "scene-stub",
  setup(b) {
    b.onResolve({ filter: /(^|\/)scene\.ts$/ }, () => ({ path: path.join(SRC, "scene-stub.ts") }));
  },
};

// The runtime's season data travels as a PNG; stub the three data modules to
// read it off a global (same as instatic-build.cjs).
const evalTs = async (file, extra = "") => {
  const { code } = await transform(fs.readFileSync(file, "utf8") + extra, { loader: "ts", format: "cjs" });
  const m = { exports: {} };
  new Function("module", "exports", code)(m, m.exports);
  return m.exports;
};
const G = "globalThis.__LK_DATA__";
const dataStubs = {
  "map-dots.ts": (s) => s.replace(/const PACKED =[\s\S]*?";\n/, `const PACKED = ${G}.dots;\n`),
  "circuit-path.ts": (s) =>
    s.replace(/export const CIRCUIT_PATH: readonly CircuitPoint\[\] = \[[\s\S]*?\n\];/, `export const CIRCUIT_PATH: readonly CircuitPoint[] = ${G}.circuit;`),
  "map-vector.ts": (s) =>
    s
      .replace(/export const TRACK_RIBBON =\n\s*"[^"]*";/, `export const TRACK_RIBBON = ${G}.ribbon;`)
      .replace(/export const LAP_CENTRELINE =\n\s*"[^"]*";/, `export const LAP_CENTRELINE = ${G}.centreline;`)
      .replace(/export const FLAG_DIAMONDS = "[^"]*";/, `export const FLAG_DIAMONDS = ${G}.flag;`),
};
const dataPlugin = {
  name: "packed-data",
  setup(b) {
    b.onLoad({ filter: /src[\\/]data[\\/](map-dots|circuit-path|map-vector)\.ts$/ }, (args) => {
      const src = fs.readFileSync(args.path, "utf8");
      const stubbed = dataStubs[path.basename(args.path)](src);
      if (!stubbed.includes(G)) throw new Error(`data stub failed: ${args.path}`);
      return { contents: stubbed, loader: "ts" };
    });
  },
};

// Minify, then re-flow onto short lines so the script can be hand-pasted and
// hash-checked inside Instatic.
const reflow = async (code) => {
  const pretty = (await transform(code, { loader: "js", format: "esm", target: "es2022" })).code;
  const lines = pretty
    .split("\n")
    .filter((l) => !/^\s*(\/\/|\/\*\*|\*)/.test(l))
    .map((l) => l.replace(/^\s+/, ""))
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""));
  return lines
    .map((line) => {
      if (line.length <= 1200) return line;
      line = line.replace(/"([^"\\\n]{900,})"/g, (m, body) => {
        const parts = [];
        for (let i = 0; i < body.length; i += 900) parts.push(JSON.stringify(body.slice(i, i + 900)));
        return parts.join("+\n");
      });
      return line
        .split("\n")
        .map((l) => (l.length > 1200 ? l.replace(/\],\[/g, "],\n[").replace(/\], \[/g, "],\n[") : l))
        .join("\n");
    })
    .join("\n");
};

(async () => {
  // 1 — worker: three.js + scene, one self-contained classic-worker IIFE.
  const worker = await build({
    entryPoints: [path.join(SRC, "worker/hero-worker.js")],
    bundle: true,
    nodePaths,
    plugins: [dracoStub],
    format: "iife",
    write: false,
    target: "es2020",
    minify: true,
    legalComments: "none",
    define: { __ASSET_BASE_URL__: JSON.stringify(BASE), __PACKED__: "true" },
  });
  packPng(Buffer.from(worker.outputFiles[0].text, "utf8"), path.join(__dirname, "assets/hero/packed/hero-worker.js.png"));
  console.log("worker:", worker.outputFiles[0].text.length, "bytes (packed)");

  // 2 — host (deps): Lenis + the worker-driving HeroScene proxy, no imports.
  const host = await build({
    entryPoints: [path.join(SRC, "host/hero-host.js")],
    bundle: true,
    nodePaths,
    format: "esm",
    write: false,
    target: "es2022",
    minify: true,
    legalComments: "none",
    define: { __ASSET_BASE_URL__: JSON.stringify(BASE), __ASSET_MAP__: mapFor([path.join(SRC, "host/hero-host.js")]) },
  });
  fs.writeFileSync(path.join(OUT, "host.js"), await reflow(host.outputFiles[0].text));

  // 3 — runtime: the UI, with the scene stubbed out (no three) and the season
  // data packed. Lenis comes from the host's global.
  const season = await evalTs(path.join(SRC, "data/map-dots.ts"), "\nexport { PACKED as __SRC };");
  const circuit = await evalTs(path.join(SRC, "data/circuit-path.ts"));
  const vector = await evalTs(path.join(SRC, "data/map-vector.ts"));
  packPng(
    Buffer.from(JSON.stringify({ dots: season.__SRC, circuit: circuit.CIRCUIT_PATH, ribbon: vector.TRACK_RIBBON, centreline: vector.LAP_CENTRELINE, flag: vector.FLAG_DIAMONDS })),
    path.join(__dirname, "assets/season/data.json.png"),
  );
  const runtime = await build({
    entryPoints: [path.join(SRC, "main.js")],
    bundle: true,
    format: "esm",
    write: false,
    target: "es2022",
    minify: true,
    legalComments: "none",
    external: ["three", "three/addons/*", "lenis"],
    plugins: [sceneStub, dataPlugin],
    define: { __ASSET_BASE_URL__: JSON.stringify(BASE), __PACKED__: "true", __ASSET_MAP__: mapFor(srcFiles(SRC).filter((f) => !f.includes(`${path.sep}host${path.sep}`))) },
  });
  let code = runtime.outputFiles[0].text;
  // Lenis comes from the host's global. Swap its import for a plain binding…
  code = code.replace(/import\s+([A-Za-z$_][\w$]*)\s+from\s*"lenis";/, "var $1=globalThis.__LK_LIBS__.Lenis;");
  if (/from\s*"(three|lenis)/.test(code)) throw new Error("runtime still imports three/lenis");
  // …and wait for the host to publish the libraries before running (no imports
  // remain, so the whole bundle can run inside the waiter).
  code = `(() => { const t = () => globalThis.__LK_LIBS__ && globalThis.__LK_LIBS__.HeroScene ? lk() : setTimeout(t, 20); t(); })();\nfunction lk() {\n${code}\n}`;
  fs.writeFileSync(path.join(OUT, "runtime.js"), await reflow(code));
  console.log("host.js, runtime.js written to", OUT);
})();
