// Supplies three.js and Lenis to src/scripts/lucaskimi.js on a global.
// Instatic could not resolve npm packages for this site, so they load from jsDelivr's ESM
// builds — this needs the site's CSP to allow https://cdn.jsdelivr.net in script-src.
// Once npm dependencies resolve, replace these with static imports of "three" and "lenis".
const CDN = "https://cdn.jsdelivr.net/npm";
const THREE_URL = `${CDN}/three@0.185.0`;
const load = (url) => import(/* @vite-ignore */ url);
Promise.all([
  load(`${CDN}/lenis@1.3.26/+esm`),
  load(`${THREE_URL}/+esm`),
  load(`${THREE_URL}/examples/jsm/loaders/DRACOLoader.js/+esm`),
  load(`${THREE_URL}/examples/jsm/loaders/GLTFLoader.js/+esm`),
  load(`${THREE_URL}/examples/jsm/loaders/RGBELoader.js/+esm`),
  load(`${THREE_URL}/examples/jsm/utils/BufferGeometryUtils.js/+esm`),
]).then(([lenis, three, draco, gltf, rgbe, utils]) => {
  globalThis.__LK_LIBS__ = {
    Lenis: lenis.default,
    THREE: three,
    DRACOLoader: draco.DRACOLoader,
    GLTFLoader: gltf.GLTFLoader,
    RGBELoader: rgbe.RGBELoader,
    mergeGeometries: utils.mergeGeometries,
  };
}).catch((error) => console.error("lucaskimi: three.js / Lenis failed to load", error));
