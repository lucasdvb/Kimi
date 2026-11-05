// Page side of the worker-hosted hero scene, plus Lenis. Bundled into the
// `lucaskimi-deps.js` script pasted into a strict-CSP host (Instatic): it has
// no bare imports once built, so nothing is resolved or fetched as a script.
//
// It exposes `HeroScene` (a proxy that drives the worker) and `Lenis` on
// `globalThis.__LK_LIBS__`, which the site runtime reads. three.js lives only
// in the worker; the worker code and every asset load as images and are handed
// across, so the page needs only `script-src 'self'`, `worker-src blob:` and
// `img-src https:`.
import Lenis from "lenis";

/* global __ASSET_BASE_URL__ */
const BASE = __ASSET_BASE_URL__;
const SCENE = `${BASE}/hero/scene`;
const PACKED = `${BASE}/hero/packed`;

/** Unpack bytes stored 3-per-pixel in a lossless PNG (see build/pack). */
const loadPackedBytes = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onerror = () => reject(new Error(url));
    img.onload = async () => {
      try {
        const bitmap = await createImageBitmap(img, {
          premultiplyAlpha: "none",
          colorSpaceConversion: "none",
        });
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close?.();
        const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const byteAt = (k) => rgba[Math.floor(k / 3) * 4 + (k % 3)];
        let length = 0;
        for (let k = 0; k < 6; k += 1) length = length * 256 + byteAt(k);
        const out = new Uint8Array(length);
        for (let k = 0; k < length; k += 1) out[k] = byteAt(k + 6);
        resolve(out.buffer);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(url));
      }
    };
    img.src = url;
  });

/** A cross-origin image decoded to a transferable ImageBitmap. */
const loadBitmap = (url, options) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onerror = () => reject(new Error(url));
    img.onload = () =>
      createImageBitmap(img, options).then(resolve, () => reject(new Error(url)));
    img.src = url;
  });

const readToken = (token) => {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
};

// The device tier (device.ts), evaluated on the page and handed to the worker,
// which has no `window`/`matchMedia`.
const getSceneTier = () => {
  const coarse = matchMedia("(hover: none) and (pointer: coarse)").matches;
  const width = innerWidth;
  const name =
    width < 768 || (coarse && width < 1024)
      ? "mobile"
      : coarse || width < 1280
        ? "tablet"
        : "desktop";
  const mobile = name === "mobile";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saver =
    Boolean(navigator.connection && navigator.connection.saveData) ||
    (navigator.deviceMemory ?? 8) <= 2;
  return {
    name,
    mobile,
    coarsePointer: coarse,
    reducedMotion,
    maxDpr: mobile ? 1 : name === "tablet" ? 1.25 : 1.5,
    frameInterval: name === "desktop" ? 0 : 1000 / 60 - 2,
    pointerEnabled: !coarse && !reducedMotion,
    antialias: name === "desktop",
    trailSamples: mobile ? 28 : name === "tablet" ? 44 : 72,
    outline: !mobile,
    reveal: !mobile,
    freeze: reducedMotion || (mobile && saver),
  };
};

/**
 * Stands in for `HeroScene` on the page: it owns the worker and forwards the
 * same calls the runtime makes (`setParams`, `resize`, `setPointer`, `update`,
 * `beginRise`, `retune`). Calls made before the worker is ready are queued.
 */
class HeroSceneHost {
  constructor(canvas) {
    if (typeof Worker === "undefined" || !canvas.transferControlToOffscreen) {
      throw new Error("OffscreenCanvas/Worker unavailable");
    }
    this.onReady = null;
    this.onError = null;
    this._tier = getSceneTier();
    this.worker = null;
    this.pending = new Map();
    this.risen = false;
    this.failed = false;

    const offscreen = canvas.transferControlToOffscreen();
    const tokens = {};
    for (const t of ["--accent", "--foreground", "--background", "--surface-soft"]) {
      tokens[t] = readToken(t);
    }
    const flip = { imageOrientation: "flipY", premultiplyAlpha: "none", colorSpaceConversion: "none" };
    const keep = { premultiplyAlpha: "none", colorSpaceConversion: "none" };

    Promise.all([
      loadPackedBytes(`${PACKED}/hero-worker.js.png`),
      loadBitmap(`${SCENE}/person-diffuse.webp`, flip),
      loadBitmap(`${SCENE}/person-depth.webp`, flip),
      loadBitmap(`${SCENE}/person-alpha.webp`, flip),
      loadBitmap(`${SCENE}/person-normal.webp`, flip),
      loadBitmap(`${SCENE}/noise.webp`, flip),
      loadPackedBytes(`${PACKED}/helmet3.glb.png`),
      loadPackedBytes(`${PACKED}/studio-light.hdr.png`),
      loadBitmap(`${PACKED}/helmet3-tex-0.webp`, keep),
      loadBitmap(`${PACKED}/helmet3-tex-1.webp`, keep),
      loadBitmap(`${PACKED}/helmet3-tex-2.webp`, keep),
    ])
      .then(([code, diffuse, depth, alpha, normal, noise, helmet, hdr, t0, t1, t2]) => {
        if (this.failed) return;
        const blobUrl = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
        const worker = new Worker(blobUrl);
        URL.revokeObjectURL(blobUrl);
        worker.onmessage = ({ data }) => {
          if (data.type === "ready") this.onReady && this.onReady();
          else if (data.type === "error") this.fail(new Error(data.message));
        };
        worker.onerror = (event) => this.fail(new Error(event.message || "hero worker error"));
        const assets = {
          hdr,
          helmet,
          diffuse,
          depth,
          alpha,
          normal,
          noise,
          helmetImages: {
            "helmet3-tex-0.webp": t0,
            "helmet3-tex-1.webp": t1,
            "helmet3-tex-2.webp": t2,
          },
        };
        worker.postMessage(
          { type: "init", canvas: offscreen, env: { tier: this._tier, tokens, dpr: devicePixelRatio, assets } },
          [offscreen, hdr, helmet, diffuse, depth, alpha, normal, noise, t0, t1, t2],
        );
        this.worker = worker;
        for (const message of this.pending.values()) worker.postMessage(message);
        this.pending.clear();
        if (this.risen) worker.postMessage({ type: "rise" });
      })
      .catch((error) => this.fail(error));
  }

  fail(error) {
    if (this.failed) return;
    this.failed = true;
    console.error("Hero scene failed:", error);
    this.onError && this.onError(error);
  }

  send(message) {
    if (this.worker) this.worker.postMessage(message);
    else this.pending.set(message.type, message);
  }

  get tier() {
    return this._tier;
  }

  retune() {
    const previous = this._tier;
    this._tier = { ...getSceneTier(), antialias: previous.antialias, trailSamples: previous.trailSamples };
    this.send({ type: "retune", tier: this._tier, dpr: devicePixelRatio });
    return this._tier;
  }

  setPointer(x, y) {
    this.send({ type: "pointer", x, y });
  }

  setParams(params) {
    this.send({ type: "params", params });
  }

  resize(width, height) {
    this.send({ type: "resize", width, height });
  }

  update(time) {
    if (this.worker) this.worker.postMessage({ type: "frame", time });
  }

  beginRise() {
    this.risen = true;
    if (this.worker) this.worker.postMessage({ type: "rise" });
  }
}

globalThis.__LK_LIBS__ = { ...(globalThis.__LK_LIBS__ || {}), Lenis, HeroScene: HeroSceneHost };
