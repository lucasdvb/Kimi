// The hero scene, run in a Web Worker on an OffscreenCanvas.
//
// For hosts whose Content Security Policy runs only same-origin scripts
// (`script-src 'self'`) but allows worker blobs (`worker-src 'self' blob:`)
// and cross-origin images (`img-src https:`): this file bundles three.js and
// the scene, travels to the page as a PNG-packed image, and the page starts it
// as a blob Worker. Every asset is decoded on the page and transferred in,
// because a worker under this policy can neither fetch nor decode images.
// See src/host/hero-host.js.
import { HeroScene } from "../scene.ts";

let scene = null;

self.onerror = (message, _source, lineno, colno, error) => {
  self.postMessage({ type: "error", message: (error && error.stack) || `${message} @${lineno}:${colno}` });
};

self.onmessage = ({ data: m }) => {
  if (m.type === "init") {
    self.__LK_ENV__ = m.env;
    try {
      scene = new HeroScene(m.canvas);
      scene.onReady = () => self.postMessage({ type: "ready" });
      scene.onError = (error) =>
        self.postMessage({ type: "error", message: String((error && error.message) || error) });
    } catch (error) {
      self.postMessage({ type: "error", message: String((error && error.message) || error) });
    }
    return;
  }
  if (!scene) return;
  switch (m.type) {
    case "retune":
      self.__LK_ENV__.tier = m.tier;
      self.__LK_ENV__.dpr = m.dpr;
      scene.retune();
      break;
    case "resize":
      scene.resize(m.width, m.height);
      break;
    case "params":
      scene.setParams(m.params);
      break;
    case "pointer":
      scene.setPointer(m.x, m.y);
      break;
    case "frame":
      scene.update(m.time);
      break;
    case "rise":
      scene.beginRise();
      break;
  }
};
