import { CIRCUIT_PATH, CIRCUIT_MARKERS, CIRCUIT_STEP } from "./data/circuit-path.ts";
import { DOTS, DOT_LATTICE, DOT_RADIUS } from "./data/map-dots.ts";
import {
  MAP_VIEW, TRACK_RIBBON, LAP_CENTRELINE, LAP_MASK_WIDTH, LAP_LENGTH, mapToArtboard,
  GRID_AXES_X, GRID_AXIS_Y, GRID_DASH, GRID_STROKE, HUB, RINGS, CORNER_MARKS, CORNER_MARK_SIZE,
  TURN_POINTS, TURNS, FLAG_CUT, FLAG_DIAMONDS,
} from "./data/map-vector.ts";
import { CONFIG, Spring, reveal, rise, fade, splitText, subscribe, loopInView, forwardInView, loopTween, ease, reducedMotion, mq } from "./engine.js";
import { readToken, parseRgb, headingControllers, setupDissolve } from "./common.js";

const SVG = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}, parent) => {
  const node = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  parent?.appendChild(node);
  return node;
};

/* ================================================================ lap maths */

const LAP_MS = 6000;
const LINE_WIDTH = 5.9;
const GLOW_WIDTH = 15;
const HEAD_UNITS = 210;
const COOL_MS = 800;
const MARKER_POP_UNITS = 90;
const CORNER_BRAKE = 9;
const CUT_CENTRE = mapToArtboard(FLAG_CUT.x, FLAG_CUT.y);
const CUT_SCALE = 1438.43 / 2560;
const CUT_ALONG = FLAG_CUT.along * CUT_SCALE;
const CUT_ACROSS = FLAG_CUT.across * CUT_SCALE;

const CUMULATIVE = CIRCUIT_PATH.reduce((acc, point, index) => {
  if (index === 0) return [0];
  const previous = CIRCUIT_PATH[index - 1];
  acc.push(acc[index - 1] + Math.hypot(point[0] - previous[0], point[1] - previous[1]));
  return acc;
}, []);
const TOTAL = CUMULATIVE[CUMULATIVE.length - 1];

const TIME_AT = (() => {
  const count = CIRCUIT_PATH.length;
  const turn = new Array(count).fill(0);
  for (let i = 1; i < count - 1; i += 1) {
    const [ax, ay] = CIRCUIT_PATH[i - 1]; const [bx, by] = CIRCUIT_PATH[i]; const [cx, cy] = CIRCUIT_PATH[i + 1];
    const ux = bx - ax, uy = by - ay, vx = cx - bx, vy = cy - by;
    const lengths = (Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1);
    turn[i] = Math.acos(Math.min(1, Math.max(-1, (ux * vx + uy * vy) / lengths)));
  }
  const window = 6;
  const smoothed = turn.map((_, i) => {
    let sum = 0, n = 0;
    for (let j = Math.max(0, i - window); j <= Math.min(count - 1, i + window); j += 1) { sum += turn[j]; n += 1; }
    return sum / n;
  });
  const accumulated = [0];
  for (let i = 1; i < count; i += 1) {
    const span = CUMULATIVE[i] - CUMULATIVE[i - 1];
    const speed = 1 / (1 + CORNER_BRAKE * smoothed[i]);
    accumulated.push(accumulated[i - 1] + span / speed);
  }
  const total = accumulated[count - 1] || 1;
  return accumulated.map((value) => value / total);
})();

const distanceAtTime = (time) => {
  if (time <= 0) return 0;
  if (time >= 1) return TOTAL;
  let low = 0, high = TIME_AT.length - 1;
  while (low < high - 1) { const mid = (low + high) >> 1; if (TIME_AT[mid] <= time) low = mid; else high = mid; }
  const span = TIME_AT[high] - TIME_AT[low] || 1;
  const ratio = (time - TIME_AT[low]) / span;
  return CUMULATIVE[low] + (CUMULATIVE[high] - CUMULATIVE[low]) * ratio;
};

const TRACK_BOX = (() => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of CIRCUIT_PATH) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  const pad = 46;
  return { x: minX - pad, y: minY - pad, width: maxX - minX + pad * 2, height: maxY - minY + pad * 2 };
})();

const mixRgb = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
const rgba = ([r, g, b], alpha) => `rgb(${r} ${g} ${b} / ${alpha})`;
const css = ([r, g, b]) => `rgb(${r} ${g} ${b})`;

const trailUpTo = (distance) => {
  const out = [];
  for (let i = 0; i < CIRCUIT_PATH.length; i += 1) {
    if (CUMULATIVE[i] <= distance) { out.push(CIRCUIT_PATH[i]); continue; }
    const a = CIRCUIT_PATH[i - 1], b = CIRCUIT_PATH[i];
    const ratio = (distance - CUMULATIVE[i - 1]) / (CUMULATIVE[i] - CUMULATIVE[i - 1]);
    out.push([a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio]);
    break;
  }
  return out;
};

/* ================================================================ map SVG */

const buildMap = (svg) => {
  const defs = el("defs", {}, svg);
  // the cut at the flag
  const cut = el("mask", { id: "season-cut", maskUnits: "userSpaceOnUse", x: -5000, y: -5000, width: 12560, height: 11440 }, defs);
  el("rect", { x: -5000, y: -5000, width: 12560, height: 11440, fill: "white" }, cut);
  el("rect", {
    x: FLAG_CUT.x - FLAG_CUT.along / 2, y: FLAG_CUT.y - FLAG_CUT.across / 2, width: FLAG_CUT.along, height: FLAG_CUT.across,
    fill: "black", transform: `rotate(${FLAG_CUT.angle} ${FLAG_CUT.x} ${FLAG_CUT.y})`,
  }, cut);
  // the lap mask
  const lapMask = el("mask", { id: "season-lap", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 2560, height: 1440 }, defs);
  const lapLine = el("path", {
    d: LAP_CENTRELINE, fill: "none", stroke: "white", "stroke-width": LAP_MASK_WIDTH,
    "stroke-linecap": "round", "stroke-linejoin": "round",
    "stroke-dasharray": `${LAP_LENGTH + 60} ${LAP_LENGTH + 60}`, "stroke-dashoffset": `${60 + LAP_LENGTH}`,
  }, lapMask);

  const grid = el("g", { id: "grid" }, svg);
  const axes = [];
  for (const x of GRID_AXES_X) {
    axes.push(el("line", { x1: x, y1: -4000, x2: x, y2: 1440 + 4000, style: "stroke:var(--map-grid)", "stroke-width": GRID_STROKE, "stroke-dasharray": GRID_DASH }, grid));
  }
  axes.push(el("line", { x1: -4000, y1: GRID_AXIS_Y, x2: 2560 + 4000, y2: GRID_AXIS_Y, style: "stroke:var(--map-grid)", "stroke-width": GRID_STROKE, "stroke-dasharray": GRID_DASH }, grid));
  for (const ring of RINGS) {
    el("circle", { cx: HUB.x, cy: HUB.y, r: ring.r, fill: "none", style: `stroke:var(${ring.ghost ? "--map-grid-ghost" : "--map-grid"})`, "stroke-width": ring.width }, grid);
  }
  const ping = el("circle", { cx: HUB.x, cy: HUB.y, r: HUB.r, fill: "none", style: "stroke:var(--accent)", "stroke-width": 2.13, opacity: 0 }, grid);
  for (const [x, y] of CORNER_MARKS) {
    el("rect", { x, y, width: CORNER_MARK_SIZE, height: CORNER_MARK_SIZE, style: "fill:var(--map-mark)" }, grid);
  }
  el("circle", { cx: HUB.x, cy: HUB.y, r: HUB.r, style: "fill:var(--map-mark)" }, grid);

  const track = el("g", { mask: "url(#season-cut)" }, svg);
  el("path", { d: TRACK_RIBBON, style: "fill:var(--foreground-on-dark)" }, track);
  const lit = el("g", { mask: "url(#season-lap)" }, track);
  el("path", { d: TRACK_RIBBON, style: "fill:var(--accent)" }, lit);

  const markers = el("g", { id: "markers" }, svg);
  for (const t of TURNS) {
    el("polygon", { points: TURN_POINTS, style: "fill:var(--accent)", transform: `translate(${t.x} ${t.y}) rotate(${t.angle})` }, markers);
  }
  el("path", { d: FLAG_DIAMONDS, style: "fill:var(--map-mark)" }, markers);

  // grid crawl and hub ping, paused off screen
  const crawl = loopTween(7000, (v) => {
    const offset = `${v * 20.5}`;
    for (const a of axes) a.setAttribute("stroke-dashoffset", offset);
  });
  const pinger = loopTween(4200, (v) => {
    ping.setAttribute("r", `${HUB.r + v * 86}`);
    ping.setAttribute("opacity", `${0.4 * (1 - v) * (1 - v)}`);
  }, ease.outQuad);
  return {
    setLap: (reveal01) => lapLine.setAttribute("stroke-dashoffset", `${60 + reveal01 * LAP_LENGTH}`),
    setRunning: (on) => {
      if (reducedMotion) return;
      crawl.setRunning(on);
      pinger.setRunning(on);
    },
  };
};

/* ================================================================ halftone */

const MAX_RATIO = mq("(hover: none) and (pointer: coarse)").matches ? 1 : 2;
const MIN_LEVEL = 0.02;
const POINTER_HEAT = 0.95;
const RETICLE_OPEN = 420;
const RETICLE_SETTLE = 900;
const SPREAD_OPEN = 0.38;
const SPREAD_SHUT = 0.09;
const RETICLE_ARM = 0.82;
const RETICLE_CORE = 54;
const POINTER_TRAIL = 0.07;
const POINTER_RISE = 0.14;
const POINTER_FALL = 0.3;
const CHEQUER_FILL = 1;
const CHEQUER_SEED = 0.7;
const PARAMS = { threshold: 0.34, radius: 170, waveSpeed: 0.16, fade: 0.9, source: "none" };
const approach = (from, to, dt, tau) => to + (from - to) * Math.exp(-dt / Math.max(1e-4, tau));
const falloff = (t) => {
  if (t >= 1) return 0;
  const u = 1 - t;
  return u * u;
};

const buildIndex = () => {
  const { columns, rows, count } = DOTS;
  let minI = Infinity, maxI = -Infinity, minJ = Infinity, maxJ = -Infinity;
  for (let i = 0; i < count; i += 1) {
    if (columns[i] < minI) minI = columns[i];
    if (columns[i] > maxI) maxI = columns[i];
    if (rows[i] < minJ) minJ = rows[i];
    if (rows[i] > maxJ) maxJ = rows[i];
  }
  const w = maxI - minI + 1;
  const h = maxJ - minJ + 1;
  const cell = new Int32Array(w * h).fill(-1);
  for (let i = 0; i < count; i += 1) cell[(rows[i] - minJ) * w + (columns[i] - minI)] = i;
  return { cell, w, h, minI, minJ };
};

const setupDots = (canvas, section) => {
  const index = buildIndex();
  const level = new Float32Array(DOTS.count);
  const active = new Int32Array(DOTS.count);
  const inList = new Uint8Array(DOTS.count);
  let activeCount = 0;
  let dirty = true;
  let baked = null;
  let last = 0;
  let spread = 0;
  let armed = false;
  const pointer = { x: 0, y: 0, heat: 0 };
  const target = { x: 0, y: 0, on: false };
  const palette = {};

  const readPalette = () => {
    palette.dot = parseRgb(readToken("--map-dot"));
    palette.accent = parseRgb(readToken("--accent"));
    palette.white = parseRgb(readToken("--foreground-on-dark"));
    palette.bright = mixRgb(palette.accent, palette.white, 0.55);
  };

  const draw = () => {
    if (!baked || !canvas.width) return;
    const context = canvas.getContext("2d");
    const scale = canvas.width / MAP_VIEW.width;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, MAP_VIEW.width, MAP_VIEW.height);
    context.drawImage(baked, 0, 0, MAP_VIEW.width, MAP_VIEW.height);
    const { points, columns, rows } = DOTS;
    const { accent, bright, white } = palette;
    const box = DOT_RADIUS * 2 + 1;
    const span = 1 - PARAMS.threshold || 1;
    let drew = 0;
    for (let k = 0; k < activeCount; k += 1) {
      const idx = active[k];
      if (level[idx] < PARAMS.threshold) continue;
      context.clearRect(points[idx * 2] - DOT_RADIUS - 0.5, points[idx * 2 + 1] - DOT_RADIUS - 0.5, box, box);
      drew += 1;
    }
    if (!drew) return;
    for (let k = 0; k < activeCount; k += 1) {
      const idx = active[k];
      const value = level[idx];
      if (value < PARAMS.threshold) continue;
      if ((columns[idx] + rows[idx]) & 1) continue;
      const t = Math.min(1, (value - PARAMS.threshold) / span);
      const side = DOT_LATTICE.pitchX * (CHEQUER_SEED + (CHEQUER_FILL - CHEQUER_SEED) * t);
      context.fillStyle = css(value > 0.8 ? white : value > 0.5 ? bright : mixRgb(accent, bright, value));
      context.fillRect(points[idx * 2] - side / 2, points[idx * 2 + 1] - side / 2, side, side);
    }
  };

  const bake = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    readPalette();
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_RATIO);
    const w = Math.round(width * ratio);
    const h = Math.round(height * ratio);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    baked = baked || document.createElement("canvas");
    baked.width = w;
    baked.height = h;
    const context = baked.getContext("2d");
    const scale = w / MAP_VIEW.width;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, MAP_VIEW.width, MAP_VIEW.height);
    const { points, count } = DOTS;
    context.fillStyle = css(palette.dot);
    context.beginPath();
    for (let i = 0; i < count; i += 1) {
      const x = points[i * 2];
      const y = points[i * 2 + 1];
      context.moveTo(x + DOT_RADIUS, y);
      context.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
    }
    context.fill();
    dirty = true;
    draw();
  };

  const add = (i, value) => {
    if (value <= MIN_LEVEL) return;
    if (value > level[i]) level[i] = value;
    if (!inList[i]) {
      inList[i] = 1;
      active[activeCount] = i;
      activeCount += 1;
    }
  };
  const addPoint = (source, reach) => {
    if (source.heat <= 0.01) return;
    const { cell, w, h, minI, minJ } = index;
    const { points } = DOTS;
    const i0 = Math.floor((source.x - reach - DOT_LATTICE.originX) / DOT_LATTICE.pitchX);
    const i1 = Math.ceil((source.x + reach - DOT_LATTICE.originX) / DOT_LATTICE.pitchX);
    const j0 = Math.floor((source.y - reach - DOT_LATTICE.originY) / DOT_LATTICE.pitchY);
    const j1 = Math.ceil((source.y + reach - DOT_LATTICE.originY) / DOT_LATTICE.pitchY);
    for (let j = Math.max(minJ, j0); j <= Math.min(minJ + h - 1, j1); j += 1) {
      const row = (j - minJ) * w;
      for (let i = Math.max(minI, i0); i <= Math.min(minI + w - 1, i1); i += 1) {
        const idx = cell[row + (i - minI)];
        if (idx < 0) continue;
        const d = Math.hypot(points[idx * 2] - source.x, points[idx * 2 + 1] - source.y);
        add(idx, falloff(d / reach) * source.heat);
      }
    }
  };
  const addReticle = (source) => {
    if (source.heat <= 0.01) return;
    const { cell, w, h, minI, minJ } = index;
    const { points } = DOTS;
    const ci = Math.round((source.x - DOT_LATTICE.originX) / DOT_LATTICE.pitchX);
    const cj = Math.round((source.y - DOT_LATTICE.originY) / DOT_LATTICE.pitchY);
    const arm = RETICLE_ARM * source.heat;
    const reach = RETICLE_OPEN * spread;
    if (reach > 1 && cj >= minJ && cj < minJ + h) {
      const row = (cj - minJ) * w;
      const span = Math.ceil(reach / DOT_LATTICE.pitchX);
      for (let i = Math.max(minI, ci - span); i <= Math.min(minI + w - 1, ci + span); i += 1) {
        const idx = cell[row + (i - minI)];
        if (idx < 0) continue;
        add(idx, (1 - Math.abs(points[idx * 2] - source.x) / reach) * arm);
      }
    }
    if (reach > 1 && ci >= minI && ci < minI + w) {
      const span = Math.ceil(reach / DOT_LATTICE.pitchY);
      for (let j = Math.max(minJ, cj - span); j <= Math.min(minJ + h - 1, cj + span); j += 1) {
        const idx = cell[(j - minJ) * w + (ci - minI)];
        if (idx < 0) continue;
        add(idx, (1 - Math.abs(points[idx * 2 + 1] - source.y) / reach) * arm);
      }
    }
    addPoint(source, RETICLE_CORE);
  };

  const frame = () => {
    const now = performance.now();
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    const wanted = target.on && armed ? POINTER_HEAT : 0;
    if (pointer.heat <= 0.001 && wanted > 0) {
      pointer.x = target.x;
      pointer.y = target.y;
    } else if (dt > 0) {
      const px = pointer.x;
      const py = pointer.y;
      pointer.x = approach(px, target.x, dt, POINTER_TRAIL);
      pointer.y = approach(py, target.y, dt, POINTER_TRAIL);
      const speed = Math.hypot(pointer.x - px, pointer.y - py) / dt;
      const wantedSpread = Math.max(0, 1 - speed / RETICLE_SETTLE);
      spread = approach(spread, wantedSpread, dt, wantedSpread > spread ? SPREAD_OPEN : SPREAD_SHUT);
    }
    pointer.heat = approach(pointer.heat, wanted, dt, wanted > pointer.heat ? POINTER_RISE : POINTER_FALL);
    if (pointer.heat < 0.005) {
      pointer.heat = 0;
      spread = 0;
    }
    const decay = Math.exp(-dt / Math.max(0.05, PARAMS.fade / 3));
    let write = 0;
    for (let k = 0; k < activeCount; k += 1) {
      const idx = active[k];
      const value = level[idx] * decay;
      if (value > MIN_LEVEL) {
        level[idx] = value;
        active[write] = idx;
        write += 1;
      } else {
        level[idx] = 0;
        inList[idx] = 0;
      }
    }
    const before = activeCount;
    activeCount = write;
    addReticle(pointer);
    if (activeCount === 0 && before === 0 && !dirty) return;
    dirty = false;
    draw();
  };

  // The pointer: mouse only, not on touch or under reduced motion.
  if (!mq("(hover: none)").matches && !reducedMotion) {
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const s = section.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * MAP_VIEW.width;
      target.y = ((e.clientY - r.top) / r.height) * MAP_VIEW.height;
      target.on = e.clientX >= s.left && e.clientX <= s.right && e.clientY >= s.top && e.clientY <= s.bottom;
    }, { passive: true });
    document.addEventListener("pointerleave", () => { target.on = false; });
    window.addEventListener("blur", () => { target.on = false; });
  }

  new ResizeObserver(bake).observe(canvas);
  bake();
  const clock = { stop: null };
  return {
    arm: () => { armed = true; },
    setRunning(on) {
      if (on && !clock.stop) { last = 0; clock.stop = subscribe(frame); }
      else if (!on && clock.stop) { clock.stop(); clock.stop = null; }
    },
  };
};

/* ================================================================ trace */

const setupTrace = (canvas, mapApi, onCooled) => {
  const context = canvas.getContext("2d");
  const coarse = mq("(hover: none) and (pointer: coarse)").matches;
  let lap = 0;
  let heat = 1;
  let palette = null;
  const ratio = () => Math.min(window.devicePixelRatio || 1, coarse ? 1 : 2);
  const size = () => {
    const r = ratio();
    canvas.width = Math.round(1440 * r);
    canvas.height = Math.round(800 * r);
    palette = {
      accent: parseRgb(readToken("--accent")),
      white: parseRgb(readToken("--foreground-on-dark")),
    };
    palette.bright = mixRgb(palette.accent, palette.white, 0.55);
    render();
  };

  const stroke = (points, scale, from = 0) => {
    context.beginPath();
    context.moveTo(points[from][0] * scale, points[from][1] * scale);
    for (let i = from + 1; i < points.length; i += 1) context.lineTo(points[i][0] * scale, points[i][1] * scale);
    context.stroke();
  };
  const drawTrail = (points, scale, minWidth, glow) => {
    if (points.length < 2) return;
    const width = Math.max(minWidth, LINE_WIDTH * scale);
    context.lineCap = "round"; context.lineJoin = "round";
    if (glow) {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = rgba(palette.accent, 0.05); context.lineWidth = GLOW_WIDTH * scale; stroke(points, scale);
      context.strokeStyle = rgba(palette.accent, 0.1); context.lineWidth = GLOW_WIDTH * 0.45 * scale; stroke(points, scale);
      context.restore();
    }
    const head = Math.max(2, Math.round(HEAD_UNITS / CIRCUIT_STEP));
    const from = Math.max(0, points.length - head);
    const tip = points[points.length - 1];
    const hot = context.createLinearGradient(points[from][0] * scale, points[from][1] * scale, tip[0] * scale, tip[1] * scale);
    hot.addColorStop(0, rgba(palette.accent, 0));
    hot.addColorStop(0.45, rgba(palette.accent, 0.9));
    hot.addColorStop(1, rgba(mixRgb(palette.accent, palette.bright, heat), 1));
    context.strokeStyle = hot; context.lineWidth = width; stroke(points, scale, from);
    const coreFrom = Math.max(0, points.length - Math.round(head * 0.42));
    if (points.length - coreFrom > 1) {
      const core = context.createLinearGradient(points[coreFrom][0] * scale, points[coreFrom][1] * scale, tip[0] * scale, tip[1] * scale);
      core.addColorStop(0, rgba(palette.bright, 0));
      core.addColorStop(1, rgba(palette.white, 0.95 * heat));
      context.strokeStyle = core; context.lineWidth = Math.max(minWidth * 0.6, width * 0.38); stroke(points, scale, coreFrom);
    }
  };

  const render = () => {
    if (!palette) return;
    const distance = distanceAtTime(lap);
    mapApi.setLap(1 - distance / TOTAL);
    const points = trailUpTo(distance);
    const r = ratio();
    context.setTransform(r, 0, 0, r, 0, 0);
    context.clearRect(0, 0, 1440, 800);
    if (points.length > 1) {
      drawTrail(points, 1, 0.6, true);
      const [tx, ty] = points[points.length - 1];
      context.save(); context.globalCompositeOperation = "lighter";
      const spark = context.createRadialGradient(tx, ty, 0, tx, ty, LINE_WIDTH * 2.6);
      spark.addColorStop(0, rgba(palette.white, 0.85 * heat));
      spark.addColorStop(0.35, rgba(palette.bright, 0.4 * heat));
      spark.addColorStop(1, rgba(palette.accent, 0));
      context.fillStyle = spark; context.beginPath(); context.arc(tx, ty, LINE_WIDTH * 2.6, 0, Math.PI * 2); context.fill();
      context.restore();
    }
    context.save(); context.translate(CUT_CENTRE[0], CUT_CENTRE[1]); context.rotate((FLAG_CUT.angle * Math.PI) / 180);
    context.clearRect(-CUT_ALONG / 2, -CUT_ACROSS / 2, CUT_ALONG, CUT_ACROSS); context.restore();
    for (const marker of CIRCUIT_MARKERS) {
      if (distance < marker.d) continue;
      const age = Math.min(1, (distance - marker.d) / MARKER_POP_UNITS);
      const radius = 12 + (1 - age) * 14;
      const glow = context.createRadialGradient(marker.x, marker.y, 0, marker.x, marker.y, radius);
      glow.addColorStop(0, rgba(palette.bright, 0.5 + 0.45 * (1 - age)));
      glow.addColorStop(0.45, rgba(palette.accent, 0.32));
      glow.addColorStop(1, rgba(palette.accent, 0));
      context.save(); context.globalCompositeOperation = "lighter"; context.fillStyle = glow;
      context.beginPath(); context.arc(marker.x, marker.y, radius, 0, Math.PI * 2); context.fill(); context.restore();
      if (age < 1) {
        context.strokeStyle = rgba(palette.bright, (1 - age) * 0.6); context.lineWidth = 1;
        context.beginPath(); context.arc(marker.x, marker.y, 9 + age * 20, 0, Math.PI * 2); context.stroke();
      }
    }
  };

  size();
  let started = false;
  return {
    resize: size,
    start() {
      if (started) return;
      started = true;
      const lapTween = new Spring(0, (v) => { lap = v; render(); });
      lapTween.onRest = () => {
        const cool = new Spring(1, (v) => { heat = v; render(); });
        cool.onRest = onCooled;
        cool.to(0, { duration: COOL_MS, easing: ease.outCubic });
      };
      lapTween.to(1, { duration: LAP_MS, easing: ease.inOutSine });
    },
  };
};

/* ================================================================ section */

export const setupSeason = () => {
  const section = document.querySelector("[data-season]");
  const frameEl = section.querySelector("[data-season-frame]");
  const stage = section.querySelector("[data-season-stage]");

  // Fit: cover from 1024, the track box fitted to the width below.
  const fit = () => {
    const w = frameEl.clientWidth;
    const h = frameEl.clientHeight;
    if (window.innerWidth >= 1024) {
      const s = Math.max(w / 1440, h / 800);
      stage.style.transform = `translate(${(w - 1440 * s) / 2}px, ${(h - 800 * s) / 2}px) scale(${s})`;
    } else {
      const s = w / TRACK_BOX.width;
      const cx = TRACK_BOX.x + TRACK_BOX.width / 2;
      const cy = TRACK_BOX.y + TRACK_BOX.height / 2;
      stage.style.transform = `translate(${w / 2 - cx * s}px, ${h / 2 - cy * s}px) scale(${s})`;
    }
  };
  new ResizeObserver(fit).observe(frameEl);
  fit();

  const mapApi = buildMap(section.querySelector("[data-season-svg]"));
  const dots = setupDots(section.querySelector("[data-season-dots]"), section);
  const trace = setupTrace(section.querySelector("[data-season-trace]"), mapApi, () => dots.arm());
  loopInView(frameEl, (on) => {
    mapApi.setRunning(on);
    dots.setRunning(on);
  });
  const lapIo = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      lapIo.disconnect();
      trace.start();
    }
  }, { threshold: 0.35 });
  lapIo.observe(frameEl);

  setupDissolve(section.querySelector("[data-dissolve]"));

  // The heading, rule and intro.
  const h2 = section.querySelector("[data-heading]");
  const ruleEl = section.querySelector("[data-season-rule]");
  const rule = reveal(ruleEl, (node, p) => {
    node.style.opacity = `${p}`;
    node.style.transform = `scaleX(${p})`;
  }, CONFIG.REVEAL);
  const intro = splitText(section.querySelector("[data-season-intro]"), { by: "word", stagger: 34, config: CONFIG.COPY_WORDS, gap: "0.22em", delay: 2 * 130 + 90 });
  forwardInView(h2, [
    ...headingControllers(h2),
    { play: () => rule.play(2 * 130), reverse: () => rule.reverse() },
    intro,
  ]);

  // The standings plate.
  const plateEl = section.querySelector("[data-season-plate]");
  const plate = reveal(plateEl, rise("0.75rem"), CONFIG.REVEAL);
  const ctls = [{ play: () => plate.play(260), reverse: () => plate.reverse() }];
  section.querySelectorAll("[data-plate-type]").forEach((node, i) => {
    ctls.push(splitText(node, { by: "letter", stagger: 22, config: CONFIG.TYPE, gap: "0", delay: 430 + i * 60 }));
  });
  section.querySelectorAll(".splate-row").forEach((row, i) => {
    ctls.push(splitText(row.querySelector("[data-plate-fig]"), { by: "letter", stagger: 22, config: CONFIG.TYPE, gap: "0", delay: 430 + i * 110 }));
    ctls.push(splitText(row.querySelector("[data-plate-word]"), { by: "letter", stagger: 22, config: CONFIG.TYPE, delay: 430 + i * 110 + 70 }));
  });
  forwardInView(plateEl, ctls);

  // The globe: the meridian turns once every 10s, paused off screen.
  const meridian = section.querySelector("[data-globe-meridian]");
  const spin = loopTween(10000, (v) => {
    meridian.setAttribute("rx", `${Math.max(0.5, Math.abs(Math.cos(v * Math.PI * 2)) * 18)}`);
  });
  if (!reducedMotion) loopInView(plateEl, (on) => spin.setRunning(on));

  window.addEventListener("resize", () => trace.resize());
};
