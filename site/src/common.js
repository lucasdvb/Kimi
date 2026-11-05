import { CONFIG, reveal, fade, splitText, subscribe, loopInView, scrub } from "./engine.js";

/** Resolve a token to a concrete colour through a probe's computed colour. */
export const readToken = (token) => {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
};

/** "rgb(a, b, c)" or "rgba(...)" → [r, g, b, a] */
export const parseRgb = (value) => {
  const m = value.match(/[\d.]+/g) || ["0", "0", "0"];
  return [Number(m[0]), Number(m[1]), Number(m[2]), m[3] !== undefined ? Number(m[3]) : 1];
};

/* ------------------------------------------------------------------ headings */

/** Two authored lines, word by word at `index * 130`; the full stop at 130 + 110. */
export const headingControllers = (h2) => {
  const lines = [...h2.querySelectorAll("[data-head-line]")];
  const ctls = lines.map((line, i) =>
    splitText(line, { by: "word", stagger: 110, config: CONFIG.REVEAL, delay: i * 130 }),
  );
  const dot = h2.querySelector("[data-head-dot]");
  if (dot) {
    const d = reveal(dot, fade, CONFIG.REVEAL);
    ctls.push({ play: () => d.play(130 + 110), reverse: () => d.reverse() });
  }
  return ctls;
};

/* ------------------------------------------------------------------ chequered dissolve */

const SOLID_UNTIL = 0.16;
const LIFT = 2;
const ACCENT_SHARE = 0.06;
const noise = (x, y) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export const setupDissolve = (canvas) => {
  const carry = canvas.dataset.dissolve;
  const context = canvas.getContext("2d");
  let progress = 0;
  let width = 0;
  let height = 0;
  let surface = "";
  let accent = "";
  const render = () => {
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const custom = parseFloat(getComputedStyle(canvas).getPropertyValue("--flag-cell"));
    const cell = custom > 0 ? custom : 24;
    const columns = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    const lift = progress * LIFT;
    for (let y = 0; y < rows; y += 1) {
      const depth = y / Math.max(1, rows - 1) + lift;
      if (depth > 1) break;
      const solid = depth <= SOLID_UNTIL;
      const fadeV = clamp01(1 - (depth - SOLID_UNTIL) / (1 - SOLID_UNTIL));
      if (!solid && fadeV <= 0) break;
      for (let x = 0; x < columns; x += 1) {
        if (!solid) {
          if ((x + y) % 2 !== 0) continue;
          if (noise(x, y) > fadeV) continue;
        }
        context.fillStyle = !solid && noise(x + 101, y + 57) < ACCENT_SHARE ? accent : surface;
        context.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  };
  const resize = () => {
    surface = readToken(carry === "light" ? "--background" : "--surface-black");
    accent = readToken("--accent");
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    render();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  scrub(canvas, "top bottom", "top top", (_raw, smoothed) => {
    progress = smoothed;
    render();
  }, { smooth: true, config: CONFIG.TRIGGER });
};

/* ------------------------------------------------------------------ contour backdrop */

const LINE_SCALE = 3.8, LINE_COUNT = 2.5, WAVE_AMOUNT = 0.37, WAVE_SPEED = 1.66, LINE_OPACITY = 0.85;
const CELLS = 96;
const field = (x, y, t) => {
  let f = Math.sin(x * 1.0 + t * 0.6) * 0.5;
  f += Math.sin(y * 0.85 - t * 0.45) * 0.45;
  f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35;
  f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25;
  return f * 0.5 + 0.5;
};

export const setupContour = (canvas, reducedMotion) => {
  const context = canvas.getContext("2d");
  const start = performance.now();
  let colour = "";
  let width = 0;
  let height = 0;
  let values = null;
  const draw = () => {
    if (!width || !height) return;
    const t = ((performance.now() - start) / 1000) * WAVE_SPEED;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const cols = width >= height ? CELLS : Math.max(8, Math.round((CELLS * width) / height));
    const rows = Math.max(8, Math.round((cols * height) / width));
    const stepX = width / cols, stepY = height / rows, aspect = width / height;
    const size = (cols + 1) * (rows + 1);
    if (!values || values.length !== size) values = new Float32Array(size);
    for (let j = 0; j <= rows; j += 1) for (let i = 0; i <= cols; i += 1) {
      const nx = ((i / cols) * 2 - 1) * aspect * LINE_SCALE;
      const ny = ((j / rows) * 2 - 1) * LINE_SCALE;
      const qx = nx + Math.sin(ny * 0.8 + t * 0.7) * WAVE_AMOUNT;
      const qy = ny + Math.cos(nx * 0.7 - t * 0.6) * WAVE_AMOUNT;
      values[j * (cols + 1) + i] = field(qx, qy, t) * LINE_COUNT;
    }
    context.strokeStyle = colour;
    context.lineWidth = 1; context.globalAlpha = LINE_OPACITY; context.beginPath();
    const segment = (p, q) => { context.moveTo(p[0], p[1]); context.lineTo(q[0], q[1]); };
    for (let level = 0.5; level < LINE_COUNT; level += 1)
      for (let j = 0; j < rows; j += 1) for (let i = 0; i < cols; i += 1) {
        const a = values[j * (cols + 1) + i], b = values[j * (cols + 1) + i + 1];
        const c = values[(j + 1) * (cols + 1) + i + 1], d = values[(j + 1) * (cols + 1) + i];
        const index = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (index === 0 || index === 15) continue;
        const x0 = i * stepX, y0 = j * stepY;
        const top = [x0 + stepX * ((level - a) / (b - a)), y0];
        const right = [x0 + stepX, y0 + stepY * ((level - b) / (c - b))];
        const bottom = [x0 + stepX * ((level - d) / (c - d)), y0 + stepY];
        const left = [x0, y0 + stepY * ((level - a) / (d - a))];
        switch (index) {
          case 1: case 14: segment(left, bottom); break;
          case 2: case 13: segment(bottom, right); break;
          case 3: case 12: segment(left, right); break;
          case 4: case 11: segment(top, right); break;
          case 6: case 9: segment(top, bottom); break;
          case 7: case 8: segment(left, top); break;
          case 5: segment(left, top); segment(bottom, right); break;
          case 10: segment(left, bottom); segment(top, right); break;
        }
      }
    context.stroke(); context.globalAlpha = 1;
  };
  const resize = () => {
    colour = readToken(canvas.dataset.contour);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    draw();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  if (reducedMotion) return;
  let stop = null;
  loopInView(canvas, (on) => {
    if (on && !stop) stop = subscribe(draw, () => 24);
    else if (!on && stop) { stop(); stop = null; }
  });
};
