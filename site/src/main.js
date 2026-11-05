import Lenis from "lenis";
import { subscribe, reducedMotion } from "./engine.js";
import { watchImages } from "./assets.js";
import { setupHero } from "./hero.js";
import { setupSeason } from "./season.js";
import { setupTimeline } from "./timeline.js";
import { setupPaddock, setupFooter } from "./paddock.js";

// The page opens behind a veil and always starts at the top.
history.scrollRestoration = "manual";
window.scrollTo(0, 0);

// Above 1920 the root keeps scaling up.
const scaleRoot = () => {
  document.documentElement.style.fontSize = window.innerWidth > 1920 ? `${(16 * window.innerWidth) / 1920}px` : "";
};
scaleRoot();
window.addEventListener("resize", scaleRoot);

// Lenis runs from the shared loop, registered first.
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ smoothWheel: true });
  subscribe((time) => lenis.raf(time), () => 0);
}

/* The sticky stack: the covered layer recedes rather than scrolling away. */
const setupStack = () => {
  const RECEDE_SCALE = 0.9;
  const RECEDE_SHADE = 0.55;
  const phone = window.matchMedia("(max-width: 639px)");
  const layers = [...document.querySelectorAll("[data-layer]")];
  const last = document.querySelector("[data-layer-last]");
  const pinned = layers.map((layer, i) => ({
    inner: layer.querySelector("[data-layer-inner]"),
    shade: layer.querySelector("[data-layer-shade]"),
    next: layers[i + 1] || last,
  }));
  const apply = () => {
    const view = window.innerHeight || 1;
    const shrink = phone.matches ? 0 : 1 - RECEDE_SCALE;
    for (const { inner, shade, next } of pinned) {
      const p = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / view));
      inner.style.transform = p > 0 && shrink > 0 ? `scale(${1 - shrink * p})` : "";
      inner.style.willChange = p > 0 && shrink > 0 ? "transform" : "";
      shade.style.opacity = `${RECEDE_SHADE * p}`;
      inner.style.visibility = p >= 1 ? "hidden" : "visible";
    }
  };
  let queued = 0;
  const schedule = () => {
    if (!queued) queued = requestAnimationFrame(() => { queued = 0; apply(); });
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  apply();
};

const start = () => {
  watchImages();
  setupStack();
  setupHero(lenis);
  setupSeason();
  setupTimeline();
  setupPaddock();
  setupFooter();
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
