(() => {
const t = () => globalThis.__LK_LIBS__ && globalThis.__LK_LIBS__.HeroScene ? lk() : setTimeout(t, 20);
t();
})();
function lk() {
var Ve = Object.defineProperty;
var dt = (t, e) => () => (t && (e = t(t = 0)), e);
var Xe = (t, e) => {
for (var n in e) Ve(t, n, { get: e[n], enumerable: true });
};
var X, C = dt(() => {
X = { "hero/scene/person-diffuse.webp": "/uploads/UkKvJZ4y_0YVVhGejLRXD-lucaskimi-person-diffuse.webp", "season/data.json.png": "/uploads/38iYW1ShR08SHobrgrs5s-lucaskimi-season-data_json.png", "hero/ui/backdrop-lines.svg": "/uploads/Re7jx_c-p6G_A-HdhFRDN-lucaskimi-backdrop-lines.svg" };
});
var G, wt, ft, Jt, z, E, ut, At, Lt, je, F, ht, yt, L, H, ot, U, It, tt, nt, Ke, ze, ct, kt, J, pt = dt(() => {
C();
G = window.matchMedia("(prefers-reduced-motion: reduce)").matches, wt = /* @__PURE__ */ new Set(), ft = 0, Jt = (t) => {
ft = requestAnimationFrame(Jt);
for (let e of [...wt]) wt.has(e) && t - e.last > e.getFramerate() && (e.last = t, e.callback(t));
}, z = (t, e = () => 0) => {
let n = { callback: t, getFramerate: e, last: -1 / 0 };
return wt.add(n), ft || (ft = requestAnimationFrame(Jt)), () => {
wt.delete(n), !wt.size && ft && (cancelAnimationFrame(ft), ft = 0);
};
}, E = { REVEAL: { tension: 90, friction: 26 }, ROW: { tension: 170, friction: 24 }, ITEM: { tension: 170, friction: 24 }, SHEET: { tension: 190, friction: 26 }, FIGURE: { tension: 200, friction: 24 }, TYPE: { tension: 210, friction: 24 }, YEAR: { tension: 190, friction: 24 }, COPY: { tension: 110, friction: 26 }, COPY_WORDS: { tension: 150, friction: 24 }, NAME: { tension: 190, friction: 24 }, VEIL: { tension: 70, friction: 24 }, CLEAR: { tension: 140, friction: 26 }, LABEL: { tension: 110, friction: 26 }, PROGRESS_WAIT: { tension: 10, friction: 30 }, PROGRESS_READY: { tension: 170, friction: 26 }, YEAR_SETTLE: { tension: 32, friction: 26 }, TRIGGER: { tension: 140, friction: 30 } }, ut = /* @__PURE__ */ new Set(), At = null, Lt = 0, je = (t) => {
let e = Math.min(64, Lt ? t - Lt : 16);
Lt = t;
for (let n of [...ut]) n.advance(t, e);
!ut.size && At && (At(), At = null, Lt = 0);
}, F = class {
constructor(e, n, o = 1e-3) {
this.value = e, this.target = e, this.velocity = 0, this.onChange = n, this.precision = o, this.config = E.REVEAL, this.startAt = 0, this.tween = null, n?.(e);
}
to(e, n = this.config, o = 0) {
this.config = n, !(e === this.target && !this.tween && !ut.has(this)) && (this.target = e, this.startAt = performance.now() + o, this.tween = null, n.duration !== void 0 && (this.tween = { from: this.value, start: null, duration: n.duration, easing: n.easing || ((r) => r) }), ut.add(this), At || (At = z(je, () => 0)));
}
set(e) {
this.value = e, this.target = e, this.velocity = 0, this.tween = null, ut.delete(this), this.onChange?.(e);
}
advance(e, n) {
let o = performance.now();
if (o < this.startAt) return;
if (this.tween) {
let i = this.tween;
i.start === null && (i.start = o);
let l = i.duration <= 0 ? 1 : Math.min(1, (o - i.start) / i.duration);
this.value = i.from + (this.target - i.from) * i.easing(l), this.onChange?.(this.value), l >= 1 && (this.tween = null, ut.delete(this), this.onRest?.());
return;
}
let { tension: r, friction: s } = this.config, c = Math.ceil(n), a = this.value, h = this.velocity;
for (let i = 0; i < c; i += 1) {
let l = -r * 1e-6 * (a - this.target), m = -s * 1e-3 * h;
h += l + m, a += h;
}
if (this.value = a, this.velocity = h, Math.abs(h) < this.precision && Math.abs(this.target - a) < this.precision) {
this.value = this.target, this.velocity = 0, ut.delete(this), this.onChange?.(this.value), this.onRest?.();
return;
}
this.onChange?.(this.value);
}
}, ht = (t, e, n = (o) => o) => {
let o = false, r = 0, s = 0, c = null;
return { setRunning(a) {
a !== o && (o = a, a ? (r += performance.now() - s, c = z(() => {
let h = (performance.now() - r) % t / t;
e(n(h));
})) : (s = performance.now(), c?.(), c = null));
} };
}, yt = { outQuad: (t) => 1 - (1 - t) * (1 - t), inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2, outCubic: (t) => 1 - Math.pow(1 - t, 3) }, L = (t, e, n = E.REVEAL) => {
let o = new F(0, (r) => e(t, r));
return { spring: o, play(r = 0) {
o.to(1, n, G ? 0 : r);
}, reverse() {
o.to(0, n, 0);
}, set(r) {
o.set(r);
} };
}, H = (t = "0.75rem") => (e, n) => {
e.style.opacity = `${n}`, e.style.transform = n >= 1 ? "" : `translateY(calc(${t} * ${1 - n}))`;
}, ot = (t, e) => {
t.style.opacity = `${e}`;
}, U = (t, { by: e = "word", stagger: n = 110, config: o = E.REVEAL, delay: r = 0, gap: s } = {}) => {
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
let l = e === "word" ? 0.35 : 0.3, m = h.map((p) => new F(0, (d) => {
p.style.opacity = `${d}`, p.style.transform = d >= 1 ? "" : `translateY(${(l * (1 - d)).toFixed(4)}em)`;
}));
return { play(p = 0) {
m.forEach((d, u) => d.to(1, o, G ? 0 : r + p + u * n));
}, reverse() {
m.forEach((p) => p.to(0, o, 0));
}, set(p) {
m.forEach((d) => d.set(p));
} };
}, It = (t, e, n = "0px") => {
let o = new IntersectionObserver((r) => {
for (let s of r) s.isIntersecting && (o.disconnect(), e());
}, { rootMargin: n });
return o.observe(t), o;
}, tt = (t, e, n = "0px") => {
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
}, nt = (t, e, n = "0px") => {
let o = 0, r = null, s = new IntersectionObserver((c) => {
for (let a of c) a.isIntersecting ? (r?.(), r = null, e(true)) : (o = 0, r?.(), r = z(() => {
o += 1, o >= 10 && (r?.(), r = null, e(false));
}));
}, { rootMargin: n });
return s.observe(t), s;
}, Ke = (t, e) => ({ top_top: t.top, center_top: t.top + t.height / 2, bottom_top: t.bottom, top_bottom: t.top - e, center_bottom: t.top + t.height / 2 - e, bottom_bottom: t.bottom - e, top_center: t.top - e / 2, center_center: t.top + t.height / 2 - e / 2, bottom_center: t.bottom - e / 2 }), ze = (t, e, n) => {
let o = t.getBoundingClientRect(), r = Ke(o, window.innerHeight), s = r[e.replace(" ", "_")], c = r[n.replace(" ", "_")], a = Math.abs(s - c) || 1;
return Math.min(Math.max(0, 1 - (s + a) / a), 1);
}, ct = (t, e, n, o, { smooth: r = false, config: s = E.TRIGGER } = {}) => {
let c = -1, a = r ? new F(0, (l) => o(c, l), 5e-4) : null, h = () => {
let l = ze(t, e, n);
l !== c && (c = l, a ? a.to(l, s) : o(l, l));
}, i = null;
return nt(t, (l) => {
l && !i ? (h(), i = z(h, () => 10)) : !l && i && (h(), i(), i = null);
}), h(), a && a.set(Math.max(0, c)), { read: h };
}, kt = (t) => `${(t / 1440 * 100).toFixed(4)}cqw`, J = (t) => window.matchMedia(t);
});
var it, bt, mt, Ft, co, io, ae, lo, St, ce, ie, le, uo, ho, de, po, Gt, qt = dt(() => {
C();
pt();
it = (t) => {
let e = document.createElement("span");
e.style.cssText = `position:absolute;visibility:hidden;color:var(${t})`, document.body.appendChild(e);
let n = getComputedStyle(e).color;
return e.remove(), n;
}, bt = (t) => {
let e = t.match(/[\d.]+/g) || ["0", "0", "0"];
return [Number(e[0]), Number(e[1]), Number(e[2]), e[3] !== void 0 ? Number(e[3]) : 1];
}, mt = (t) => {
let n = [...t.querySelectorAll("[data-head-line]")].map((r, s) => U(r, { by: "word", stagger: 110, config: E.REVEAL, delay: s * 130 })), o = t.querySelector("[data-head-dot]");
if (o) {
let r = L(o, ot, E.REVEAL);
n.push({ play: () => r.play(240), reverse: () => r.reverse() });
}
return n;
}, Ft = 0.16, co = 2, io = 0.06, ae = (t, e) => {
let n = Math.imul(t, 374761393) + Math.imul(e, 668265263);
return n = Math.imul(n ^ n >>> 13, 1274126177), ((n ^ n >>> 16) >>> 0) / 4294967295;
}, lo = (t) => Math.min(1, Math.max(0, t)), St = (t) => {
let e = t.dataset.dissolve, n = t.getContext("2d"), o = 0, r = 0, s = 0, c = "", a = "", h = () => {
if (!r || !s) return;
let l = Math.min(window.devicePixelRatio || 1, 2);
n.setTransform(l, 0, 0, l, 0, 0), n.clearRect(0, 0, r, s);
let m = parseFloat(getComputedStyle(t).getPropertyValue("--flag-cell")), p = m > 0 ? m : 24, d = Math.ceil(r / p), u = Math.ceil(s / p), f = o * co;
for (let w = 0; w < u; w += 1) {
let b = w / Math.max(1, u - 1) + f;
if (b > 1) break;
let S = b <= Ft, x = lo(1 - (b - Ft) / (1 - Ft));
if (!S && x <= 0) break;
for (let y = 0; y < d; y += 1) !S && ((y + w) % 2 !== 0 || ae(y, w) > x) || (n.fillStyle = !S && ae(y + 101, w + 57) < io ? a : c, n.fillRect(y * p, w * p, p, p));
}
}, i = () => {
c = it(e === "light" ? "--background" : "--surface-black"), a = it("--accent"), r = t.clientWidth, s = t.clientHeight;
let l = Math.min(window.devicePixelRatio || 1, 2);
t.width = Math.round(r * l), t.height = Math.round(s * l), h();
};
new ResizeObserver(i).observe(t), i(), ct(t, "top bottom", "top top", (l, m) => {
o = m, h();
}, { smooth: true, config: E.TRIGGER });
}, ce = 3.8, ie = 2.5, le = 0.37, uo = 1.66, ho = 0.85, de = 96, po = (t, e, n) => {
let o = Math.sin(t * 1 + n * 0.6) * 0.5;
return o += Math.sin(e * 0.85 - n * 0.45) * 0.45, o += Math.sin((t + e) * 0.65 + n * 0.35) * 0.35, o += Math.sin((t - e) * 0.95 - n * 0.55) * 0.25, o * 0.5 + 0.5;
}, Gt = (t, e) => {
let n = t.getContext("2d"), o = performance.now(), r = "", s = 0, c = 0, a = null, h = () => {
if (!s || !c) return;
let m = (performance.now() - o) / 1e3 * uo, p = Math.min(window.devicePixelRatio || 1, 2);
n.setTransform(p, 0, 0, p, 0, 0), n.clearRect(0, 0, s, c);
let d = s >= c ? de : Math.max(8, Math.round(de * s / c)), u = Math.max(8, Math.round(d * c / s)), f = s / d, w = c / u, b = s / c, S = (d + 1) * (u + 1);
(!a || a.length !== S) && (a = new Float32Array(S));
for (let y = 0; y <= u; y += 1) for (let R = 0; R <= d; R += 1) {
let _ = (R / d * 2 - 1) * b * ce, g = (y / u * 2 - 1) * ce, A = _ + Math.sin(g * 0.8 + m * 0.7) * le, T = g + Math.cos(_ * 0.7 - m * 0.6) * le;
a[y * (d + 1) + R] = po(A, T, m) * ie;
}
n.strokeStyle = r, n.lineWidth = 1, n.globalAlpha = ho, n.beginPath();
let x = (y, R) => {
n.moveTo(y[0], y[1]), n.lineTo(R[0], R[1]);
};
for (let y = 0.5; y < ie; y += 1) for (let R = 0; R < u; R += 1) for (let _ = 0; _ < d; _ += 1) {
let g = a[R * (d + 1) + _], A = a[R * (d + 1) + _ + 1], T = a[(R + 1) * (d + 1) + _ + 1], Y = a[(R + 1) * (d + 1) + _], P = (g > y ? 8 : 0) | (A > y ? 4 : 0) | (T > y ? 2 : 0) | (Y > y ? 1 : 0);
if (P === 0 || P === 15) continue;
let M = _ * f, I = R * w, v = [M + f * ((y - g) / (A - g)), I], k = [M + f, I + w * ((y - A) / (T - A))], O = [M + f * ((y - Y) / (T - Y)), I + w], q = [M, I + w * ((y - g) / (Y - g))];
switch (P) {
case 1:
case 14:
x(q, O);
break;
case 2:
case 13:
x(O, k);
break;
case 3:
case 12:
x(q, k);
break;
case 4:
case 11:
x(v, k);
break;
case 6:
case 9:
x(v, O);
break;
case 7:
case 8:
x(q, v);
break;
case 5:
x(q, v), x(O, k);
break;
case 10:
x(q, O), x(v, k);
break;
}
}
n.stroke(), n.globalAlpha = 1;
}, i = () => {
r = it(t.dataset.contour), s = t.clientWidth, c = t.clientHeight;
let m = Math.min(window.devicePixelRatio || 1, 2);
t.width = Math.round(s * m), t.height = Math.round(c * m), h();
};
if (new ResizeObserver(i).observe(t), i(), e) return;
let l = null;
nt(t, (m) => {
m && !l ? l = z(h, () => 24) : !m && l && (l(), l = null);
});
};
});
var Q, ye, ge, be = dt(() => {
C();
Q = globalThis.__LK_DATA__.circuit, ye = [{ x: 328.9, y: 510.6, d: 278.4 }, { x: 758.4, y: 193.2, d: 811.7 }, { x: 1046.6, y: 338.9, d: 1323.7 }, { x: 973.7, y: 503.3, d: 1867.7 }], ge = 3;
});
var N, Et, ko, lt, Se = dt(() => {
C();
N = { pitchX: 7.8, pitchY: 7.7, originX: 5, originY: 16.64 }, Et = 1.75, ko = globalThis.__LK_DATA__.dots, lt = (() => {
let t = [], e = [], n = [], o = 0;
for (let r of ko.split(";")) {
let [s, c] = r.split(":");
o += Number(s);
let a = 0, h = c.split(",");
for (let i = 0; i < h.length; i += 1) a = i === 0 ? Number(h[i]) : a + Number(h[i]), t.push(N.originX + a * N.pitchX, N.originY + o * N.pitchY), e.push(a), n.push(o);
}
return { points: Float32Array.from(t), columns: Int16Array.from(e), rows: Int16Array.from(n), count: e.length };
})();
});
var B, Ut, Ee, we, Tt, Vt, Po, Oo, Ae, xe, Xt, Bt, jt, rt, Re, _e, Kt, Te, ve, j, Me, Ce = dt(() => {
C();
B = { width: 2560, height: 1440, band: 11.67 }, Ut = globalThis.__LK_DATA__.ribbon, Ee = globalThis.__LK_DATA__.centreline, we = 30, Tt = 4805.57, Vt = { top: 2, width: 1438.43, height: 796 }, Po = B.width / Vt.width, Oo = (B.height - B.band * 2) / Vt.height, Ae = (t, e) => [t / Po, (e - B.band) / Oo + Vt.top], xe = [645.31, 1276.96, 1908.61], Xt = 697.98, Bt = "12.15 8.35", jt = 2.13, rt = { x: 1278.48, y: 699.5, r: 10.63 }, Re = [{ r: 69.85, width: 3.04, ghost: false }, { r: 356.06, width: 2.13, ghost: true }, { r: 442.61, width: 2.13, ghost: true }], _e = [[65.29, 76.96], [2471.93, 76.96], [65.29, 931.81], [2471.93, 931.81], [65.29, 1343.3], [1155.49, 1343.3], [1384.77, 1343.3]], Kt = 16.7, Te = "13.69,0 -6.85,11.86 -6.85,-11.86", ve = [{ x: 1349.96, y: 351.98, angle: 73.5 }, { x: 1862.23, y: 611.24, angle: 30.5 }, { x: 1732.95, y: 903.82, angle: 89.5 }, { x: 585.43, y: 916.65, angle: 17.5 }], j = { x: 822.96, y: 921.57, along: 36, across: 40, angle: 144 }, Me = globalThis.__LK_DATA__.flag;
});
var We = {};
Xe(We, { setupSeason: () => sn });
var qo, $, Do, zt, Le, No, $o, Yo, Wo, Ie, $e, ke, Pe, et, Ye, vt, Fo, Mt, Nt, K, Oe, Go, Ho, Uo, qe, Vo, Xo, Bo, jo, Ko, zo, Zo, De, Jo, Qo, tn, Ne, Ct, Dt, en, on, nn, rn, sn, Fe = dt(() => {
C();
be();
Se();
Ce();
pt();
qt();
qo = "http://www.w3.org/2000/svg", $ = (t, e = {}, n) => {
let o = document.createElementNS(qo, t);
for (let [r, s] of Object.entries(e)) o.setAttribute(r, s);
return n?.appendChild(o), o;
}, Do = 6e3, zt = 5.9, Le = 15, No = 210, $o = 800, Yo = 90, Wo = 9, Ie = Ae(j.x, j.y), $e = 1438.43 / 2560, ke = j.along * $e, Pe = j.across * $e, et = Q.reduce((t, e, n) => {
if (n === 0) return [0];
let o = Q[n - 1];
return t.push(t[n - 1] + Math.hypot(e[0] - o[0], e[1] - o[1])), t;
}, []), Ye = et[et.length - 1], vt = (() => {
let t = Q.length, e = new Array(t).fill(0);
for (let c = 1; c < t - 1; c += 1) {
let [a, h] = Q[c - 1], [i, l] = Q[c], [m, p] = Q[c + 1], d = i - a, u = l - h, f = m - i, w = p - l, b = (Math.hypot(d, u) || 1) * (Math.hypot(f, w) || 1);
e[c] = Math.acos(Math.min(1, Math.max(-1, (d * f + u * w) / b)));
}
let n = 6, o = e.map((c, a) => {
let h = 0, i = 0;
for (let l = Math.max(0, a - n); l <= Math.min(t - 1, a + n); l += 1) h += e[l], i += 1;
return h / i;
}), r = [0];
for (let c = 1; c < t; c += 1) {
let a = et[c] - et[c - 1], h = 1 / (1 + Wo * o[c]);
r.push(r[c - 1] + a / h);
}
let s = r[t - 1] || 1;
return r.map((c) => c / s);
})(), Fo = (t) => {
if (t <= 0) return 0;
if (t >= 1) return Ye;
let e = 0, n = vt.length - 1;
for (; e < n - 1; ) {
let s = e + n >> 1;
vt[s] <= t ? e = s : n = s;
}
let o = vt[n] - vt[e] || 1, r = (t - vt[e]) / o;
return et[e] + (et[n] - et[e]) * r;
}, Mt = (() => {
let t = 1 / 0, e = 1 / 0, n = -1 / 0, o = -1 / 0;
for (let [s, c] of Q) t = Math.min(t, s), n = Math.max(n, s), e = Math.min(e, c), o = Math.max(o, c);
let r = 46;
return { x: t - r, y: e - r, width: n - t + r * 2, height: o - e + r * 2 };
})(), Nt = (t, e, n) => [Math.round(t[0] + (e[0] - t[0]) * n), Math.round(t[1] + (e[1] - t[1]) * n), Math.round(t[2] + (e[2] - t[2]) * n)], K = ([t, e, n], o) => `rgb(${t} ${e} ${n} / ${o})`, Oe = ([t, e, n]) => `rgb(${t} ${e} ${n})`, Go = (t) => {
let e = [];
for (let n = 0; n < Q.length; n += 1) {
if (et[n] <= t) {
e.push(Q[n]);
continue;
}
let o = Q[n - 1], r = Q[n], s = (t - et[n - 1]) / (et[n] - et[n - 1]);
e.push([o[0] + (r[0] - o[0]) * s, o[1] + (r[1] - o[1]) * s]);
break;
}
return e;
}, Ho = (t) => {
let e = $("defs", {}, t), n = $("mask", { id: "season-cut", maskUnits: "userSpaceOnUse", x: -5e3, y: -5e3, width: 12560, height: 11440 }, e);
$("rect", { x: -5e3, y: -5e3, width: 12560, height: 11440, fill: "white" }, n), $("rect", { x: j.x - j.along / 2, y: j.y - j.across / 2, width: j.along, height: j.across, fill: "black", transform: `rotate(${j.angle} ${j.x} ${j.y})` }, n);
let o = $("mask", { id: "season-lap", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 2560, height: 1440 }, e), r = $("path", { d: Ee, fill: "none", stroke: "white", "stroke-width": we, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": `${Tt + 60} ${Tt + 60}`, "stroke-dashoffset": `${60 + Tt}` }, o), s = $("g", { id: "grid" }, t), c = [];
for (let d of xe) c.push($("line", { x1: d, y1: -4e3, x2: d, y2: 5440, style: "stroke:var(--map-grid)", "stroke-width": jt, "stroke-dasharray": Bt }, s));
c.push($("line", { x1: -4e3, y1: Xt, x2: 6560, y2: Xt, style: "stroke:var(--map-grid)", "stroke-width": jt, "stroke-dasharray": Bt }, s));
for (let d of Re) $("circle", { cx: rt.x, cy: rt.y, r: d.r, fill: "none", style: `stroke:var(${d.ghost ? "--map-grid-ghost" : "--map-grid"})`, "stroke-width": d.width }, s);
let a = $("circle", { cx: rt.x, cy: rt.y, r: rt.r, fill: "none", style: "stroke:var(--accent)", "stroke-width": 2.13, opacity: 0 }, s);
for (let [d, u] of _e) $("rect", { x: d, y: u, width: Kt, height: Kt, style: "fill:var(--map-mark)" }, s);
$("circle", { cx: rt.x, cy: rt.y, r: rt.r, style: "fill:var(--map-mark)" }, s);
let h = $("g", { mask: "url(#season-cut)" }, t);
$("path", { d: Ut, style: "fill:var(--foreground-on-dark)" }, h);
let i = $("g", { mask: "url(#season-lap)" }, h);
$("path", { d: Ut, style: "fill:var(--accent)" }, i);
let l = $("g", { id: "markers" }, t);
for (let d of ve) $("polygon", { points: Te, style: "fill:var(--accent)", transform: `translate(${d.x} ${d.y}) rotate(${d.angle})` }, l);
$("path", { d: Me, style: "fill:var(--map-mark)" }, l);
let m = ht(7e3, (d) => {
let u = `${d * 20.5}`;
for (let f of c) f.setAttribute("stroke-dashoffset", u);
}), p = ht(4200, (d) => {
a.setAttribute("r", `${rt.r + d * 86}`), a.setAttribute("opacity", `${0.4 * (1 - d) * (1 - d)}`);
}, yt.outQuad);
return { setLap: (d) => r.setAttribute("stroke-dashoffset", `${60 + d * Tt}`), setRunning: (d) => {
G || (m.setRunning(d), p.setRunning(d));
} };
}, Uo = J("(hover: none) and (pointer: coarse)").matches ? 1 : 2, qe = 0.02, Vo = 0.95, Xo = 420, Bo = 900, jo = 0.38, Ko = 0.09, zo = 0.82, Zo = 54, De = 0.07, Jo = 0.14, Qo = 0.3, tn = 1, Ne = 0.7, Ct = { threshold: 0.34, radius: 170, waveSpeed: 0.16, fade: 0.9, source: "none" }, Dt = (t, e, n, o) => e + (t - e) * Math.exp(-n / Math.max(1e-4, o)), en = (t) => {
if (t >= 1) return 0;
let e = 1 - t;
return e * e;
}, on = () => {
let { columns: t, rows: e, count: n } = lt, o = 1 / 0, r = -1 / 0, s = 1 / 0, c = -1 / 0;
for (let l = 0; l < n; l += 1) t[l] < o && (o = t[l]), t[l] > r && (r = t[l]), e[l] < s && (s = e[l]), e[l] > c && (c = e[l]);
let a = r - o + 1, h = c - s + 1, i = new Int32Array(a * h).fill(-1);
for (let l = 0; l < n; l += 1) i[(e[l] - s) * a + (t[l] - o)] = l;
return { cell: i, w: a, h, minI: o, minJ: s };
}, nn = (t, e) => {
let n = on(), o = new Float32Array(lt.count), r = new Int32Array(lt.count), s = new Uint8Array(lt.count), c = 0, a = true, h = null, i = 0, l = 0, m = false, p = { x: 0, y: 0, heat: 0 }, d = { x: 0, y: 0, on: false }, u = {}, f = () => {
u.dot = bt(it("--map-dot")), u.accent = bt(it("--accent")), u.white = bt(it("--foreground-on-dark")), u.bright = Nt(u.accent, u.white, 0.55);
}, w = () => {
if (!h || !t.width) return;
let g = t.getContext("2d"), A = t.width / B.width;
g.setTransform(A, 0, 0, A, 0, 0), g.clearRect(0, 0, B.width, B.height), g.drawImage(h, 0, 0, B.width, B.height);
let { points: T, columns: Y, rows: P } = lt, { accent: M, bright: I, white: v } = u, k = Et * 2 + 1, O = 1 - Ct.threshold || 1, q = 0;
for (let W = 0; W < c; W += 1) {
let D = r[W];
o[D] < Ct.threshold || (g.clearRect(T[D * 2] - Et - 0.5, T[D * 2 + 1] - Et - 0.5, k, k), q += 1);
}
if (q) for (let W = 0; W < c; W += 1) {
let D = r[W], V = o[D];
if (V < Ct.threshold || Y[D] + P[D] & 1) continue;
let st = Math.min(1, (V - Ct.threshold) / O), at = N.pitchX * (Ne + (tn - Ne) * st);
g.fillStyle = Oe(V > 0.8 ? v : V > 0.5 ? I : Nt(M, I, V)), g.fillRect(T[D * 2] - at / 2, T[D * 2 + 1] - at / 2, at, at);
}
}, b = () => {
let g = t.clientWidth, A = t.clientHeight;
if (!g || !A) return;
f();
let T = Math.min(window.devicePixelRatio || 1, Uo), Y = Math.round(g * T), P = Math.round(A * T);
(t.width !== Y || t.height !== P) && (t.width = Y, t.height = P), h = h || document.createElement("canvas"), h.width = Y, h.height = P;
let M = h.getContext("2d"), I = Y / B.width;
M.setTransform(I, 0, 0, I, 0, 0), M.clearRect(0, 0, B.width, B.height);
let { points: v, count: k } = lt;
M.fillStyle = Oe(u.dot), M.beginPath();
for (let O = 0; O < k; O += 1) {
let q = v[O * 2], W = v[O * 2 + 1];
M.moveTo(q + Et, W), M.arc(q, W, Et, 0, Math.PI * 2);
}
M.fill(), a = true, w();
}, S = (g, A) => {
A <= qe || (A > o[g] && (o[g] = A), s[g] || (s[g] = 1, r[c] = g, c += 1));
}, x = (g, A) => {
if (g.heat <= 0.01) return;
let { cell: T, w: Y, h: P, minI: M, minJ: I } = n, { points: v } = lt, k = Math.floor((g.x - A - N.originX) / N.pitchX), O = Math.ceil((g.x + A - N.originX) / N.pitchX), q = Math.floor((g.y - A - N.originY) / N.pitchY), W = Math.ceil((g.y + A - N.originY) / N.pitchY);
for (let D = Math.max(I, q); D <= Math.min(I + P - 1, W); D += 1) {
let V = (D - I) * Y;
for (let st = Math.max(M, k); st <= Math.min(M + Y - 1, O); st += 1) {
let at = T[V + (st - M)];
if (at < 0) continue;
let Ue = Math.hypot(v[at * 2] - g.x, v[at * 2 + 1] - g.y);
S(at, en(Ue / A) * g.heat);
}
}
}, y = (g) => {
if (g.heat <= 0.01) return;
let { cell: A, w: T, h: Y, minI: P, minJ: M } = n, { points: I } = lt, v = Math.round((g.x - N.originX) / N.pitchX), k = Math.round((g.y - N.originY) / N.pitchY), O = zo * g.heat, q = Xo * l;
if (q > 1 && k >= M && k < M + Y) {
let W = (k - M) * T, D = Math.ceil(q / N.pitchX);
for (let V = Math.max(P, v - D); V <= Math.min(P + T - 1, v + D); V += 1) {
let st = A[W + (V - P)];
st < 0 || S(st, (1 - Math.abs(I[st * 2] - g.x) / q) * O);
}
}
if (q > 1 && v >= P && v < P + T) {
let W = Math.ceil(q / N.pitchY);
for (let D = Math.max(M, k - W); D <= Math.min(M + Y - 1, k + W); D += 1) {
let V = A[(D - M) * T + (v - P)];
V < 0 || S(V, (1 - Math.abs(I[V * 2 + 1] - g.y) / q) * O);
}
}
x(g, Zo);
}, R = () => {
let g = performance.now(), A = i ? Math.min(0.1, (g - i) / 1e3) : 0;
i = g;
let T = d.on && m ? Vo : 0;
if (p.heat <= 1e-3 && T > 0) p.x = d.x, p.y = d.y;
else if (A > 0) {
let I = p.x, v = p.y;
p.x = Dt(I, d.x, A, De), p.y = Dt(v, d.y, A, De);
let k = Math.hypot(p.x - I, p.y - v) / A, O = Math.max(0, 1 - k / Bo);
l = Dt(l, O, A, O > l ? jo : Ko);
}
p.heat = Dt(p.heat, T, A, T > p.heat ? Jo : Qo), p.heat < 5e-3 && (p.heat = 0, l = 0);
let Y = Math.exp(-A / Math.max(0.05, Ct.fade / 3)), P = 0;
for (let I = 0; I < c; I += 1) {
let v = r[I], k = o[v] * Y;
k > qe ? (o[v] = k, r[P] = v, P += 1) : (o[v] = 0, s[v] = 0);
}
let M = c;
c = P, y(p), !(c === 0 && M === 0 && !a) && (a = false, w());
};
!J("(hover: none)").matches && !G && (window.addEventListener("pointermove", (g) => {
if (g.pointerType !== "mouse") return;
let A = t.getBoundingClientRect(), T = e.getBoundingClientRect();
d.x = (g.clientX - A.left) / A.width * B.width, d.y = (g.clientY - A.top) / A.height * B.height, d.on = g.clientX >= T.left && g.clientX <= T.right && g.clientY >= T.top && g.clientY <= T.bottom;
}, { passive: true }), document.addEventListener("pointerleave", () => {
d.on = false;
}), window.addEventListener("blur", () => {
d.on = false;
})), new ResizeObserver(b).observe(t), b();
let _ = { stop: null };
return { arm: () => {
m = true;
}, setRunning(g) {
g && !_.stop ? (i = 0, _.stop = z(R)) : !g && _.stop && (_.stop(), _.stop = null);
} };
}, rn = (t, e, n) => {
let o = t.getContext("2d"), r = J("(hover: none) and (pointer: coarse)").matches, s = 0, c = 1, a = null, h = () => Math.min(window.devicePixelRatio || 1, r ? 1 : 2), i = () => {
let u = h();
t.width = Math.round(1440 * u), t.height = Math.round(800 * u), a = { accent: bt(it("--accent")), white: bt(it("--foreground-on-dark")) }, a.bright = Nt(a.accent, a.white, 0.55), p();
}, l = (u, f, w = 0) => {
o.beginPath(), o.moveTo(u[w][0] * f, u[w][1] * f);
for (let b = w + 1; b < u.length; b += 1) o.lineTo(u[b][0] * f, u[b][1] * f);
o.stroke();
}, m = (u, f, w, b) => {
if (u.length < 2) return;
let S = Math.max(w, zt * f);
o.lineCap = "round", o.lineJoin = "round", b && (o.save(), o.globalCompositeOperation = "lighter", o.strokeStyle = K(a.accent, 0.05), o.lineWidth = Le * f, l(u, f), o.strokeStyle = K(a.accent, 0.1), o.lineWidth = Le * 0.45 * f, l(u, f), o.restore());
let x = Math.max(2, Math.round(No / ge)), y = Math.max(0, u.length - x), R = u[u.length - 1], _ = o.createLinearGradient(u[y][0] * f, u[y][1] * f, R[0] * f, R[1] * f);
_.addColorStop(0, K(a.accent, 0)), _.addColorStop(0.45, K(a.accent, 0.9)), _.addColorStop(1, K(Nt(a.accent, a.bright, c), 1)), o.strokeStyle = _, o.lineWidth = S, l(u, f, y);
let g = Math.max(0, u.length - Math.round(x * 0.42));
if (u.length - g > 1) {
let A = o.createLinearGradient(u[g][0] * f, u[g][1] * f, R[0] * f, R[1] * f);
A.addColorStop(0, K(a.bright, 0)), A.addColorStop(1, K(a.white, 0.95 * c)), o.strokeStyle = A, o.lineWidth = Math.max(w * 0.6, S * 0.38), l(u, f, g);
}
}, p = () => {
if (!a) return;
let u = Fo(s);
e.setLap(1 - u / Ye);
let f = Go(u), w = h();
if (o.setTransform(w, 0, 0, w, 0, 0), o.clearRect(0, 0, 1440, 800), f.length > 1) {
m(f, 1, 0.6, true);
let [b, S] = f[f.length - 1];
o.save(), o.globalCompositeOperation = "lighter";
let x = o.createRadialGradient(b, S, 0, b, S, zt * 2.6);
x.addColorStop(0, K(a.white, 0.85 * c)), x.addColorStop(0.35, K(a.bright, 0.4 * c)), x.addColorStop(1, K(a.accent, 0)), o.fillStyle = x, o.beginPath(), o.arc(b, S, zt * 2.6, 0, Math.PI * 2), o.fill(), o.restore();
}
o.save(), o.translate(Ie[0], Ie[1]), o.rotate(j.angle * Math.PI / 180), o.clearRect(-ke / 2, -Pe / 2, ke, Pe), o.restore();
for (let b of ye) {
if (u < b.d) continue;
let S = Math.min(1, (u - b.d) / Yo), x = 12 + (1 - S) * 14, y = o.createRadialGradient(b.x, b.y, 0, b.x, b.y, x);
y.addColorStop(0, K(a.bright, 0.5 + 0.45 * (1 - S))), y.addColorStop(0.45, K(a.accent, 0.32)), y.addColorStop(1, K(a.accent, 0)), o.save(), o.globalCompositeOperation = "lighter", o.fillStyle = y, o.beginPath(), o.arc(b.x, b.y, x, 0, Math.PI * 2), o.fill(), o.restore(), S < 1 && (o.strokeStyle = K(a.bright, (1 - S) * 0.6), o.lineWidth = 1, o.beginPath(), o.arc(b.x, b.y, 9 + S * 20, 0, Math.PI * 2), o.stroke());
}
};
i();
let d = false;
return { resize: i, start() {
if (d) return;
d = true;
let u = new F(0, (f) => {
s = f, p();
});
u.onRest = () => {
let f = new F(1, (w) => {
c = w, p();
});
f.onRest = n, f.to(0, { duration: $o, easing: yt.outCubic });
}, u.to(1, { duration: Do, easing: yt.inOutSine });
} };
}, sn = () => {
let t = document.querySelector("[data-season]"), e = t.querySelector("[data-season-frame]"), n = t.querySelector("[data-season-stage]"), o = () => {
let b = e.clientWidth, S = e.clientHeight;
if (window.innerWidth >= 1024) {
let x = Math.max(b / 1440, S / 800);
n.style.transform = `translate(${(b - 1440 * x) / 2}px, ${(S - 800 * x) / 2}px) scale(${x})`;
} else {
let x = b / Mt.width, y = Mt.x + Mt.width / 2, R = Mt.y + Mt.height / 2;
n.style.transform = `translate(${b / 2 - y * x}px, ${S / 2 - R * x}px) scale(${x})`;
}
};
new ResizeObserver(o).observe(e), o();
let r = Ho(t.querySelector("[data-season-svg]")), s = nn(t.querySelector("[data-season-dots]"), t), c = rn(t.querySelector("[data-season-trace]"), r, () => s.arm());
nt(e, (b) => {
r.setRunning(b), s.setRunning(b);
});
let a = new IntersectionObserver((b) => {
b.some((S) => S.isIntersecting) && (a.disconnect(), c.start());
}, { threshold: 0.35 });
a.observe(e), St(t.querySelector("[data-dissolve]"));
let h = t.querySelector("[data-heading]"), i = t.querySelector("[data-season-rule]"), l = L(i, (b, S) => {
b.style.opacity = `${S}`, b.style.transform = `scaleX(${S})`;
}, E.REVEAL), m = U(t.querySelector("[data-season-intro]"), { by: "word", stagger: 34, config: E.COPY_WORDS, gap: "0.22em", delay: 2 * 130 + 90 });
tt(h, [...mt(h), { play: () => l.play(2 * 130), reverse: () => l.reverse() }, m]);
let p = t.querySelector("[data-season-plate]"), d = L(p, H("0.75rem"), E.REVEAL), u = [{ play: () => d.play(260), reverse: () => d.reverse() }];
t.querySelectorAll("[data-plate-type]").forEach((b, S) => {
u.push(U(b, { by: "letter", stagger: 22, config: E.TYPE, gap: "0", delay: 430 + S * 60 }));
}), t.querySelectorAll(".splate-row").forEach((b, S) => {
u.push(U(b.querySelector("[data-plate-fig]"), { by: "letter", stagger: 22, config: E.TYPE, gap: "0", delay: 430 + S * 110 })), u.push(U(b.querySelector("[data-plate-word]"), { by: "letter", stagger: 22, config: E.TYPE, delay: 430 + S * 110 + 70 }));
}), tt(p, u);
let f = t.querySelector("[data-globe-meridian]"), w = ht(1e4, (b) => {
f.setAttribute("rx", `${Math.max(0.5, Math.abs(Math.cos(b * Math.PI * 2)) * 18)}`);
});
G || nt(p, (b) => w.setRunning(b)), window.addEventListener("resize", () => c.resize());
};
});
C();
pt();
var an = globalThis.__LK_LIBS__.Lenis;
C();
var Qt = "/uploads", Ze = Qt === "@relative" ? new URL("../assets", import.meta.url).href.replace(/\/$/, "") : Qt;
var te = typeof X < "u" ? X : null, xt = (t) => te && te[t] || `${Ze}/${t}`, ee = true, oe = (t) => new Promise((e, n) => {
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
}), gt = null, $t = (t) => {
if (console.error("Asset failed to load:", t), typeof document > "u") return;
gt || (gt = document.createElement("div"), gt.setAttribute("role", "alert"), gt.className = "asset-banner", document.body.appendChild(gt));
let e = document.createElement("div");
e.textContent = `Failed to load: ${t}`, gt.appendChild(e);
}, ne = () => {
for (let t of document.querySelectorAll("img")) {
let e = () => $t(t.currentSrc || t.src);
t.complete && t.naturalWidth === 0 && t.src ? e() : t.addEventListener("error", e, { once: true });
}
};
C();
C();
C();
var re = (t) => 2 * t * Math.tan(35 * Math.PI / 360), Yt = (t, e, n) => {
if (n <= 0 || e.height <= 0) return { subjectScale: t.subjectScale, subjectY: t.subjectY };
let o = e.height / n, r = re(t.cameraZ), s = n / 2 - (e.top + e.height / 2);
return { subjectScale: t.subjectScale * o, subjectY: 0.1 + (t.subjectY - 0.1) * o + s * r / n };
}, Pt = { cameraZ: 6.5, subjectScale: 1.15, subjectX: 0, subjectY: 0.42, subjectParallax: 0.02, riseDistance: 200, riseDuration: 2, headScale: 0.8, headY: 0.58, headParallax: 5e-3, headRelight: 0.32, helmetScale: 0.69, helmetX: -0.08, helmetY: 0.45, helmetZ: 0, helmetFollow: 0.01, helmetAmpX: 2.5, helmetCurveX: 0, helmetAmpY: 2.1, helmetCurveY: 0, helmetBrightness: 1, trailRadius: 0.46, trailIdleScale: 0.28, trailTaper: 1.9, trailTaperIdle: 1.6, trailTaperFast: 1.25, trailLength: 0.64, revealThreshold: 0.08, revealEdge: 5e-3, revealWarp: 1.29, revealWarpScale: 2.9, revealSpeed: 1.25, pointerLerp: 0.17, pacePeak: 0.029, paceAttack: 0.09, paceRelease: 0.205, paceThreshold: 0.06, paceRamp: 0.15, outlinePeriod: 3.1, sweepWarp: 0.86, sweepLength: 0.67, sweepRadius: 0.33, outlineStagger: 1.2, outlineOpacity: 0.09, outlineWidth: 0.15, outlineBase: 0, outlineLightness: 0.64, bgLineScale: 3.8, bgLineCount: 2.5, bgLineThickness: 1.4, bgLineOpacity: 0.85, bgWaveAmount: 0.37, bgWaveSpeed: 1.66, bgRevealLightness: 0.62, bgRevealLightnessAlt: 0.44, bgRevealOpacity: 1, introDuration: 4, burnStart: 0.14, burnSoftness: 0.02, burnGlow: 4, autoSweepAmount: 0, autoSweepPeriod: 5, autoSweepStroke: 0.45, autoSweepHold: 0 };
var Ot = class {
constructor(e) {
return new globalThis.__LK_LIBS__.HeroScene(e);
}
};
pt();
var Je = 430, Qe = 240, to = 3e3, eo = 1.15, oo = (t) => {
let e = H("1.25rem"), n = [...t.querySelectorAll("[data-hero-rise]")].map((a) => ({ ctl: L(a, e, E.REVEAL), delay: Number(a.dataset.heroRise) })), o = L(t.querySelector("[data-id-tag]"), ot, E.REVEAL), r = U(t.querySelector("[data-id-name]"), { by: "word", stagger: 110, config: E.REVEAL }), s = [...t.querySelectorAll("[data-id-row]")].map((a) => L(a, H("0.75rem"), E.REVEAL)), c = [...t.querySelectorAll("[data-hero-figure]")].map((a, h) => ({ ctl: U(a, { by: "letter", stagger: 26, config: E.FIGURE, gap: "0" }), delay: 900 + h * 90 }));
return () => {
for (let { ctl: a, delay: h } of n) a.play(h);
o.play(180), r.play(180), s.forEach((a, h) => a.play(440 + h * 130));
for (let { ctl: a, delay: h } of c) a.play(h);
};
}, no = (t, e) => {
let n = t.querySelector("[data-veil]"), o = n.querySelector("[data-veil-content]"), r = n.querySelector("[data-veil-fill]"), s = n.querySelector("[data-veil-bar]"), c = n.querySelector("[data-veil-meter]"), a = n.querySelector("[data-veil-name]"), h = new F(0, (m) => {
r.style.transform = `scaleY(${m})`, s.style.transform = `scaleX(${m})`;
});
h.to(0.7, E.PROGRESS_WAIT), L(a, H("0.6rem"), E.LABEL).play(260);
let i = false;
return { ready: () => {
if (i) return;
i = true, h.to(1, E.PROGRESS_READY), n.style.pointerEvents = "none", n.setAttribute("aria-label", "Loaded"), new F(1, (p) => {
o.style.opacity = `${p}`, o.style.transform = `translateY(calc(-0.75rem * ${1 - p}))`, c.style.opacity = `${p}`;
}).to(0, E.CLEAR), setTimeout(() => {
new F(1, (f) => {
n.style.opacity = `${f}`;
}).to(0, E.VEIL), e();
let d = performance.now(), u = z(() => {
(Number(getComputedStyle(n).opacity) <= 4e-3 || performance.now() - d > to) && (u(), n.remove());
});
}, Je + Qe);
} };
}, ro = () => {
try {
let t = document.createElement("canvas");
return !!(t.getContext("webgl2") || t.getContext("webgl"));
} catch {
return false;
}
}, Wt = (t) => {
let e = t.querySelector("[data-hero-canvas]");
e.innerHTML = "";
let n = document.createElement("div");
n.className = "hero-fallback", n.style.backgroundImage = `url('${xt("hero/ui/backdrop-lines.svg")}')`, e.appendChild(n);
let o = t.querySelector("[data-hero-box]"), r = o && o.offsetParent !== null ? o : n, s = document.createElement("img");
s.src = xt("hero/scene/person-diffuse.webp"), s.alt = "Kimi Antonelli", r.appendChild(s);
}, so = (t, e) => {
if (!ro()) return Wt(t), e.ready(), { beginRise() {
} };
let n = t.querySelector("[data-hero-canvas]"), o = n.querySelector("canvas"), r = t.querySelector("[data-hero-box]"), s;
try {
s = new Ot(o);
} catch (S) {
return console.error(S), Wt(t), e.ready(), { beginRise() {
} };
}
s.onReady = () => e.ready(), s.onError = () => {
Wt(t), e.ready();
};
let c = () => {
let S = t.getBoundingClientRect(), x = r.offsetParent !== null ? (() => {
let y = r.getBoundingClientRect();
return Yt(Pt, { top: y.top - S.top, height: y.height }, n.clientHeight);
})() : null;
s.setParams({ ...Pt, ...x, ...J("(max-width: 1023px)").matches ? { bgRevealOpacity: 0 } : null, ...J("(hover: none)").matches ? { autoSweepAmount: 0.76 } : null, ...J("(max-width: 639px)").matches ? { sweepRadius: 0.95, sweepWarp: 0.18, autoSweepAmount: 0.55 } : null, ...s.tier.reveal ? null : { autoSweepAmount: 0 } });
}, a = (S) => s.setPointer(S.clientX / innerWidth * 2 - 1, S.clientY / innerHeight * 2 - 1), h = false, i = () => {
let S = s.tier.pointerEnabled;
S && !h && window.addEventListener("pointermove", a, { passive: true }), !S && h && window.removeEventListener("pointermove", a), h = S;
};
i();
let l = J("(hover: none) and (pointer: coarse)"), m = 0, p = 0, d = l.matches, u = 0, f = () => {
u = 0;
let S = n.clientWidth, x = n.clientHeight, y = l.matches, R = S !== m, _ = y !== d;
!R && !_ && y || !R && !_ && x === p || ((R || _) && (s.retune(), i()), m = S, p = x, d = y, s.resize(S, x), c());
}, w = () => {
u || (u = requestAnimationFrame(f));
};
new ResizeObserver(w).observe(n), l.addEventListener?.("change", w), s.resize(n.clientWidth || innerWidth, n.clientHeight || innerHeight), m = n.clientWidth, p = n.clientHeight, c();
let b = true;
return nt(t, (S) => {
b = S;
}), z((S) => {
!b || document.hidden || window.scrollY > window.innerHeight * eo || s.update(S);
}, () => s.tier.frameInterval), { beginRise: () => s.beginRise() };
}, ao = (t, e) => {
let n = t.querySelector("[data-burger]"), o = t.querySelector(".mast-logo img"), r = null, s = null, c = () => {
if (!r) return;
let i = r;
r = null, document.documentElement.classList.remove("menu-open"), e?.start(), n.setAttribute("aria-expanded", "false");
let l = new F(1, (m) => {
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
<nav class="sheet-nav" aria-label="Menu"><ul>${i.map(([m, p]) => `<li data-sheet-item><a class="sheet-link hov" href="${p}">${m}</a></li>`).join("")}</ul></nav>`, document.body.appendChild(r), new F(0, (m) => {
r && (r.style.opacity = `${m}`);
}).to(1, E.SHEET), [...r.querySelectorAll("[data-sheet-item]")].forEach((m, p) => L(m, H("0.75rem"), E.ITEM).play(120 + p * 55)), r.querySelector("[data-sheet-logo]").addEventListener("click", c), r.querySelector("[data-sheet-close]").addEventListener("click", c), e?.stop(), document.documentElement.classList.add("menu-open"), n.setAttribute("aria-expanded", "true"), r.querySelector("[data-sheet-close]").focus(), document.addEventListener("keydown", a);
};
n.addEventListener("click", h), J("(min-width: 1280px)").addEventListener?.("change", (i) => i.matches && c());
}, se = (t) => {
let e = document.querySelector("[data-hero]"), n = oo(e), o = null, r = no(e, () => {
n(), o?.beginRise();
});
o = so(e, r), ao(e, t);
};
C();
pt();
qt();
var mo = 50, fo = 9, yo = 20, Ht = 98, go = 4, bo = 0.4, So = 2200, ue = "http://www.w3.org/2000/svg", Eo = (t, e, n, o, r = "top bottom", s = "bottom top") => {
ct(t, r, s, (c) => {
e.style.top = `${(n + (o - n) * c).toFixed(4)}cqw`;
});
}, wo = (t, e) => {
let n = t.querySelector("[data-rail]"), o = document.createElementNS(ue, "svg");
o.setAttribute("preserveAspectRatio", "none"), n.appendChild(o);
let r = (p, d) => {
let u = document.createElementNS(ue, p);
for (let [f, w] of Object.entries(d)) u.setAttribute(f, w);
return o.appendChild(u), u;
}, s = r("line", { x1: 8, x2: 8, y1: 0, y2: Ht, style: "stroke:var(--timeline-rail)", "stroke-width": 1, "vector-effect": "non-scaling-stroke" }), c = r("line", { x1: 8, x2: 8, y1: Ht + go, y2: 0, style: "stroke:var(--timeline-rail)", "stroke-width": 1, "stroke-dasharray": "6 6" }), a = r("rect", { x: 7.5, y: 0, width: 1, height: 0, style: "fill:var(--foreground-on-dark)" }), h = r("rect", { x: -4.5, y: -4.5, width: 9, height: 9, style: "fill:var(--foreground-on-dark)" }), i = 0, l = () => {
let p = n.getBoundingClientRect(), d = p.width / 16 || 1, u = p.height / d;
o.setAttribute("viewBox", `0 0 16 ${u}`);
let f = e[e.length - 1];
i = Math.max(0, (f.offsetTop + f.offsetHeight / 2 - n.offsetTop) / d - mo), c.setAttribute("y2", `${i}`), s.setAttribute("y2", `${Math.min(Ht, i)}`);
let w = window.innerWidth < 1024 ? yo : fo;
h.setAttribute("x", `${-w / 2}`), h.setAttribute("y", `${-w / 2}`), h.setAttribute("width", `${w}`), h.setAttribute("height", `${w}`);
}, m = (p) => {
let d = p * i;
a.setAttribute("height", `${Math.max(0, d)}`), h.setAttribute("transform", `translate(8 ${d}) rotate(${i ? d / i * 1800 : 0})`);
};
new ResizeObserver(l).observe(n), l(), ct(n, "top center", "bottom bottom", (p, d) => m(d), { smooth: true });
}, he = () => {
let t = document.querySelector("[data-timeline]"), e = t.querySelector("[data-tl-wrap]"), n = [...t.querySelectorAll("[data-tl-row]")];
St(t.querySelector("[data-dissolve]"));
let o = t.querySelector("[data-heading]");
tt(o, mt(o)), wo(t, n);
let r = J("(hover: hover)").matches && !G;
return n.forEach((s) => {
let c = s.dataset.frame === "centre";
for (let f of s.querySelectorAll("[data-para]")) {
let w = Number(f.dataset.para);
Eo(s, f, w / 1440 * 100, -w / 1440 * 100);
}
let a = s.querySelector("[data-plate-slot]");
ct(s, "top bottom", "top center", (f) => {
a.style.top = `${-10 + 10 * f}%`;
});
let h = s.querySelector("[data-tl-year]"), i = s.querySelector(".tl-year"), l = U(h, { by: "letter", stagger: 26, config: E.YEAR, gap: "0" }), m = new F(1, (f) => {
i.style.opacity = `${f}`;
}), p = s.querySelector("[data-tl-copy]"), d = p ? L(p, H("0.75rem"), E.COPY) : null, u = 0;
if (It(s, () => {
d?.play(220);
}, "0% 0% -25% 0%"), tt(s, [{ play() {
l.play(), m.to(1, E.YEAR_SETTLE), c && (clearTimeout(u), u = setTimeout(() => m.to(bo, E.YEAR_SETTLE), So));
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
}), { px: kt };
};
C();
pt();
qt();
var Rt = 560, _t = 90, Ao = 3200, xo = 3.4, Ro = 5200, _o = 5, To = 320, pe = 460, vo = 90, Mo = 260, Co = 80, Lo = 48, Io = 60, Z = (t, e) => ({ play: () => t.play(e), reverse: () => t.reverse() }), me = () => {
let t = document.querySelector("[data-paddock]");
Gt(t.querySelector("[data-contour]"), G), St(t.querySelector("[data-dissolve]"));
let e = t.querySelector("[data-para-paddock]");
ct(t, "top bottom", "bottom top", (y) => {
e.style.top = `${(-(Lo / 1440) * 100 * y).toFixed(4)}cqw`;
});
let n = t.querySelector("[data-heading]"), o = U(t.querySelector("[data-paddock-report]"), { by: "word", stagger: 30, config: E.COPY_WORDS, gap: "0.22em", delay: 2 * 130 + 90 }), r = L(t.querySelector("[data-paddock-cta]"), H("0.75rem"), E.REVEAL);
tt(n, mt(n)), tt(t.querySelector("[data-paddock-intro]"), [o, Z(r, 2 * 130 + 260)]);
let s = t.querySelector("[data-paddock-panels]"), c = [], a = s.querySelector(".p-bracket-meet");
c.push(Z(L(a, ot, E.REVEAL), To)), c.push(Z(L(s.querySelector(".p-meet"), H("0.75rem"), E.REVEAL), 410)), c.push(Z(L(s.querySelector(".p-bracket-stats"), ot, E.REVEAL), pe));
let h = [...s.querySelectorAll("[data-p-rule]")];
[...s.querySelectorAll("[data-p-stat]")].forEach((y, R) => {
let _ = pe + R * vo;
R > 0 && c.push(Z(L(h[R - 1], (A, T) => {
A.style.transform = `scaleX(${T})`;
}, E.ROW), _)), c.push(Z(L(y, H("0.75rem"), E.ROW), _ + 40));
let g = U(y.querySelector("[data-p-fig]"), { by: "letter", stagger: 24, config: E.FIGURE, gap: "0", delay: _ + 120 });
c.push(g);
}), tt(s.querySelector(".p-meet"), c);
let i = t.querySelector("[data-cal]"), l = [...i.querySelectorAll("[data-cal-link]")], m = [...i.querySelectorAll("[data-cal-card]")], p = [...i.querySelectorAll("[data-cal-mark]")], d = i.querySelector("[data-cal-bracket]"), u = [];
l.forEach((y, R) => u.push(Z(L(y, (_, g) => {
_.style.transform = `scaleX(${g})`;
}, E.ROW), Rt + R * _t))), m.forEach((y, R) => {
u.push(Z(L(y, H("0.5rem"), E.ROW), Rt + R * _t)), u.push(Z(L(y.querySelector("[data-cal-name]"), H("0.3em"), E.NAME), Rt + R * _t + 110));
}), p.forEach((y, R) => u.push(Z(L(y, ot, E.ROW), Rt + R * _t + 60))), u.push(Z(L(d, ot, E.ROW), Rt + 5 * _t)), It(i, () => u.forEach((y) => y.play()), "0% 0% -20% 0%");
let f = 11.45 / 1440 * 100, w = ht(Ro, (y) => {
for (let R of l) R.style.backgroundPositionX = `calc(${(y * f * Number(R.dataset.dir)).toFixed(4)}cqw * var(--cal-spread, 1))`;
}), b = i.querySelector("[data-cal-pulse]"), S = ht(Ao, (y) => {
b.setAttribute("r", `${5.5 + y * 5.5 * xo}`), b.setAttribute("opacity", `${0.5 * (1 - y) * (1 - y)}`);
}, yt.outQuad);
G || nt(i, (y) => {
w.setRunning(y), S.setRunning(y);
});
let x = i.querySelector("[data-cal-live-card]");
x.addEventListener("mouseenter", () => i.style.setProperty("--bracket-spread", kt(_o))), x.addEventListener("mouseleave", () => i.style.removeProperty("--bracket-spread"));
}, fe = () => {
let t = document.querySelector("[data-foot]");
Gt(t.querySelector("[data-contour]"), G);
let e = t.querySelector("[data-para-foot]");
ct(t, "top bottom", "bottom bottom", (r) => {
e.style.top = `${(Io / 1440 * 100 * (1 - r)).toFixed(4)}cqw`;
});
let n = t.querySelector("[data-heading]"), o = [Z(L(t.querySelector("[data-foot-logo]"), ot, E.REVEAL), 120), ...mt(n)];
t.querySelectorAll("[data-foot-link]").forEach((r, s) => {
o.push(U(r, { by: "letter", stagger: 22, config: E.ROW, gap: "0.2em", delay: Mo + s * Co }));
}), t.querySelectorAll("[data-foot-rise]").forEach((r) => {
o.push(Z(L(r, H("0.75rem"), E.REVEAL), Number(r.dataset.footRise)));
}), tt(t, o, "0% 0% -20% 0%");
};
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
var He = () => {
document.documentElement.style.fontSize = window.innerWidth > 1920 ? `${16 * window.innerWidth / 1920}px` : "";
};
He();
window.addEventListener("resize", He);
var Zt = null;
G || (Zt = new an({ smoothWheel: true }), z((t) => Zt.raf(t), () => 0));
var cn = () => {
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
}, ln = async () => {
if (ee) {
let e = xt("season/data.json.png");
try {
globalThis.__LK_DATA__ = JSON.parse(new TextDecoder().decode(await oe(e)));
} catch {
$t(e);
return;
}
}
let { setupSeason: t } = await Promise.resolve().then(() => (Fe(), We));
t();
}, Ge = () => {
ne(), cn(), se(Zt), ln(), he(), me(), fe();
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ge, { once: true }) : Ge();
}
