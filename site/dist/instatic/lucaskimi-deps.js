var z = { "hero/packed/hero-worker.js.png": "/uploads/_ogiFqM07ivP5JB1hFjQs-lucaskimi-hero-worker_js.png", "hero/packed/helmet3.glb.png": "/uploads/RvQEb9GRaf3gBlwtSy7el-lucaskimi-helmet3_glb.png", "hero/packed/studio-light.hdr.png": "/uploads/4zbey72L_fH68Fh6Ml9D_-lucaskimi-studio-light_hdr.png", "hero/packed/helmet3-tex-0.webp": "/uploads/Z_vrnKjY_0SlRg2La6oMe-lucaskimi-helmet3-tex-0.webp", "hero/packed/helmet3-tex-1.webp": "/uploads/_OjNgVpLsc0p2gxOkR-Ds-lucaskimi-helmet3-tex-1.webp", "hero/packed/helmet3-tex-2.webp": "/uploads/zlGsvUJEtq8Mx7mZxUZMG-lucaskimi-helmet3-tex-2.webp", "hero/scene/person-diffuse.webp": "/uploads/UkKvJZ4y_0YVVhGejLRXD-lucaskimi-person-diffuse.webp", "hero/scene/person-depth.webp": "/uploads/xC84NlkDf-bfAcEk9lyN9-lucaskimi-person-depth.webp", "hero/scene/person-alpha.webp": "/uploads/VMFJaQ633IbxG-bLude1s-lucaskimi-person-alpha.webp", "hero/scene/person-normal.webp": "/uploads/k-ecgjTBXom8jjL_2t7qx-lucaskimi-person-normal.webp", "hero/scene/noise.webp": "/uploads/0eGFNB5zLPqLTyBaAHJGI-lucaskimi-noise.webp" };
var R = "1.3.26";
function W(t, e, i) {
return Math.max(t, Math.min(e, i));
}
function X(t, e, i) {
return (1 - i) * t + i * e;
}
function U(t, e, i, o) {
return X(t, e, 1 - Math.exp(-i * o));
}
function V(t, e) {
return (t % e + e) % e;
}
var F = class {
isRunning = false;
value = 0;
from = 0;
to = 0;
currentTime = 0;
lerp;
duration;
easing;
onUpdate;
advance(t) {
if (!this.isRunning) return;
let e = false;
if (this.duration && this.easing) {
this.currentTime += t;
let i = W(0, this.currentTime / this.duration, 1);
e = i >= 1;
let o = e ? 1 : this.easing(i);
this.value = this.from + (this.to - this.from) * o;
} else this.lerp ? (this.value = U(this.value, this.to, this.lerp * 60, t), Math.round(this.value) === Math.round(this.to) && (this.value = this.to, e = true)) : (this.value = this.to, e = true);
e && this.stop(), this.onUpdate?.(this.value, e);
}
stop() {
this.isRunning = false;
}
fromTo(t, e, { lerp: i, duration: o, easing: s, onStart: n, onUpdate: h }) {
this.from = this.value = t, this.to = e, this.lerp = i, this.duration = o, this.easing = s, this.currentTime = 0, this.isRunning = true, n?.(), this.onUpdate = h;
}
};
function q(t, e) {
let i;
return function(...o) {
clearTimeout(i), i = setTimeout(() => {
i = void 0, t.apply(this, o);
}, e);
};
}
var j = class {
width = 0;
height = 0;
scrollHeight = 0;
scrollWidth = 0;
debouncedResize;
wrapperResizeObserver;
contentResizeObserver;
constructor(t, e, { autoResize: i = true, debounce: o = 250 } = {}) {
this.wrapper = t, this.content = e, i && (this.debouncedResize = q(this.resize, o), this.wrapper instanceof Window ? window.addEventListener("resize", this.debouncedResize) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize();
}
destroy() {
this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect(), this.wrapper === window && this.debouncedResize && window.removeEventListener("resize", this.debouncedResize);
}
resize = () => {
this.onWrapperResize(), this.onContentResize();
};
onWrapperResize = () => {
this.wrapper instanceof Window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
};
onContentResize = () => {
this.wrapper instanceof Window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth);
};
get limit() {
return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
}
}, x = class {
events = {};
emit(t, ...e) {
let i = this.events[t] || [];
for (let o = 0, s = i.length; o < s; o++) i[o]?.(...e);
}
on(t, e) {
return this.events[t] ? this.events[t].push(e) : this.events[t] = [e], () => {
this.events[t] = this.events[t]?.filter((i) => e !== i);
};
}
off(t, e) {
this.events[t] = this.events[t]?.filter((i) => e !== i);
}
destroy() {
this.events = {};
}
}, K = 100 / 6, E = { passive: false };
function N(t, e) {
return t === 1 ? K : t === 2 ? e : 1;
}
var $ = class {
touchStart = { x: 0, y: 0 };
lastDelta = { x: 0, y: 0 };
window = { width: 0, height: 0 };
emitter = new x();
constructor(t, e = { wheelMultiplier: 1, touchMultiplier: 1 }) {
this.element = t, this.options = e, window.addEventListener("resize", this.onWindowResize), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, E), this.element.addEventListener("touchstart", this.onTouchStart, E), this.element.addEventListener("touchmove", this.onTouchMove, E), this.element.addEventListener("touchend", this.onTouchEnd, E);
}
on(t, e) {
return this.emitter.on(t, e);
}
destroy() {
this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize), this.element.removeEventListener("wheel", this.onWheel, E), this.element.removeEventListener("touchstart", this.onTouchStart, E), this.element.removeEventListener("touchmove", this.onTouchMove, E), this.element.removeEventListener("touchend", this.onTouchEnd, E);
}
onTouchStart = (t) => {
let { clientX: e, clientY: i } = t.targetTouches ? t.targetTouches[0] : t;
this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = { x: 0, y: 0 }, this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t });
};
onTouchMove = (t) => {
let { clientX: e, clientY: i } = t.targetTouches ? t.targetTouches[0] : t, o = -(e - this.touchStart.x) * this.options.touchMultiplier, s = -(i - this.touchStart.y) * this.options.touchMultiplier;
this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = { x: o, y: s }, this.emitter.emit("scroll", { deltaX: o, deltaY: s, event: t });
};
onTouchEnd = (t) => {
this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t });
};
onWheel = (t) => {
let { deltaX: e, deltaY: i, deltaMode: o } = t, s = N(o, this.window.width), n = N(o, this.window.height);
e *= s, i *= n, e *= this.options.wheelMultiplier, i *= this.options.wheelMultiplier, this.emitter.emit("scroll", { deltaX: e, deltaY: i, event: t });
};
onWindowResize = () => {
this.window = { width: window.innerWidth, height: window.innerHeight };
};
}, O = (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), H = class {
_isScrolling = false;
_isStopped = false;
_isLocked = false;
_preventNextNativeScrollEvent = false;
_resetVelocityTimeout = null;
_rafId = null;
_isDraggingSelection = false;
reducedMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
isTouching;
isIos;
time = 0;
userData = {};
lastVelocity = 0;
velocity = 0;
direction = 0;
options;
targetScroll;
animatedScroll;
animate = new F();
emitter = new x();
dimensions;
virtualScroll;
constructor({ wrapper: t = window, content: e = document.documentElement, eventsTarget: i = t, smoothWheel: o = true, syncTouch: s = false, syncTouchLerp: n = 0.075, touchInertiaExponent: h = 1.7, duration: p, easing: c, lerp: d = 0.1, infinite: u = false, orientation: a = "vertical", gestureOrientation: r = a === "horizontal" ? "both" : "vertical", touchMultiplier: f = 1, wheelMultiplier: l = 1, autoResize: g = true, prevent: w, virtualScroll: S, overscroll: v = true, autoRaf: b = false, anchors: m = false, autoToggle: L = false, allowNestedScroll: _ = false, __experimental__naiveDimensions: A = false, naiveDimensions: D = A, stopInertiaOnNavigate: I = false, respectReducedMotion: B = true } = {}) {
window.lenisVersion = R, window.lenis || (window.lenis = {}), window.lenis.version = R, a === "horizontal" && (window.lenis.horizontal = true), s === true && (window.lenis.touch = true), this.isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent), (!t || t === document.documentElement) && (t = window), typeof p == "number" && typeof c != "function" ? c = O : typeof c == "function" && typeof p != "number" && (p = 1), this.options = { wrapper: t, content: e, eventsTarget: i, smoothWheel: o, syncTouch: s, syncTouchLerp: n, touchInertiaExponent: h, duration: p, easing: c, lerp: d, infinite: u, gestureOrientation: r, orientation: a, touchMultiplier: f, wheelMultiplier: l, autoResize: g, prevent: w, virtualScroll: S, overscroll: v, autoRaf: b, anchors: m, autoToggle: L, allowNestedScroll: _, naiveDimensions: D, stopInertiaOnNavigate: I, respectReducedMotion: B }, this.dimensions = new j(t, e, { autoResize: g }), this.updateClassName(), this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll), this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true }), (this.options.anchors || this.options.stopInertiaOnNavigate) && this.options.wrapper.addEventListener("click", this.onClick), this.options.wrapper.addEventListener("pointerdown", this.onPointerDown), this.virtualScroll = new $(i, { touchMultiplier: f, wheelMultiplier: l }), this.virtualScroll.on("scroll", this.onVirtualScroll), this.options.autoToggle && (this.checkOverflow(), this.rootElement.addEventListener("transitionend", this.onTransitionEnd)), this.options.autoRaf && (this._rafId = requestAnimationFrame(this.raf));
}
destroy() {
this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll), this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true }), this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown), (this.options.anchors || this.options.stopInertiaOnNavigate) && this.options.wrapper.removeEventListener("click", this.onClick), this.virtualScroll.destroy(), this.dimensions.destroy(), this.cleanUpClassName(), this._rafId && cancelAnimationFrame(this._rafId);
}
on(t, e) {
return this.emitter.on(t, e);
}
off(t, e) {
return this.emitter.off(t, e);
}
onScrollEnd = (t) => {
t instanceof CustomEvent || (this.isScrolling === "smooth" || this.isScrolling === false) && t.stopPropagation();
};
dispatchScrollendEvent = () => {
this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", { bubbles: this.options.wrapper === window, detail: { lenisScrollEnd: true } }));
};
get overflow() {
let t = this.isHorizontal ? "overflow-x" : "overflow-y";
return getComputedStyle(this.rootElement)[t];
}
checkOverflow() {
["hidden", "clip"].includes(this.overflow) ? this.internalStop() : this.internalStart();
}
onTransitionEnd = (t) => {
t.propertyName?.includes("overflow") && t.target === this.rootElement && this.checkOverflow();
};
setScroll(t) {
this.isHorizontal ? this.options.wrapper.scrollTo({ left: t, behavior: "instant" }) : this.options.wrapper.scrollTo({ top: t, behavior: "instant" });
}
onClick = (t) => {
let e = t.composedPath().filter((o) => o instanceof HTMLAnchorElement && o.href).map((o) => new URL(o.href)), i = new URL(window.location.href);
if (this.options.anchors) {
let o = e.find((s) => i.host === s.host && i.pathname === s.pathname && s.hash);
if (o) {
let s = typeof this.options.anchors == "object" && this.options.anchors ? this.options.anchors : void 0, n = decodeURIComponent(o.hash);
this.scrollTo(n, s);
return;
}
}
if (this.options.stopInertiaOnNavigate && e.some((o) => i.host === o.host && i.pathname !== o.pathname)) {
this.reset();
return;
}
};
onPointerDown = (t) => {
t.button === 1 && this.reset();
};
isTouchOnSelectionHandle(t) {
let e = window.getSelection();
if (!e || e.isCollapsed || e.rangeCount === 0) return false;
let i = t.targetTouches[0] ?? t.changedTouches[0];
if (!i) return false;
let o = e.getRangeAt(0).getClientRects();
if (o.length === 0) return false;
let s = o[0], n = o[o.length - 1], h = 40, p = Math.hypot(i.clientX - s.left, i.clientY - s.top) <= h, c = Math.hypot(i.clientX - n.right, i.clientY - n.bottom) <= h;
return p || c;
}
onVirtualScroll = (t) => {
if (typeof this.options.virtualScroll == "function" && this.options.virtualScroll(t) === false) return;
let { deltaX: e, deltaY: i, event: o } = t;
if (this.emitter.emit("virtual-scroll", { deltaX: e, deltaY: i, event: o }), o.ctrlKey || o.lenisStopPropagation) return;
let s = o.type.includes("touch"), n = o.type.includes("wheel");
if (s && this.isIos && (o.type === "touchstart" && (this._isDraggingSelection = this.isTouchOnSelectionHandle(o)), this._isDraggingSelection)) {
o.type === "touchend" && (this._isDraggingSelection = false);
return;
}
this.isTouching = o.type === "touchstart" || o.type === "touchmove";
let h = e === 0 && i === 0;
if (this.options.syncTouch && s && o.type === "touchstart" && h && !this.isStopped && !this.isLocked) {
this.reset();
return;
}
let p = this.options.gestureOrientation === "vertical" && i === 0 || this.options.gestureOrientation === "horizontal" && e === 0;
if (h || p) return;
let c = o.composedPath();
c = c.slice(0, c.indexOf(this.rootElement));
let d = this.options.prevent, u = Math.abs(e) >= Math.abs(i) ? "horizontal" : "vertical";
if (c.find((l) => l instanceof HTMLElement && (typeof d == "function" && d?.(l) || l.hasAttribute?.("data-lenis-prevent") || u === "vertical" && l.hasAttribute?.("data-lenis-prevent-vertical") || u === "horizontal" && l.hasAttribute?.("data-lenis-prevent-horizontal") || s && l.hasAttribute?.("data-lenis-prevent-touch") || n && l.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.hasNestedScroll(l, { deltaX: e, deltaY: i })))) return;
if (this.isStopped || this.isLocked) {
o.cancelable && o.preventDefault();
return;
}
if (!(this.options.syncTouch && s || this.options.smoothWheel && n)) {
this.isScrolling = "native", this.animate.stop(), o.lenisStopPropagation = true;
return;
}
let a = i;
this.options.gestureOrientation === "both" ? a = Math.abs(i) > Math.abs(e) ? i : e : this.options.gestureOrientation === "horizontal" && (a = e), (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && i > 0 || this.animatedScroll === this.limit && i < 0)) && (o.lenisStopPropagation = true), o.cancelable && o.preventDefault();
let r = s && this.options.syncTouch, f = s && o.type === "touchend";
f && (a = Math.sign(a) * Math.abs(this.velocity) ** this.options.touchInertiaExponent), this.scrollTo(this.targetScroll + a, { programmatic: false, ...r ? { lerp: f ? this.options.syncTouchLerp : 1 } : { lerp: this.options.lerp, duration: this.options.duration, easing: this.options.easing } });
};
resize() {
this.dimensions.resize(), this.animatedScroll = this.targetScroll = this.actualScroll, this.emit();
}
emit() {
this.emitter.emit("scroll", this);
}
onNativeScroll = () => {
if (this._resetVelocityTimeout !== null && (clearTimeout(this._resetVelocityTimeout), this._resetVelocityTimeout = null), this._preventNextNativeScrollEvent) {
this._preventNextNativeScrollEvent = false;
return;
}
if (this.isScrolling === false || this.isScrolling === "native") {
let t = this.animatedScroll;
this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity, this.velocity = this.animatedScroll - t, this.direction = Math.sign(this.animatedScroll - t), this.isStopped || (this.isScrolling = "native"), this.emit(), this.velocity !== 0 && (this._resetVelocityTimeout = setTimeout(() => {
this.lastVelocity = this.velocity, this.velocity = 0, this.isScrolling = false, this.emit();
}, 400));
}
};
reset() {
this.isLocked = false, this.isScrolling = false, this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity = 0, this.animate.stop();
}
start() {
if (this.isStopped) {
if (this.options.autoToggle) {
this.rootElement.style.removeProperty("overflow");
return;
}
this.internalStart();
}
}
internalStart() {
this.isStopped && (this.reset(), this.isStopped = false, this.emit());
}
stop() {
if (!this.isStopped) {
if (this.options.autoToggle) {
this.rootElement.style.setProperty("overflow", "clip");
return;
}
this.internalStop();
}
}
internalStop() {
this.isStopped || (this.reset(), this.isStopped = true, this.emit());
}
raf = (t) => {
let e = t - (this.time || t);
this.time = t, this.animate.advance(e * 1e-3), this.options.autoRaf && (this._rafId = requestAnimationFrame(this.raf));
};
scrollTo(t, { offset: e = 0, immediate: i = false, lock: o = false, programmatic: s = true, lerp: n = s ? this.options.lerp : void 0, duration: h = s ? this.options.duration : void 0, easing: p = s ? this.options.easing : void 0, onStart: c, onComplete: d, force: u = false, userData: a } = {}) {
if (this.prefersReducedMotion && (s ? i = true : (n = 1, h = void 0, p = void 0)), (this.isStopped || this.isLocked) && !u) return;
let r = t, f = e;
if (typeof r == "string" && ["top", "left", "start", "#"].includes(r)) r = 0;
else if (typeof r == "string" && ["bottom", "right", "end"].includes(r)) r = this.limit;
else {
let l = null;
if (typeof r == "string" ? (l = r.startsWith("#") ? document.getElementById(r.slice(1)) : document.querySelector(r), l || (r === "#top" ? r = 0 : console.warn("Lenis: Target not found", r))) : r instanceof HTMLElement && r?.nodeType && (l = r), l) {
if (this.options.wrapper !== window) {
let m = this.rootElement.getBoundingClientRect();
f -= this.isHorizontal ? m.left : m.top;
}
let g = l.getBoundingClientRect(), w = getComputedStyle(l), S = this.isHorizontal ? Number.parseFloat(w.scrollMarginLeft) : Number.parseFloat(w.scrollMarginTop), v = getComputedStyle(this.rootElement), b = this.isHorizontal ? Number.parseFloat(v.scrollPaddingLeft) : Number.parseFloat(v.scrollPaddingTop);
r = (this.isHorizontal ? g.left : g.top) + this.animatedScroll - (Number.isNaN(S) ? 0 : S) - (Number.isNaN(b) ? 0 : b);
}
}
if (typeof r == "number") {
if (r += f, this.options.infinite) {
if (s) {
this.targetScroll = this.animatedScroll = this.scroll;
let l = r - this.animatedScroll;
l > this.limit / 2 ? r -= this.limit : l < -this.limit / 2 && (r += this.limit);
}
} else r = W(0, r, this.limit);
if (r === this.targetScroll) {
c?.(this), d?.(this);
return;
}
if (this.userData = a ?? {}, i) {
this.animatedScroll = this.targetScroll = r, this.setScroll(this.scroll), this.reset(), this.preventNextNativeScrollEvent(), this.emit(), d?.(this), this.userData = {}, requestAnimationFrame(() => {
this.dispatchScrollendEvent();
});
return;
}
s || (this.targetScroll = r), typeof h == "number" && typeof p != "function" ? p = O : typeof p == "function" && typeof h != "number" && (h = 1), this.animate.fromTo(this.animatedScroll, r, { duration: h, easing: p, lerp: n, onStart: () => {
o && (this.isLocked = true), this.isScrolling = "smooth", c?.(this);
}, onUpdate: (l, g) => {
this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = l - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = l, this.setScroll(this.scroll), s && (this.targetScroll = l), g || this.emit(), g && (this.reset(), this.emit(), d?.(this), this.userData = {}, requestAnimationFrame(() => {
this.dispatchScrollendEvent();
}), this.preventNextNativeScrollEvent());
} });
}
}
preventNextNativeScrollEvent() {
this._preventNextNativeScrollEvent = true, requestAnimationFrame(() => {
this._preventNextNativeScrollEvent = false;
});
}
hasNestedScroll(t, { deltaX: e, deltaY: i }) {
let o = Date.now();
t._lenis || (t._lenis = {});
let s = t._lenis, n, h, p, c, d, u, a, r, f, l;
if (o - (s.time ?? 0) > 2e3) {
s.time = Date.now();
let _ = window.getComputedStyle(t);
if (s.computedStyle = _, n = ["auto", "overlay", "scroll"].includes(_.overflowX), h = ["auto", "overlay", "scroll"].includes(_.overflowY), d = ["auto"].includes(_.overscrollBehaviorX), u = ["auto"].includes(_.overscrollBehaviorY), s.hasOverflowX = n, s.hasOverflowY = h, !(n || h)) return false;
a = t.scrollWidth, r = t.scrollHeight, f = t.clientWidth, l = t.clientHeight, p = a > f, c = r > l, s.isScrollableX = p, s.isScrollableY = c, s.scrollWidth = a, s.scrollHeight = r, s.clientWidth = f, s.clientHeight = l, s.hasOverscrollBehaviorX = d, s.hasOverscrollBehaviorY = u;
} else p = s.isScrollableX, c = s.isScrollableY, n = s.hasOverflowX, h = s.hasOverflowY, a = s.scrollWidth, r = s.scrollHeight, f = s.clientWidth, l = s.clientHeight, d = s.hasOverscrollBehaviorX, u = s.hasOverscrollBehaviorY;
if (!(n && p || h && c)) return false;
let g = Math.abs(e) >= Math.abs(i) ? "horizontal" : "vertical", w, S, v, b, m, L;
if (g === "horizontal") w = Math.round(t.scrollLeft), S = a - f, v = e, b = n, m = p, L = d;
else if (g === "vertical") w = Math.round(t.scrollTop), S = r - l, v = i, b = h, m = c, L = u;
else return false;
return !L && (w >= S || w <= 0) ? true : (v > 0 ? w < S : w > 0) && b && m;
}
get rootElement() {
return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
}
get limit() {
return this.options.naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
}
get isHorizontal() {
return this.options.orientation === "horizontal";
}
get actualScroll() {
let t = this.options.wrapper;
return this.isHorizontal ? t.scrollX ?? t.scrollLeft : t.scrollY ?? t.scrollTop;
}
get scroll() {
return this.options.infinite ? V(this.animatedScroll, this.limit) : this.animatedScroll;
}
get progress() {
return this.limit === 0 ? 1 : this.scroll / this.limit;
}
get isScrolling() {
return this._isScrolling;
}
set isScrolling(t) {
this._isScrolling !== t && (this._isScrolling = t, this.updateClassName());
}
get isStopped() {
return this._isStopped;
}
set isStopped(t) {
this._isStopped !== t && (this._isStopped = t, this.updateClassName());
}
get isLocked() {
return this._isLocked;
}
set isLocked(t) {
this._isLocked !== t && (this._isLocked = t, this.updateClassName());
}
get isSmooth() {
return this.isScrolling === "smooth";
}
get prefersReducedMotion() {
return this.options.respectReducedMotion && this.reducedMotionMediaQuery.matches;
}
get className() {
let t = "lenis";
return this.options.autoToggle && (t += " lenis-autoToggle"), this.isStopped && (t += " lenis-stopped"), this.isLocked && (t += " lenis-locked"), this.isScrolling && (t += " lenis-scrolling"), this.isScrolling === "smooth" && (t += " lenis-smooth"), t;
}
updateClassName() {
this.cleanUpClassName(), this.className.split(" ").forEach((t) => {
this.rootElement.classList.add(t);
});
}
cleanUpClassName() {
for (let t of Array.from(this.rootElement.classList)) (t === "lenis" || t.startsWith("lenis-")) && this.rootElement.classList.remove(t);
}
};
var G = "/uploads", C = typeof z < "u" ? z : null, y = (t) => C && C[t] || `${G}/${t}`, M = (t) => new Promise((e, i) => {
let o = new Image();
o.crossOrigin = "anonymous", o.onerror = () => i(new Error(t)), o.onload = async () => {
try {
let s = await createImageBitmap(o, { premultiplyAlpha: "none", colorSpaceConversion: "none" }), n = document.createElement("canvas");
n.width = s.width, n.height = s.height;
let h = n.getContext("2d", { willReadFrequently: true });
h.drawImage(s, 0, 0), s.close?.();
let p = h.getImageData(0, 0, n.width, n.height).data, c = (a) => p[Math.floor(a / 3) * 4 + a % 3], d = 0;
for (let a = 0; a < 6; a += 1) d = d * 256 + c(a);
let u = new Uint8Array(d);
for (let a = 0; a < d; a += 1) u[a] = c(a + 6);
e(u.buffer);
} catch (s) {
i(s instanceof Error ? s : new Error(t));
}
}, o.src = t;
}), T = (t, e) => new Promise((i, o) => {
let s = new Image();
s.crossOrigin = "anonymous", s.onerror = () => o(new Error(t)), s.onload = () => createImageBitmap(s, e).then(i, () => o(new Error(t))), s.src = t;
}), Q = (t) => {
let e = document.createElement("span");
e.style.cssText = `position:absolute;visibility:hidden;color:var(${t})`, document.body.appendChild(e);
let i = getComputedStyle(e).color;
return e.remove(), i;
}, P = () => {
let t = matchMedia("(hover: none) and (pointer: coarse)").matches, e = innerWidth, i = e < 768 || t && e < 1024 ? "mobile" : t || e < 1280 ? "tablet" : "desktop", o = i === "mobile", s = matchMedia("(prefers-reduced-motion: reduce)").matches, n = !!(navigator.connection && navigator.connection.saveData) || (navigator.deviceMemory ?? 8) <= 2;
return { name: i, mobile: o, coarsePointer: t, reducedMotion: s, maxDpr: o ? 1 : i === "tablet" ? 1.25 : 1.5, frameInterval: i === "desktop" ? 0 : 1e3 / 60 - 2, pointerEnabled: !t && !s, antialias: i === "desktop", trailSamples: o ? 28 : i === "tablet" ? 44 : 72, outline: !o, reveal: !o, freeze: s || o && n };
}, k = class {
constructor(e) {
if (typeof Worker > "u" || !e.transferControlToOffscreen) throw new Error("OffscreenCanvas/Worker unavailable");
this.onReady = null, this.onError = null, this._tier = P(), this.worker = null, this.pending = /* @__PURE__ */ new Map(), this.risen = false, this.failed = false;
let i = e.transferControlToOffscreen(), o = {};
for (let h of ["--accent", "--foreground", "--background", "--surface-soft"]) o[h] = Q(h);
let s = { imageOrientation: "flipY", premultiplyAlpha: "none", colorSpaceConversion: "none" }, n = { premultiplyAlpha: "none", colorSpaceConversion: "none" };
Promise.all([M(y("hero/packed/hero-worker.js.png")), T(y("hero/scene/person-diffuse.webp"), s), T(y("hero/scene/person-depth.webp"), s), T(y("hero/scene/person-alpha.webp"), s), T(y("hero/scene/person-normal.webp"), s), T(y("hero/scene/noise.webp"), s), M(y("hero/packed/helmet3.glb.png")), M(y("hero/packed/studio-light.hdr.png")), T(y("hero/packed/helmet3-tex-0.webp"), n), T(y("hero/packed/helmet3-tex-1.webp"), n), T(y("hero/packed/helmet3-tex-2.webp"), n)]).then(([h, p, c, d, u, a, r, f, l, g, w]) => {
if (this.failed) return;
let S = URL.createObjectURL(new Blob([h], { type: "text/javascript" })), v = new Worker(S);
URL.revokeObjectURL(S), v.onmessage = ({ data: m }) => {
m.type === "ready" ? this.onReady && this.onReady() : m.type === "error" && this.fail(new Error(m.message));
}, v.onerror = (m) => this.fail(new Error(m.message || "hero worker error"));
let b = { hdr: f, helmet: r, diffuse: p, depth: c, alpha: d, normal: u, noise: a, helmetImages: { "helmet3-tex-0.webp": l, "helmet3-tex-1.webp": g, "helmet3-tex-2.webp": w } };
v.postMessage({ type: "init", canvas: i, env: { tier: this._tier, tokens: o, dpr: devicePixelRatio, assets: b } }, [i, f, r, p, c, d, u, a, l, g, w]), this.worker = v;
for (let m of this.pending.values()) v.postMessage(m);
this.pending.clear(), this.risen && v.postMessage({ type: "rise" });
}).catch((h) => this.fail(h));
}
fail(e) {
this.failed || (this.failed = true, console.error("Hero scene failed:", e), this.onError && this.onError(e));
}
send(e) {
this.worker ? this.worker.postMessage(e) : this.pending.set(e.type, e);
}
get tier() {
return this._tier;
}
retune() {
let e = this._tier;
return this._tier = { ...P(), antialias: e.antialias, trailSamples: e.trailSamples }, this.send({ type: "retune", tier: this._tier, dpr: devicePixelRatio }), this._tier;
}
setPointer(e, i) {
this.send({ type: "pointer", x: e, y: i });
}
setParams(e) {
this.send({ type: "params", params: e });
}
resize(e, i) {
this.send({ type: "resize", width: e, height: i });
}
update(e) {
this.worker && this.worker.postMessage({ type: "frame", time: e });
}
beginRise() {
this.risen = true, this.worker && this.worker.postMessage({ type: "rise" });
}
};
globalThis.__LK_LIBS__ = { ...globalThis.__LK_LIBS__ || {}, Lenis: H, HeroScene: k };
