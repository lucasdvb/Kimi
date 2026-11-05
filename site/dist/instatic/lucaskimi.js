(() => {
const t = () => globalThis.__LK_LIBS__ && globalThis.__LK_LIBS__.HeroScene ? lk() : setTimeout(t, 20);
t();
})();
function lk() {
var Ge = Object.defineProperty;
var ht = (t, e) => () => (t && (e = t(t = 0)), e);
var He = (t, e) => {
for (var n in e) Ge(t, n, { get: e[n], enumerable: true });
};
var F, St, pt, zt, j, E, it, Et, Ct, Ue, W, lt, mt, M, G, tt, H, Mt, J, et, Ve, Xe, st, Lt, z, dt = ht(() => {
F = window.matchMedia("(prefers-reduced-motion: reduce)").matches, St = /* @__PURE__ */ new Set(), pt = 0, zt = (t) => {
pt = requestAnimationFrame(zt);
for (let e of [...St]) St.has(e) && t - e.last > e.getFramerate() && (e.last = t, e.callback(t));
}, j = (t, e = () => 0) => {
let n = { callback: t, getFramerate: e, last: -1 / 0 };
return St.add(n), pt || (pt = requestAnimationFrame(zt)), () => {
St.delete(n), !St.size && pt && (cancelAnimationFrame(pt), pt = 0);
};
}, E = { REVEAL: { tension: 90, friction: 26 }, ROW: { tension: 170, friction: 24 }, ITEM: { tension: 170, friction: 24 }, SHEET: { tension: 190, friction: 26 }, FIGURE: { tension: 200, friction: 24 }, TYPE: { tension: 210, friction: 24 }, YEAR: { tension: 190, friction: 24 }, COPY: { tension: 110, friction: 26 }, COPY_WORDS: { tension: 150, friction: 24 }, NAME: { tension: 190, friction: 24 }, VEIL: { tension: 70, friction: 24 }, CLEAR: { tension: 140, friction: 26 }, LABEL: { tension: 110, friction: 26 }, PROGRESS_WAIT: { tension: 10, friction: 30 }, PROGRESS_READY: { tension: 170, friction: 26 }, YEAR_SETTLE: { tension: 32, friction: 26 }, TRIGGER: { tension: 140, friction: 30 } }, it = /* @__PURE__ */ new Set(), Et = null, Ct = 0, Ue = (t) => {
let e = Math.min(64, Ct ? t - Ct : 16);
Ct = t;
for (let n of [...it]) n.advance(t, e);
!it.size && Et && (Et(), Et = null, Ct = 0);
}, W = class {
constructor(e, n, o = 1e-3) {
this.value = e, this.target = e, this.velocity = 0, this.onChange = n, this.precision = o, this.config = E.REVEAL, this.startAt = 0, this.tween = null, n?.(e);
}
to(e, n = this.config, o = 0) {
this.config = n, !(e === this.target && !this.tween && !it.has(this)) && (this.target = e, this.startAt = performance.now() + o, this.tween = null, n.duration !== void 0 && (this.tween = { from: this.value, start: null, duration: n.duration, easing: n.easing || ((r) => r) }), it.add(this), Et || (Et = j(Ue, () => 0)));
}
set(e) {
this.value = e, this.target = e, this.velocity = 0, this.tween = null, it.delete(this), this.onChange?.(e);
}
advance(e, n) {
let o = performance.now();
if (o < this.startAt) return;
if (this.tween) {
let i = this.tween;
i.start === null && (i.start = o);
let l = i.duration <= 0 ? 1 : Math.min(1, (o - i.start) / i.duration);
this.value = i.from + (this.target - i.from) * i.easing(l), this.onChange?.(this.value), l >= 1 && (this.tween = null, it.delete(this), this.onRest?.());
return;
}
let { tension: r, friction: s } = this.config, c = Math.ceil(n), a = this.value, h = this.velocity;
for (let i = 0; i < c; i += 1) {
let l = -r * 1e-6 * (a - this.target), m = -s * 1e-3 * h;
h += l + m, a += h;
}
if (this.value = a, this.velocity = h, Math.abs(h) < this.precision && Math.abs(this.target - a) < this.precision) {
this.value = this.target, this.velocity = 0, it.delete(this), this.onChange?.(this.value), this.onRest?.();
return;
}
this.onChange?.(this.value);
}
}, lt = (t, e, n = (o) => o) => {
let o = false, r = 0, s = 0, c = null;
return { setRunning(a) {
a !== o && (o = a, a ? (r += performance.now() - s, c = j(() => {
let h = (performance.now() - r) % t / t;
e(n(h));
})) : (s = performance.now(), c?.(), c = null));
} };
}, mt = { outQuad: (t) => 1 - (1 - t) * (1 - t), inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2, outCubic: (t) => 1 - Math.pow(1 - t, 3) }, M = (t, e, n = E.REVEAL) => {
let o = new W(0, (r) => e(t, r));
return { spring: o, play(r = 0) {
o.to(1, n, F ? 0 : r);
}, reverse() {
o.to(0, n, 0);
}, set(r) {
o.set(r);
} };
}, G = (t = "0.75rem") => (e, n) => {
e.style.opacity = `${n}`, e.style.transform = n >= 1 ? "" : `translateY(calc(${t} * ${1 - n}))`;
}, tt = (t, e) => {
t.style.opacity = `${e}`;
}, H = (t, { by: e = "word", stagger: n = 110, config: o = E.REVEAL, delay: r = 0, gap: s } = {}) => {
let c = t.textContent.replace(/\s+/g, " ").trim();
t.textContent = "", t.classList.add("txt"), s !== void 0 && (t.style.columnGap = s);
let a = document.createElement("span");
a.className = "sr-only", a.textContent = c, t.appendChild(a);
let h = [], i = c.split(" ");
for (let p of i) {
let d = document.createElement("span");
if (d.setAttribute("aria-hidden", "true"), d.className = "txt-w", e === "word") h.push(d), d.textContent = p;
else for (let u of p) {
let f = document.createElement("span");
f.className = "txt-l", f.textContent = u, d.appendChild(f), h.push(f);
}
t.appendChild(d);
}
let l = e === "word" ? 0.35 : 0.3, m = h.map((p) => new W(0, (d) => {
p.style.opacity = `${d}`, p.style.transform = d >= 1 ? "" : `translateY(${(l * (1 - d)).toFixed(4)}em)`;
}));
return { play(p = 0) {
m.forEach((d, u) => d.to(1, o, F ? 0 : r + p + u * n));
}, reverse() {
m.forEach((p) => p.to(0, o, 0));
}, set(p) {
m.forEach((d) => d.set(p));
} };
}, Mt = (t, e, n = "0px") => {
let o = new IntersectionObserver((r) => {
for (let s of r) s.isIntersecting && (o.disconnect(), e());
}, { rootMargin: n });
return o.observe(t), o;
}, J = (t, e, n = "0px") => {
let o = false, r = new IntersectionObserver((s) => {
for (let c of s) {
let a = c.boundingClientRect.top <= 0, h = c.isIntersecting || a;
if (h !== o) {
o = h;
for (let i of e) h ? i.play() : i.reverse();
}
}
}, { rootMargin: n });
return r.observe(t), r;
}, et = (t, e, n = "0px") => {
let o = 0, r = null, s = new IntersectionObserver((c) => {
for (let a of c) a.isIntersecting ? (r?.(), r = null, e(true)) : (o = 0, r?.(), r = j(() => {
o += 1, o >= 10 && (r?.(), r = null, e(false));
}));
}, { rootMargin: n });
return s.observe(t), s;
}, Ve = (t, e) => ({ top_top: t.top, center_top: t.top + t.height / 2, bottom_top: t.bottom, top_bottom: t.top - e, center_bottom: t.top + t.height / 2 - e, bottom_bottom: t.bottom - e, top_center: t.top - e / 2, center_center: t.top + t.height / 2 - e / 2, bottom_center: t.bottom - e / 2 }), Xe = (t, e, n) => {
let o = t.getBoundingClientRect(), r = Ve(o, window.innerHeight), s = r[e.replace(" ", "_")], c = r[n.replace(" ", "_")], a = Math.abs(s - c) || 1;
return Math.min(Math.max(0, 1 - (s + a) / a), 1);
}, st = (t, e, n, o, { smooth: r = false, config: s = E.TRIGGER } = {}) => {
let c = -1, a = r ? new W(0, (l) => o(c, l), 5e-4) : null, h = () => {
let l = Xe(t, e, n);
l !== c && (c = l, a ? a.to(l, s) : o(l, l));
}, i = null;
return et(t, (l) => {
l && !i ? (h(), i = j(h, () => 10)) : !l && i && (h(), i(), i = null);
}), h(), a && a.set(Math.max(0, c)), { read: h };
}, Lt = (t) => `${(t / 1440 * 100).toFixed(4)}cqw`, z = (t) => window.matchMedia(t);
});
var at, yt, ut, Yt, no, ro, ne, so, gt, re, se, ae, ao, co, ce, io, Wt, Pt = ht(() => {
dt();
at = (t) => {
let e = document.createElement("span");
e.style.cssText = `position:absolute;visibility:hidden;color:var(${t})`, document.body.appendChild(e);
let n = getComputedStyle(e).color;
return e.remove(), n;
}, yt = (t) => {
let e = t.match(/[\d.]+/g) || ["0", "0", "0"];
return [Number(e[0]), Number(e[1]), Number(e[2]), e[3] !== void 0 ? Number(e[3]) : 1];
}, ut = (t) => {
let n = [...t.querySelectorAll("[data-head-line]")].map((r, s) => H(r, { by: "word", stagger: 110, config: E.REVEAL, delay: s * 130 })), o = t.querySelector("[data-head-dot]");
if (o) {
let r = M(o, tt, E.REVEAL);
n.push({ play: () => r.play(240), reverse: () => r.reverse() });
}
return n;
}, Yt = 0.16, no = 2, ro = 0.06, ne = (t, e) => {
let n = Math.imul(t, 374761393) + Math.imul(e, 668265263);
return n = Math.imul(n ^ n >>> 13, 1274126177), ((n ^ n >>> 16) >>> 0) / 4294967295;
}, so = (t) => Math.min(1, Math.max(0, t)), gt = (t) => {
let e = t.dataset.dissolve, n = t.getContext("2d"), o = 0, r = 0, s = 0, c = "", a = "", h = () => {
if (!r || !s) return;
let l = Math.min(window.devicePixelRatio || 1, 2);
n.setTransform(l, 0, 0, l, 0, 0), n.clearRect(0, 0, r, s);
let m = parseFloat(getComputedStyle(t).getPropertyValue("--flag-cell")), p = m > 0 ? m : 24, d = Math.ceil(r / p), u = Math.ceil(s / p), f = o * no;
for (let w = 0; w < u; w += 1) {
let b = w / Math.max(1, u - 1) + f;
if (b > 1) break;
let S = b <= Yt, x = so(1 - (b - Yt) / (1 - Yt));
if (!S && x <= 0) break;
for (let y = 0; y < d; y += 1) !S && ((y + w) % 2 !== 0 || ne(y, w) > x) || (n.fillStyle = !S && ne(y + 101, w + 57) < ro ? a : c, n.fillRect(y * p, w * p, p, p));
}
}, i = () => {
c = at(e === "light" ? "--background" : "--surface-black"), a = at("--accent"), r = t.clientWidth, s = t.clientHeight;
let l = Math.min(window.devicePixelRatio || 1, 2);
t.width = Math.round(r * l), t.height = Math.round(s * l), h();
};
new ResizeObserver(i).observe(t), i(), st(t, "top bottom", "top top", (l, m) => {
o = m, h();
}, { smooth: true, config: E.TRIGGER });
}, re = 3.8, se = 2.5, ae = 0.37, ao = 1.66, co = 0.85, ce = 96, io = (t, e, n) => {
let o = Math.sin(t * 1 + n * 0.6) * 0.5;
return o += Math.sin(e * 0.85 - n * 0.45) * 0.45, o += Math.sin((t + e) * 0.65 + n * 0.35) * 0.35, o += Math.sin((t - e) * 0.95 - n * 0.55) * 0.25, o * 0.5 + 0.5;
}, Wt = (t, e) => {
let n = t.getContext("2d"), o = performance.now(), r = "", s = 0, c = 0, a = null, h = () => {
if (!s || !c) return;
let m = (performance.now() - o) / 1e3 * ao, p = Math.min(window.devicePixelRatio || 1, 2);
n.setTransform(p, 0, 0, p, 0, 0), n.clearRect(0, 0, s, c);
let d = s >= c ? ce : Math.max(8, Math.round(ce * s / c)), u = Math.max(8, Math.round(d * c / s)), f = s / d, w = c / u, b = s / c, S = (d + 1) * (u + 1);
(!a || a.length !== S) && (a = new Float32Array(S));
for (let y = 0; y <= u; y += 1) for (let R = 0; R <= d; R += 1) {
let _ = (R / d * 2 - 1) * b * re, g = (y / u * 2 - 1) * re, A = _ + Math.sin(g * 0.8 + m * 0.7) * ae, T = g + Math.cos(_ * 0.7 - m * 0.6) * ae;
a[y * (d + 1) + R] = io(A, T, m) * se;
}
n.strokeStyle = r, n.lineWidth = 1, n.globalAlpha = co, n.beginPath();
let x = (y, R) => {
n.moveTo(y[0], y[1]), n.lineTo(R[0], R[1]);
};
for (let y = 0.5; y < se; y += 1) for (let R = 0; R < u; R += 1) for (let _ = 0; _ < d; _ += 1) {
let g = a[R * (d + 1) + _], A = a[R * (d + 1) + _ + 1], T = a[(R + 1) * (d + 1) + _ + 1], $ = a[(R + 1) * (d + 1) + _], k = (g > y ? 8 : 0) | (A > y ? 4 : 0) | (T > y ? 2 : 0) | ($ > y ? 1 : 0);
if (k === 0 || k === 15) continue;
let C = _ * f, L = R * w, v = [C + f * ((y - g) / (A - g)), L], I = [C + f, L + w * ((y - A) / (T - A))], P = [C + f * ((y - $) / (T - $)), L + w], O = [C, L + w * ((y - g) / ($ - g))];
switch (k) {
case 1:
case 14:
x(O, P);
break;
case 2:
case 13:
x(P, I);
break;
case 3:
case 12:
x(O, I);
break;
case 4:
case 11:
x(v, I);
break;
case 6:
case 9:
x(v, P);
break;
case 7:
case 8:
x(O, v);
break;
case 5:
x(O, v), x(P, I);
break;
case 10:
x(O, P), x(v, I);
break;
}
}
n.stroke(), n.globalAlpha = 1;
}, i = () => {
r = at(t.dataset.contour), s = t.clientWidth, c = t.clientHeight;
let m = Math.min(window.devicePixelRatio || 1, 2);
t.width = Math.round(s * m), t.height = Math.round(c * m), h();
};
if (new ResizeObserver(i).observe(t), i(), e) return;
let l = null;
et(t, (m) => {
m && !l ? l = j(h, () => 24) : !m && l && (l(), l = null);
});
};
});
var Z, pe, me, fe = ht(() => {
Z = globalThis.__LK_DATA__.circuit, pe = [{ x: 328.9, y: 510.6, d: 278.4 }, { x: 758.4, y: 193.2, d: 811.7 }, { x: 1046.6, y: 338.9, d: 1323.7 }, { x: 973.7, y: 503.3, d: 1867.7 }], me = 3;
});
var D, bt, Co, ct, ye = ht(() => {
D = { pitchX: 7.8, pitchY: 7.7, originX: 5, originY: 16.64 }, bt = 1.75, Co = globalThis.__LK_DATA__.dots, ct = (() => {
let t = [], e = [], n = [], o = 0;
for (let r of Co.split(";")) {
let [s, c] = r.split(":");
o += Number(s);
let a = 0, h = c.split(",");
for (let i = 0; i < h.length; i += 1) a = i === 0 ? Number(h[i]) : a + Number(h[i]), t.push(D.originX + a * D.pitchX, D.originY + o * D.pitchY), e.push(a), n.push(o);
}
return { points: Float32Array.from(t), columns: Int16Array.from(e), rows: Int16Array.from(n), count: e.length };
})();
});
var V, Gt, ge, be, Rt, Ht, Mo, Lo, Se, Ee, Ut, Vt, Xt, ot, we, Ae, Bt, xe, Re, X, _e, Te = ht(() => {
V = { width: 2560, height: 1440, band: 11.67 }, Gt = globalThis.__LK_DATA__.ribbon, ge = globalThis.__LK_DATA__.centreline, be = 30, Rt = 4805.57, Ht = { top: 2, width: 1438.43, height: 796 }, Mo = V.width / Ht.width, Lo = (V.height - V.band * 2) / Ht.height, Se = (t, e) => [t / Mo, (e - V.band) / Lo + Ht.top], Ee = [645.31, 1276.96, 1908.61], Ut = 697.98, Vt = "12.15 8.35", Xt = 2.13, ot = { x: 1278.48, y: 699.5, r: 10.63 }, we = [{ r: 69.85, width: 3.04, ghost: false }, { r: 356.06, width: 2.13, ghost: true }, { r: 442.61, width: 2.13, ghost: true }], Ae = [[65.29, 76.96], [2471.93, 76.96], [65.29, 931.81], [2471.93, 931.81], [65.29, 1343.3], [1155.49, 1343.3], [1384.77, 1343.3]], Bt = 16.7, xe = "13.69,0 -6.85,11.86 -6.85,-11.86", Re = [{ x: 1349.96, y: 351.98, angle: 73.5 }, { x: 1862.23, y: 611.24, angle: 30.5 }, { x: 1732.95, y: 903.82, angle: 89.5 }, { x: 585.43, y: 916.65, angle: 17.5 }], X = { x: 822.96, y: 921.57, along: 36, across: 40, angle: 144 }, _e = globalThis.__LK_DATA__.flag;
});
var Ne = {};
He(Ne, { setupSeason: () => en });
var Io, N, ko, jt, ve, Po, Oo, qo, Do, Ce, qe, Me, Le, Q, De, _t, No, Tt, qt, B, Ie, $o, Yo, Wo, ke, Fo, Go, Ho, Uo, Vo, Xo, Bo, Pe, jo, Ko, zo, Oe, vt, Ot, Zo, Jo, Qo, tn, en, $e = ht(() => {
fe();
ye();
Te();
dt();
Pt();
Io = "http://www.w3.org/2000/svg", N = (t, e = {}, n) => {
let o = document.createElementNS(Io, t);
for (let [r, s] of Object.entries(e)) o.setAttribute(r, s);
return n?.appendChild(o), o;
}, ko = 6e3, jt = 5.9, ve = 15, Po = 210, Oo = 800, qo = 90, Do = 9, Ce = Se(X.x, X.y), qe = 1438.43 / 2560, Me = X.along * qe, Le = X.across * qe, Q = Z.reduce((t, e, n) => {
if (n === 0) return [0];
let o = Z[n - 1];
return t.push(t[n - 1] + Math.hypot(e[0] - o[0], e[1] - o[1])), t;
}, []), De = Q[Q.length - 1], _t = (() => {
let t = Z.length, e = new Array(t).fill(0);
for (let c = 1; c < t - 1; c += 1) {
let [a, h] = Z[c - 1], [i, l] = Z[c], [m, p] = Z[c + 1], d = i - a, u = l - h, f = m - i, w = p - l, b = (Math.hypot(d, u) || 1) * (Math.hypot(f, w) || 1);
e[c] = Math.acos(Math.min(1, Math.max(-1, (d * f + u * w) / b)));
}
let n = 6, o = e.map((c, a) => {
let h = 0, i = 0;
for (let l = Math.max(0, a - n); l <= Math.min(t - 1, a + n); l += 1) h += e[l], i += 1;
return h / i;
}), r = [0];
for (let c = 1; c < t; c += 1) {
let a = Q[c] - Q[c - 1], h = 1 / (1 + Do * o[c]);
r.push(r[c - 1] + a / h);
}
let s = r[t - 1] || 1;
return r.map((c) => c / s);
})(), No = (t) => {
if (t <= 0) return 0;
if (t >= 1) return De;
let e = 0, n = _t.length - 1;
for (; e < n - 1; ) {
let s = e + n >> 1;
_t[s] <= t ? e = s : n = s;
}
let o = _t[n] - _t[e] || 1, r = (t - _t[e]) / o;
return Q[e] + (Q[n] - Q[e]) * r;
}, Tt = (() => {
let t = 1 / 0, e = 1 / 0, n = -1 / 0, o = -1 / 0;
for (let [s, c] of Z) t = Math.min(t, s), n = Math.max(n, s), e = Math.min(e, c), o = Math.max(o, c);
let r = 46;
return { x: t - r, y: e - r, width: n - t + r * 2, height: o - e + r * 2 };
})(), qt = (t, e, n) => [Math.round(t[0] + (e[0] - t[0]) * n), Math.round(t[1] + (e[1] - t[1]) * n), Math.round(t[2] + (e[2] - t[2]) * n)], B = ([t, e, n], o) => `rgb(${t} ${e} ${n} / ${o})`, Ie = ([t, e, n]) => `rgb(${t} ${e} ${n})`, $o = (t) => {
let e = [];
for (let n = 0; n < Z.length; n += 1) {
if (Q[n] <= t) {
e.push(Z[n]);
continue;
}
let o = Z[n - 1], r = Z[n], s = (t - Q[n - 1]) / (Q[n] - Q[n - 1]);
e.push([o[0] + (r[0] - o[0]) * s, o[1] + (r[1] - o[1]) * s]);
break;
}
return e;
}, Yo = (t) => {
let e = N("defs", {}, t), n = N("mask", { id: "season-cut", maskUnits: "userSpaceOnUse", x: -5e3, y: -5e3, width: 12560, height: 11440 }, e);
N("rect", { x: -5e3, y: -5e3, width: 12560, height: 11440, fill: "white" }, n), N("rect", { x: X.x - X.along / 2, y: X.y - X.across / 2, width: X.along, height: X.across, fill: "black", transform: `rotate(${X.angle} ${X.x} ${X.y})` }, n);
let o = N("mask", { id: "season-lap", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 2560, height: 1440 }, e), r = N("path", { d: ge, fill: "none", stroke: "white", "stroke-width": be, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${Rt + 60} ${Rt + 60}`, "stroke-dashoffset": `${60 + Rt}` }, o), s = N("g", { id: "grid" }, t), c = [];
for (let d of Ee) c.push(N("line", { x1: d, y1: -4e3, x2: d, y2: 5440, style: "stroke:var(--map-grid)", "stroke-width": Xt, "stroke-dasharray": Vt }, s));
c.push(N("line", { x1: -4e3, y1: Ut, x2: 6560, y2: Ut, style: "stroke:var(--map-grid)", "stroke-width": Xt, "stroke-dasharray": Vt }, s));
for (let d of we) N("circle", { cx: ot.x, cy: ot.y, r: d.r, fill: "none", style: `stroke:var(${d.ghost ? "--map-grid-ghost" : "--map-grid"})`, "stroke-width": d.width }, s);
let a = N("circle", { cx: ot.x, cy: ot.y, r: ot.r, fill: "none", style: "stroke:var(--accent)", "stroke-width": 2.13, opacity: 0 }, s);
for (let [d, u] of Ae) N("rect", { x: d, y: u, width: Bt, height: Bt, style: "fill:var(--map-mark)" }, s);
N("circle", { cx: ot.x, cy: ot.y, r: ot.r, style: "fill:var(--map-mark)" }, s);
let h = N("g", { mask: "url(#season-cut)" }, t);
N("path", { d: Gt, style: "fill:var(--foreground-on-dark)" }, h);
let i = N("g", { mask: "url(#season-lap)" }, h);
N("path", { d: Gt, style: "fill:var(--accent)" }, i);
let l = N("g", { id: "markers" }, t);
for (let d of Re) N("polygon", { points: xe, style: "fill:var(--accent)", transform: `translate(${d.x} ${d.y}) rotate(${d.angle})` }, l);
N("path", { d: _e, style: "fill:var(--map-mark)" }, l);
let m = lt(7e3, (d) => {
let u = `${d * 20.5}`;
for (let f of c) f.setAttribute("stroke-dashoffset", u);
}), p = lt(4200, (d) => {
a.setAttribute("r", `${ot.r + d * 86}`), a.setAttribute("opacity", `${0.4 * (1 - d) * (1 - d)}`);
}, mt.outQuad);
return { setLap: (d) => r.setAttribute("stroke-dashoffset", `${60 + d * Rt}`), setRunning: (d) => {
F || (m.setRunning(d), p.setRunning(d));
} };
}, Wo = z("(hover: none) and (pointer: coarse)").matches ? 1 : 2, ke = 0.02, Fo = 0.95, Go = 420, Ho = 900, Uo = 0.38, Vo = 0.09, Xo = 0.82, Bo = 54, Pe = 0.07, jo = 0.14, Ko = 0.3, zo = 1, Oe = 0.7, vt = { threshold: 0.34, radius: 170, waveSpeed: 0.16, fade: 0.9, source: "none" }, Ot = (t, e, n, o) => e + (t - e) * Math.exp(-n / Math.max(1e-4, o)), Zo = (t) => {
if (t >= 1) return 0;
let e = 1 - t;
return e * e;
}, Jo = () => {
let { columns: t, rows: e, count: n } = ct, o = 1 / 0, r = -1 / 0, s = 1 / 0, c = -1 / 0;
for (let l = 0; l < n; l += 1) t[l] < o && (o = t[l]), t[l] > r && (r = t[l]), e[l] < s && (s = e[l]), e[l] > c && (c = e[l]);
let a = r - o + 1, h = c - s + 1, i = new Int32Array(a * h).fill(-1);
for (let l = 0; l < n; l += 1) i[(e[l] - s) * a + (t[l] - o)] = l;
return { cell: i, w: a, h, minI: o, minJ: s };
}, Qo = (t, e) => {
let n = Jo(), o = new Float32Array(ct.count), r = new Int32Array(ct.count), s = new Uint8Array(ct.count), c = 0, a = true, h = null, i = 0, l = 0, m = false, p = { x: 0, y: 0, heat: 0 }, d = { x: 0, y: 0, on: false }, u = {}, f = () => {
u.dot = yt(at("--map-dot")), u.accent = yt(at("--accent")), u.white = yt(at("--foreground-on-dark")), u.bright = qt(u.accent, u.white, 0.55);
}, w = () => {
if (!h || !t.width) return;
let g = t.getContext("2d"), A = t.width / V.width;
g.setTransform(A, 0, 0, A, 0, 0), g.clearRect(0, 0, V.width, V.height), g.drawImage(h, 0, 0, V.width, V.height);
let { points: T, columns: $, rows: k } = ct, { accent: C, bright: L, white: v } = u, I = bt * 2 + 1, P = 1 - vt.threshold || 1, O = 0;
for (let Y = 0; Y < c; Y += 1) {
let q = r[Y];
o[q] < vt.threshold || (g.clearRect(T[q * 2] - bt - 0.5, T[q * 2 + 1] - bt - 0.5, I, I), O += 1);
}
if (O) for (let Y = 0; Y < c; Y += 1) {
let q = r[Y], U = o[q];
if (U < vt.threshold || $[q] + k[q] & 1) continue;
let nt = Math.min(1, (U - vt.threshold) / P), rt = D.pitchX * (Oe + (zo - Oe) * nt);
g.fillStyle = Ie(U > 0.8 ? v : U > 0.5 ? L : qt(C, L, U)), g.fillRect(T[q * 2] - rt / 2, T[q * 2 + 1] - rt / 2, rt, rt);
}
}, b = () => {
let g = t.clientWidth, A = t.clientHeight;
if (!g || !A) return;
f();
let T = Math.min(window.devicePixelRatio || 1, Wo), $ = Math.round(g * T), k = Math.round(A * T);
(t.width !== $ || t.height !== k) && (t.width = $, t.height = k), h = h || document.createElement("canvas"), h.width = $, h.height = k;
let C = h.getContext("2d"), L = $ / V.width;
C.setTransform(L, 0, 0, L, 0, 0), C.clearRect(0, 0, V.width, V.height);
let { points: v, count: I } = ct;
C.fillStyle = Ie(u.dot), C.beginPath();
for (let P = 0; P < I; P += 1) {
let O = v[P * 2], Y = v[P * 2 + 1];
C.moveTo(O + bt, Y), C.arc(O, Y, bt, 0, Math.PI * 2);
}
C.fill(), a = true, w();
}, S = (g, A) => {
A <= ke || (A > o[g] && (o[g] = A), s[g] || (s[g] = 1, r[c] = g, c += 1));
}, x = (g, A) => {
if (g.heat <= 0.01) return;
let { cell: T, w: $, h: k, minI: C, minJ: L } = n, { points: v } = ct, I = Math.floor((g.x - A - D.originX) / D.pitchX), P = Math.ceil((g.x + A - D.originX) / D.pitchX), O = Math.floor((g.y - A - D.originY) / D.pitchY), Y = Math.ceil((g.y + A - D.originY) / D.pitchY);
for (let q = Math.max(L, O); q <= Math.min(L + k - 1, Y); q += 1) {
let U = (q - L) * $;
for (let nt = Math.max(C, I); nt <= Math.min(C + $ - 1, P); nt += 1) {
let rt = T[U + (nt - C)];
if (rt < 0) continue;
let Fe = Math.hypot(v[rt * 2] - g.x, v[rt * 2 + 1] - g.y);
S(rt, Zo(Fe / A) * g.heat);
}
}
}, y = (g) => {
if (g.heat <= 0.01) return;
let { cell: A, w: T, h: $, minI: k, minJ: C } = n, { points: L } = ct, v = Math.round((g.x - D.originX) / D.pitchX), I = Math.round((g.y - D.originY) / D.pitchY), P = Xo * g.heat, O = Go * l;
if (O > 1 && I >= C && I < C + $) {
let Y = (I - C) * T, q = Math.ceil(O / D.pitchX);
for (let U = Math.max(k, v - q); U <= Math.min(k + T - 1, v + q); U += 1) {
let nt = A[Y + (U - k)];
nt < 0 || S(nt, (1 - Math.abs(L[nt * 2] - g.x) / O) * P);
}
}
if (O > 1 && v >= k && v < k + T) {
let Y = Math.ceil(O / D.pitchY);
for (let q = Math.max(C, I - Y); q <= Math.min(C + $ - 1, I + Y); q += 1) {
let U = A[(q - C) * T + (v - k)];
U < 0 || S(U, (1 - Math.abs(L[U * 2 + 1] - g.y) / O) * P);
}
}
x(g, Bo);
}, R = () => {
let g = performance.now(), A = i ? Math.min(0.1, (g - i) / 1e3) : 0;
i = g;
let T = d.on && m ? Fo : 0;
if (p.heat <= 1e-3 && T > 0) p.x = d.x, p.y = d.y;
else if (A > 0) {
let L = p.x, v = p.y;
p.x = Ot(L, d.x, A, Pe), p.y = Ot(v, d.y, A, Pe);
let I = Math.hypot(p.x - L, p.y - v) / A, P = Math.max(0, 1 - I / Ho);
l = Ot(l, P, A, P > l ? Uo : Vo);
}
p.heat = Ot(p.heat, T, A, T > p.heat ? jo : Ko), p.heat < 5e-3 && (p.heat = 0, l = 0);
let $ = Math.exp(-A / Math.max(0.05, vt.fade / 3)), k = 0;
for (let L = 0; L < c; L += 1) {
let v = r[L], I = o[v] * $;
I > ke ? (o[v] = I, r[k] = v, k += 1) : (o[v] = 0, s[v] = 0);
}
let C = c;
c = k, y(p), !(c === 0 && C === 0 && !a) && (a = false, w());
};
!z("(hover: none)").matches && !F && (window.addEventListener("pointermove", (g) => {
if (g.pointerType !== "mouse") return;
let A = t.getBoundingClientRect(), T = e.getBoundingClientRect();
d.x = (g.clientX - A.left) / A.width * V.width, d.y = (g.clientY - A.top) / A.height * V.height, d.on = g.clientX >= T.left && g.clientX <= T.right && g.clientY >= T.top && g.clientY <= T.bottom;
}, { passive: true }), document.addEventListener("pointerleave", () => {
d.on = false;
}), window.addEventListener("blur", () => {
d.on = false;
})), new ResizeObserver(b).observe(t), b();
let _ = { stop: null };
return { arm: () => {
m = true;
}, setRunning(g) {
g && !_.stop ? (i = 0, _.stop = j(R)) : !g && _.stop && (_.stop(), _.stop = null);
} };
}, tn = (t, e, n) => {
let o = t.getContext("2d"), r = z("(hover: none) and (pointer: coarse)").matches, s = 0, c = 1, a = null, h = () => Math.min(window.devicePixelRatio || 1, r ? 1 : 2), i = () => {
let u = h();
t.width = Math.round(1440 * u), t.height = Math.round(800 * u), a = { accent: yt(at("--accent")), white: yt(at("--foreground-on-dark")) }, a.bright = qt(a.accent, a.white, 0.55), p();
}, l = (u, f, w = 0) => {
o.beginPath(), o.moveTo(u[w][0] * f, u[w][1] * f);
for (let b = w + 1; b < u.length; b += 1) o.lineTo(u[b][0] * f, u[b][1] * f);
o.stroke();
}, m = (u, f, w, b) => {
if (u.length < 2) return;
let S = Math.max(w, jt * f);
o.lineCap = "round", o.lineJoin = "round", b && (o.save(), o.globalCompositeOperation = "lighter", o.strokeStyle = B(a.accent, 0.05), o.lineWidth = ve * f, l(u, f), o.strokeStyle = B(a.accent, 0.1), o.lineWidth = ve * 0.45 * f, l(u, f), o.restore());
let x = Math.max(2, Math.round(Po / me)), y = Math.max(0, u.length - x), R = u[u.length - 1], _ = o.createLinearGradient(u[y][0] * f, u[y][1] * f, R[0] * f, R[1] * f);
_.addColorStop(0, B(a.accent, 0)), _.addColorStop(0.45, B(a.accent, 0.9)), _.addColorStop(1, B(qt(a.accent, a.bright, c), 1)), o.strokeStyle = _, o.lineWidth = S, l(u, f, y);
let g = Math.max(0, u.length - Math.round(x * 0.42));
if (u.length - g > 1) {
let A = o.createLinearGradient(u[g][0] * f, u[g][1] * f, R[0] * f, R[1] * f);
A.addColorStop(0, B(a.bright, 0)), A.addColorStop(1, B(a.white, 0.95 * c)), o.strokeStyle = A, o.lineWidth = Math.max(w * 0.6, S * 0.38), l(u, f, g);
}
}, p = () => {
if (!a) return;
let u = No(s);
e.setLap(1 - u / De);
let f = $o(u), w = h();
if (o.setTransform(w, 0, 0, w, 0, 0), o.clearRect(0, 0, 1440, 800), f.length > 1) {
m(f, 1, 0.6, true);
let [b, S] = f[f.length - 1];
o.save(), o.globalCompositeOperation = "lighter";
let x = o.createRadialGradient(b, S, 0, b, S, jt * 2.6);
x.addColorStop(0, B(a.white, 0.85 * c)), x.addColorStop(0.35, B(a.bright, 0.4 * c)), x.addColorStop(1, B(a.accent, 0)), o.fillStyle = x, o.beginPath(), o.arc(b, S, jt * 2.6, 0, Math.PI * 2), o.fill(), o.restore();
}
o.save(), o.translate(Ce[0], Ce[1]), o.rotate(X.angle * Math.PI / 180), o.clearRect(-Me / 2, -Le / 2, Me, Le), o.restore();
for (let b of pe) {
if (u < b.d) continue;
let S = Math.min(1, (u - b.d) / qo), x = 12 + (1 - S) * 14, y = o.createRadialGradient(b.x, b.y, 0, b.x, b.y, x);
y.addColorStop(0, B(a.bright, 0.5 + 0.45 * (1 - S))), y.addColorStop(0.45, B(a.accent, 0.32)), y.addColorStop(1, B(a.accent, 0)), o.save(), o.globalCompositeOperation = "lighter", o.fillStyle = y, o.beginPath(), o.arc(b.x, b.y, x, 0, Math.PI * 2), o.fill(), o.restore(), S < 1 && (o.strokeStyle = B(a.bright, (1 - S) * 0.6), o.lineWidth = 1, o.beginPath(), o.arc(b.x, b.y, 9 + S * 20, 0, Math.PI * 2), o.stroke());
}
};
i();
let d = false;
return { resize: i, start() {
if (d) return;
d = true;
let u = new W(0, (f) => {
s = f, p();
});
u.onRest = () => {
let f = new W(1, (w) => {
c = w, p();
});
f.onRest = n, f.to(0, { duration: Oo, easing: mt.outCubic });
}, u.to(1, { duration: ko, easing: mt.inOutSine });
} };
}, en = () => {
let t = document.querySelector("[data-season]"), e = t.querySelector("[data-season-frame]"), n = t.querySelector("[data-season-stage]"), o = () => {
let b = e.clientWidth, S = e.clientHeight;
if (window.innerWidth >= 1024) {
let x = Math.max(b / 1440, S / 800);
n.style.transform = `translate(${(b - 1440 * x) / 2}px, ${(S - 800 * x) / 2}px) scale(${x})`;
} else {
let x = b / Tt.width, y = Tt.x + Tt.width / 2, R = Tt.y + Tt.height / 2;
n.style.transform = `translate(${b / 2 - y * x}px, ${S / 2 - R * x}px) scale(${x})`;
}
};
new ResizeObserver(o).observe(e), o();
let r = Yo(t.querySelector("[data-season-svg]")), s = Qo(t.querySelector("[data-season-dots]"), t), c = tn(t.querySelector("[data-season-trace]"), r, () => s.arm());
et(e, (b) => {
r.setRunning(b), s.setRunning(b);
});
let a = new IntersectionObserver((b) => {
b.some((S) => S.isIntersecting) && (a.disconnect(), c.start());
}, { threshold: 0.35 });
a.observe(e), gt(t.querySelector("[data-dissolve]"));
let h = t.querySelector("[data-heading]"), i = t.querySelector("[data-season-rule]"), l = M(i, (b, S) => {
b.style.opacity = `${S}`, b.style.transform = `scaleX(${S})`;
}, E.REVEAL), m = H(t.querySelector("[data-season-intro]"), { by: "word", stagger: 34, config: E.COPY_WORDS, gap: "0.22em", delay: 2 * 130 + 90 });
J(h, [...ut(h), { play: () => l.play(2 * 130), reverse: () => l.reverse() }, m]);
let p = t.querySelector("[data-season-plate]"), d = M(p, G("0.75rem"), E.REVEAL), u = [{ play: () => d.play(260), reverse: () => d.reverse() }];
t.querySelectorAll("[data-plate-type]").forEach((b, S) => {
u.push(H(b, { by: "letter", stagger: 22, config: E.TYPE, gap: "0", delay: 430 + S * 60 }));
}), t.querySelectorAll(".splate-row").forEach((b, S) => {
u.push(H(b.querySelector("[data-plate-fig]"), { by: "letter", stagger: 22, config: E.TYPE, gap: "0", delay: 430 + S * 110 })), u.push(H(b.querySelector("[data-plate-word]"), { by: "letter", stagger: 22, config: E.TYPE, delay: 430 + S * 110 + 70 }));
}), J(p, u);
let f = t.querySelector("[data-globe-meridian]"), w = lt(1e4, (b) => {
f.setAttribute("rx", `${Math.max(0.5, Math.abs(Math.cos(b * Math.PI * 2)) * 18)}`);
});
F || et(p, (b) => w.setRunning(b)), window.addEventListener("resize", () => c.resize());
};
});
dt();
var on = globalThis.__LK_LIBS__.Lenis;
var Zt = "https://cdn.jsdelivr.net/gh/lucasdvb/kimi@5a951b1c61135621cce772923c21893630785c04/site/assets", Be = Zt === "@relative" ? new URL("../assets", import.meta.url).href.replace(/\/$/, "") : Zt;
var wt = (t) => `${Be}/${t}`, Jt = true, Qt = (t) => new Promise((e, n) => {
let o = new Image();
o.crossOrigin = "anonymous", o.decoding = "async", o.onerror = () => n(new Error(t)), o.onload = async () => {
try {
let r = await createImageBitmap(o, { premultiplyAlpha: "none", colorSpaceConversion: "none" }), s = document.createElement("canvas");
s.width = r.width, s.height = r.height;
let c = s.getContext("2d", { willReadFrequently: true });
c.drawImage(r, 0, 0);
let a = c.getImageData(0, 0, r.width, r.height).data, h = (m) => a[Math.floor(m / 3) * 4 + m % 3], i = 0;
for (let m = 0; m < 6; m += 1) i = i * 256 + h(m);
let l = new Uint8Array(i);
for (let m = 0; m < i; m += 1) l[m] = h(m + 6);
e(l.buffer);
} catch {
n(new Error(t));
}
}, o.src = t;
}), ft = null, Dt = (t) => {
if (console.error("Asset failed to load:", t), typeof document > "u") return;
ft || (ft = document.createElement("div"), ft.setAttribute("role", "alert"), ft.className = "asset-banner", document.body.appendChild(ft));
let e = document.createElement("div");
e.textContent = `Failed to load: ${t}`, ft.appendChild(e);
}, te = () => {
for (let t of document.querySelectorAll("img")) {
let e = () => Dt(t.currentSrc || t.src);
t.complete && t.naturalWidth === 0 && t.src ? e() : t.addEventListener("error", e, { once: true });
}
};
var ee = (t) => 2 * t * Math.tan(35 * Math.PI / 360), Nt = (t, e, n) => {
if (n <= 0 || e.height <= 0) return { subjectScale: t.subjectScale, subjectY: t.subjectY };
let o = e.height / n, r = ee(t.cameraZ), s = n / 2 - (e.top + e.height / 2);
return { subjectScale: t.subjectScale * o, subjectY: 0.1 + (t.subjectY - 0.1) * o + s * r / n };
}, It = { cameraZ: 6.5, subjectScale: 1.15, subjectX: 0, subjectY: 0.42, subjectParallax: 0.02, riseDistance: 200, riseDuration: 2, headScale: 0.8, headY: 0.58, headParallax: 5e-3, headRelight: 0.32, helmetScale: 0.69, helmetX: -0.08, helmetY: 0.45, helmetZ: 0, helmetFollow: 0.01, helmetAmpX: 2.5, helmetCurveX: 0, helmetAmpY: 2.1, helmetCurveY: 0, helmetBrightness: 1, trailRadius: 0.46, trailIdleScale: 0.28, trailTaper: 1.9, trailTaperIdle: 1.6, trailTaperFast: 1.25, trailLength: 0.64, revealThreshold: 0.08, revealEdge: 5e-3, revealWarp: 1.29, revealWarpScale: 2.9, revealSpeed: 1.25, pointerLerp: 0.17, pacePeak: 0.029, paceAttack: 0.09, paceRelease: 0.205, paceThreshold: 0.06, paceRamp: 0.15, outlinePeriod: 3.1, sweepWarp: 0.86, sweepLength: 0.67, sweepRadius: 0.33, outlineStagger: 1.2, outlineOpacity: 0.09, outlineWidth: 0.15, outlineBase: 0, outlineLightness: 0.64, bgLineScale: 3.8, bgLineCount: 2.5, bgLineThickness: 1.4, bgLineOpacity: 0.85, bgWaveAmount: 0.37, bgWaveSpeed: 1.66, bgRevealLightness: 0.62, bgRevealLightnessAlt: 0.44, bgRevealOpacity: 1, introDuration: 4, burnStart: 0.14, burnSoftness: 0.02, burnGlow: 4, autoSweepAmount: 0, autoSweepPeriod: 5, autoSweepStroke: 0.45, autoSweepHold: 0 };
var kt = class {
constructor(e) {
return new globalThis.__LK_LIBS__.HeroScene(e);
}
};
dt();
var je = 430, Ke = 240, ze = 3e3, Ze = 1.15, Je = (t) => {
let e = G("1.25rem"), n = [...t.querySelectorAll("[data-hero-rise]")].map((a) => ({ ctl: M(a, e, E.REVEAL), delay: Number(a.dataset.heroRise) })), o = M(t.querySelector("[data-id-tag]"), tt, E.REVEAL), r = H(t.querySelector("[data-id-name]"), { by: "word", stagger: 110, config: E.REVEAL }), s = [...t.querySelectorAll("[data-id-row]")].map((a) => M(a, G("0.75rem"), E.REVEAL)), c = [...t.querySelectorAll("[data-hero-figure]")].map((a, h) => ({ ctl: H(a, { by: "letter", stagger: 26, config: E.FIGURE, gap: "0" }), delay: 900 + h * 90 }));
return () => {
for (let { ctl: a, delay: h } of n) a.play(h);
o.play(180), r.play(180), s.forEach((a, h) => a.play(440 + h * 130));
for (let { ctl: a, delay: h } of c) a.play(h);
};
}, Qe = (t, e) => {
let n = t.querySelector("[data-veil]"), o = n.querySelector("[data-veil-content]"), r = n.querySelector("[data-veil-fill]"), s = n.querySelector("[data-veil-bar]"), c = n.querySelector("[data-veil-meter]"), a = n.querySelector("[data-veil-name]"), h = new W(0, (m) => {
r.style.transform = `scaleY(${m})`, s.style.transform = `scaleX(${m})`;
});
h.to(0.7, E.PROGRESS_WAIT), M(a, G("0.6rem"), E.LABEL).play(260);
let i = false;
return { ready: () => {
if (i) return;
i = true, h.to(1, E.PROGRESS_READY), n.style.pointerEvents = "none", n.setAttribute("aria-label", "Loaded"), new W(1, (p) => {
o.style.opacity = `${p}`, o.style.transform = `translateY(calc(-0.75rem * ${1 - p}))`, c.style.opacity = `${p}`;
}).to(0, E.CLEAR), setTimeout(() => {
new W(1, (f) => {
n.style.opacity = `${f}`;
}).to(0, E.VEIL), e();
let d = performance.now(), u = j(() => {
(Number(getComputedStyle(n).opacity) <= 4e-3 || performance.now() - d > ze) && (u(), n.remove());
});
}, je + Ke);
} };
}, to = () => {
try {
let t = document.createElement("canvas");
return !!(t.getContext("webgl2") || t.getContext("webgl"));
} catch {
return false;
}
}, $t = (t) => {
let e = t.querySelector("[data-hero-canvas]");
e.innerHTML = "";
let n = document.createElement("div");
n.className = "hero-fallback", n.style.backgroundImage = `url('${wt("hero/ui/backdrop-lines.svg")}')`, e.appendChild(n);
let o = t.querySelector("[data-hero-box]"), r = o && o.offsetParent !== null ? o : n, s = document.createElement("img");
s.src = wt("hero/scene/person-diffuse.webp"), s.alt = "Kimi Antonelli", r.appendChild(s);
}, eo = (t, e) => {
if (!to()) return $t(t), e.ready(), { beginRise() {
} };
let n = t.querySelector("[data-hero-canvas]"), o = n.querySelector("canvas"), r = t.querySelector("[data-hero-box]"), s;
try {
s = new kt(o);
} catch (S) {
return console.error(S), $t(t), e.ready(), { beginRise() {
} };
}
s.onReady = () => e.ready(), s.onError = () => {
$t(t), e.ready();
};
let c = () => {
let S = t.getBoundingClientRect(), x = r.offsetParent !== null ? (() => {
let y = r.getBoundingClientRect();
return Nt(It, { top: y.top - S.top, height: y.height }, n.clientHeight);
})() : null;
s.setParams({ ...It, ...x, ...z("(max-width: 1023px)").matches ? { bgRevealOpacity: 0 } : null, ...z("(hover: none)").matches ? { autoSweepAmount: 0.76 } : null, ...z("(max-width: 639px)").matches ? { sweepRadius: 0.95, sweepWarp: 0.18, autoSweepAmount: 0.55 } : null, ...s.tier.reveal ? null : { autoSweepAmount: 0 } });
}, a = (S) => s.setPointer(S.clientX / innerWidth * 2 - 1, S.clientY / innerHeight * 2 - 1), h = false, i = () => {
let S = s.tier.pointerEnabled;
S && !h && window.addEventListener("pointermove", a, { passive: true }), !S && h && window.removeEventListener("pointermove", a), h = S;
};
i();
let l = z("(hover: none) and (pointer: coarse)"), m = 0, p = 0, d = l.matches, u = 0, f = () => {
u = 0;
let S = n.clientWidth, x = n.clientHeight, y = l.matches, R = S !== m, _ = y !== d;
!R && !_ && y || !R && !_ && x === p || ((R || _) && (s.retune(), i()), m = S, p = x, d = y, s.resize(S, x), c());
}, w = () => {
u || (u = requestAnimationFrame(f));
};
new ResizeObserver(w).observe(n), l.addEventListener?.("change", w), s.resize(n.clientWidth || innerWidth, n.clientHeight || innerHeight), m = n.clientWidth, p = n.clientHeight, c();
let b = true;
return et(t, (S) => {
b = S;
}), j((S) => {
!b || document.hidden || window.scrollY > window.innerHeight * Ze || s.update(S);
}, () => s.tier.frameInterval), { beginRise: () => s.beginRise() };
}, oo = (t, e) => {
let n = t.querySelector("[data-burger]"), o = t.querySelector(".mast-logo img"), r = null, s = null, c = () => {
if (!r) return;
let i = r;
r = null, document.documentElement.classList.remove("menu-open"), e?.start(), n.setAttribute("aria-expanded", "false");
let l = new W(1, (m) => {
i.style.opacity = `${m}`;
});
l.onRest = () => i.remove(), l.to(0, E.SHEET), document.removeEventListener("keydown", a), s?.focus();
}, a = (i) => {
i.key === "Escape" && c();
}, h = () => {
if (r) return;
s = document.activeElement, r = document.createElement("div"), r.className = "sheet", r.setAttribute("role", "dialog"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-label", "Menu");
let i = [...t.querySelectorAll(".mast-nav a")].map((m) => [m.textContent, m.getAttribute("href")]);
i.push(["Garage", "/garage"]), r.innerHTML = `
<div class="sheet-top"><a href="/" data-sheet-logo aria-label="Grido1 Racing Systems"><img src="${o.src}" alt=""></a>
<button class="sheet-close" type="button" data-sheet-close><span class="sr-only">Close menu</span><span class="sheet-x"><i></i><i></i></span></button></div>
<nav class="sheet-nav" aria-label="Menu"><ul>${i.map(([m, p]) => `<li data-sheet-item><a class="sheet-link hov" href="${p}">${m}</a></li>`).join("")}</ul></nav>`, document.body.appendChild(r), new W(0, (m) => {
r && (r.style.opacity = `${m}`);
}).to(1, E.SHEET), [...r.querySelectorAll("[data-sheet-item]")].forEach((m, p) => M(m, G("0.75rem"), E.ITEM).play(120 + p * 55)), r.querySelector("[data-sheet-logo]").addEventListener("click", c), r.querySelector("[data-sheet-close]").addEventListener("click", c), e?.stop(), document.documentElement.classList.add("menu-open"), n.setAttribute("aria-expanded", "true"), r.querySelector("[data-sheet-close]").focus(), document.addEventListener("keydown", a);
};
n.addEventListener("click", h), z("(min-width: 1280px)").addEventListener?.("change", (i) => i.matches && c());
}, oe = (t) => {
let e = document.querySelector("[data-hero]"), n = Je(e), o = null, r = Qe(e, () => {
n(), o?.beginRise();
});
o = eo(e, r), oo(e, t);
};
dt();
Pt();
var lo = 50, uo = 9, ho = 20, Ft = 98, po = 4, mo = 0.4, fo = 2200, ie = "http://www.w3.org/2000/svg", yo = (t, e, n, o, r = "top bottom", s = "bottom top") => {
st(t, r, s, (c) => {
e.style.top = `${(n + (o - n) * c).toFixed(4)}cqw`;
});
}, go = (t, e) => {
let n = t.querySelector("[data-rail]"), o = document.createElementNS(ie, "svg");
o.setAttribute("preserveAspectRatio", "none"), n.appendChild(o);
let r = (p, d) => {
let u = document.createElementNS(ie, p);
for (let [f, w] of Object.entries(d)) u.setAttribute(f, w);
return o.appendChild(u), u;
}, s = r("line", { x1: 8, x2: 8, y1: 0, y2: Ft, style: "stroke:var(--timeline-rail)", "stroke-width": 1, "vector-effect": "non-scaling-stroke" }), c = r("line", { x1: 8, x2: 8, y1: Ft + po, y2: 0, style: "stroke:var(--timeline-rail)", "stroke-width": 1, "stroke-dasharray": "6 6" }), a = r("rect", { x: 7.5, y: 0, width: 1, height: 0, style: "fill:var(--foreground-on-dark)" }), h = r("rect", { x: -4.5, y: -4.5, width: 9, height: 9, style: "fill:var(--foreground-on-dark)" }), i = 0, l = () => {
let p = n.getBoundingClientRect(), d = p.width / 16 || 1, u = p.height / d;
o.setAttribute("viewBox", `0 0 16 ${u}`);
let f = e[e.length - 1];
i = Math.max(0, (f.offsetTop + f.offsetHeight / 2 - n.offsetTop) / d - lo), c.setAttribute("y2", `${i}`), s.setAttribute("y2", `${Math.min(Ft, i)}`);
let w = window.innerWidth < 1024 ? ho : uo;
h.setAttribute("x", `${-w / 2}`), h.setAttribute("y", `${-w / 2}`), h.setAttribute("width", `${w}`), h.setAttribute("height", `${w}`);
}, m = (p) => {
let d = p * i;
a.setAttribute("height", `${Math.max(0, d)}`), h.setAttribute("transform", `translate(8 ${d}) rotate(${i ? d / i * 1800 : 0})`);
};
new ResizeObserver(l).observe(n), l(), st(n, "top center", "bottom bottom", (p, d) => m(d), { smooth: true });
}, le = () => {
let t = document.querySelector("[data-timeline]"), e = t.querySelector("[data-tl-wrap]"), n = [...t.querySelectorAll("[data-tl-row]")];
gt(t.querySelector("[data-dissolve]"));
let o = t.querySelector("[data-heading]");
J(o, ut(o)), go(t, n);
let r = z("(hover: hover)").matches && !F;
return n.forEach((s) => {
let c = s.dataset.frame === "centre";
for (let f of s.querySelectorAll("[data-para]")) {
let w = Number(f.dataset.para);
yo(s, f, w / 1440 * 100, -w / 1440 * 100);
}
let a = s.querySelector("[data-plate-slot]");
st(s, "top bottom", "top center", (f) => {
a.style.top = `${-10 + 10 * f}%`;
});
let h = s.querySelector("[data-tl-year]"), i = s.querySelector(".tl-year"), l = H(h, { by: "letter", stagger: 26, config: E.YEAR, gap: "0" }), m = new W(1, (f) => {
i.style.opacity = `${f}`;
}), p = s.querySelector("[data-tl-copy]"), d = p ? M(p, G("0.75rem"), E.COPY) : null, u = 0;
if (Mt(s, () => {
d?.play(220);
}, "0% 0% -25% 0%"), J(s, [{ play() {
l.play(), m.to(1, E.YEAR_SETTLE), c && (clearTimeout(u), u = setTimeout(() => m.to(mo, E.YEAR_SETTLE), fo));
}, reverse() {
clearTimeout(u), l.reverse();
} }], "0% 0% -25% 0%"), r) {
let f = s.querySelector(".plate");
f.addEventListener("mouseenter", () => {
s.classList.add("hot"), e.classList.add("dim");
}), f.addEventListener("mouseleave", () => {
s.classList.remove("hot"), e.classList.remove("dim");
});
}
}), { px: Lt };
};
dt();
Pt();
var At = 560, xt = 90, bo = 3200, So = 3.4, Eo = 5200, wo = 5, Ao = 320, de = 460, xo = 90, Ro = 260, _o = 80, To = 48, vo = 60, K = (t, e) => ({ play: () => t.play(e), reverse: () => t.reverse() }), ue = () => {
let t = document.querySelector("[data-paddock]");
Wt(t.querySelector("[data-contour]"), F), gt(t.querySelector("[data-dissolve]"));
let e = t.querySelector("[data-para-paddock]");
st(t, "top bottom", "bottom top", (y) => {
e.style.top = `${(-(To / 1440) * 100 * y).toFixed(4)}cqw`;
});
let n = t.querySelector("[data-heading]"), o = H(t.querySelector("[data-paddock-report]"), { by: "word", stagger: 30, config: E.COPY_WORDS, gap: "0.22em", delay: 2 * 130 + 90 }), r = M(t.querySelector("[data-paddock-cta]"), G("0.75rem"), E.REVEAL);
J(n, ut(n)), J(t.querySelector("[data-paddock-intro]"), [o, K(r, 2 * 130 + 260)]);
let s = t.querySelector("[data-paddock-panels]"), c = [], a = s.querySelector(".p-bracket-meet");
c.push(K(M(a, tt, E.REVEAL), Ao)), c.push(K(M(s.querySelector(".p-meet"), G("0.75rem"), E.REVEAL), 410)), c.push(K(M(s.querySelector(".p-bracket-stats"), tt, E.REVEAL), de));
let h = [...s.querySelectorAll("[data-p-rule]")];
[...s.querySelectorAll("[data-p-stat]")].forEach((y, R) => {
let _ = de + R * xo;
R > 0 && c.push(K(M(h[R - 1], (A, T) => {
A.style.transform = `scaleX(${T})`;
}, E.ROW), _)), c.push(K(M(y, G("0.75rem"), E.ROW), _ + 40));
let g = H(y.querySelector("[data-p-fig]"), { by: "letter", stagger: 24, config: E.FIGURE, gap: "0", delay: _ + 120 });
c.push(g);
}), J(s.querySelector(".p-meet"), c);
let i = t.querySelector("[data-cal]"), l = [...i.querySelectorAll("[data-cal-link]")], m = [...i.querySelectorAll("[data-cal-card]")], p = [...i.querySelectorAll("[data-cal-mark]")], d = i.querySelector("[data-cal-bracket]"), u = [];
l.forEach((y, R) => u.push(K(M(y, (_, g) => {
_.style.transform = `scaleX(${g})`;
}, E.ROW), At + R * xt))), m.forEach((y, R) => {
u.push(K(M(y, G("0.5rem"), E.ROW), At + R * xt)), u.push(K(M(y.querySelector("[data-cal-name]"), G("0.3em"), E.NAME), At + R * xt + 110));
}), p.forEach((y, R) => u.push(K(M(y, tt, E.ROW), At + R * xt + 60))), u.push(K(M(d, tt, E.ROW), At + 5 * xt)), Mt(i, () => u.forEach((y) => y.play()), "0% 0% -20% 0%");
let f = 11.45 / 1440 * 100, w = lt(Eo, (y) => {
for (let R of l) R.style.backgroundPositionX = `calc(${(y * f * Number(R.dataset.dir)).toFixed(4)}cqw * var(--cal-spread, 1))`;
}), b = i.querySelector("[data-cal-pulse]"), S = lt(bo, (y) => {
b.setAttribute("r", `${5.5 + y * 5.5 * So}`), b.setAttribute("opacity", `${0.5 * (1 - y) * (1 - y)}`);
}, mt.outQuad);
F || et(i, (y) => {
w.setRunning(y), S.setRunning(y);
});
let x = i.querySelector("[data-cal-live-card]");
x.addEventListener("mouseenter", () => i.style.setProperty("--bracket-spread", Lt(wo))), x.addEventListener("mouseleave", () => i.style.removeProperty("--bracket-spread"));
}, he = () => {
let t = document.querySelector("[data-foot]");
Wt(t.querySelector("[data-contour]"), F);
let e = t.querySelector("[data-para-foot]");
st(t, "top bottom", "bottom bottom", (r) => {
e.style.top = `${(vo / 1440 * 100 * (1 - r)).toFixed(4)}cqw`;
});
let n = t.querySelector("[data-heading]"), o = [K(M(t.querySelector("[data-foot-logo]"), tt, E.REVEAL), 120), ...ut(n)];
t.querySelectorAll("[data-foot-link]").forEach((r, s) => {
o.push(H(r, { by: "letter", stagger: 22, config: E.ROW, gap: "0.2em", delay: Ro + s * _o }));
}), t.querySelectorAll("[data-foot-rise]").forEach((r) => {
o.push(K(M(r, G("0.75rem"), E.REVEAL), Number(r.dataset.footRise)));
}), J(t, o, "0% 0% -20% 0%");
};
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
var We = () => {
document.documentElement.style.fontSize = window.innerWidth > 1920 ? `${16 * window.innerWidth / 1920}px` : "";
};
We();
window.addEventListener("resize", We);
var Kt = null;
F || (Kt = new on({ smoothWheel: true }), j((t) => Kt.raf(t), () => 0));
var nn = () => {
let n = window.matchMedia("(max-width: 639px)"), o = [...document.querySelectorAll("[data-layer]")], r = document.querySelector("[data-layer-last]"), s = o.map((i, l) => ({ inner: i.querySelector("[data-layer-inner]"), shade: i.querySelector("[data-layer-shade]"), next: o[l + 1] || r })), c = () => {
let i = window.innerHeight || 1, l = n.matches ? 0 : 1 - 0.9;
for (let { inner: m, shade: p, next: d } of s) {
let u = Math.min(1, Math.max(0, 1 - d.getBoundingClientRect().top / i));
m.style.transform = u > 0 && l > 0 ? `scale(${1 - l * u})` : "", m.style.willChange = u > 0 && l > 0 ? "transform" : "", p.style.opacity = `${0.55 * u}`, m.style.visibility = u >= 1 ? "hidden" : "visible";
}
}, a = 0, h = () => {
a || (a = requestAnimationFrame(() => {
a = 0, c();
}));
};
window.addEventListener("scroll", h, { passive: true }), window.addEventListener("resize", h), c();
}, rn = async () => {
if (Jt) {
let e = wt("season/data.json.png");
try {
globalThis.__LK_DATA__ = JSON.parse(new TextDecoder().decode(await Qt(e)));
} catch {
Dt(e);
return;
}
}
let { setupSeason: t } = await Promise.resolve().then(() => ($e(), Ne));
t();
}, Ye = () => {
te(), nn(), oe(Kt), rn(), le(), ue(), he();
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ye, { once: true }) : Ye();
}
