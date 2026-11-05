import { CONFIG, Spring, reveal, rise, splitText, scrub, onceInView, forwardInView, px, mq, reducedMotion } from "./engine.js";
import { headingControllers, setupDissolve } from "./common.js";

const MARK_RISE = 50;
const MARK_SIZE = 9;
const MARK_SIZE_NARROW = 20;
const RAIL_SOLID = 98;
const RAIL_GAP = 4;
const YEAR_RESTING = 0.4;
const YEAR_HOLD = 2200;
const SVGNS = "http://www.w3.org/2000/svg";

/** A layer whose content moves on `top` from +travel to −travel over the crossing. */
export const parallaxTop = (trigger, node, from, to, start = "top bottom", end = "bottom top") => {
  scrub(trigger, start, end, (p) => {
    node.style.top = `${(from + (to - from) * p).toFixed(4)}cqw`;
  });
};

const setupRail = (section, rows) => {
  const rail = section.querySelector("[data-rail]");

  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("preserveAspectRatio", "none");
  rail.appendChild(svg);
  const mk = (tag, attrs) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.appendChild(n);
    return n;
  };
  const solid = mk("line", { x1: 8, x2: 8, y1: 0, y2: RAIL_SOLID, style: "stroke:var(--timeline-rail)", "stroke-width": 1, "vector-effect": "non-scaling-stroke" });
  const dashed = mk("line", { x1: 8, x2: 8, y1: RAIL_SOLID + RAIL_GAP, y2: 0, style: "stroke:var(--timeline-rail)", "stroke-width": 1, "stroke-dasharray": "6 6" });
  const progress = mk("rect", { x: 7.5, y: 0, width: 1, height: 0, style: "fill:var(--foreground-on-dark)" });
  const marker = mk("rect", { x: -4.5, y: -4.5, width: 9, height: 9, style: "fill:var(--foreground-on-dark)" });

  // 16 viewBox units across the rail, so a unit is one design pixel. The
  // thread rests on the last entry: its middle less MARK_RISE.
  let rest = 0;
  const layout = () => {
    const box = rail.getBoundingClientRect();
    const unit = box.width / 16 || 1;
    const viewH = box.height / unit;
    svg.setAttribute("viewBox", `0 0 16 ${viewH}`);
    const last = rows[rows.length - 1];
    rest = Math.max(0, (last.offsetTop + last.offsetHeight / 2 - rail.offsetTop) / unit - MARK_RISE);
    dashed.setAttribute("y2", `${rest}`);
    solid.setAttribute("y2", `${Math.min(RAIL_SOLID, rest)}`);
    const size = window.innerWidth < 1024 ? MARK_SIZE_NARROW : MARK_SIZE;
    marker.setAttribute("x", `${-size / 2}`);
    marker.setAttribute("y", `${-size / 2}`);
    marker.setAttribute("width", `${size}`);
    marker.setAttribute("height", `${size}`);
  };
  const draw = (p) => {
    const run = p * rest;
    progress.setAttribute("height", `${Math.max(0, run)}`);
    marker.setAttribute("transform", `translate(8 ${run}) rotate(${rest ? (run / rest) * 1800 : 0})`);
  };
  new ResizeObserver(layout).observe(rail);
  layout();
  scrub(rail, "top center", "bottom bottom", (_raw, smoothed) => draw(smoothed), { smooth: true });
};

export const setupTimeline = () => {
  const section = document.querySelector("[data-timeline]");
  const wrap = section.querySelector("[data-tl-wrap]");
  const rows = [...section.querySelectorAll("[data-tl-row]")];
  setupDissolve(section.querySelector("[data-dissolve]"));

  const h2 = section.querySelector("[data-heading]");
  forwardInView(h2, headingControllers(h2));

  setupRail(section, rows);

  const hover = mq("(hover: hover)").matches && !reducedMotion;
  rows.forEach((row) => {
    const centre = row.dataset.frame === "centre";
    // Parallax layers on `top`: plate, its year, the copy.
    for (const node of row.querySelectorAll("[data-para]")) {
      const travel = Number(node.dataset.para);
      parallaxTop(row, node, (travel / 1440) * 100, (-travel / 1440) * 100);
    }
    const slot = row.querySelector("[data-plate-slot]");
    scrub(row, "top bottom", "top center", (p) => {
      slot.style.top = `${-10 + 10 * p}%`;
    });

    // The year: letter by letter, then (centre rows) settle to 0.4.
    const yearEl = row.querySelector("[data-tl-year]");
    const yearBox = row.querySelector(".tl-year");
    const year = splitText(yearEl, { by: "letter", stagger: 26, config: CONFIG.YEAR, gap: "0" });
    const settle = new Spring(1, (v) => { yearBox.style.opacity = `${v}`; });
    const copyEl = row.querySelector("[data-tl-copy]");
    const copy = copyEl ? reveal(copyEl, rise("0.75rem"), CONFIG.COPY) : null;
    let settleTimer = 0;
    onceInView(row, () => {
      copy?.play(220);
    }, "0% 0% -25% 0%");
    forwardInView(row, [{
      play() {
        year.play();
        settle.to(1, CONFIG.YEAR_SETTLE);
        if (centre) {
          clearTimeout(settleTimer);
          settleTimer = setTimeout(() => settle.to(YEAR_RESTING, CONFIG.YEAR_SETTLE), YEAR_HOLD);
        }
      },
      reverse() {
        clearTimeout(settleTimer);
        year.reverse();
      },
    }], "0% 0% -25% 0%");

    if (hover) {
      const plate = row.querySelector(".plate");
      plate.addEventListener("mouseenter", () => {
        row.classList.add("hot");
        wrap.classList.add("dim");
      });
      plate.addEventListener("mouseleave", () => {
        row.classList.remove("hot");
        wrap.classList.remove("dim");
      });
    }
  });
  return { px };
};
