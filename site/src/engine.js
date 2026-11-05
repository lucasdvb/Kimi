// The motion engine — one rAF loop, react-spring's damped spring, the text
// engine, scroll triggers and in-view gates. Everything that moves on the page
// runs through here.

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ ticker */

const subscribers = new Set();
let rafId = 0;
const loop = (time) => {
  rafId = requestAnimationFrame(loop);
  for (const sub of [...subscribers]) {
    if (!subscribers.has(sub)) continue;
    if (time - sub.last > sub.getFramerate()) {
      sub.last = time;
      sub.callback(time);
    }
  }
};

/** Reference-counted: starts on the first subscriber, cancels on the last. */
export const subscribe = (callback, getFramerate = () => 0) => {
  const sub = { callback, getFramerate, last: -Infinity };
  subscribers.add(sub);
  if (!rafId) rafId = requestAnimationFrame(loop);
  return () => {
    subscribers.delete(sub);
    if (!subscribers.size && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
};

/* ------------------------------------------------------------------ spring */

export const CONFIG = {
  REVEAL: { tension: 90, friction: 26 },
  ROW: { tension: 170, friction: 24 },
  ITEM: { tension: 170, friction: 24 },
  SHEET: { tension: 190, friction: 26 },
  FIGURE: { tension: 200, friction: 24 },
  TYPE: { tension: 210, friction: 24 },
  YEAR: { tension: 190, friction: 24 },
  COPY: { tension: 110, friction: 26 },
  COPY_WORDS: { tension: 150, friction: 24 },
  NAME: { tension: 190, friction: 24 },
  VEIL: { tension: 70, friction: 24 },
  CLEAR: { tension: 140, friction: 26 },
  LABEL: { tension: 110, friction: 26 },
  PROGRESS_WAIT: { tension: 10, friction: 30 },
  PROGRESS_READY: { tension: 170, friction: 26 },
  YEAR_SETTLE: { tension: 32, friction: 26 },
  TRIGGER: { tension: 140, friction: 30 },
};

const active = new Set();
let unsubscribeSprings = null;
let lastStep = 0;

const stepSprings = (time) => {
  const frame = Math.min(64, lastStep ? time - lastStep : 16);
  lastStep = time;
  for (const spring of [...active]) spring.advance(time, frame);
  if (!active.size && unsubscribeSprings) {
    unsubscribeSprings();
    unsubscribeSprings = null;
    lastStep = 0;
  }
};

/**
 * One animated number. react-spring's solver: 1ms substeps up to a 64ms
 * frame, mass 1, at rest when both velocity and distance fall under the
 * precision. A `{ duration, easing }` config is a plain tween instead.
 */
export class Spring {
  constructor(value, onChange, precision = 0.001) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.onChange = onChange;
    this.precision = precision;
    this.config = CONFIG.REVEAL;
    this.startAt = 0;
    this.tween = null;
    onChange?.(value);
  }

  to(target, config = this.config, delay = 0) {
    this.config = config;
    if (target === this.target && !this.tween && !active.has(this)) return;
    this.target = target;
    this.startAt = performance.now() + delay;
    this.tween = null;
    if (config.duration !== undefined) {
      this.tween = { from: this.value, start: null, duration: config.duration, easing: config.easing || ((t) => t) };
    }
    active.add(this);
    if (!unsubscribeSprings) unsubscribeSprings = subscribe(stepSprings, () => 0);
  }

  set(value) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.tween = null;
    active.delete(this);
    this.onChange?.(value);
  }

  advance(time, frame) {
    const now = performance.now();
    if (now < this.startAt) return;
    if (this.tween) {
      const tw = this.tween;
      if (tw.start === null) tw.start = now;
      const u = tw.duration <= 0 ? 1 : Math.min(1, (now - tw.start) / tw.duration);
      this.value = tw.from + (this.target - tw.from) * tw.easing(u);
      this.onChange?.(this.value);
      if (u >= 1) {
        this.tween = null;
        active.delete(this);
        this.onRest?.();
      }
      return;
    }
    const { tension, friction } = this.config;
    const steps = Math.ceil(frame);
    let x = this.value;
    let v = this.velocity;
    for (let i = 0; i < steps; i += 1) {
      const springForce = -tension * 0.000001 * (x - this.target);
      const dampingForce = -friction * 0.001 * v;
      v += springForce + dampingForce;
      x += v;
    }
    this.value = x;
    this.velocity = v;
    if (Math.abs(v) < this.precision && Math.abs(this.target - x) < this.precision) {
      this.value = this.target;
      this.velocity = 0;
      active.delete(this);
      this.onChange?.(this.value);
      this.onRest?.();
      return;
    }
    this.onChange?.(this.value);
  }
}

/** A tween that loops forever, paused by `setRunning(false)`. */
export const loopTween = (duration, onValue, easing = (t) => t) => {
  let running = false;
  let start = 0;
  let pausedAt = 0;
  let stop = null;
  return {
    setRunning(on) {
      if (on === running) return;
      running = on;
      if (on) {
        start += performance.now() - pausedAt;
        stop = subscribe(() => {
          const u = ((performance.now() - start) % duration) / duration;
          onValue(easing(u));
        });
      } else {
        pausedAt = performance.now();
        stop?.();
        stop = null;
      }
    },
  };
};

/* ------------------------------------------------------------- easings */

export const ease = {
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
};

/* ------------------------------------------------------------- reveals */

/**
 * Drive one element between two states with a 0→1 spring. `apply(p)` writes
 * the interpolated style. Returns { play(delay), reverse(), set(p) }.
 */
export const reveal = (el, apply, config = CONFIG.REVEAL) => {
  const spring = new Spring(0, (p) => apply(el, p));
  return {
    spring,
    play(delay = 0) {
      spring.to(1, config, reducedMotion ? 0 : delay);
    },
    reverse() {
      spring.to(0, config, 0);
    },
    set(p) {
      spring.set(p);
    },
  };
};

/** The common rise: opacity 0→1, translateY(dist)→0. */
export const rise = (dist = "0.75rem") => (el, p) => {
  el.style.opacity = `${p}`;
  el.style.transform = p >= 1 ? "" : `translateY(calc(${dist} * ${1 - p}))`;
};
export const fade = (el, p) => {
  el.style.opacity = `${p}`;
};

/**
 * The text engine: split into words or letters, each in an inline-block span
 * with its own spring. A visually hidden plain copy stays for assistive tech.
 */
export const splitText = (el, { by = "word", stagger = 110, config = CONFIG.REVEAL, delay = 0, gap } = {}) => {
  const text = el.textContent.replace(/\s+/g, " ").trim();
  el.textContent = "";
  el.classList.add("txt");
  if (gap !== undefined) el.style.columnGap = gap;
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = text;
  el.appendChild(sr);
  const units = [];
  const words = text.split(" ");
  for (const word of words) {
    const w = document.createElement("span");
    w.setAttribute("aria-hidden", "true");
    w.className = "txt-w";
    if (by === "word") {
      units.push(w);
      w.textContent = word;
    } else {
      for (const ch of word) {
        const l = document.createElement("span");
        l.className = "txt-l";
        l.textContent = ch;
        w.appendChild(l);
        units.push(l);
      }
    }
    el.appendChild(w);
  }
  const shift = by === "word" ? 0.35 : 0.3;
  const springs = units.map((unit) =>
    new Spring(0, (p) => {
      unit.style.opacity = `${p}`;
      unit.style.transform = p >= 1 ? "" : `translateY(${(shift * (1 - p)).toFixed(4)}em)`;
    }),
  );
  return {
    play(extra = 0) {
      springs.forEach((s, i) => s.to(1, config, reducedMotion ? 0 : delay + extra + i * stagger));
    },
    reverse() {
      springs.forEach((s) => s.to(0, config, 0));
    },
    set(p) {
      springs.forEach((s) => s.set(p));
    },
  };
};

/* ------------------------------------------------------------- in view */

/**
 * Fires `onEnter` once when the element enters the viewport inset by
 * `rootMargin`.
 */
export const onceInView = (el, onEnter, rootMargin = "0px") => {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          io.disconnect();
          onEnter();
        }
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return io;
};

/**
 * `mode="forward"`: plays in when the element is on screen; on the way back up
 * the page (element top above the viewport top) it holds rather than
 * reversing. Reverses only when it leaves through the bottom.
 */
export const forwardInView = (el, controllers, rootMargin = "0px") => {
  let on = false;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const scrolledDown = entry.boundingClientRect.top <= 0;
        const want = entry.isIntersecting || scrolledDown;
        if (want === on) continue;
        on = want;
        for (const c of controllers) (want ? c.play() : c.reverse());
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return io;
};

/**
 * The "loop in view" rule: `setRunning(true)` while the element is in view,
 * false ten frames after it leaves.
 */
export const loopInView = (el, setRunning, rootMargin = "0px") => {
  let frames = 0;
  let stop = null;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          stop?.();
          stop = null;
          setRunning(true);
        } else {
          frames = 0;
          stop?.();
          stop = subscribe(() => {
            frames += 1;
            if (frames >= 10) {
              stop?.();
              stop = null;
              setRunning(false);
            }
          });
        }
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return io;
};

/* ------------------------------------------------------------- scroll triggers */

const poseOf = (bb, vh) => ({
  top_top: bb.top,
  center_top: bb.top + bb.height / 2,
  bottom_top: bb.bottom,
  top_bottom: bb.top - vh,
  center_bottom: bb.top + bb.height / 2 - vh,
  bottom_bottom: bb.bottom - vh,
  top_center: bb.top - vh / 2,
  center_center: bb.top + bb.height / 2 - vh / 2,
  bottom_center: bb.bottom - vh / 2,
});

export const triggerProgress = (el, start, end) => {
  const bb = el.getBoundingClientRect();
  const poses = poseOf(bb, window.innerHeight);
  const scrollStart = poses[start.replace(" ", "_")];
  const scrollEnd = poses[end.replace(" ", "_")];
  const length = Math.abs(scrollStart - scrollEnd) || 1;
  return Math.min(Math.max(0, 1 - (scrollStart + length) / length), 1);
};

/**
 * A scrub trigger: progress from the element's rect, read inside the ticker
 * at 10ms, only while in view plus ten frames. `onProgress(raw, smoothed)` —
 * `smoothed` is the `interpolatedProgress` spring for readers that want it.
 */
export const scrub = (el, start, end, onProgress, { smooth = false, config = CONFIG.TRIGGER } = {}) => {
  let last = -1;
  const smoothed = smooth ? new Spring(0, (v) => onProgress(last, v), 0.0005) : null;
  const read = () => {
    const p = triggerProgress(el, start, end);
    if (p === last) return;
    last = p;
    if (smoothed) smoothed.to(p, config);
    else onProgress(p, p);
  };
  let stop = null;
  loopInView(el, (on) => {
    if (on && !stop) {
      read();
      stop = subscribe(read, () => 10);
    } else if (!on && stop) {
      read();
      stop();
      stop = null;
    }
  });
  read();
  if (smoothed) smoothed.set(Math.max(0, last));
  return { read };
};

/** Interpolate "<n><unit>" strings and plain numbers by progress. */
export const lerpUnit = (from, to, p) => {
  if (typeof from === "number") return from + (to - from) * p;
  const re = /(-?[\d.]+)([a-z%]*)/;
  const [, a, unit] = from.match(re);
  const [, b] = to.match(re);
  const v = Number(a) + (Number(b) - Number(a)) * p;
  return `${v.toFixed(4)}${unit}`;
};

/* ------------------------------------------------------------- units */

export const px = (value) => `${((value / 1440) * 100).toFixed(4)}cqw`;
export const type = (value) => `max(${px(value)}, var(--type-min, 0px))`;

export const mq = (query) => window.matchMedia(query);
