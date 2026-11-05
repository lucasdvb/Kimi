// Where every asset comes from. One constant; the build sets it (a relative
// `./assets` for the repository copy, an absolute CDN URL for the hosted copy).
/* global __ASSET_BASE_URL__ */
const configured = typeof __ASSET_BASE_URL__ !== "undefined" ? __ASSET_BASE_URL__ : "./assets";
// "@relative": the dist bundle finds the assets beside itself (../assets).
export const ASSET_BASE_URL = configured === "@relative" ? new URL("../assets", import.meta.url).href.replace(/\/$/, "") : configured;

export const DRACO_DECODER_PATH = "https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/libs/draco/gltf/";

export const asset = (path) => `${ASSET_BASE_URL}/${path}`;

/**
 * Hosts whose Content Security Policy allows images from anywhere but no
 * cross-origin fetch (`connect-src 'self'`) get the binary assets packed into
 * lossless PNGs: 3 bytes per opaque pixel, the first 6 bytes the length.
 */
/* global __PACKED__ */
export const PACKED = typeof __PACKED__ !== "undefined" && __PACKED__;

export const loadPackedBytes = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onerror = () => reject(new Error(url));
    img.onload = async () => {
      try {
        const bitmap = await createImageBitmap(img, { premultiplyAlpha: "none", colorSpaceConversion: "none" });
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(bitmap, 0, 0);
        const rgba = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data;
        const byteAt = (k) => rgba[Math.floor(k / 3) * 4 + (k % 3)];
        let length = 0;
        for (let k = 0; k < 6; k += 1) length = length * 256 + byteAt(k);
        const out = new Uint8Array(length);
        for (let k = 0; k < length; k += 1) out[k] = byteAt(k + 6);
        resolve(out.buffer);
      } catch (error) {
        reject(new Error(url));
      }
    };
    img.src = url;
  });

/** A failed asset load must be visible: a banner naming the URL. */
let banner = null;
export const reportAssetFailure = (url) => {
  console.error("Asset failed to load:", url);
  if (typeof document === "undefined") return; // worker: no DOM to show a banner on
  if (!banner) {
    banner = document.createElement("div");
    banner.setAttribute("role", "alert");
    banner.className = "asset-banner";
    document.body.appendChild(banner);
  }
  const line = document.createElement("div");
  line.textContent = `Failed to load: ${url}`;
  banner.appendChild(line);
};

/** Watch every <img> on the page for a failed load. */
export const watchImages = () => {
  for (const img of document.querySelectorAll("img")) {
    const fail = () => reportAssetFailure(img.currentSrc || img.src);
    if (img.complete && img.naturalWidth === 0 && img.src) fail();
    else img.addEventListener("error", fail, { once: true });
  }
};
