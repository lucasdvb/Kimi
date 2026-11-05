// Where every asset comes from. One constant; the build sets it (a relative
// `./assets` for the repository copy, an absolute CDN URL for the hosted copy).
/* global __ASSET_BASE_URL__ */
export const ASSET_BASE_URL = typeof __ASSET_BASE_URL__ !== "undefined" ? __ASSET_BASE_URL__ : "./assets";

export const DRACO_DECODER_PATH = "https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/libs/draco/gltf/";

export const asset = (path) => `${ASSET_BASE_URL}/${path}`;

/** A failed asset load must be visible: a banner naming the URL. */
let banner = null;
export const reportAssetFailure = (url) => {
  console.error("Asset failed to load:", url);
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
