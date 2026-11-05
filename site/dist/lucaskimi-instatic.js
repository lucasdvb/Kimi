var pr = Object.defineProperty;
var ge = (t, r) => () => (t && (r = t(t = 0)), r);
var mr = (t, r) => {
for (var o in r) pr(t, o, { get: r[o], enumerable: true });
};
var U, Ee, be, dt, z, S, ue, Ae, Ge, fr, F, he, ye, C, B, te, Y, $e, Q, re, vr, gr, se, qe, Z, de = ge(() => {
U = window.matchMedia("(prefers-reduced-motion: reduce)").matches, Ee = /* @__PURE__ */ new Set(), be = 0, dt = (t) => {
be = requestAnimationFrame(dt);
for (let r of [...Ee]) Ee.has(r) && t - r.last > r.getFramerate() && (r.last = t, r.callback(t));
}, z = (t, r = () => 0) => {
let o = { callback: t, getFramerate: r, last: -1 / 0 };
return Ee.add(o), be || (be = requestAnimationFrame(dt)), () => {
Ee.delete(o), !Ee.size && be && (cancelAnimationFrame(be), be = 0);
};
}, S = { REVEAL: { tension: 90, friction: 26 }, ROW: { tension: 170, friction: 24 }, ITEM: { tension: 170, friction: 24 }, SHEET: { tension: 190, friction: 26 }, FIGURE: { tension: 200, friction: 24 }, TYPE: { tension: 210, friction: 24 }, YEAR: { tension: 190, friction: 24 }, COPY: { tension: 110, friction: 26 }, COPY_WORDS: { tension: 150, friction: 24 }, NAME: { tension: 190, friction: 24 }, VEIL: { tension: 70, friction: 24 }, CLEAR: { tension: 140, friction: 26 }, LABEL: { tension: 110, friction: 26 }, PROGRESS_WAIT: { tension: 10, friction: 30 }, PROGRESS_READY: { tension: 170, friction: 26 }, YEAR_SETTLE: { tension: 32, friction: 26 }, TRIGGER: { tension: 140, friction: 30 } }, ue = /* @__PURE__ */ new Set(), Ae = null, Ge = 0, fr = (t) => {
let r = Math.min(64, Ge ? t - Ge : 16);
Ge = t;
for (let o of [...ue]) o.advance(t, r);
!ue.size && Ae && (Ae(), Ae = null, Ge = 0);
}, F = class {
constructor(r, o, e = 1e-3) {
this.value = r, this.target = r, this.velocity = 0, this.onChange = o, this.precision = e, this.config = S.REVEAL, this.startAt = 0, this.tween = null, o?.(r);
}
to(r, o = this.config, e = 0) {
this.config = o, !(r === this.target && !this.tween && !ue.has(this)) && (this.target = r, this.startAt = performance.now() + e, this.tween = null, o.duration !== void 0 && (this.tween = { from: this.value, start: null, duration: o.duration, easing: o.easing || ((a) => a) }), ue.add(this), Ae || (Ae = z(fr, () => 0)));
}
set(r) {
this.value = r, this.target = r, this.velocity = 0, this.tween = null, ue.delete(this), this.onChange?.(r);
}
advance(r, o) {
let e = performance.now();
if (e < this.startAt) return;
if (this.tween) {
let c = this.tween;
c.start === null && (c.start = e);
let s = c.duration <= 0 ? 1 : Math.min(1, (e - c.start) / c.duration);
this.value = c.from + (this.target - c.from) * c.easing(s), this.onChange?.(this.value), s >= 1 && (this.tween = null, ue.delete(this), this.onRest?.());
return;
}
let { tension: a, friction: n } = this.config, i = Math.ceil(o), l = this.value, h = this.velocity;
for (let c = 0; c < i; c += 1) {
let s = -a * 1e-6 * (l - this.target), f = -n * 1e-3 * h;
h += s + f, l += h;
}
if (this.value = l, this.velocity = h, Math.abs(h) < this.precision && Math.abs(this.target - l) < this.precision) {
this.value = this.target, this.velocity = 0, ue.delete(this), this.onChange?.(this.value), this.onRest?.();
return;
}
this.onChange?.(this.value);
}
}, he = (t, r, o = (e) => e) => {
let e = false, a = 0, n = 0, i = null;
return { setRunning(l) {
l !== e && (e = l, l ? (a += performance.now() - n, i = z(() => {
let h = (performance.now() - a) % t / t;
r(o(h));
})) : (n = performance.now(), i?.(), i = null));
} };
}, ye = { outQuad: (t) => 1 - (1 - t) * (1 - t), inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2, outCubic: (t) => 1 - Math.pow(1 - t, 3) }, C = (t, r, o = S.REVEAL) => {
let e = new F(0, (a) => r(t, a));
return { spring: e, play(a = 0) {
e.to(1, o, U ? 0 : a);
}, reverse() {
e.to(0, o, 0);
}, set(a) {
e.set(a);
} };
}, B = (t = "0.75rem") => (r, o) => {
r.style.opacity = `${o}`, r.style.transform = o >= 1 ? "" : `translateY(calc(${t} * ${1 - o}))`;
}, te = (t, r) => {
t.style.opacity = `${r}`;
}, Y = (t, { by: r = "word", stagger: o = 110, config: e = S.REVEAL, delay: a = 0, gap: n } = {}) => {
let i = t.textContent.replace(/\s+/g, " ").trim();
t.textContent = "", t.classList.add("txt"), n !== void 0 && (t.style.columnGap = n);
let l = document.createElement("span");
l.className = "sr-only", l.textContent = i, t.appendChild(l);
let h = [], c = i.split(" ");
for (let p of c) {
let d = document.createElement("span");
if (d.setAttribute("aria-hidden", "true"), d.className = "txt-w", r === "word") h.push(d), d.textContent = p;
else for (let u of p) {
let m = document.createElement("span");
m.className = "txt-l", m.textContent = u, d.appendChild(m), h.push(m);
}
t.appendChild(d);
}
let s = r === "word" ? 0.35 : 0.3, f = h.map((p) => new F(0, (d) => {
p.style.opacity = `${d}`, p.style.transform = d >= 1 ? "" : `translateY(${(s * (1 - d)).toFixed(4)}em)`;
}));
return { play(p = 0) {
f.forEach((d, u) => d.to(1, e, U ? 0 : a + p + u * o));
}, reverse() {
f.forEach((p) => p.to(0, e, 0));
}, set(p) {
f.forEach((d) => d.set(p));
} };
}, $e = (t, r, o = "0px") => {
let e = new IntersectionObserver((a) => {
for (let n of a) n.isIntersecting && (e.disconnect(), r());
}, { rootMargin: o });
return e.observe(t), e;
}, Q = (t, r, o = "0px") => {
let e = false, a = new IntersectionObserver((n) => {
for (let i of n) {
let l = i.boundingClientRect.top <= 0, h = i.isIntersecting || l;
if (h !== e) {
e = h;
for (let c of r) h ? c.play() : c.reverse();
}
}
}, { rootMargin: o });
return a.observe(t), a;
}, re = (t, r, o = "0px") => {
let e = 0, a = null, n = new IntersectionObserver((i) => {
for (let l of i) l.isIntersecting ? (a?.(), a = null, r(true)) : (e = 0, a?.(), a = z(() => {
e += 1, e >= 10 && (a?.(), a = null, r(false));
}));
}, { rootMargin: o });
return n.observe(t), n;
}, vr = (t, r) => ({ top_top: t.top, center_top: t.top + t.height / 2, bottom_top: t.bottom, top_bottom: t.top - r, center_bottom: t.top + t.height / 2 - r, bottom_bottom: t.bottom - r, top_center: t.top - r / 2, center_center: t.top + t.height / 2 - r / 2, bottom_center: t.bottom - r / 2 }), gr = (t, r, o) => {
let e = t.getBoundingClientRect(), a = vr(e, window.innerHeight), n = a[r.replace(" ", "_")], i = a[o.replace(" ", "_")], l = Math.abs(n - i) || 1;
return Math.min(Math.max(0, 1 - (n + l) / l), 1);
}, se = (t, r, o, e, { smooth: a = false, config: n = S.TRIGGER } = {}) => {
let i = -1, l = a ? new F(0, (s) => e(i, s), 5e-4) : null, h = () => {
let s = gr(t, r, o);
s !== i && (i = s, l ? l.to(s, n) : e(s, s));
}, c = null;
return re(t, (s) => {
s && !c ? (h(), c = z(h, () => 10)) : !s && c && (h(), c(), c = null);
}), h(), l && l.set(Math.max(0, i)), { read: h };
}, qe = (t) => `${(t / 1440 * 100).toFixed(4)}cqw`, Z = (t) => window.matchMedia(t);
});
var ie, Se, ve, tt, io, lo, Lt, co, xe, _t, Ct, kt, uo, ho, Pt, po, rt, Ye = ge(() => {
de();
ie = (t) => {
let r = document.createElement("span");
r.style.cssText = `position:absolute;visibility:hidden;color:var(${t})`, document.body.appendChild(r);
let o = getComputedStyle(r).color;
return r.remove(), o;
}, Se = (t) => {
let r = t.match(/[\d.]+/g) || ["0", "0", "0"];
return [Number(r[0]), Number(r[1]), Number(r[2]), r[3] !== void 0 ? Number(r[3]) : 1];
}, ve = (t) => {
let o = [...t.querySelectorAll("[data-head-line]")].map((a, n) => Y(a, { by: "word", stagger: 110, config: S.REVEAL, delay: n * 130 })), e = t.querySelector("[data-head-dot]");
if (e) {
let a = C(e, te, S.REVEAL);
o.push({ play: () => a.play(240), reverse: () => a.reverse() });
}
return o;
}, tt = 0.16, io = 2, lo = 0.06, Lt = (t, r) => {
let o = Math.imul(t, 374761393) + Math.imul(r, 668265263);
return o = Math.imul(o ^ o >>> 13, 1274126177), ((o ^ o >>> 16) >>> 0) / 4294967295;
}, co = (t) => Math.min(1, Math.max(0, t)), xe = (t) => {
let r = t.dataset.dissolve, o = t.getContext("2d"), e = 0, a = 0, n = 0, i = "", l = "", h = () => {
if (!a || !n) return;
let s = Math.min(window.devicePixelRatio || 1, 2);
o.setTransform(s, 0, 0, s, 0, 0), o.clearRect(0, 0, a, n);
let f = parseFloat(getComputedStyle(t).getPropertyValue("--flag-cell")), p = f > 0 ? f : 24, d = Math.ceil(a / p), u = Math.ceil(n / p), m = e * io;
for (let w = 0; w < u; w += 1) {
let g = w / Math.max(1, u - 1) + m;
if (g > 1) break;
let b = g <= tt, x = co(1 - (g - tt) / (1 - tt));
if (!b && x <= 0) break;
for (let v = 0; v < d; v += 1) !b && ((v + w) % 2 !== 0 || Lt(v, w) > x) || (o.fillStyle = !b && Lt(v + 101, w + 57) < lo ? l : i, o.fillRect(v * p, w * p, p, p));
}
}, c = () => {
i = ie(r === "light" ? "--background" : "--surface-black"), l = ie("--accent"), a = t.clientWidth, n = t.clientHeight;
let s = Math.min(window.devicePixelRatio || 1, 2);
t.width = Math.round(a * s), t.height = Math.round(n * s), h();
};
new ResizeObserver(c).observe(t), c(), se(t, "top bottom", "top top", (s, f) => {
e = f, h();
}, { smooth: true, config: S.TRIGGER });
}, _t = 3.8, Ct = 2.5, kt = 0.37, uo = 1.66, ho = 0.85, Pt = 96, po = (t, r, o) => {
let e = Math.sin(t * 1 + o * 0.6) * 0.5;
return e += Math.sin(r * 0.85 - o * 0.45) * 0.45, e += Math.sin((t + r) * 0.65 + o * 0.35) * 0.35, e += Math.sin((t - r) * 0.95 - o * 0.55) * 0.25, e * 0.5 + 0.5;
}, rt = (t, r) => {
let o = t.getContext("2d"), e = performance.now(), a = "", n = 0, i = 0, l = null, h = () => {
if (!n || !i) return;
let f = (performance.now() - e) / 1e3 * uo, p = Math.min(window.devicePixelRatio || 1, 2);
o.setTransform(p, 0, 0, p, 0, 0), o.clearRect(0, 0, n, i);
let d = n >= i ? Pt : Math.max(8, Math.round(Pt * n / i)), u = Math.max(8, Math.round(d * i / n)), m = n / d, w = i / u, g = n / i, b = (d + 1) * (u + 1);
(!l || l.length !== b) && (l = new Float32Array(b));
for (let v = 0; v <= u; v += 1) for (let E = 0; E <= d; E += 1) {
let T = (E / d * 2 - 1) * g * _t, y = (v / u * 2 - 1) * _t, R = T + Math.sin(y * 0.8 + f * 0.7) * kt, M = y + Math.cos(T * 0.7 - f * 0.6) * kt;
l[v * (d + 1) + E] = po(R, M, f) * Ct;
}
o.strokeStyle = a, o.lineWidth = 1, o.globalAlpha = ho, o.beginPath();
let x = (v, E) => {
o.moveTo(v[0], v[1]), o.lineTo(E[0], E[1]);
};
for (let v = 0.5; v < Ct; v += 1) for (let E = 0; E < u; E += 1) for (let T = 0; T < d; T += 1) {
let y = l[E * (d + 1) + T], R = l[E * (d + 1) + T + 1], M = l[(E + 1) * (d + 1) + T + 1], q = l[(E + 1) * (d + 1) + T], I = (y > v ? 8 : 0) | (R > v ? 4 : 0) | (M > v ? 2 : 0) | (q > v ? 1 : 0);
if (I === 0 || I === 15) continue;
let _ = T * m, k = E * w, L = [_ + m * ((v - y) / (R - y)), k], P = [_ + m, k + w * ((v - R) / (M - R))], O = [_ + m * ((v - q) / (M - q)), k + w], D = [_, k + w * ((v - y) / (q - y))];
switch (I) {
case 1:
case 14:
x(D, O);
break;
case 2:
case 13:
x(O, P);
break;
case 3:
case 12:
x(D, P);
break;
case 4:
case 11:
x(L, P);
break;
case 6:
case 9:
x(L, O);
break;
case 7:
case 8:
x(D, L);
break;
case 5:
x(D, L), x(O, P);
break;
case 10:
x(D, O), x(L, P);
break;
}
}
o.stroke(), o.globalAlpha = 1;
}, c = () => {
a = ie(t.dataset.contour), n = t.clientWidth, i = t.clientHeight;
let f = Math.min(window.devicePixelRatio || 1, 2);
t.width = Math.round(n * f), t.height = Math.round(i * f), h();
};
if (new ResizeObserver(c).observe(t), c(), r) return;
let s = null;
re(t, (f) => {
f && !s ? s = z(h, () => 24) : !f && s && (s(), s = null);
});
};
});
var J, $t, qt, Nt = ge(() => {
J = globalThis.__LK_DATA__.circuit, $t = [{ x: 328.9, y: 510.6, d: 278.4 }, { x: 758.4, y: 193.2, d: 811.7 }, { x: 1046.6, y: 338.9, d: 1323.7 }, { x: 973.7, y: 503.3, d: 1867.7 }], qt = 3;
});
var G, Re, Po, le, Ft = ge(() => {
G = { pitchX: 7.8, pitchY: 7.7, originX: 5, originY: 16.64 }, Re = 1.75, Po = globalThis.__LK_DATA__.dots, le = (() => {
let t = [], r = [], o = [], e = 0;
for (let a of Po.split(";")) {
let [n, i] = a.split(":");
e += Number(n);
let l = 0, h = i.split(",");
for (let c = 0; c < h.length; c += 1) l = c === 0 ? Number(h[c]) : l + Number(h[c]), t.push(G.originX + l * G.pitchX, G.originY + e * G.pitchY), r.push(l), o.push(e);
}
return { points: Float32Array.from(t), columns: Int16Array.from(r), rows: Int16Array.from(o), count: r.length };
})();
});
var V, at, Ut, Bt, Ie, nt, Io, Oo, Yt, Ht, st, it, lt, oe, Vt, jt, ct, Xt, zt, j, Kt, Zt = ge(() => {
V = { width: 2560, height: 1440, band: 11.67 }, at = globalThis.__LK_DATA__.ribbon, Ut = globalThis.__LK_DATA__.centreline, Bt = 30, Ie = 4805.57, nt = { top: 2, width: 1438.43, height: 796 }, Io = V.width / nt.width, Oo = (V.height - V.band * 2) / nt.height, Yt = (t, r) => [t / Io, (r - V.band) / Oo + nt.top], Ht = [645.31, 1276.96, 1908.61], st = 697.98, it = "12.15 8.35", lt = 2.13, oe = { x: 1278.48, y: 699.5, r: 10.63 }, Vt = [{ r: 69.85, width: 3.04, ghost: false }, { r: 356.06, width: 2.13, ghost: true }, { r: 442.61, width: 2.13, ghost: true }], jt = [[65.29, 76.96], [2471.93, 76.96], [65.29, 931.81], [2471.93, 931.81], [65.29, 1343.3], [1155.49, 1343.3], [1384.77, 1343.3]], ct = 16.7, Xt = "13.69,0 -6.85,11.86 -6.85,-11.86", zt = [{ x: 1349.96, y: 351.98, angle: 73.5 }, { x: 1862.23, y: 611.24, angle: 30.5 }, { x: 1732.95, y: 903.82, angle: 89.5 }, { x: 585.43, y: 916.65, angle: 17.5 }], j = { x: 822.96, y: 921.57, along: 36, across: 40, angle: 144 }, Kt = globalThis.__LK_DATA__.flag;
});
var lr = {};
mr(lr, { setupSeason: () => na });
var Do, $, Wo, ut, Jt, Go, $o, qo, No, Qt, sr, er, tr, ee, ir, Oe, Fo, De, Ve, X, rr, Uo, Bo, Yo, or, Ho, Vo, jo, Xo, zo, Ko, Zo, ar, Jo, Qo, ea, nr, We, He, ta, ra, oa, aa, na, cr = ge(() => {
Nt();
Ft();
Zt();
de();
Ye();
Do = "http://www.w3.org/2000/svg", $ = (t, r = {}, o) => {
let e = document.createElementNS(Do, t);
for (let [a, n] of Object.entries(r)) e.setAttribute(a, n);
return o?.appendChild(e), e;
}, Wo = 6e3, ut = 5.9, Jt = 15, Go = 210, $o = 800, qo = 90, No = 9, Qt = Yt(j.x, j.y), sr = 1438.43 / 2560, er = j.along * sr, tr = j.across * sr, ee = J.reduce((t, r, o) => {
if (o === 0) return [0];
let e = J[o - 1];
return t.push(t[o - 1] + Math.hypot(r[0] - e[0], r[1] - e[1])), t;
}, []), ir = ee[ee.length - 1], Oe = (() => {
let t = J.length, r = new Array(t).fill(0);
for (let i = 1; i < t - 1; i += 1) {
let [l, h] = J[i - 1], [c, s] = J[i], [f, p] = J[i + 1], d = c - l, u = s - h, m = f - c, w = p - s, g = (Math.hypot(d, u) || 1) * (Math.hypot(m, w) || 1);
r[i] = Math.acos(Math.min(1, Math.max(-1, (d * m + u * w) / g)));
}
let o = 6, e = r.map((i, l) => {
let h = 0, c = 0;
for (let s = Math.max(0, l - o); s <= Math.min(t - 1, l + o); s += 1) h += r[s], c += 1;
return h / c;
}), a = [0];
for (let i = 1; i < t; i += 1) {
let l = ee[i] - ee[i - 1], h = 1 / (1 + No * e[i]);
a.push(a[i - 1] + l / h);
}
let n = a[t - 1] || 1;
return a.map((i) => i / n);
})(), Fo = (t) => {
if (t <= 0) return 0;
if (t >= 1) return ir;
let r = 0, o = Oe.length - 1;
for (; r < o - 1; ) {
let n = r + o >> 1;
Oe[n] <= t ? r = n : o = n;
}
let e = Oe[o] - Oe[r] || 1, a = (t - Oe[r]) / e;
return ee[r] + (ee[o] - ee[r]) * a;
}, De = (() => {
let t = 1 / 0, r = 1 / 0, o = -1 / 0, e = -1 / 0;
for (let [n, i] of J) t = Math.min(t, n), o = Math.max(o, n), r = Math.min(r, i), e = Math.max(e, i);
let a = 46;
return { x: t - a, y: r - a, width: o - t + a * 2, height: e - r + a * 2 };
})(), Ve = (t, r, o) => [Math.round(t[0] + (r[0] - t[0]) * o), Math.round(t[1] + (r[1] - t[1]) * o), Math.round(t[2] + (r[2] - t[2]) * o)], X = ([t, r, o], e) => `rgb(${t} ${r} ${o} / ${e})`, rr = ([t, r, o]) => `rgb(${t} ${r} ${o})`, Uo = (t) => {
let r = [];
for (let o = 0; o < J.length; o += 1) {
if (ee[o] <= t) {
r.push(J[o]);
continue;
}
let e = J[o - 1], a = J[o], n = (t - ee[o - 1]) / (ee[o] - ee[o - 1]);
r.push([e[0] + (a[0] - e[0]) * n, e[1] + (a[1] - e[1]) * n]);
break;
}
return r;
}, Bo = (t) => {
let r = $("defs", {}, t), o = $("mask", { id: "season-cut", maskUnits: "userSpaceOnUse", x: -5e3, y: -5e3, width: 12560, height: 11440 }, r);
$("rect", { x: -5e3, y: -5e3, width: 12560, height: 11440, fill: "white" }, o), $("rect", { x: j.x - j.along / 2, y: j.y - j.across / 2, width: j.along, height: j.across, fill: "black", transform: `rotate(${j.angle} ${j.x} ${j.y})` }, o);
let e = $("mask", { id: "season-lap", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 2560, height: 1440 }, r), a = $("path", { d: Ut, fill: "none", stroke: "white", "stroke-width": Bt, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${Ie + 60} ${Ie + 60}`, "stroke-dashoffset": `${60 + Ie}` }, e), n = $("g", { id: "grid" }, t), i = [];
for (let d of Ht) i.push($("line", { x1: d, y1: -4e3, x2: d, y2: 5440, style: "stroke:var(--map-grid)", "stroke-width": lt, "stroke-dasharray": it }, n));
i.push($("line", { x1: -4e3, y1: st, x2: 6560, y2: st, style: "stroke:var(--map-grid)", "stroke-width": lt, "stroke-dasharray": it }, n));
for (let d of Vt) $("circle", { cx: oe.x, cy: oe.y, r: d.r, fill: "none", style: `stroke:var(${d.ghost ? "--map-grid-ghost" : "--map-grid"})`, "stroke-width": d.width }, n);
let l = $("circle", { cx: oe.x, cy: oe.y, r: oe.r, fill: "none", style: "stroke:var(--accent)", "stroke-width": 2.13, opacity: 0 }, n);
for (let [d, u] of jt) $("rect", { x: d, y: u, width: ct, height: ct, style: "fill:var(--map-mark)" }, n);
$("circle", { cx: oe.x, cy: oe.y, r: oe.r, style: "fill:var(--map-mark)" }, n);
let h = $("g", { mask: "url(#season-cut)" }, t);
$("path", { d: at, style: "fill:var(--foreground-on-dark)" }, h);
let c = $("g", { mask: "url(#season-lap)" }, h);
$("path", { d: at, style: "fill:var(--accent)" }, c);
let s = $("g", { id: "markers" }, t);
for (let d of zt) $("polygon", { points: Xt, style: "fill:var(--accent)", transform: `translate(${d.x} ${d.y}) rotate(${d.angle})` }, s);
$("path", { d: Kt, style: "fill:var(--map-mark)" }, s);
let f = he(7e3, (d) => {
let u = `${d * 20.5}`;
for (let m of i) m.setAttribute("stroke-dashoffset", u);
}), p = he(4200, (d) => {
l.setAttribute("r", `${oe.r + d * 86}`), l.setAttribute("opacity", `${0.4 * (1 - d) * (1 - d)}`);
}, ye.outQuad);
return { setLap: (d) => a.setAttribute("stroke-dashoffset", `${60 + d * Ie}`), setRunning: (d) => {
U || (f.setRunning(d), p.setRunning(d));
} };
}, Yo = Z("(hover: none) and (pointer: coarse)").matches ? 1 : 2, or = 0.02, Ho = 0.95, Vo = 420, jo = 900, Xo = 0.38, zo = 0.09, Ko = 0.82, Zo = 54, ar = 0.07, Jo = 0.14, Qo = 0.3, ea = 1, nr = 0.7, We = { threshold: 0.34, radius: 170, waveSpeed: 0.16, fade: 0.9, source: "none" }, He = (t, r, o, e) => r + (t - r) * Math.exp(-o / Math.max(1e-4, e)), ta = (t) => {
if (t >= 1) return 0;
let r = 1 - t;
return r * r;
}, ra = () => {
let { columns: t, rows: r, count: o } = le, e = 1 / 0, a = -1 / 0, n = 1 / 0, i = -1 / 0;
for (let s = 0; s < o; s += 1) t[s] < e && (e = t[s]), t[s] > a && (a = t[s]), r[s] < n && (n = r[s]), r[s] > i && (i = r[s]);
let l = a - e + 1, h = i - n + 1, c = new Int32Array(l * h).fill(-1);
for (let s = 0; s < o; s += 1) c[(r[s] - n) * l + (t[s] - e)] = s;
return { cell: c, w: l, h, minI: e, minJ: n };
}, oa = (t, r) => {
let o = ra(), e = new Float32Array(le.count), a = new Int32Array(le.count), n = new Uint8Array(le.count), i = 0, l = true, h = null, c = 0, s = 0, f = false, p = { x: 0, y: 0, heat: 0 }, d = { x: 0, y: 0, on: false }, u = {}, m = () => {
u.dot = Se(ie("--map-dot")), u.accent = Se(ie("--accent")), u.white = Se(ie("--foreground-on-dark")), u.bright = Ve(u.accent, u.white, 0.55);
}, w = () => {
if (!h || !t.width) return;
let y = t.getContext("2d"), R = t.width / V.width;
y.setTransform(R, 0, 0, R, 0, 0), y.clearRect(0, 0, V.width, V.height), y.drawImage(h, 0, 0, V.width, V.height);
let { points: M, columns: q, rows: I } = le, { accent: _, bright: k, white: L } = u, P = Re * 2 + 1, O = 1 - We.threshold || 1, D = 0;
for (let N = 0; N < i; N += 1) {
let W = a[N];
e[W] < We.threshold || (y.clearRect(M[W * 2] - Re - 0.5, M[W * 2 + 1] - Re - 0.5, P, P), D += 1);
}
if (D) for (let N = 0; N < i; N += 1) {
let W = a[N], H = e[W];
if (H < We.threshold || q[W] + I[W] & 1) continue;
let ae = Math.min(1, (H - We.threshold) / O), ne = G.pitchX * (nr + (ea - nr) * ae);
y.fillStyle = rr(H > 0.8 ? L : H > 0.5 ? k : Ve(_, k, H)), y.fillRect(M[W * 2] - ne / 2, M[W * 2 + 1] - ne / 2, ne, ne);
}
}, g = () => {
let y = t.clientWidth, R = t.clientHeight;
if (!y || !R) return;
m();
let M = Math.min(window.devicePixelRatio || 1, Yo), q = Math.round(y * M), I = Math.round(R * M);
(t.width !== q || t.height !== I) && (t.width = q, t.height = I), h = h || document.createElement("canvas"), h.width = q, h.height = I;
let _ = h.getContext("2d"), k = q / V.width;
_.setTransform(k, 0, 0, k, 0, 0), _.clearRect(0, 0, V.width, V.height);
let { points: L, count: P } = le;
_.fillStyle = rr(u.dot), _.beginPath();
for (let O = 0; O < P; O += 1) {
let D = L[O * 2], N = L[O * 2 + 1];
_.moveTo(D + Re, N), _.arc(D, N, Re, 0, Math.PI * 2);
}
_.fill(), l = true, w();
}, b = (y, R) => {
R <= or || (R > e[y] && (e[y] = R), n[y] || (n[y] = 1, a[i] = y, i += 1));
}, x = (y, R) => {
if (y.heat <= 0.01) return;
let { cell: M, w: q, h: I, minI: _, minJ: k } = o, { points: L } = le, P = Math.floor((y.x - R - G.originX) / G.pitchX), O = Math.ceil((y.x + R - G.originX) / G.pitchX), D = Math.floor((y.y - R - G.originY) / G.pitchY), N = Math.ceil((y.y + R - G.originY) / G.pitchY);
for (let W = Math.max(k, D); W <= Math.min(k + I - 1, N); W += 1) {
let H = (W - k) * q;
for (let ae = Math.max(_, P); ae <= Math.min(_ + q - 1, O); ae += 1) {
let ne = M[H + (ae - _)];
if (ne < 0) continue;
let dr = Math.hypot(L[ne * 2] - y.x, L[ne * 2 + 1] - y.y);
b(ne, ta(dr / R) * y.heat);
}
}
}, v = (y) => {
if (y.heat <= 0.01) return;
let { cell: R, w: M, h: q, minI: I, minJ: _ } = o, { points: k } = le, L = Math.round((y.x - G.originX) / G.pitchX), P = Math.round((y.y - G.originY) / G.pitchY), O = Ko * y.heat, D = Vo * s;
if (D > 1 && P >= _ && P < _ + q) {
let N = (P - _) * M, W = Math.ceil(D / G.pitchX);
for (let H = Math.max(I, L - W); H <= Math.min(I + M - 1, L + W); H += 1) {
let ae = R[N + (H - I)];
ae < 0 || b(ae, (1 - Math.abs(k[ae * 2] - y.x) / D) * O);
}
}
if (D > 1 && L >= I && L < I + M) {
let N = Math.ceil(D / G.pitchY);
for (let W = Math.max(_, P - N); W <= Math.min(_ + q - 1, P + N); W += 1) {
let H = R[(W - _) * M + (L - I)];
H < 0 || b(H, (1 - Math.abs(k[H * 2 + 1] - y.y) / D) * O);
}
}
x(y, Zo);
}, E = () => {
let y = performance.now(), R = c ? Math.min(0.1, (y - c) / 1e3) : 0;
c = y;
let M = d.on && f ? Ho : 0;
if (p.heat <= 1e-3 && M > 0) p.x = d.x, p.y = d.y;
else if (R > 0) {
let k = p.x, L = p.y;
p.x = He(k, d.x, R, ar), p.y = He(L, d.y, R, ar);
let P = Math.hypot(p.x - k, p.y - L) / R, O = Math.max(0, 1 - P / jo);
s = He(s, O, R, O > s ? Xo : zo);
}
p.heat = He(p.heat, M, R, M > p.heat ? Jo : Qo), p.heat < 5e-3 && (p.heat = 0, s = 0);
let q = Math.exp(-R / Math.max(0.05, We.fade / 3)), I = 0;
for (let k = 0; k < i; k += 1) {
let L = a[k], P = e[L] * q;
P > or ? (e[L] = P, a[I] = L, I += 1) : (e[L] = 0, n[L] = 0);
}
let _ = i;
i = I, v(p), !(i === 0 && _ === 0 && !l) && (l = false, w());
};
!Z("(hover: none)").matches && !U && (window.addEventListener("pointermove", (y) => {
if (y.pointerType !== "mouse") return;
let R = t.getBoundingClientRect(), M = r.getBoundingClientRect();
d.x = (y.clientX - R.left) / R.width * V.width, d.y = (y.clientY - R.top) / R.height * V.height, d.on = y.clientX >= M.left && y.clientX <= M.right && y.clientY >= M.top && y.clientY <= M.bottom;
}, { passive: true }), document.addEventListener("pointerleave", () => {
d.on = false;
}), window.addEventListener("blur", () => {
d.on = false;
})), new ResizeObserver(g).observe(t), g();
let T = { stop: null };
return { arm: () => {
f = true;
}, setRunning(y) {
y && !T.stop ? (c = 0, T.stop = z(E)) : !y && T.stop && (T.stop(), T.stop = null);
} };
}, aa = (t, r, o) => {
let e = t.getContext("2d"), a = Z("(hover: none) and (pointer: coarse)").matches, n = 0, i = 1, l = null, h = () => Math.min(window.devicePixelRatio || 1, a ? 1 : 2), c = () => {
let u = h();
t.width = Math.round(1440 * u), t.height = Math.round(800 * u), l = { accent: Se(ie("--accent")), white: Se(ie("--foreground-on-dark")) }, l.bright = Ve(l.accent, l.white, 0.55), p();
}, s = (u, m, w = 0) => {
e.beginPath(), e.moveTo(u[w][0] * m, u[w][1] * m);
for (let g = w + 1; g < u.length; g += 1) e.lineTo(u[g][0] * m, u[g][1] * m);
e.stroke();
}, f = (u, m, w, g) => {
if (u.length < 2) return;
let b = Math.max(w, ut * m);
e.lineCap = "round", e.lineJoin = "round", g && (e.save(), e.globalCompositeOperation = "lighter", e.strokeStyle = X(l.accent, 0.05), e.lineWidth = Jt * m, s(u, m), e.strokeStyle = X(l.accent, 0.1), e.lineWidth = Jt * 0.45 * m, s(u, m), e.restore());
let x = Math.max(2, Math.round(Go / qt)), v = Math.max(0, u.length - x), E = u[u.length - 1], T = e.createLinearGradient(u[v][0] * m, u[v][1] * m, E[0] * m, E[1] * m);
T.addColorStop(0, X(l.accent, 0)), T.addColorStop(0.45, X(l.accent, 0.9)), T.addColorStop(1, X(Ve(l.accent, l.bright, i), 1)), e.strokeStyle = T, e.lineWidth = b, s(u, m, v);
let y = Math.max(0, u.length - Math.round(x * 0.42));
if (u.length - y > 1) {
let R = e.createLinearGradient(u[y][0] * m, u[y][1] * m, E[0] * m, E[1] * m);
R.addColorStop(0, X(l.bright, 0)), R.addColorStop(1, X(l.white, 0.95 * i)), e.strokeStyle = R, e.lineWidth = Math.max(w * 0.6, b * 0.38), s(u, m, y);
}
}, p = () => {
if (!l) return;
let u = Fo(n);
r.setLap(1 - u / ir);
let m = Uo(u), w = h();
if (e.setTransform(w, 0, 0, w, 0, 0), e.clearRect(0, 0, 1440, 800), m.length > 1) {
f(m, 1, 0.6, true);
let [g, b] = m[m.length - 1];
e.save(), e.globalCompositeOperation = "lighter";
let x = e.createRadialGradient(g, b, 0, g, b, ut * 2.6);
x.addColorStop(0, X(l.white, 0.85 * i)), x.addColorStop(0.35, X(l.bright, 0.4 * i)), x.addColorStop(1, X(l.accent, 0)), e.fillStyle = x, e.beginPath(), e.arc(g, b, ut * 2.6, 0, Math.PI * 2), e.fill(), e.restore();
}
e.save(), e.translate(Qt[0], Qt[1]), e.rotate(j.angle * Math.PI / 180), e.clearRect(-er / 2, -tr / 2, er, tr), e.restore();
for (let g of $t) {
if (u < g.d) continue;
let b = Math.min(1, (u - g.d) / qo), x = 12 + (1 - b) * 14, v = e.createRadialGradient(g.x, g.y, 0, g.x, g.y, x);
v.addColorStop(0, X(l.bright, 0.5 + 0.45 * (1 - b))), v.addColorStop(0.45, X(l.accent, 0.32)), v.addColorStop(1, X(l.accent, 0)), e.save(), e.globalCompositeOperation = "lighter", e.fillStyle = v, e.beginPath(), e.arc(g.x, g.y, x, 0, Math.PI * 2), e.fill(), e.restore(), b < 1 && (e.strokeStyle = X(l.bright, (1 - b) * 0.6), e.lineWidth = 1, e.beginPath(), e.arc(g.x, g.y, 9 + b * 20, 0, Math.PI * 2), e.stroke());
}
};
c();
let d = false;
return { resize: c, start() {
if (d) return;
d = true;
let u = new F(0, (m) => {
n = m, p();
});
u.onRest = () => {
let m = new F(1, (w) => {
i = w, p();
});
m.onRest = o, m.to(0, { duration: $o, easing: ye.outCubic });
}, u.to(1, { duration: Wo, easing: ye.inOutSine });
} };
}, na = () => {
let t = document.querySelector("[data-season]"), r = t.querySelector("[data-season-frame]"), o = t.querySelector("[data-season-stage]"), e = () => {
let g = r.clientWidth, b = r.clientHeight;
if (window.innerWidth >= 1024) {
let x = Math.max(g / 1440, b / 800);
o.style.transform = `translate(${(g - 1440 * x) / 2}px, ${(b - 800 * x) / 2}px) scale(${x})`;
} else {
let x = g / De.width, v = De.x + De.width / 2, E = De.y + De.height / 2;
o.style.transform = `translate(${g / 2 - v * x}px, ${b / 2 - E * x}px) scale(${x})`;
}
};
new ResizeObserver(e).observe(r), e();
let a = Bo(t.querySelector("[data-season-svg]")), n = oa(t.querySelector("[data-season-dots]"), t), i = aa(t.querySelector("[data-season-trace]"), a, () => n.arm());
re(r, (g) => {
a.setRunning(g), n.setRunning(g);
});
let l = new IntersectionObserver((g) => {
g.some((b) => b.isIntersecting) && (l.disconnect(), i.start());
}, { threshold: 0.35 });
l.observe(r), xe(t.querySelector("[data-dissolve]"));
let h = t.querySelector("[data-heading]"), c = t.querySelector("[data-season-rule]"), s = C(c, (g, b) => {
g.style.opacity = `${b}`, g.style.transform = `scaleX(${b})`;
}, S.REVEAL), f = Y(t.querySelector("[data-season-intro]"), { by: "word", stagger: 34, config: S.COPY_WORDS, gap: "0.22em", delay: 2 * 130 + 90 });
Q(h, [...ve(h), { play: () => s.play(2 * 130), reverse: () => s.reverse() }, f]);
let p = t.querySelector("[data-season-plate]"), d = C(p, B("0.75rem"), S.REVEAL), u = [{ play: () => d.play(260), reverse: () => d.reverse() }];
t.querySelectorAll("[data-plate-type]").forEach((g, b) => {
u.push(Y(g, { by: "letter", stagger: 22, config: S.TYPE, gap: "0", delay: 430 + b * 60 }));
}), t.querySelectorAll(".splate-row").forEach((g, b) => {
u.push(Y(g.querySelector("[data-plate-fig]"), { by: "letter", stagger: 22, config: S.TYPE, gap: "0", delay: 430 + b * 110 })), u.push(Y(g.querySelector("[data-plate-word]"), { by: "letter", stagger: 22, config: S.TYPE, delay: 430 + b * 110 + 70 }));
}), Q(p, u);
let m = t.querySelector("[data-globe-meridian]"), w = he(1e4, (g) => {
m.setAttribute("rx", `${Math.max(0.5, Math.abs(Math.cos(g * Math.PI * 2)) * 18)}`);
});
U || re(p, (g) => w.setRunning(g)), window.addEventListener("resize", () => i.resize());
};
});
de();
import sa from "lenis";
var pt = "https://cdn.jsdelivr.net/gh/lucasdvb/kimi@4779a8b0d89d4df1e0f7b775abbf2885bb56b098/site/assets", Ne = pt === "@relative" ? new URL("../assets", import.meta.url).href.replace(/\/$/, "") : pt, mt = "https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/libs/draco/gltf/", Te = (t) => `${Ne}/${t}`, Me = true, Le = (t) => new Promise((r, o) => {
let e = new Image();
e.crossOrigin = "anonymous", e.decoding = "async", e.onerror = () => o(new Error(t)), e.onload = async () => {
try {
let a = await createImageBitmap(e, { premultiplyAlpha: "none", colorSpaceConversion: "none" }), n = document.createElement("canvas");
n.width = a.width, n.height = a.height;
let i = n.getContext("2d", { willReadFrequently: true });
i.drawImage(a, 0, 0);
let l = i.getImageData(0, 0, a.width, a.height).data, h = (f) => l[Math.floor(f / 3) * 4 + f % 3], c = 0;
for (let f = 0; f < 6; f += 1) c = c * 256 + h(f);
let s = new Uint8Array(c);
for (let f = 0; f < c; f += 1) s[f] = h(f + 6);
r(s.buffer);
} catch {
o(new Error(t));
}
}, e.src = t;
}), we = null, _e = (t) => {
console.error("Asset failed to load:", t), we || (we = document.createElement("div"), we.setAttribute("role", "alert"), we.className = "asset-banner", document.body.appendChild(we));
let r = document.createElement("div");
r.textContent = `Failed to load: ${t}`, we.appendChild(r);
}, ft = () => {
for (let t of document.querySelectorAll("img")) {
let r = () => _e(t.currentSrc || t.src);
t.complete && t.naturalWidth === 0 && t.src ? r() : t.addEventListener("error", r, { once: true });
}
};
import { ACESFilmicToneMapping as wr, Box3 as Sr, Color as pe, FrontSide as xr, Group as Xe, LinearMipmapLinearFilter as Rr, Matrix4 as Er, Mesh as ze, PerspectiveCamera as Ar, PlaneGeometry as vt, PMREMGenerator as Tr, RepeatWrapping as gt, Scene as Mr, ShaderMaterial as Ke, SRGBColorSpace as Lr, Texture as _r, TextureLoader as bt, DataTexture as Cr, LinearFilter as yt, LinearSRGBColorSpace as kr, RGBAFormat as Pr, Vector2 as me, Vector3 as Je, WebGLRenderer as Ir } from "three";
import { DRACOLoader as Or } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader as Dr } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader as wt } from "three/addons/loaders/RGBELoader.js";
import { mergeGeometries as Wr } from "three/addons/utils/BufferGeometryUtils.js";
var br = 14.666666666666668, yr = () => {
let t = navigator;
return !!t.connection?.saveData || (t.deviceMemory ?? 8) <= 2;
}, je = () => {
let t = window.matchMedia("(hover: none) and (pointer: coarse)").matches, r = window.innerWidth, o = r < 768 || t && r < 1024 ? "mobile" : t || r < 1280 ? "tablet" : "desktop", e = o === "mobile", a = window.matchMedia("(prefers-reduced-motion: reduce)").matches, n = yr();
return { name: o, mobile: e, coarsePointer: t, reducedMotion: a, maxDpr: e ? 1 : o === "tablet" ? 1.25 : 1.5, frameInterval: o === "desktop" ? 0 : br, pointerEnabled: !t && !a, antialias: o === "desktop", trailSamples: e ? 28 : o === "tablet" ? 44 : 72, outline: !e, reveal: !e, freeze: a || e && n };
};
var Ce = Ne + "/hero/scene", Fe = (t) => {
let r = document.createElement("span");
r.style.cssText = `position:absolute;visibility:hidden;color:var(${t})`, document.body.appendChild(r);
let o = getComputedStyle(r).color;
return r.remove(), o;
}, Ue = 5.4, Gr = Math.PI / 180, St = (t, r, o) => {
let e = r * Gr;
return o < 1e-3 ? e * t : e * Math.tanh(o * t) / Math.tanh(o);
}, $r = new Je(0, -0.56, 0.35), Ze = 0.14, fe = { x: 0.3, y: 0.1 }, Et = 35, Qe = 0.1, qr = (t) => 2 * t * Math.tan(Et * Math.PI / 360), At = (t, r, o) => {
if (o <= 0 || r.height <= 0) return { subjectScale: t.subjectScale, subjectY: t.subjectY };
let e = r.height / o, a = qr(t.cameraZ), n = o / 2 - (r.top + r.height / 2);
return { subjectScale: t.subjectScale * e, subjectY: Qe + (t.subjectY - Qe) * e + n * a / o };
}, Nr = 8, xt = -3, Fr = 1.778, Ur = 1440, Br = 0.9, Yr = 0.25, Hr = 1280, ce = [{ x: -0.85, y: -0.62 }, { x: 0.78, y: -0.2 }, { x: -0.7, y: 0.2 }, { x: 0.82, y: 0.6 }], Rt = (t, r, o, e, a, n, i, l, h) => `
float ${t}(vec2 ndc) {
float gate = smoothstep(uGateStart, uGateStart + uGateWidth, ${a});
if (gate <= 0.0) return 0.0;

vec2 bounded = vec2(ndc.x * uAspect, ndc.y);
if (any(lessThan(bounded, ${o})) || any(greaterThan(bounded, ${e}))) {
return 0.0;
}

vec2 point = bounded;
if (${n} > 0.001) {
vec2 noiseUv = ndc * 0.5 + 0.5;
float nx = texture2D(uNoiseTex, noiseUv * uWarpScale + vec2(uTime * 0.07, uTime * 0.05)).r;
float ny = texture2D(uNoiseTex, noiseUv * uWarpScale * 1.4 - vec2(uTime * 0.06, uTime * 0.09)).r;
point += (vec2(nx, ny) - 0.5) * ${n} * 0.22;
}

float radius = ${l} * mix(uIdleScale, 1.0, ${a});
float taper = uTaper * mix(uTaperIdle, uTaperFast, ${a});

float span = max(${i} * float(${h} - 1), 1.0);
float ceiling = uThreshold + uEdge;
float trail = 0.0;
for (int i = 0; i < ${h} - 1; i++) {
if (float(i) >= span) break;
float weight = pow(1.0 - float(i) / span, taper);

if (weight <= trail) break;

vec2 a = vec2(${r}[i].x * uAspect, ${r}[i].y);
vec2 b = vec2(${r}[i + 1].x * uAspect, ${r}[i + 1].y);
float r = radius * weight;
trail = max(trail, weight * smoothstep(r, r * 0.35, revealSegment(point, a, b)));

if (trail >= ceiling) break;
}

return smoothstep(uThreshold - uEdge, uThreshold + uEdge, trail) * gate;
}
`, Tt = (t) => `
uniform vec2 uTrail[${t}];
uniform vec2 uTrailMin;
uniform vec2 uTrailMax;
uniform float uPace;
uniform vec2 uSweep[${t}];
uniform vec2 uSweepMin;
uniform vec2 uSweepMax;
uniform float uSweepPace;
uniform float uSweepWarp;
uniform float uSweepLength;
uniform float uSweepRadius;
uniform float uAspect;
uniform float uRadius;
uniform float uIdleScale;
uniform float uTaper;
uniform float uTaperIdle;
uniform float uTaperFast;
uniform float uLength;
uniform float uGateStart;
uniform float uGateWidth;
uniform float uWarpScale;
uniform float uTime;
uniform float uEdge;
uniform float uThreshold;
uniform float uWarp;
uniform float uRevealMix;
uniform sampler2D uNoiseTex;

float revealSegment(vec2 p, vec2 a, vec2 b) {
vec2 pa = p - a;
vec2 ba = b - a;
float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
return length(pa - ba * h);
}

${Rt("revealCursorTrail", "uTrail", "uTrailMin", "uTrailMax", "uPace", "uWarp", "uLength", "uRadius", t)}
${Rt("revealSweepTrail", "uSweep", "uSweepMin", "uSweepMax", "uSweepPace", "uSweepWarp", "uSweepLength", "uSweepRadius", t)}

float revealTrail(vec2 ndc) {
float cursor = revealCursorTrail(ndc);
if (cursor >= 1.0) return 1.0;
return max(cursor, revealSweepTrail(ndc));
}
`, A = { cameraZ: 6.5, subjectScale: 1.15, subjectX: 0, subjectY: 0.42, subjectParallax: 0.02, riseDistance: 200, riseDuration: 2, headScale: 0.8, headY: 0.58, headParallax: 5e-3, headRelight: 0.32, helmetScale: 0.69, helmetX: -0.08, helmetY: 0.45, helmetZ: 0, helmetFollow: 0.01, helmetAmpX: 2.5, helmetCurveX: 0, helmetAmpY: 2.1, helmetCurveY: 0, helmetBrightness: 1, trailRadius: 0.46, trailIdleScale: 0.28, trailTaper: 1.9, trailTaperIdle: 1.6, trailTaperFast: 1.25, trailLength: 0.64, revealThreshold: 0.08, revealEdge: 5e-3, revealWarp: 1.29, revealWarpScale: 2.9, revealSpeed: 1.25, pointerLerp: 0.17, pacePeak: 0.029, paceAttack: 0.09, paceRelease: 0.205, paceThreshold: 0.06, paceRamp: 0.15, outlinePeriod: 3.1, sweepWarp: 0.86, sweepLength: 0.67, sweepRadius: 0.33, outlineStagger: 1.2, outlineOpacity: 0.09, outlineWidth: 0.15, outlineBase: 0, outlineLightness: 0.64, bgLineScale: 3.8, bgLineCount: 2.5, bgLineThickness: 1.4, bgLineOpacity: 0.85, bgWaveAmount: 0.37, bgWaveSpeed: 1.66, bgRevealLightness: 0.62, bgRevealLightnessAlt: 0.44, bgRevealOpacity: 1, introDuration: 4, burnStart: 0.14, burnSoftness: 0.02, burnGlow: 4, autoSweepAmount: 0, autoSweepPeriod: 5, autoSweepStroke: 0.45, autoSweepHold: 0 }, Vr = `
varying float vHeight;
uniform float uMinY;
uniform float uRangeY;
void main() {
vHeight = (position.y - uMinY) / max(uRangeY, 0.0001);
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`, jr = `
varying float vHeight;
uniform float uTime;
uniform float uPeriod;
uniform float uStagger;
uniform float uOpacity;
uniform float uBase;
uniform float uWidth;
uniform float uLightness;
uniform float uRevealMix;
uniform vec3 uColor;

void main() {
float width = max(uWidth, 0.0001);
float period = max(uPeriod, 0.0001);
float stagger = max(uStagger, 0.0001);

float start = 1.0 + width * 3.0;
float travel = 1.0 + width * 6.0;

float wave = 0.0;
for (int i = 0; i < ${Nr}; i++) {
float age = mod(uTime, stagger) + float(i) * stagger;
if (age > period) break;
float centre = start - (age / period) * travel;
float d = (vHeight - centre) / width;
wave = max(wave, exp(-d * d));
}

vec3 stroke = mix(uColor, vec3(1.0), uLightness);
gl_FragColor = vec4(stroke, (uBase + wave * uOpacity) * uRevealMix);
}
`, Xr = `
varying vec4 vBackdropClip;
void main() {
vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
vBackdropClip = clip;
gl_Position = clip;
}
`, zr = (t) => `
varying vec4 vBackdropClip;
uniform vec3 uBackground;
uniform vec3 uLineColor;
uniform vec3 uRevealColor;
uniform vec3 uRevealColorAlt;
uniform float uLineScale;
uniform float uLineCount;
uniform float uLineThickness;
uniform float uLineOpacity;
uniform float uWaveAmount;
uniform float uWaveSpeed;
uniform float uRevealOpacity;
${Tt(t)}

float backdropField(vec2 p, float t) {
float f = sin(p.x * 1.00 + t * 0.60) * 0.50;
f += sin(p.y * 0.85 - t * 0.45) * 0.45;
f += sin((p.x + p.y) * 0.65 + t * 0.35) * 0.35;
f += sin((p.x - p.y) * 0.95 - t * 0.55) * 0.25;
return f * 0.5 + 0.5;
}

void main() {
vec2 ndc = vBackdropClip.xy / vBackdropClip.w;
vec2 p = vec2(ndc.x * uAspect, ndc.y) * uLineScale;

float t = uTime * uWaveSpeed;
vec2 q = p;
q.x += sin(p.y * 0.8 + t * 0.7) * uWaveAmount;
q.y += cos(p.x * 0.7 - t * 0.6) * uWaveAmount;

float scaled = backdropField(q, t) * uLineCount;

float w = max(fwidth(scaled) * uLineThickness, 1e-5);
float line = 1.0 - smoothstep(0.0, w, abs(fract(scaled) - 0.5));

vec3 color = mix(uBackground, uLineColor, line * uLineOpacity * uRevealMix);

float parity = mod(floor(scaled + 0.5), 2.0);
vec3 revealShade = mix(uRevealColor, uRevealColorAlt, parity);

if (uRevealOpacity > 0.001) {
color = mix(
color,
revealShade,
revealTrail(ndc) * uRevealMix * uRevealOpacity
);
}

gl_FragColor = vec4(color, 1.0);
#include <colorspace_fragment>
}
`, Kr = `
uniform float uExtend;
varying vec2 vUv;
void main() {
vUv = vec2(uv.x, 1.0 - (1.0 - uv.y) * (1.0 + uExtend));
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`, Zr = `
uniform sampler2D uDiffuse;
uniform sampler2D uDepth;
uniform sampler2D uAlpha;
uniform sampler2D uNormal;
uniform vec2 uParallax;
uniform float uReveal;
uniform float uDepthScale;
uniform float uRelight;
varying vec2 vUv;
void main() {
float depth = texture2D(uDepth, vUv).r;
vec2 offset = uParallax * (depth - 0.5) * uDepthScale;
vec2 uv = vUv + offset;
vec4 color = texture2D(uDiffuse, uv);
float alpha = texture2D(uAlpha, uv).r;

vec3 normal = normalize(texture2D(uNormal, uv).rgb * 2.0 - 1.0);
vec3 lightDir = normalize(vec3(uParallax * 1.6, 1.0));
float lambert = max(dot(normal, lightDir), 0.0) - 0.72;
vec3 lit = color.rgb * (1.0 + lambert * uRelight);

gl_FragColor = vec4(clamp(lit, 0.0, 1.0), alpha * uReveal);

#include <colorspace_fragment>
}
`, Be = class {
renderer;
scene = new Mr();
camera = new Ar(Et, 1, 0.1, 50);
headMaterial = null;
headMesh = null;
shellMaterial = null;
helmetTextures = [];
revealUniforms = null;
outlineMaterial = null;
outlineMesh = null;
helmetRoot = null;
samples;
trail;
helmetGroup = new Xe();
helmetPivot = new Xe();
subjectGroup = new Xe();
backdropMesh = null;
backdropMaterial = null;
params = { ...A };
pointer = { x: 0, y: 0 };
smoothed = { x: 0, y: 0 };
lastSmoothed = { x: 0, y: 0 };
pointerSeen = false;
tilt = 0;
yaw = 0;
pace = 0;
readyAt = null;
intro = 0;
viewportHeight = 1;
viewportWidth = 1;
riseStarted = false;
riseAt = null;
sweepPointer = { x: ce[0].x, y: ce[0].y };
sweepSmoothed = { ...this.sweepPointer };
sweepLast = { ...this.sweepPointer };
sweepPace = 0;
sweepCycle = 0;
sweepTrail;
aspect = 1;
reveal = 0;
settled = false;
disposed = false;
startTime = null;
_tier;
get tier() {
return this._tier;
}
ready = false;
onReady = null;
onError = null;
constructor(r) {
this._tier = je(), this.samples = this._tier.trailSamples, this.trail = Array.from({ length: this.samples }, () => new me(fe.x, -fe.y)), this.sweepTrail = Array.from({ length: this.samples }, () => new me(ce[0].x, -ce[0].y)), this.renderer = new Ir({ canvas: r, alpha: false, antialias: this._tier.antialias, stencil: false, powerPreference: this._tier.mobile ? "default" : "high-performance" }), this.renderer.setClearColor(new pe(getComputedStyle(document.body).backgroundColor)), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this._tier.maxDpr)), this.renderer.toneMapping = wr, this._tier.pointerEnabled || this.parkPointer(), this.camera.position.set(0, Qe, 6.5), this.helmetGroup.add(this.helmetPivot), this.subjectGroup.add(this.helmetGroup), this.scene.add(this.subjectGroup), this.load();
}
retune() {
let r = je(), o = this._tier, e = { ...r, antialias: o.antialias, trailSamples: o.trailSamples };
return this._tier = e, this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, e.maxDpr)), e.outline && !this.outlineMesh && this.helmetRoot && this.buildOutline(this.helmetRoot), this.outlineMesh && (this.outlineMesh.visible = e.outline), e.pointerEnabled ? o.pointerEnabled || (this.pointerSeen = false) : this.parkPointer(), e.freeze || (this.settled = false), e;
}
parkPointer() {
this.pointer = { ...fe }, this.smoothed = { ...fe }, this.lastSmoothed = { ...fe }, this.tilt = this.pitchFor(fe.y), this.yaw = this.yawFor(fe.x), this.pointerSeen = false;
}
beginRise() {
this.riseStarted = true;
}
setPointer(r, o) {
this.pointer.x = r, this.pointer.y = o, this.pointerSeen || (this.pointerSeen = true, this.smoothed.x = r, this.smoothed.y = o, this.lastSmoothed.x = r, this.lastSmoothed.y = o, this.tilt = this.pitchFor(o), this.yaw = this.yawFor(r));
}
pitchFor(r) {
return St(r, this.params.helmetAmpX, this.params.helmetCurveX);
}
yawFor(r) {
return St(r, this.params.helmetAmpY, this.params.helmetCurveY);
}
setParams(r) {
Object.assign(this.params, r), this.settled = false;
}
resize(r, o) {
this.renderer.setSize(r, o, false), this.viewportHeight = Math.max(o, 1), this.viewportWidth = Math.max(r, 1), this.aspect = r / o, this.camera.aspect = this.aspect, this.camera.updateProjectionMatrix(), this.revealUniforms && (this.revealUniforms.uAspect.value = this.aspect);
}
update(r) {
if (this.disposed || this.settled || !this.ready) return;
this.startTime === null && (this.startTime = r);
let o = (r - this.startTime) / 1e3, e = this.params;
this._tier.freeze && this.reveal > 0.995 && this.intro >= 1 && (this.settled = true);
let a = e.autoSweepAmount > 0 && !this._tier.freeze && this.intro >= 1;
if (a) {
let s = o % Math.max(e.autoSweepPeriod, 1e-3);
s < this.sweepCycle && this.resetSweep(), this.sweepCycle = s;
let f = ce.length - 1, p = Math.max(e.autoSweepStroke, 0.05), d = p + Math.max(e.autoSweepHold, 0), u = Math.floor(s / d);
if (u < f) {
let m = Math.min(1, (s - u * d) / p), w = 1 - (1 - m) * (1 - m), g = ce[u], b = ce[u + 1];
this.sweepPointer.x = (g.x + (b.x - g.x) * w) * e.autoSweepAmount, this.sweepPointer.y = (g.y + (b.y - g.y) * w) * e.autoSweepAmount;
}
}
this.sweepSmoothed.x += (this.sweepPointer.x - this.sweepSmoothed.x) * e.pointerLerp, this.sweepSmoothed.y += (this.sweepPointer.y - this.sweepSmoothed.y) * e.pointerLerp;
let n = Math.hypot(this.sweepSmoothed.x - this.sweepLast.x, this.sweepSmoothed.y - this.sweepLast.y), i = a ? Math.min(1, n / Math.max(e.pacePeak, 1e-5)) : 0;
this.sweepPace += (i - this.sweepPace) * (i > this.sweepPace ? e.paceAttack : e.paceRelease), this.sweepLast.x = this.sweepSmoothed.x, this.sweepLast.y = this.sweepSmoothed.y;
let l = this.sweepTrail.pop();
l && (l.set(this.sweepSmoothed.x, -this.sweepSmoothed.y), this.sweepTrail.unshift(l)), this.smoothed.x += (this.pointer.x - this.smoothed.x) * e.pointerLerp, this.smoothed.y += (this.pointer.y - this.smoothed.y) * e.pointerLerp, this.ready && (this.readyAt === null && (this.readyAt = o), this.intro = Math.min(1, (o - this.readyAt) / Math.max(e.introDuration, 1e-3)), this._tier.freeze && (this.intro = 1)), this.camera.position.z = e.cameraZ, this.subjectGroup.scale.setScalar(e.subjectScale * this.narrowFit()), this.subjectGroup.position.x = e.subjectX + (this.viewportWidth < Hr && this.aspect >= 1.2 ? Yr : 0) + this.smoothed.x * e.subjectParallax, this.subjectGroup.position.y = e.subjectY - this.smoothed.y * e.subjectParallax - this.riseOffset(o, e), this.headMaterial && (this.headMaterial.uniforms.uParallax.value.set(this.smoothed.x, -this.smoothed.y), this.headMaterial.uniforms.uReveal.value = this.reveal, this.headMaterial.uniforms.uDepthScale.value = e.headParallax, this.headMaterial.uniforms.uRelight.value = e.headRelight), this.headMesh && (this.headMesh.scale.setScalar(e.headScale), this.headMesh.position.y = -0.55 + e.headY - Ue * Ze * e.headScale / 2), this.tilt += (this.pitchFor(this.smoothed.y) - this.tilt) * e.pointerLerp, this.yaw += (this.yawFor(this.smoothed.x) - this.yaw) * e.pointerLerp, this.helmetPivot.rotation.x = this.tilt, this.helmetPivot.rotation.y = this.yaw, this.helmetGroup.position.x = e.helmetX + this.smoothed.x * e.helmetFollow, this.helmetGroup.position.y = e.helmetY - this.smoothed.y * e.helmetFollow * 0.8, this.helmetGroup.position.z = e.helmetZ, this.helmetGroup.scale.setScalar(e.helmetScale);
let h = Math.hypot(this.smoothed.x - this.lastSmoothed.x, this.smoothed.y - this.lastSmoothed.y);
if (this._tier.pointerEnabled) {
let s = Math.min(1, h / Math.max(e.pacePeak, 1e-5));
this.pace += (s - this.pace) * (s > this.pace ? e.paceAttack : e.paceRelease);
} else !a && this.intro >= 1 && this._tier.reveal && (this.pace = 1);
this.lastSmoothed.x = this.smoothed.x, this.lastSmoothed.y = this.smoothed.y;
let c = this.trail.pop();
if (c && (c.set(this.smoothed.x, -this.smoothed.y), this.trail.unshift(c)), this.revealUniforms && (this.revealUniforms.uAspect.value = this.aspect, this.revealUniforms.uRadius.value = e.trailRadius, this.revealUniforms.uIdleScale.value = e.trailIdleScale, this.revealUniforms.uTaper.value = e.trailTaper, this.revealUniforms.uTaperIdle.value = e.trailTaperIdle, this.revealUniforms.uTaperFast.value = e.trailTaperFast, this.revealUniforms.uLength.value = e.trailLength, this.revealUniforms.uPace.value = this.pace, this.revealUniforms.uGateStart.value = e.paceThreshold, this.revealUniforms.uGateWidth.value = e.paceRamp, this.revealUniforms.uWarpScale.value = e.revealWarpScale, this.revealUniforms.uTime.value = o * e.revealSpeed, this.revealUniforms.uRevealMix.value = this.reveal, this.revealUniforms.uThreshold.value = e.revealThreshold, this.revealUniforms.uEdge.value = e.revealEdge, this.revealUniforms.uWarp.value = e.revealWarp, this.revealUniforms.uIntro.value = this.intro, this.revealUniforms.uBurnStart.value = e.burnStart, this.revealUniforms.uBurnSoft.value = e.burnSoftness, this.revealUniforms.uBurnGlow.value = e.burnGlow, this.revealUniforms.uSweepPace.value = this.sweepPace, this.revealUniforms.uSweepWarp.value = e.sweepWarp, this.revealUniforms.uSweepLength.value = e.sweepLength, this.revealUniforms.uSweepRadius.value = e.sweepRadius, this.writeTrailBounds(this.trail, e.trailLength, e.revealWarp, e.trailRadius, this.revealUniforms.uTrailMin.value, this.revealUniforms.uTrailMax.value), this.writeTrailBounds(this.sweepTrail, e.sweepLength, e.sweepWarp, e.sweepRadius, this.revealUniforms.uSweepMin.value, this.revealUniforms.uSweepMax.value)), this.backdropMesh && this.backdropMaterial) {
let f = 2 * (this.camera.position.z - xt) * Math.tan(this.camera.fov * Math.PI / 360) * 1.06;
this.backdropMesh.scale.set(f * this.aspect, f, 1);
let p = this.backdropMaterial.uniforms;
p.uLineScale.value = e.bgLineScale, p.uLineCount.value = e.bgLineCount, p.uLineThickness.value = e.bgLineThickness, p.uLineOpacity.value = e.bgLineOpacity, p.uWaveAmount.value = e.bgWaveAmount, p.uWaveSpeed.value = e.bgWaveSpeed, p.uRevealOpacity.value = e.bgRevealOpacity, p.uRevealColor.value.setScalar(e.bgRevealLightness), p.uRevealColorAlt.value.setScalar(e.bgRevealLightnessAlt);
}
if (this.outlineMaterial) {
let s = this.outlineMaterial.uniforms;
s.uTime.value = o, s.uPeriod.value = e.outlinePeriod, s.uStagger.value = e.outlineStagger, s.uOpacity.value = e.outlineOpacity, s.uWidth.value = e.outlineWidth, s.uLightness.value = e.outlineLightness, s.uBase.value = e.outlineBase, s.uRevealMix.value = this.reveal * this.burnProgress(e);
}
this.shellMaterial?.color.setScalar(e.helmetBrightness), this.renderer.render(this.scene, this.camera);
}
riseOffset(r, o) {
if (this._tier.freeze || o.riseDistance === 0) return 0;
let e = 1;
if (this.riseStarted) {
this.riseAt === null && (this.riseAt = r);
let n = Math.min(1, (r - this.riseAt) / Math.max(o.riseDuration, 1e-3));
e = 1 - (1 - (1 - n) * (1 - n));
}
if (e <= 0) return 0;
let a = 2 * o.cameraZ * Math.tan(this.camera.fov * Math.PI / 360);
return e * o.riseDistance * (a / this.viewportHeight);
}
burnProgress(r) {
let o = Math.max(1 - r.burnStart, 1e-4), e = Math.min(1, Math.max(0, (this.intro - r.burnStart) / o));
return e * e * (3 - 2 * e);
}
resetSweep() {
let r = ce[0], o = this.params.autoSweepAmount, e = r.x * o, a = r.y * o;
this.sweepPointer.x = e, this.sweepPointer.y = a, this.sweepSmoothed.x = e, this.sweepSmoothed.y = a, this.sweepLast.x = e, this.sweepLast.y = a, this.sweepPace = 0;
for (let n of this.sweepTrail) n.set(e, -a);
}
narrowFit() {
return this.viewportWidth >= Ur || this.aspect < 1.2 ? 1 : Math.max(Br, Math.min(1, this.aspect / Fr));
}
writeTrailBounds(r, o, e, a, n, i) {
let l = Math.min(r.length, Math.ceil(o * (this.samples - 1)) + 1), h = a + e * 0.22 + 0.05, c = 1 / 0, s = 1 / 0, f = -1 / 0, p = -1 / 0;
for (let d = 0; d < l; d++) {
let u = r[d], m = u.x * this.aspect;
m < c && (c = m), m > f && (f = m), u.y < s && (s = u.y), u.y > p && (p = u.y);
}
n.set(c - h, s - h), i.set(f + h, p + h);
}
dispose() {
this.disposed = true, this.scene.traverse((r) => {
let o = r;
o.geometry && o.geometry.dispose();
let e = Array.isArray(o.material) ? o.material : [o.material];
for (let a of e) if (a) {
for (let n of Object.values(a)) n instanceof _r && n.dispose();
a.dispose();
}
}), this.renderer.dispose();
}
async load() {
let r = new bt(), o = (u, m = false) => new Promise((w, g) => {
let b = `${Ce}/${u}`;
r.load(b, (x) => {
m && (x.colorSpace = Lr), x.minFilter = Rr, x.generateMipmaps = true, w(x);
}, void 0, () => g(new Error(b)));
}), e = new Or();
e.setDecoderPath(mt);
let a = new Dr();
a.setDRACOLoader(e);
let n = (u, m) => u.catch(() => {
throw new Error(m);
}), i = Ne + "/hero/packed", l = async () => {
if (!Me) return new wt().loadAsync(`${Ce}/studio-light.hdr`);
let u = new wt().parse(await Le(`${i}/studio-light.hdr.png`)), m = new Cr(u.data, u.width, u.height, u.format ?? Pr, u.type);
return m.colorSpace = kr, m.minFilter = yt, m.magFilter = yt, m.generateMipmaps = false, m.flipY = true, m.needsUpdate = true, m;
}, h = async () => {
if (!Me) return a.loadAsync(`${Ce}/helmet3.glb`);
let u = await Le(`${i}/helmet3.glb.png`);
return a.register((m) => {
let w = new bt(m.options.manager);
return w.setCrossOrigin("anonymous"), m.textureLoader = w, { name: "lk_image_textures" };
}), a.parseAsync(u, `${i}/`);
}, c, s, f, p;
try {
[c, s, f, p] = await Promise.all([n(l(), `${Ce}/studio-light.hdr`), Promise.all([o("person-diffuse.webp", true), o("person-depth.webp"), o("person-alpha.webp"), o("person-normal.webp")]), n(h(), `${Ce}/helmet3.glb`), o("noise.webp")]);
} catch (u) {
_e(u.message), this.onError?.(u);
return;
}
if (this.disposed) return;
let d = new Tr(this.renderer);
this.scene.environment = d.fromEquirectangular(c).texture, c.dispose(), d.dispose(), this.buildHead(s[0], s[1], s[2], s[3]), this.buildHelmet(f.scene, p), this.buildBackdrop(p), this.reveal = 1;
for (let u of [...s, p, ...this.helmetTextures]) this.renderer.initTexture(u);
await this.renderer.compileAsync(this.scene, this.camera), !this.disposed && (this.renderer.render(this.scene, this.camera), this.ready = true, this.onReady?.());
}
buildHead(r, o, e, a) {
this.headMaterial = new Ke({ vertexShader: Kr, fragmentShader: Zr, uniforms: { uDiffuse: { value: r }, uDepth: { value: o }, uAlpha: { value: e }, uNormal: { value: a }, uParallax: { value: new me() }, uReveal: { value: 0 }, uDepthScale: { value: A.headParallax }, uRelight: { value: A.headRelight }, uExtend: { value: Ze } }, transparent: true });
let n = new vt(Ue, Ue * (1 + Ze)), i = new ze(n, this.headMaterial);
i.position.set(0, -0.55, 0), this.headMesh = i, this.subjectGroup.add(i);
}
buildHelmet(r, o) {
o.wrapS = gt, o.wrapT = gt, this.revealUniforms = { uTrail: { value: this.trail }, uTrailMin: { value: new me(-1e3, -1e3) }, uTrailMax: { value: new me(1e3, 1e3) }, uSweep: { value: this.sweepTrail }, uSweepMin: { value: new me(-1e3, -1e3) }, uSweepMax: { value: new me(1e3, 1e3) }, uSweepPace: { value: 0 }, uSweepWarp: { value: A.sweepWarp }, uSweepLength: { value: A.sweepLength }, uSweepRadius: { value: A.sweepRadius }, uAspect: { value: this.aspect }, uRadius: { value: A.trailRadius }, uIdleScale: { value: A.trailIdleScale }, uTaper: { value: A.trailTaper }, uTaperIdle: { value: A.trailTaperIdle }, uTaperFast: { value: A.trailTaperFast }, uLength: { value: A.trailLength }, uPace: { value: 0 }, uGateStart: { value: A.paceThreshold }, uGateWidth: { value: A.paceRamp }, uWarpScale: { value: A.revealWarpScale }, uTime: { value: 0 }, uThreshold: { value: A.revealThreshold }, uEdge: { value: A.revealEdge }, uWarp: { value: A.revealWarp }, uRevealMix: { value: 0 }, uNoiseTex: { value: o }, uIntro: { value: 0 }, uBurnStart: { value: A.burnStart }, uBurnSoft: { value: A.burnSoftness }, uBurnGlow: { value: A.burnGlow }, uBurnColor: { value: new pe(Fe("--accent")) } }, r.traverse((l) => {
if (!l.isMesh) return;
let h = l, c = h.material;
c.side = xr, c.transparent = true, c.depthWrite = false, c.envMapIntensity = 1.3, this.injectRevealMask(c), h.renderOrder = 1, this.shellMaterial = c;
for (let s of [c.map, c.normalMap, c.roughnessMap, c.metalnessMap]) s && !this.helmetTextures.includes(s) && this.helmetTextures.push(s);
});
let e = new Sr().setFromObject(r), a = e.getSize(new Je()), n = Ue * 0.56 / a.y;
r.scale.setScalar(n), e.setFromObject(r);
let i = e.getCenter(new Je());
r.position.sub(i), this.helmetPivot.position.copy($r), this.helmetPivot.add(r), this.helmetGroup.updateMatrixWorld(true), this.helmetRoot = r, this._tier.outline && this.buildOutline(r);
}
buildOutline(r) {
let o = this.helmetPivot.matrixWorld.clone().invert(), e = [];
if (r.traverse((c) => {
let s = c;
if (!s.isMesh || !s.visible || !s.geometry) return;
let f = s.geometry.clone();
f.applyMatrix4(new Er().multiplyMatrices(o, s.matrixWorld));
for (let p of Object.keys(f.attributes)) p !== "position" && f.deleteAttribute(p);
e.push(f);
}), !e.length) return;
let a = Wr(e, false);
for (let c of e) c.dispose();
if (!a) return;
a.computeBoundingBox();
let n = a.boundingBox, i = n?.min.y ?? 0, l = n ? n.max.y - n.min.y : 1;
this.outlineMaterial = new Ke({ vertexShader: Vr, fragmentShader: jr, wireframe: true, transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 }, uPeriod: { value: A.outlinePeriod }, uStagger: { value: A.outlineStagger }, uOpacity: { value: A.outlineOpacity }, uWidth: { value: A.outlineWidth }, uLightness: { value: A.outlineLightness }, uBase: { value: A.outlineBase }, uRevealMix: { value: 0 }, uColor: { value: new pe(Fe("--foreground")) }, uMinY: { value: i }, uRangeY: { value: l } } });
let h = new ze(a, this.outlineMaterial);
h.renderOrder = 3, h.visible = this._tier.outline, this.outlineMesh = h, this.helmetPivot.add(h);
}
injectRevealMask(r) {
let o = this.revealUniforms;
o && (r.onBeforeCompile = (e) => {
Object.assign(e.uniforms, o), e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>
varying vec4 vRevealClip;`).replace("#include <project_vertex>", `#include <project_vertex>
vRevealClip = gl_Position;`), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>
varying vec4 vRevealClip;
uniform float uIntro;
uniform float uBurnStart;
uniform float uBurnSoft;
uniform float uBurnGlow;
uniform vec3 uBurnColor;
${Tt(this.samples)}`).replace("#include <alphamap_fragment>", `#include <alphamap_fragment>
vec2 revealNdc = vRevealClip.xy / vRevealClip.w;

float burnFront = smoothstep(uBurnStart, 1.0, uIntro);
float burnNoise = texture2D(uNoiseTex, revealNdc * 0.5 + 0.5).r;
float burnHeight = 1.0 - (revealNdc.y * 0.5 + 0.5);
float burnAt = mix(burnHeight, burnNoise, 0.45);
float intact = smoothstep(
burnFront - uBurnSoft,
burnFront + uBurnSoft,
burnAt
);

float mask = max(revealTrail(revealNdc), intact);
diffuseColor.a *= mask * uRevealMix;

float burnEdge = 4.0 * intact * (1.0 - intact);

diffuseColor.rgb += uBurnColor * burnEdge * uBurnGlow * uRevealMix;`);
});
}
buildBackdrop(r) {
let o = this.revealUniforms;
if (!o) return;
this.backdropMaterial = new Ke({ vertexShader: Xr, fragmentShader: zr(this.samples), depthWrite: false, uniforms: { ...o, uNoiseTex: { value: r }, uBackground: { value: new pe(Fe("--background")) }, uLineColor: { value: new pe(Fe("--surface-soft")) }, uRevealColor: { value: new pe().setScalar(A.bgRevealLightness) }, uRevealColorAlt: { value: new pe().setScalar(A.bgRevealLightnessAlt) }, uLineScale: { value: A.bgLineScale }, uLineCount: { value: A.bgLineCount }, uLineThickness: { value: A.bgLineThickness }, uLineOpacity: { value: A.bgLineOpacity }, uWaveAmount: { value: A.bgWaveAmount }, uWaveSpeed: { value: A.bgWaveSpeed }, uRevealOpacity: { value: A.bgRevealOpacity } } });
let e = new ze(new vt(1, 1), this.backdropMaterial);
e.position.z = xt, e.renderOrder = -1, this.backdropMesh = e, this.scene.add(e);
}
};
de();
var Jr = 430, Qr = 240, eo = 3e3, to = 1.15, ro = (t) => {
let r = B("1.25rem"), o = [...t.querySelectorAll("[data-hero-rise]")].map((l) => ({ ctl: C(l, r, S.REVEAL), delay: Number(l.dataset.heroRise) })), e = C(t.querySelector("[data-id-tag]"), te, S.REVEAL), a = Y(t.querySelector("[data-id-name]"), { by: "word", stagger: 110, config: S.REVEAL }), n = [...t.querySelectorAll("[data-id-row]")].map((l) => C(l, B("0.75rem"), S.REVEAL)), i = [...t.querySelectorAll("[data-hero-figure]")].map((l, h) => ({ ctl: Y(l, { by: "letter", stagger: 26, config: S.FIGURE, gap: "0" }), delay: 900 + h * 90 }));
return () => {
for (let { ctl: l, delay: h } of o) l.play(h);
e.play(180), a.play(180), n.forEach((l, h) => l.play(440 + h * 130));
for (let { ctl: l, delay: h } of i) l.play(h);
};
}, oo = (t, r) => {
let o = t.querySelector("[data-veil]"), e = o.querySelector("[data-veil-content]"), a = o.querySelector("[data-veil-fill]"), n = o.querySelector("[data-veil-bar]"), i = o.querySelector("[data-veil-meter]"), l = o.querySelector("[data-veil-name]"), h = new F(0, (f) => {
a.style.transform = `scaleY(${f})`, n.style.transform = `scaleX(${f})`;
});
h.to(0.7, S.PROGRESS_WAIT), C(l, B("0.6rem"), S.LABEL).play(260);
let c = false;
return { ready: () => {
if (c) return;
c = true, h.to(1, S.PROGRESS_READY), o.style.pointerEvents = "none", o.setAttribute("aria-label", "Loaded"), new F(1, (p) => {
e.style.opacity = `${p}`, e.style.transform = `translateY(calc(-0.75rem * ${1 - p}))`, i.style.opacity = `${p}`;
}).to(0, S.CLEAR), setTimeout(() => {
new F(1, (m) => {
o.style.opacity = `${m}`;
}).to(0, S.VEIL), r();
let d = performance.now(), u = z(() => {
(Number(getComputedStyle(o).opacity) <= 4e-3 || performance.now() - d > eo) && (u(), o.remove());
});
}, Jr + Qr);
} };
}, ao = () => {
try {
let t = document.createElement("canvas");
return !!(t.getContext("webgl2") || t.getContext("webgl"));
} catch {
return false;
}
}, et = (t) => {
let r = t.querySelector("[data-hero-canvas]");
r.innerHTML = "";
let o = document.createElement("div");
o.className = "hero-fallback", o.style.backgroundImage = `url('${Te("hero/ui/backdrop-lines.svg")}')`, r.appendChild(o);
let e = t.querySelector("[data-hero-box]"), a = e && e.offsetParent !== null ? e : o, n = document.createElement("img");
n.src = Te("hero/scene/person-diffuse.webp"), n.alt = "Kimi Antonelli", a.appendChild(n);
}, no = (t, r) => {
if (!ao()) return et(t), r.ready(), { beginRise() {
} };
let o = t.querySelector("[data-hero-canvas]"), e = o.querySelector("canvas"), a = t.querySelector("[data-hero-box]"), n;
try {
n = new Be(e);
} catch (b) {
return console.error(b), et(t), r.ready(), { beginRise() {
} };
}
n.onReady = () => r.ready(), n.onError = () => {
et(t), r.ready();
};
let i = () => {
let b = t.getBoundingClientRect(), x = a.offsetParent !== null ? (() => {
let v = a.getBoundingClientRect();
return At(A, { top: v.top - b.top, height: v.height }, o.clientHeight);
})() : null;
n.setParams({ ...A, ...x, ...Z("(max-width: 1023px)").matches ? { bgRevealOpacity: 0 } : null, ...Z("(hover: none)").matches ? { autoSweepAmount: 0.76 } : null, ...Z("(max-width: 639px)").matches ? { sweepRadius: 0.95, sweepWarp: 0.18, autoSweepAmount: 0.55 } : null, ...n.tier.reveal ? null : { autoSweepAmount: 0 } });
}, l = (b) => n.setPointer(b.clientX / innerWidth * 2 - 1, b.clientY / innerHeight * 2 - 1), h = false, c = () => {
let b = n.tier.pointerEnabled;
b && !h && window.addEventListener("pointermove", l, { passive: true }), !b && h && window.removeEventListener("pointermove", l), h = b;
};
c();
let s = Z("(hover: none) and (pointer: coarse)"), f = 0, p = 0, d = s.matches, u = 0, m = () => {
u = 0;
let b = o.clientWidth, x = o.clientHeight, v = s.matches, E = b !== f, T = v !== d;
!E && !T && v || !E && !T && x === p || ((E || T) && (n.retune(), c()), f = b, p = x, d = v, n.resize(b, x), i());
}, w = () => {
u || (u = requestAnimationFrame(m));
};
new ResizeObserver(w).observe(o), s.addEventListener?.("change", w), n.resize(o.clientWidth || innerWidth, o.clientHeight || innerHeight), f = o.clientWidth, p = o.clientHeight, i();
let g = true;
return re(t, (b) => {
g = b;
}), z((b) => {
!g || document.hidden || window.scrollY > window.innerHeight * to || n.update(b);
}, () => n.tier.frameInterval), { beginRise: () => n.beginRise() };
}, so = (t, r) => {
let o = t.querySelector("[data-burger]"), e = t.querySelector(".mast-logo img"), a = null, n = null, i = () => {
if (!a) return;
let c = a;
a = null, document.documentElement.classList.remove("menu-open"), r?.start(), o.setAttribute("aria-expanded", "false");
let s = new F(1, (f) => {
c.style.opacity = `${f}`;
});
s.onRest = () => c.remove(), s.to(0, S.SHEET), document.removeEventListener("keydown", l), n?.focus();
}, l = (c) => {
c.key === "Escape" && i();
}, h = () => {
if (a) return;
n = document.activeElement, a = document.createElement("div"), a.className = "sheet", a.setAttribute("role", "dialog"), a.setAttribute("aria-modal", "true"), a.setAttribute("aria-label", "Menu");
let c = [...t.querySelectorAll(".mast-nav a")].map((f) => [f.textContent, f.getAttribute("href")]);
c.push(["Garage", "/garage"]), a.innerHTML = `
<div class="sheet-top"><a href="/" data-sheet-logo aria-label="Grido1 Racing Systems"><img src="${e.src}" alt=""></a>
<button class="sheet-close" type="button" data-sheet-close><span class="sr-only">Close menu</span><span class="sheet-x"><i></i><i></i></span></button></div>
<nav class="sheet-nav" aria-label="Menu"><ul>${c.map(([f, p]) => `<li data-sheet-item><a class="sheet-link hov" href="${p}">${f}</a></li>`).join("")}</ul></nav>`, document.body.appendChild(a), new F(0, (f) => {
a && (a.style.opacity = `${f}`);
}).to(1, S.SHEET), [...a.querySelectorAll("[data-sheet-item]")].forEach((f, p) => C(f, B("0.75rem"), S.ITEM).play(120 + p * 55)), a.querySelector("[data-sheet-logo]").addEventListener("click", i), a.querySelector("[data-sheet-close]").addEventListener("click", i), r?.stop(), document.documentElement.classList.add("menu-open"), o.setAttribute("aria-expanded", "true"), a.querySelector("[data-sheet-close]").focus(), document.addEventListener("keydown", l);
};
o.addEventListener("click", h), Z("(min-width: 1280px)").addEventListener?.("change", (c) => c.matches && i());
}, Mt = (t) => {
let r = document.querySelector("[data-hero]"), o = ro(r), e = null, a = oo(r, () => {
o(), e?.beginRise();
});
e = no(r, a), so(r, t);
};
de();
Ye();
var mo = 50, fo = 9, vo = 20, ot = 98, go = 4, bo = 0.4, yo = 2200, It = "http://www.w3.org/2000/svg", wo = (t, r, o, e, a = "top bottom", n = "bottom top") => {
se(t, a, n, (i) => {
r.style.top = `${(o + (e - o) * i).toFixed(4)}cqw`;
});
}, So = (t, r) => {
let o = t.querySelector("[data-rail]"), e = document.createElementNS(It, "svg");
e.setAttribute("preserveAspectRatio", "none"), o.appendChild(e);
let a = (p, d) => {
let u = document.createElementNS(It, p);
for (let [m, w] of Object.entries(d)) u.setAttribute(m, w);
return e.appendChild(u), u;
}, n = a("line", { x1: 8, x2: 8, y1: 0, y2: ot, style: "stroke:var(--timeline-rail)", "stroke-width": 1, "vector-effect": "non-scaling-stroke" }), i = a("line", { x1: 8, x2: 8, y1: ot + go, y2: 0, style: "stroke:var(--timeline-rail)", "stroke-width": 1, "stroke-dasharray": "6 6" }), l = a("rect", { x: 7.5, y: 0, width: 1, height: 0, style: "fill:var(--foreground-on-dark)" }), h = a("rect", { x: -4.5, y: -4.5, width: 9, height: 9, style: "fill:var(--foreground-on-dark)" }), c = 0, s = () => {
let p = o.getBoundingClientRect(), d = p.width / 16 || 1, u = p.height / d;
e.setAttribute("viewBox", `0 0 16 ${u}`);
let m = r[r.length - 1];
c = Math.max(0, (m.offsetTop + m.offsetHeight / 2 - o.offsetTop) / d - mo), i.setAttribute("y2", `${c}`), n.setAttribute("y2", `${Math.min(ot, c)}`);
let w = window.innerWidth < 1024 ? vo : fo;
h.setAttribute("x", `${-w / 2}`), h.setAttribute("y", `${-w / 2}`), h.setAttribute("width", `${w}`), h.setAttribute("height", `${w}`);
}, f = (p) => {
let d = p * c;
l.setAttribute("height", `${Math.max(0, d)}`), h.setAttribute("transform", `translate(8 ${d}) rotate(${c ? d / c * 1800 : 0})`);
};
new ResizeObserver(s).observe(o), s(), se(o, "top center", "bottom bottom", (p, d) => f(d), { smooth: true });
}, Ot = () => {
let t = document.querySelector("[data-timeline]"), r = t.querySelector("[data-tl-wrap]"), o = [...t.querySelectorAll("[data-tl-row]")];
xe(t.querySelector("[data-dissolve]"));
let e = t.querySelector("[data-heading]");
Q(e, ve(e)), So(t, o);
let a = Z("(hover: hover)").matches && !U;
return o.forEach((n) => {
let i = n.dataset.frame === "centre";
for (let m of n.querySelectorAll("[data-para]")) {
let w = Number(m.dataset.para);
wo(n, m, w / 1440 * 100, -w / 1440 * 100);
}
let l = n.querySelector("[data-plate-slot]");
se(n, "top bottom", "top center", (m) => {
l.style.top = `${-10 + 10 * m}%`;
});
let h = n.querySelector("[data-tl-year]"), c = n.querySelector(".tl-year"), s = Y(h, { by: "letter", stagger: 26, config: S.YEAR, gap: "0" }), f = new F(1, (m) => {
c.style.opacity = `${m}`;
}), p = n.querySelector("[data-tl-copy]"), d = p ? C(p, B("0.75rem"), S.COPY) : null, u = 0;
if ($e(n, () => {
d?.play(220);
}, "0% 0% -25% 0%"), Q(n, [{ play() {
s.play(), f.to(1, S.YEAR_SETTLE), i && (clearTimeout(u), u = setTimeout(() => f.to(bo, S.YEAR_SETTLE), yo));
}, reverse() {
clearTimeout(u), s.reverse();
} }], "0% 0% -25% 0%"), a) {
let m = n.querySelector(".plate");
m.addEventListener("mouseenter", () => {
n.classList.add("hot"), r.classList.add("dim");
}), m.addEventListener("mouseleave", () => {
n.classList.remove("hot"), r.classList.remove("dim");
});
}
}), { px: qe };
};
de();
Ye();
var ke = 560, Pe = 90, xo = 3200, Ro = 3.4, Eo = 5200, Ao = 5, To = 320, Dt = 460, Mo = 90, Lo = 260, _o = 80, Co = 48, ko = 60, K = (t, r) => ({ play: () => t.play(r), reverse: () => t.reverse() }), Wt = () => {
let t = document.querySelector("[data-paddock]");
rt(t.querySelector("[data-contour]"), U), xe(t.querySelector("[data-dissolve]"));
let r = t.querySelector("[data-para-paddock]");
se(t, "top bottom", "bottom top", (v) => {
r.style.top = `${(-(Co / 1440) * 100 * v).toFixed(4)}cqw`;
});
let o = t.querySelector("[data-heading]"), e = Y(t.querySelector("[data-paddock-report]"), { by: "word", stagger: 30, config: S.COPY_WORDS, gap: "0.22em", delay: 2 * 130 + 90 }), a = C(t.querySelector("[data-paddock-cta]"), B("0.75rem"), S.REVEAL);
Q(o, ve(o)), Q(t.querySelector("[data-paddock-intro]"), [e, K(a, 2 * 130 + 260)]);
let n = t.querySelector("[data-paddock-panels]"), i = [], l = n.querySelector(".p-bracket-meet");
i.push(K(C(l, te, S.REVEAL), To)), i.push(K(C(n.querySelector(".p-meet"), B("0.75rem"), S.REVEAL), 410)), i.push(K(C(n.querySelector(".p-bracket-stats"), te, S.REVEAL), Dt));
let h = [...n.querySelectorAll("[data-p-rule]")];
[...n.querySelectorAll("[data-p-stat]")].forEach((v, E) => {
let T = Dt + E * Mo;
E > 0 && i.push(K(C(h[E - 1], (R, M) => {
R.style.transform = `scaleX(${M})`;
}, S.ROW), T)), i.push(K(C(v, B("0.75rem"), S.ROW), T + 40));
let y = Y(v.querySelector("[data-p-fig]"), { by: "letter", stagger: 24, config: S.FIGURE, gap: "0", delay: T + 120 });
i.push(y);
}), Q(n.querySelector(".p-meet"), i);
let c = t.querySelector("[data-cal]"), s = [...c.querySelectorAll("[data-cal-link]")], f = [...c.querySelectorAll("[data-cal-card]")], p = [...c.querySelectorAll("[data-cal-mark]")], d = c.querySelector("[data-cal-bracket]"), u = [];
s.forEach((v, E) => u.push(K(C(v, (T, y) => {
T.style.transform = `scaleX(${y})`;
}, S.ROW), ke + E * Pe))), f.forEach((v, E) => {
u.push(K(C(v, B("0.5rem"), S.ROW), ke + E * Pe)), u.push(K(C(v.querySelector("[data-cal-name]"), B("0.3em"), S.NAME), ke + E * Pe + 110));
}), p.forEach((v, E) => u.push(K(C(v, te, S.ROW), ke + E * Pe + 60))), u.push(K(C(d, te, S.ROW), ke + 5 * Pe)), $e(c, () => u.forEach((v) => v.play()), "0% 0% -20% 0%");
let m = 11.45 / 1440 * 100, w = he(Eo, (v) => {
for (let E of s) E.style.backgroundPositionX = `calc(${(v * m * Number(E.dataset.dir)).toFixed(4)}cqw * var(--cal-spread, 1))`;
}), g = c.querySelector("[data-cal-pulse]"), b = he(xo, (v) => {
g.setAttribute("r", `${5.5 + v * 5.5 * Ro}`), g.setAttribute("opacity", `${0.5 * (1 - v) * (1 - v)}`);
}, ye.outQuad);
U || re(c, (v) => {
w.setRunning(v), b.setRunning(v);
});
let x = c.querySelector("[data-cal-live-card]");
x.addEventListener("mouseenter", () => c.style.setProperty("--bracket-spread", qe(Ao))), x.addEventListener("mouseleave", () => c.style.removeProperty("--bracket-spread"));
}, Gt = () => {
let t = document.querySelector("[data-foot]");
rt(t.querySelector("[data-contour]"), U);
let r = t.querySelector("[data-para-foot]");
se(t, "top bottom", "bottom bottom", (a) => {
r.style.top = `${(ko / 1440 * 100 * (1 - a)).toFixed(4)}cqw`;
});
let o = t.querySelector("[data-heading]"), e = [K(C(t.querySelector("[data-foot-logo]"), te, S.REVEAL), 120), ...ve(o)];
t.querySelectorAll("[data-foot-link]").forEach((a, n) => {
e.push(Y(a, { by: "letter", stagger: 22, config: S.ROW, gap: "0.2em", delay: Lo + n * _o }));
}), t.querySelectorAll("[data-foot-rise]").forEach((a) => {
e.push(K(C(a, B("0.75rem"), S.REVEAL), Number(a.dataset.footRise)));
}), Q(t, e, "0% 0% -20% 0%");
};
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
var hr = () => {
document.documentElement.style.fontSize = window.innerWidth > 1920 ? `${16 * window.innerWidth / 1920}px` : "";
};
hr();
window.addEventListener("resize", hr);
var ht = null;
U || (ht = new sa({ smoothWheel: true }), z((t) => ht.raf(t), () => 0));
var ia = () => {
let o = window.matchMedia("(max-width: 639px)"), e = [...document.querySelectorAll("[data-layer]")], a = document.querySelector("[data-layer-last]"), n = e.map((c, s) => ({ inner: c.querySelector("[data-layer-inner]"), shade: c.querySelector("[data-layer-shade]"), next: e[s + 1] || a })), i = () => {
let c = window.innerHeight || 1, s = o.matches ? 0 : 1 - 0.9;
for (let { inner: f, shade: p, next: d } of n) {
let u = Math.min(1, Math.max(0, 1 - d.getBoundingClientRect().top / c));
f.style.transform = u > 0 && s > 0 ? `scale(${1 - s * u})` : "", f.style.willChange = u > 0 && s > 0 ? "transform" : "", p.style.opacity = `${0.55 * u}`, f.style.visibility = u >= 1 ? "hidden" : "visible";
}
}, l = 0, h = () => {
l || (l = requestAnimationFrame(() => {
l = 0, i();
}));
};
window.addEventListener("scroll", h, { passive: true }), window.addEventListener("resize", h), i();
}, la = async () => {
if (Me) {
let r = Te("season/data.json.png");
try {
globalThis.__LK_DATA__ = JSON.parse(new TextDecoder().decode(await Le(r)));
} catch {
_e(r);
return;
}
}
let { setupSeason: t } = await Promise.resolve().then(() => (cr(), lr));
t();
}, ur = () => {
ft(), ia(), Mt(ht), la(), Ot(), Wt(), Gt();
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ur, { once: true }) : ur();
