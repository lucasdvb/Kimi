import { CONFIG, reveal, rise, fade, splitText, scrub, onceInView, forwardInView, loopInView, loopTween, ease, px, reducedMotion } from "./engine.js";
import { headingControllers, setupDissolve, setupContour } from "./common.js";

const CARD_DELAY = 560;
const CARD_STAGGER = 90;
const PULSE_MS = 3200;
const PULSE_REACH = 3.4;
const CRAWL_MS = 5200;
const BRACKET_SPREAD = 5;
const MEET_DELAY = 320;
const STATS_DELAY = 460;
const ROW_STAGGER = 90;
const NAV_DELAY = 260;
const NAV_STAGGER = 80;
const PARALLAX_PORTRAIT = 48;
const PARALLAX_FIGURE = 60;

const ctl = (r, delay) => ({ play: () => r.play(delay), reverse: () => r.reverse() });

export const setupPaddock = () => {
  const section = document.querySelector("[data-paddock]");
  setupContour(section.querySelector("[data-contour]"), reducedMotion);
  setupDissolve(section.querySelector("[data-dissolve]"));

  // The portrait drifts up only, 48 design px over the crossing.
  const fig = section.querySelector("[data-para-paddock]");
  scrub(section, "top bottom", "bottom top", (p) => {
    fig.style.top = `${(-(PARALLAX_PORTRAIT / 1440) * 100 * p).toFixed(4)}cqw`;
  });

  // Masthead, report, button.
  const h2 = section.querySelector("[data-heading]");
  const report = splitText(section.querySelector("[data-paddock-report]"), { by: "word", stagger: 30, config: CONFIG.COPY_WORDS, gap: "0.22em", delay: 2 * 130 + 90 });
  const cta = reveal(section.querySelector("[data-paddock-cta]"), rise("0.75rem"), CONFIG.REVEAL);
  forwardInView(h2, headingControllers(h2));
  forwardInView(section.querySelector("[data-paddock-intro]"), [report, ctl(cta, 2 * 130 + 260)]);

  // The two panels.
  const panels = section.querySelector("[data-paddock-panels]");
  const pctl = [];
  const meetBrackets = panels.querySelector(".p-bracket-meet");
  pctl.push(ctl(reveal(meetBrackets, fade, CONFIG.REVEAL), MEET_DELAY));
  pctl.push(ctl(reveal(panels.querySelector(".p-meet"), rise("0.75rem"), CONFIG.REVEAL), 410));
  pctl.push(ctl(reveal(panels.querySelector(".p-bracket-stats"), fade, CONFIG.REVEAL), STATS_DELAY));
  const rules = [...panels.querySelectorAll("[data-p-rule]")];
  [...panels.querySelectorAll("[data-p-stat]")].forEach((row, i) => {
    const ruleAt = STATS_DELAY + i * ROW_STAGGER;
    if (i > 0) {
      pctl.push(ctl(reveal(rules[i - 1], (n, p) => { n.style.transform = `scaleX(${p})`; }, CONFIG.ROW), ruleAt));
    }
    pctl.push(ctl(reveal(row, rise("0.75rem"), CONFIG.ROW), ruleAt + 40));
    const figure = splitText(row.querySelector("[data-p-fig]"), { by: "letter", stagger: 24, config: CONFIG.FIGURE, gap: "0", delay: ruleAt + 120 });
    pctl.push(figure);
  });
  forwardInView(panels.querySelector(".p-meet"), pctl);

  // The calendar strip.
  const cal = section.querySelector("[data-cal]");
  const links = [...cal.querySelectorAll("[data-cal-link]")];
  const cards = [...cal.querySelectorAll("[data-cal-card]")];
  const marks = [...cal.querySelectorAll("[data-cal-mark]")];
  const live = cal.querySelector("[data-cal-bracket]");
  const cctl = [];
  links.forEach((link, i) => cctl.push(ctl(reveal(link, (n, p) => { n.style.transform = `scaleX(${p})`; }, CONFIG.ROW), CARD_DELAY + i * CARD_STAGGER)));
  cards.forEach((card, i) => {
    cctl.push(ctl(reveal(card, rise("0.5rem"), CONFIG.ROW), CARD_DELAY + i * CARD_STAGGER));
    cctl.push(ctl(reveal(card.querySelector("[data-cal-name]"), rise("0.3em"), CONFIG.NAME), CARD_DELAY + i * CARD_STAGGER + 110));
  });
  marks.forEach((mark, i) => cctl.push(ctl(reveal(mark, fade, CONFIG.ROW), CARD_DELAY + i * CARD_STAGGER + 60)));
  cctl.push(ctl(reveal(live, fade, CONFIG.ROW), CARD_DELAY + 5 * CARD_STAGGER));
  onceInView(cal, () => cctl.forEach((c) => c.play()), "0% 0% -20% 0%");

  // Connectors crawl toward the live round; the live marker pulses.
  const period = (11.45 / 1440) * 100;
  const crawl = loopTween(CRAWL_MS, (v) => {
    for (const link of links) {
      link.style.backgroundPositionX = `calc(${(v * period * Number(link.dataset.dir)).toFixed(4)}cqw * var(--cal-spread, 1))`;
    }
  });
  const pulseRing = cal.querySelector("[data-cal-pulse]");
  const pulse = loopTween(PULSE_MS, (v) => {
    pulseRing.setAttribute("r", `${5.5 + v * 5.5 * PULSE_REACH}`);
    pulseRing.setAttribute("opacity", `${0.5 * (1 - v) * (1 - v)}`);
  }, ease.outQuad);
  if (!reducedMotion) {
    loopInView(cal, (on) => {
      crawl.setRunning(on);
      pulse.setRunning(on);
    });
  }
  const liveCard = cal.querySelector("[data-cal-live-card]");
  liveCard.addEventListener("mouseenter", () => cal.style.setProperty("--bracket-spread", px(BRACKET_SPREAD)));
  liveCard.addEventListener("mouseleave", () => cal.style.removeProperty("--bracket-spread"));
};

export const setupFooter = () => {
  const section = document.querySelector("[data-foot]");
  setupContour(section.querySelector("[data-contour]"), reducedMotion);

  // The figure rides back into place as the page bottoms out.
  const figure = section.querySelector("[data-para-foot]");
  scrub(section, "top bottom", "bottom bottom", (p) => {
    figure.style.top = `${((PARALLAX_FIGURE / 1440) * 100 * (1 - p)).toFixed(4)}cqw`;
  });

  const h2 = section.querySelector("[data-heading]");
  const ctls = [ctl(reveal(section.querySelector("[data-foot-logo]"), fade, CONFIG.REVEAL), 120), ...headingControllers(h2)];
  section.querySelectorAll("[data-foot-link]").forEach((link, i) => {
    ctls.push(splitText(link, { by: "letter", stagger: 22, config: CONFIG.ROW, gap: "0.2em", delay: NAV_DELAY + i * NAV_STAGGER }));
  });
  section.querySelectorAll("[data-foot-rise]").forEach((node) => {
    ctls.push(ctl(reveal(node, rise("0.75rem"), CONFIG.REVEAL), Number(node.dataset.footRise)));
  });
  forwardInView(section, ctls, "0% 0% -20% 0%");
};
