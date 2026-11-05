import { HeroScene, DEFAULT_PARAMS, fitSubjectToBox } from "./scene.ts";
import { asset } from "./assets.js";
import { CONFIG, Spring, reveal, rise, fade, splitText, subscribe, loopInView, reducedMotion, mq } from "./engine.js";

const CLEAR_MS = 430;
const PAUSE_MS = 240;
const LIFT_TIMEOUT_MS = 3000;
const COVERED_AFTER = 1.15;

/* ------------------------------------------------------------------ entrance */

const setupEntrance = (section) => {
  const RISE = rise("1.25rem");
  const parts = [...section.querySelectorAll("[data-hero-rise]")].map((el) => ({
    ctl: reveal(el, RISE, CONFIG.REVEAL),
    delay: Number(el.dataset.heroRise),
  }));
  const tag = reveal(section.querySelector("[data-id-tag]"), fade, CONFIG.REVEAL);
  const name = splitText(section.querySelector("[data-id-name]"), { by: "word", stagger: 110, config: CONFIG.REVEAL });
  const rows = [...section.querySelectorAll("[data-id-row]")].map((el) => reveal(el, rise("0.75rem"), CONFIG.REVEAL));
  const figures = [...section.querySelectorAll("[data-hero-figure]")].map((el, i) => ({
    ctl: splitText(el, { by: "letter", stagger: 26, config: CONFIG.FIGURE, gap: "0" }),
    delay: 900 + i * 90,
  }));
  return () => {
    for (const { ctl, delay } of parts) ctl.play(delay);
    tag.play(180);
    name.play(180);
    rows.forEach((r, i) => r.play(180 + 260 + i * 130));
    for (const { ctl, delay } of figures) ctl.play(delay);
  };
};

/* ------------------------------------------------------------------ the veil */

const setupVeil = (section, onHandover) => {
  const veil = section.querySelector("[data-veil]");
  const content = veil.querySelector("[data-veil-content]");
  const fill = veil.querySelector("[data-veil-fill]");
  const bar = veil.querySelector("[data-veil-bar]");
  const meter = veil.querySelector("[data-veil-meter]");
  const nameEl = veil.querySelector("[data-veil-name]");

  const progress = new Spring(0, (p) => {
    fill.style.transform = `scaleY(${p})`;
    bar.style.transform = `scaleX(${p})`;
  });
  progress.to(0.7, CONFIG.PROGRESS_WAIT);
  reveal(nameEl, rise("0.6rem"), CONFIG.LABEL).play(260);

  let done = false;
  const ready = () => {
    if (done) return;
    done = true;
    progress.to(1, CONFIG.PROGRESS_READY);
    veil.style.pointerEvents = "none";
    veil.setAttribute("aria-label", "Loaded");
    const clear = new Spring(1, (v) => {
      content.style.opacity = `${v}`;
      content.style.transform = `translateY(calc(-0.75rem * ${1 - v}))`;
      meter.style.opacity = `${v}`;
    });
    clear.to(0, CONFIG.CLEAR);
    setTimeout(() => {
      const lift = new Spring(1, (v) => {
        veil.style.opacity = `${v}`;
      });
      lift.to(0, CONFIG.VEIL);
      onHandover();
      // Removed on its *rendered* opacity, never on a timer.
      const started = performance.now();
      const stop = subscribe(() => {
        const rendered = Number(getComputedStyle(veil).opacity);
        if (rendered <= 0.004 || performance.now() - started > LIFT_TIMEOUT_MS) {
          stop();
          veil.remove();
        }
      });
    }, CLEAR_MS + PAUSE_MS);
  };
  return { ready };
};

/* ------------------------------------------------------------------ the scene */

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

const showFallback = (section) => {
  const container = section.querySelector("[data-hero-canvas]");
  container.innerHTML = "";
  const back = document.createElement("div");
  back.className = "hero-fallback";
  back.style.backgroundImage = `url('${asset("hero/ui/backdrop-lines.svg")}')`;
  container.appendChild(back);
  const box = section.querySelector("[data-hero-box]");
  const host = box && box.offsetParent !== null ? box : back;
  const img = document.createElement("img");
  img.src = asset("hero/scene/person-diffuse.webp");
  img.alt = "Kimi Antonelli";
  host.appendChild(img);
};

const setupScene = (section, veil) => {
  if (!hasWebGL()) {
    showFallback(section);
    veil.ready();
    return { beginRise() {} };
  }
  const container = section.querySelector("[data-hero-canvas]");
  const canvas = container.querySelector("canvas");
  const box = section.querySelector("[data-hero-box]");
  let scene;
  try {
    scene = new HeroScene(canvas);
  } catch (error) {
    console.error(error);
    showFallback(section);
    veil.ready();
    return { beginRise() {} };
  }
  scene.onReady = () => veil.ready();
  scene.onError = () => {
    showFallback(section);
    veil.ready();
  };

  const applyFit = () => {
    const s = section.getBoundingClientRect();
    const fit = box.offsetParent !== null
      ? (() => {
          const b = box.getBoundingClientRect();
          return fitSubjectToBox(DEFAULT_PARAMS, { top: b.top - s.top, height: b.height }, container.clientHeight);
        })()
      : null;
    scene.setParams({
      ...DEFAULT_PARAMS,
      ...fit,
      ...(mq("(max-width: 1023px)").matches ? { bgRevealOpacity: 0 } : null),
      ...(mq("(hover: none)").matches ? { autoSweepAmount: 0.76 } : null),
      ...(mq("(max-width: 639px)").matches ? { sweepRadius: 0.95, sweepWarp: 0.18, autoSweepAmount: 0.55 } : null),
      ...(scene.tier.reveal ? null : { autoSweepAmount: 0 }),
    });
  };

  // Pointer, bound only while the tier wants it.
  const onPointer = (e) => scene.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
  let pointerBound = false;
  const bindPointer = () => {
    const want = scene.tier.pointerEnabled;
    if (want && !pointerBound) window.addEventListener("pointermove", onPointer, { passive: true });
    if (!want && pointerBound) window.removeEventListener("pointermove", onPointer);
    pointerBound = want;
  };
  bindPointer();

  // Resize: width changes and pointer-class flips re-read the tier.
  const coarseQuery = mq("(hover: none) and (pointer: coarse)");
  let lastW = 0;
  let lastH = 0;
  let lastCoarse = coarseQuery.matches;
  let pending = 0;
  const measure = () => {
    pending = 0;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const coarse = coarseQuery.matches;
    const widthChanged = w !== lastW;
    const coarseChanged = coarse !== lastCoarse;
    if (!widthChanged && !coarseChanged && coarse) return; // iOS URL bar
    if (!widthChanged && !coarseChanged && h === lastH) return;
    if (widthChanged || coarseChanged) {
      scene.retune();
      bindPointer();
    }
    lastW = w;
    lastH = h;
    lastCoarse = coarse;
    scene.resize(w, h);
    applyFit();
  };
  const schedule = () => {
    if (!pending) pending = requestAnimationFrame(measure);
  };
  new ResizeObserver(schedule).observe(container);
  coarseQuery.addEventListener?.("change", schedule);
  scene.resize(container.clientWidth || innerWidth, container.clientHeight || innerHeight);
  lastW = container.clientWidth;
  lastH = container.clientHeight;
  applyFit();

  // The render loop: in view (+10 frames), tab visible, hero not covered.
  let inView = true;
  loopInView(section, (on) => {
    inView = on;
  });
  subscribe(
    (time) => {
      if (!inView || document.hidden) return;
      if (window.scrollY > window.innerHeight * COVERED_AFTER) return;
      scene.update(time);
    },
    () => scene.tier.frameInterval,
  );

  return { beginRise: () => scene.beginRise() };
};

/* ------------------------------------------------------------------ menu sheet */

const setupMenu = (section, lenis) => {
  const burger = section.querySelector("[data-burger]");
  const logo = section.querySelector(".mast-logo img");
  let sheet = null;
  let lastFocus = null;
  const close = () => {
    if (!sheet) return;
    const el = sheet;
    sheet = null;
    document.documentElement.classList.remove("menu-open");
    lenis?.start();
    burger.setAttribute("aria-expanded", "false");
    const s = new Spring(1, (v) => {
      el.style.opacity = `${v}`;
    });
    s.onRest = () => el.remove();
    s.to(0, CONFIG.SHEET);
    document.removeEventListener("keydown", onKey);
    lastFocus?.focus();
  };
  const onKey = (e) => {
    if (e.key === "Escape") close();
  };
  const open = () => {
    if (sheet) return;
    lastFocus = document.activeElement;
    sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-label", "Menu");
    const links = [...section.querySelectorAll(".mast-nav a")].map((a) => [a.textContent, a.getAttribute("href")]);
    links.push(["Garage", "/garage"]);
    sheet.innerHTML = `
      <div class="sheet-top"><a href="/" data-sheet-logo aria-label="Grido1 Racing Systems"><img src="${logo.src}" alt=""></a>
      <button class="sheet-close" type="button" data-sheet-close><span class="sr-only">Close menu</span><span class="sheet-x"><i></i><i></i></span></button></div>
      <nav class="sheet-nav" aria-label="Menu"><ul>${links.map(([l, h]) => `<li data-sheet-item><a class="sheet-link hov" href="${h}">${l}</a></li>`).join("")}</ul></nav>`;
    document.body.appendChild(sheet);
    const s = new Spring(0, (v) => {
      sheet && (sheet.style.opacity = `${v}`);
    });
    s.to(1, CONFIG.SHEET);
    [...sheet.querySelectorAll("[data-sheet-item]")].forEach((li, i) => reveal(li, rise("0.75rem"), CONFIG.ITEM).play(120 + i * 55));
    sheet.querySelector("[data-sheet-logo]").addEventListener("click", close);
    sheet.querySelector("[data-sheet-close]").addEventListener("click", close);
    lenis?.stop();
    document.documentElement.classList.add("menu-open");
    burger.setAttribute("aria-expanded", "true");
    sheet.querySelector("[data-sheet-close]").focus();
    document.addEventListener("keydown", onKey);
  };
  burger.addEventListener("click", open);
  mq("(min-width: 1280px)").addEventListener?.("change", (e) => e.matches && close());
};

export const setupHero = (lenis) => {
  const section = document.querySelector("[data-hero]");
  const entrance = setupEntrance(section);
  let scene = null;
  const veil = setupVeil(section, () => {
    entrance();
    scene?.beginRise();
  });
  scene = setupScene(section, veil);
  setupMenu(section, lenis);
  if (reducedMotion) {
    /* the scene plays its entrance and freezes (see the tier) */
  }
};
