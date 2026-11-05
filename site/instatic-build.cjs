// Builds the copy pasted into the Instatic script asset, for a host whose CSP
// allows same-origin scripts and https images only:
// - bare npm imports (Instatic bundles three and lenis),
// - the helmet/HDR and the season map data as PNG-packed bytes (see assets.js),
// - assets from the Kimi repo on jsDelivr,
// - minified, then re-flowed onto short lines so it can be transcribed and hash-checked.
//   node instatic-build.cjs <asset base url> <out.js>   (also writes assets/season/data.json.png)
const { build, transform } = require("esbuild");
const { PNG } = require(process.env.PNGJS || "pngjs");
const fs = require("fs");
const path = require("path");
const [base, out] = process.argv.slice(2);

const evalTs = async (file, extra = "") => {
  const src = fs.readFileSync(file, "utf8") + extra;
  const { code } = await transform(src, { loader: "ts", format: "cjs" });
  const m = { exports: {} };
  new Function("module", "exports", code)(m, m.exports);
  return m.exports;
};

const packPng = (bytes, file) => {
  const total = bytes.length + 6, width = 1024, height = Math.ceil(Math.ceil(total / 3) / width);
  const png = new PNG({ width, height });
  const data = Buffer.alloc(width * height * 3);
  data.writeUIntBE(bytes.length, 0, 6);
  bytes.copy(data, 6);
  for (let p = 0; p < width * height; p += 1) {
    png.data[p * 4] = data[p * 3]; png.data[p * 4 + 1] = data[p * 3 + 1]; png.data[p * 4 + 2] = data[p * 3 + 2]; png.data[p * 4 + 3] = 255;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write(png, { colorType: 2, deflateLevel: 9 }));
};

(async () => {
  const dots = await evalTs("src/data/map-dots.ts", "\nexport { PACKED as __SRC };");
  const circuit = await evalTs("src/data/circuit-path.ts");
  const vector = await evalTs("src/data/map-vector.ts");
  const data = {
    dots: dots.__SRC,
    circuit: circuit.CIRCUIT_PATH,
    ribbon: vector.TRACK_RIBBON,
    centreline: vector.LAP_CENTRELINE,
    flag: vector.FLAG_DIAMONDS,
  };
  packPng(Buffer.from(JSON.stringify(data)), "assets/season/data.json.png");

  const G = "globalThis.__LK_DATA__";
  const stubs = {
    "map-dots.ts": (s) => s.replace(/const PACKED =[\s\S]*?";\n/, `const PACKED = ${G}.dots;\n`),
    "circuit-path.ts": (s) => s.replace(/export const CIRCUIT_PATH: readonly CircuitPoint\[\] = \[[\s\S]*?\n\];/, `export const CIRCUIT_PATH: readonly CircuitPoint[] = ${G}.circuit;`),
    "map-vector.ts": (s) => s
      .replace(/export const TRACK_RIBBON =\n\s*"[^"]*";/, `export const TRACK_RIBBON = ${G}.ribbon;`)
      .replace(/export const LAP_CENTRELINE =\n\s*"[^"]*";/, `export const LAP_CENTRELINE = ${G}.centreline;`)
      .replace(/export const FLAG_DIAMONDS = "[^"]*";/, `export const FLAG_DIAMONDS = ${G}.flag;`),
  };
  const dataPlugin = {
    name: "packed-data",
    setup(b) {
      b.onLoad({ filter: /src[\\/]data[\\/](map-dots|circuit-path|map-vector)\.ts$/ }, (args) => {
        const src = fs.readFileSync(args.path, "utf8");
        const stubbed = stubs[path.basename(args.path)](src);
        if (stubbed === src || !stubbed.includes(G)) throw new Error(`stub failed: ${args.path}`);
        return { contents: stubbed, loader: "ts" };
      });
    },
  };

  const r = await build({ entryPoints: ["src/main.js"], bundle: true, format: "esm", write: false, target: "es2022",
    external: ["three", "three/addons/*", "lenis"], minify: true, legalComments: "none", plugins: [dataPlugin],
    define: { __ASSET_BASE_URL__: JSON.stringify(base), __PACKED__: "true" } });
  const pretty = (await transform(r.outputFiles[0].text, { loader: "js", format: "esm", target: "es2022" })).code;
  const lines = pretty.split("\n")
    .filter((l) => !/^\s*(\/\/|\/\*\*|\*)/.test(l))
    .map((l) => l.replace(/^\s+/, ""))
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""));
  const code = lines.map((line) => {
    if (line.length <= 1200) return line;
    line = line.replace(/"([^"\\\n]{900,})"/g, (m, body) => {
      const parts = [];
      for (let i = 0; i < body.length; i += 900) parts.push(JSON.stringify(body.slice(i, i + 900)));
      return parts.join("+\n");
    });
    return line.split("\n").map((l) => (l.length > 1200 ? l.replace(/\],\[/g, "],\n[").replace(/\], \[/g, "],\n[") : l)).join("\n");
  }).join("\n");
  fs.writeFileSync(out, code);
  console.log(`${out}: ${code.length} bytes, ${code.split("\n").length} lines`);
})();
