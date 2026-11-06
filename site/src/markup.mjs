// The page's markup, generated at build time so the repeated parts (timeline
// rows, calendar cards, stat rows) are written once. `A` is the asset base.

const corner = (cls) =>
  `<svg class="corner ${cls}" viewBox="0 0 10.5 10.5" aria-hidden="true"><path d="M0 0.5H10V10.5"/></svg>`;
const corners = () => ["c-tl", "c-tr", "c-br", "c-bl"].map(corner).join("");

const ARROW = `<svg class="cta-arrow" viewBox="0 0 13.7071 10.7071" aria-hidden="true"><path d="M0 5.35355H13M8 10.3536L13 5.35355L8 0.353553"/></svg>`;
const ARROW_SM = `<svg class="cta-arrow" viewBox="0 0 13.71 10.71" aria-hidden="true"><path d="M0 5.35H13M8 10.35L13 5.35L8 0.35"/></svg>`;

const NAV = [
  ["Driver", "/driver"],
  ["SEASON", "/season"],
  ["journal", "/journal"],
  ["next race", "/next-race"],
  ["store", "/store"],
];
const SOCIALS = [
  ["inst", "https://instagram.com"],
  ["x", "https://x.com"],
  ["youtube", "https://youtube.com"],
];

const TIMELINE = [
  { year: 2012, frame: "centre", lead: "The first kart.", rest: "At six, Kimi discovered karting — turning a childhood curiosity into something of his own.", copyWidth: 228, alt: "Kimi in kart overalls in the paddock, aged six" },
  { year: 2015, frame: "side", align: "right", alt: "Kimi holding a karting trophy at sunset" },
  { year: 2019, frame: "centre", lead: "Finding his people.", rest: "Kimi joined the Mercedes Junior Programme, marking his first major step into professional motorsport.", copyWidth: 272, alt: "Kimi signing with the Mercedes junior team" },
  { year: 2021, frame: "side", align: "left", alt: "Kimi beside a single-seater in the garage" },
  { year: 2024, frame: "centre", lead: "The year everything changed.", rest: "Formula 2 brought Kimi closer to F1, while Mercedes confirmed him as their future race driver.", copyWidth: 278, alt: "Kimi walking the pit lane in Mercedes kit" },
  { year: 2025, frame: "side", align: "right", alt: "Kimi in the Mercedes garage" },
  { year: 2026, frame: "centre", lead: "From karts to f1.", rest: "Kimi is now racing at the highest level, with Bologna still his anchor — family, home and life beyond racing.", copyWidth: 284, alt: "The Mercedes-AMG F1 car on track" },
];

const CALENDAR = [
  { round: "round 11", name: "austrian gp", date: "29 jun", x: 347, w: 100, mark: "p6" },
  { round: "round 12", name: "british gp", date: "12 jul", x: 511, w: 100, mark: "p4" },
  { round: "round 13", name: "belgian gp", date: "27 jul", x: 675, w: 100, mark: "live" },
  { round: "round 14", name: "hungarian gp", date: "03 aug", x: 839, w: 114, mark: "ring" },
  { round: "round 15", name: "dutch gp", date: "31 aug", x: 1017, w: 76, mark: "ring" },
];
const LINKS = [
  { x: 416, w: 126 },
  { x: 580, w: 128 },
  { x: 743, w: 136 },
  { x: 914, w: 124 },
];

const STATS = [
  ["icon-flag.svg", "last result", "P4"],
  ["icon-bars.svg", "points gained", "+12"],
  ["icon-trophy.svg", "championship", "P1"],
  ["icon-gauge.svg", "points", "118"],
];

const px = (v) => `${((v / 1440) * 100).toFixed(4)}cqw`;
const spread = (x) => `calc(50% + ${px(x - 720)} * var(--cal-spread, 1))`;

// ------------------------------------------------------------------ hero
const hero = (A) => `
<section data-hero aria-labelledby="hero-name">
  <div class="hero-canvas" data-hero-canvas><canvas aria-hidden="true"></canvas></div>
  <div class="hero-ramp" aria-hidden="true"></div>
  <div class="veil" data-veil role="status" aria-label="Loading Grido1 Racing Systems">
    <div class="veil-content" data-veil-content>
      <div class="veil-helmet" style="-webkit-mask-image:url('${A}/hero/ui/helmet-mask.png');mask-image:url('${A}/hero/ui/helmet-mask.png')">
        <div class="veil-shell"></div>
        <div class="veil-fill" data-veil-fill></div>
      </div>
      <p class="veil-name" data-veil-name>kimi antonelli</p>
    </div>
    <div class="veil-meter" data-veil-meter><i data-veil-bar></i></div>
  </div>
  <div class="hero-col">
    <div class="hero-mast-wrap" data-hero-rise="0" style="opacity:0">
      <header class="mast">
        <a class="mast-logo" href="/" aria-label="Grido1 Racing Systems"><img src="${A}/hero/ui/grido1-logo.webp" width="424" height="97" alt=""></a>
        <nav class="mast-nav" aria-label="Primary"><ul>
          ${NAV.map(([l, h]) => `<li><a class="mast-link hov" href="${h}">${l}</a></li>`).join("")}
        </ul></nav>
        <a class="mast-link mast-garage hov" href="/garage"><span aria-hidden="true">[ </span>Garage<span aria-hidden="true"> → ]</span></a>
        <button class="burger" type="button" data-burger aria-haspopup="dialog" aria-expanded="false"><span class="sr-only">Open menu</span><span class="burger-lines"><i></i><i></i></span></button>
      </header>
    </div>
    <div class="hero-mid">
      <div class="hero-pair">
        <div class="identity">
          <div class="id-name-block">
            <p class="id-tag" data-id-tag style="opacity:0">driver_012</p>
            <h1 class="id-name" id="hero-name" data-id-name>kimi antonelli</h1>
          </div>
          <ul class="id-meta">
            <li class="id-row" data-id-row style="opacity:0"><img src="${A}/hero/ui/flag-italy.webp" alt="Italy" style="width:1.125rem;height:0.75rem"><span>Italy</span></li>
            <li class="id-row" data-id-row style="opacity:0"><img src="${A}/hero/ui/icon-rookie.svg" alt="" aria-hidden="true" style="width:1rem;height:1rem"><span>rookie season_2026</span></li>
            <li class="id-row" data-id-row style="opacity:0"><img src="${A}/hero/ui/mercedes-logo.webp" alt="" aria-hidden="true" style="width:0.875rem;height:0.875rem"><span>Mercedes-AMG F1 Team</span></li>
          </ul>
        </div>
        <div class="hero-panels-wrap">
          <div data-hero-rise="900" style="opacity:0">
            <div class="panels" data-hero-panels>
              <div class="bpanel">${corners()}
                <p class="eyebrow">next race</p>
                <div class="race-row">
                  <dl class="race-dl"><dt>belgian gp</dt><dd>spa-francorchamps</dd><dd><time datetime="2026-07-27">27 jul 2026</time></dd></dl>
                  <img class="race-map" data-hero-map src="${A}/hero/ui/circuit-spa.webp" width="312" height="199" alt="Spa-Francorchamps circuit layout">
                </div>
              </div>
              <div class="bpanel">${corners()}
                <p class="eyebrow">Season stats</p>
                <dl class="stats" data-hero-stats>
                  ${[["Races", "12"], ["Podiums", "3"], ["Points", "118"]].map(([k, v]) => `<div class="stat"><dt>${k}</dt><dd data-hero-figure>${v}</dd></div>`).join("")}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-figwrap" aria-hidden="true">
        <div class="hero-box" data-hero-box></div>
        <div class="hero-figramp"></div>
      </div>
    </div>
    <div class="hero-actions-wrap" data-hero-rise="1500" style="opacity:0">
      <div class="actions">
        <a class="trailer" href="/trailer"><img src="${A}/hero/ui/play-button.svg" alt="" aria-hidden="true"><span class="trailer-lines"><span class="trailer-title">watch trailer</span><span class="trailer-time">01:26</span></span></a>
        <a class="cta" href="/driver/kimi-antonelli">
          <svg class="cta-frame" viewBox="0 0 220 50" preserveAspectRatio="none" aria-hidden="true">
            <path d="M220 42L212.932 50H0V0H220V42Z" fill="#0E0F14"/>
            <path class="flood" d="M220 42L212.932 50H0V0H220V42Z" fill="var(--accent)" style="fill:var(--accent)"/>
            <path d="M220 42L212.932 50H0V0H220V42Z" fill="none" stroke="#02d2e3" stroke-opacity="0.25"/>
            <path d="M205 49.5H213L219.5 42V36M212 0.5H219.5V7M8 0.5H0.5V7M7.5 49.5H0.5V42.5" fill="none" stroke="#02d2e3"/>
          </svg>
          <span class="cta-label">view profile</span>${ARROW}
        </a>
        <ul class="socials">${SOCIALS.map(([l, h]) => `<li><a class="hov" href="${h}">${l}</a></li>`).join("")}</ul>
      </div>
    </div>
  </div>
</section>`;

// ------------------------------------------------------------------ season
const season = () => `
<section data-season aria-labelledby="season-h">
  <div class="season-frame" data-season-frame aria-hidden="true">
    <div class="season-stage" data-season-stage>
      <div class="season-map" data-season-map><canvas data-season-dots></canvas><svg data-season-svg viewBox="0 0 2560 1440" style="overflow:visible"></svg></div>
      <canvas class="season-trace" data-season-trace></canvas>
    </div>
  </div>
  <canvas class="dissolve" data-dissolve="light" aria-hidden="true"></canvas>
  <div class="season-col">
    <div>
      <h2 class="display season-h" id="season-h" data-heading>
        <span class="sr-only">the season so far.</span>
        <span class="head-line" aria-hidden="true"><span data-head-line>the season</span></span>
        <span class="head-line" aria-hidden="true"><span data-head-line>so far</span><span class="dot-end" data-head-dot>.</span></span>
      </h2>
      <div class="season-rule" data-season-rule></div>
      <p class="season-intro" data-season-intro>Every race is a step forward. Here's how the season is shaping up.</p>
    </div>
    <div class="splate" data-season-plate style="opacity:0">
      <svg viewBox="0 0 277 78" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0.5 0.5H276.5V69L268 77.5H0.5Z" fill="var(--surface-black)" style="fill:var(--surface-black);stroke:var(--accent)" stroke-width="1" vector-effect="non-scaling-stroke"/>
        <line x1="83" y1="0.5" x2="83" y2="77.5" style="stroke:var(--accent)" stroke-width="1" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="splate-badge">
        <svg class="splate-globe" viewBox="0 0 37 23" aria-hidden="true" style="stroke:var(--accent);fill:none" stroke-width="1">
          <ellipse cx="18.5" cy="11.5" rx="18" ry="11"/><line x1="0.5" y1="11.5" x2="36.5" y2="11.5"/><ellipse data-globe-meridian cx="18.5" cy="11.5" rx="18" ry="11"/>
        </svg>
        <p class="splate-mark"><span data-plate-type style="color:var(--foreground-on-dark)">F1</span><span data-plate-type style="color:var(--accent)">/ 2026</span></p>
      </div>
      <dl class="splate-stats">
        ${[["P1", "in the championship"], ["6", "wins"], ["9", "podiums."]].map(([a, b]) => `<div class="splate-row"><dt data-plate-fig>${a}</dt><dd data-plate-word>${b}</dd></div>`).join("")}
      </dl>
    </div>
  </div>
</section>`;

// ------------------------------------------------------------------ timeline
const plate = (A, e) => `
<div class="plate">
  <div class="plate-fill" style="clip-path:url(#plate-clip)">
    <div class="plate-slot" data-plate-slot><img src="${A}/timeline/${e.year}.webp" width="1420" height="1016" alt="${e.alt}" loading="lazy" decoding="async"></div>
  </div>
  <svg class="plate-outline" viewBox="0 0 710.995 462.995" preserveAspectRatio="none" aria-hidden="true"><path d="PLATE_OUTLINE"/></svg>
</div>`;

const timeline = (A) => `
<section class="timeline" data-timeline aria-labelledby="timeline-h">
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><clipPath id="plate-clip" clipPathUnits="objectBoundingBox"><path d="PLATE_CLIP"/></clipPath></defs></svg>
  <canvas class="dissolve" data-dissolve="light" aria-hidden="true"></canvas>
  <div class="tl-wrap" data-tl-wrap>
    <div class="rail" data-rail aria-hidden="true"></div>
    <h2 class="display timeline-h" id="timeline-h" data-heading>
      <span class="sr-only">from karts to f1.</span>
      <span class="head-line" aria-hidden="true"><span data-head-line>from karts</span></span>
      <span class="head-line" aria-hidden="true"><span data-head-line>to f1</span><span class="dot-end" data-head-dot>.</span></span>
    </h2>
    ${TIMELINE.map((e, i) => `
    <div class="tl-row ${e.frame} ${e.align || ""} ${i % 2 ? "odd" : "even"}" data-tl-row data-frame="${e.frame}">
      <div class="tl-plate" data-tl-plate><div class="para" data-para="${e.frame === "side" ? 60 : 20}">${plate(A, e)}</div></div>
      <div class="tl-year display" aria-hidden="true"><div class="tl-year-inner" data-para="${e.frame === "side" ? 60 : 20}"><span data-tl-year>${e.year}</span></div></div>
      ${e.lead ? `<p class="tl-copy" data-tl-copy style="opacity:0;width:min(max(${px(e.copyWidth)}, var(--copy-min-w, 0px)), var(--copy-max-w, 100vw))"><span class="tl-copy-inner" data-para="110" style="position:relative;display:block"><b>${e.lead}</b> ${e.rest}</span></p>` : ""}
    </div>`).join("")}
  </div>
</section>`;

// ------------------------------------------------------------------ paddock
const bracketSet = (cls, { left, right, top, bottom }, delayAttr) => {
  // tl 270, tr 0, br 90, bl 180 — each offset outward by --bracket-spread,
  // the bottom pair moved alone by --bracket-stretch.
  const s = "var(--bracket-spread, 0px)";
  const st = "var(--bracket-stretch, 0px)";
  const U10 = "calc(var(--U) * 10)";
  const pos = [
    [`calc(${left} - ${s})`, `calc(${top} - ${s})`, 270],
    [`calc(${right} - ${U10} + ${s})`, `calc(${top} - ${s})`, 0],
    [`calc(${right} - ${U10} + ${s})`, `calc(${bottom} - ${U10} + ${s} + ${st})`, 90],
    [`calc(${left} - ${s})`, `calc(${bottom} - ${U10} + ${s} + ${st})`, 180],
  ];
  return `<div class="${cls}" ${delayAttr} style="opacity:0">${pos
    .map(([l, t, r]) => `<svg class="bracket" viewBox="0 0 10.5 10.5" style="left:${l};top:${t};transform:rotate(${r}deg)" aria-hidden="true"><path d="M0 0.5H10V10.5"/></svg>`)
    .join("")}</div>`;
};

const paddock = (A) => {
  const U = (n) => `calc(var(--U) * ${n})`;
  const columnRight = `calc(2.2222cqw + ${U(12)})`;
  const columnLeft = `calc(100% - ${columnRight} - ${U(193)})`;
  const FRAME_RIGHT = "calc(100% - 2.2222cqw)";
  const FRAME_LEFT = `calc(100% - 2.2222cqw - ${U(193)} - ${U(25)})`;
  const live = { left: 669, right: 781, top: 32, bottom: 113 };
  return `
<section class="paddock" data-paddock aria-labelledby="paddock-h">
  <canvas class="contour" data-contour="--paddock-contour" aria-hidden="true"></canvas>
  <div class="p-band" aria-hidden="true"></div>
  <div class="p-figlayer" data-paddock-fig><div class="para" data-para-paddock><img class="p-fig" src="${A}/paddock/portrait.webp" width="1350" height="1165" alt="Kimi Antonelli in the paddock" loading="lazy" decoding="async"></div></div>
  <div class="p-melt" aria-hidden="true"></div>
  <canvas class="dissolve" data-dissolve="dark" aria-hidden="true"></canvas>
  <h2 class="display paddock-h" id="paddock-h" data-heading>
    <span class="sr-only">from the paddock.</span>
    <span class="head-line" aria-hidden="true"><span data-head-line>from the</span></span>
    <span class="head-line" aria-hidden="true"><span data-head-line>paddock</span><span class="dot-end" data-head-dot>.</span></span>
  </h2>
  <div class="p-intro" data-paddock-intro>
    <p class="p-report" data-paddock-report>A composed drive through a difficult weekend secured another podium — and kept Kimi at the top of the championship.</p>
    <a class="btn btn-read" href="/stories/hungarian-gp" data-paddock-cta style="opacity:0">
      <svg class="btn-frame" viewBox="0 0 217 50" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0.5 0.5H216.5V42L209 49.5H0.5Z" style="fill:var(--surface-black)"/>
        <path class="flood" d="M0.5 0.5H216.5V42L209 49.5H0.5Z" style="fill:var(--accent)"/>
        <path d="M0.5 0.5H216.5V42L209 49.5H0.5Z" style="fill:none;stroke:var(--accent)" stroke-width="1" vector-effect="non-scaling-stroke"/>
      </svg>
      <span class="btn-label"><span class="cta-label">read story</span>${ARROW_SM}</span>
    </a>
  </div>
  <div class="p-panels" data-paddock-panels>
    ${bracketSet("p-bracket-meet", {
      left: `var(--meet-frame-left, ${FRAME_LEFT})`,
      right: `var(--meet-frame-right, ${FRAME_RIGHT})`,
      top: `var(--meet-frame-top, ${U(32)})`,
      bottom: `var(--meet-frame-bottom, ${U(105)})`,
    }, 'data-p-delay="320"')}
    <div class="p-meet" data-p-delay="410" style="opacity:0;left:var(--meet-left, ${columnLeft});top:var(--meet-top, ${U(43)})"><b>hungarian gp</b><span>silverstone</span><span>july 12, 2026</span></div>
    <div style="--bracket-stretch:var(--stats-stretch, 0px)">${bracketSet("p-bracket-stats", {
      left: `var(--stats-frame-left, ${FRAME_LEFT})`,
      right: `var(--stats-frame-right, ${FRAME_RIGHT})`,
      top: `calc(${U(137)} + var(--stats-drop, 0px) + var(--stats-frame-drop, 0px))`,
      bottom: `calc(${U(535)} + var(--stats-drop, 0px) + var(--stats-frame-drop, 0px))`,
    }, 'data-p-delay="460"')}</div>
    <div class="p-stats" style="left:var(--stats-left, ${columnLeft});top:calc(${U(147)} + var(--stats-drop, 0px));width:var(--stats-col-w, ${U(193)})">
      ${STATS.map(([icon, label, fig], i) => `${i ? `<div class="p-rule" data-p-rule style="transform:scaleX(0)"></div>` : ""}
      <div class="p-stat" data-p-stat style="opacity:0"><img src="${A}/paddock/${icon}" alt="" aria-hidden="true"><div class="p-stat-text"><span class="p-stat-label">${label}</span><span class="p-stat-fig" data-p-fig>${fig}</span></div></div>`).join("")}
    </div>
  </div>
  <div class="cal" data-cal>
    <div class="cal-bar" aria-hidden="true"></div>
    ${LINKS.map((l, i) => `<div class="cal-link" data-cal-link data-dir="${l.x < 675 ? 1 : -1}" aria-hidden="true" style="left:${spread(l.x)};width:calc(${px(l.w)} * var(--cal-spread, 1));transform:scaleX(0)"></div>`).join("")}
    ${CALENDAR.map((c, i) => `
    <div class="cal-card ${c.mark === "live" ? "live" : ""} ${i < 2 ? "early" : ""}" data-cal-card ${c.mark === "live" ? "data-cal-live-card" : ""} style="opacity:0;left:calc(${spread(c.x + c.w / 2)} - ${px(c.w / 2)});width:var(--cal-card-w, ${px(c.w)})">
      <span class="cal-round">${c.round}</span>
      <span class="cal-name" data-cal-name>${c.name}</span>
      <span class="cal-date">${c.date}</span>
    </div>`).join("")}
    ${CALENDAR.map((c) => `
    <div class="cal-mark" data-cal-mark aria-hidden="true" style="opacity:0;left:${spread(c.x + c.w / 2)}">${
      c.mark === "live"
        ? `<svg viewBox="0 0 11 11"><circle data-cal-pulse cx="5.5" cy="5.5" r="5.5" style="fill:none;stroke:var(--accent)" stroke-width="1" vector-effect="non-scaling-stroke" opacity="0"/><circle cx="5.5" cy="5.5" r="5.5" style="fill:var(--accent)"/></svg>`
        : c.mark === "ring"
          ? `<svg viewBox="0 0 11 11"><circle cx="5.5" cy="5.5" r="5" style="fill:none;stroke:var(--foreground-on-dark)" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`
          : `<span class="cal-mark-text">${c.mark}</span>`
    }</div>`).join("")}
    <div class="cal-live" data-cal-live style="--bracket-stretch:var(--live-stretch, 0px)">${bracketSet("cal-live-set", {
      left: spread(live.left),
      right: spread(live.right),
      top: `calc(${px(live.top)} + var(--bracket-drop, 0px))`,
      bottom: `calc(${px(live.bottom)} + var(--bracket-drop, 0px))`,
    }, 'data-cal-bracket')}</div>
  </div>
</section>`;
};

// ------------------------------------------------------------------ footer
const footer = (A) => `
<section class="foot" data-foot aria-labelledby="foot-h">
  <div class="foot-panel"><canvas class="contour" data-contour="--footer-contour" aria-hidden="true"></canvas></div>
  <div class="foot-fig" aria-hidden="true">
    <div class="para" data-para-foot>
      <img class="foot-body" src="${A}/footer/body.webp" width="1536" height="1024" alt="" loading="lazy" decoding="async">
      <img class="foot-helmet" src="${A}/footer/helmet.webp" width="1536" height="1024" alt="Kimi Antonelli's helmet" loading="lazy" decoding="async">
    </div>
  </div>
  <div class="foot-logo" data-foot-logo role="img" aria-label="GRID01 Racing Systems" style="-webkit-mask-image:url('${A}/footer/logo-mask.png');mask-image:url('${A}/footer/logo-mask.png')"></div>
  <h2 class="display foot-h" id="foot-h" data-heading>
    <span class="sr-only">keep pushing forward.</span>
    <span class="head-line" aria-hidden="true"><span data-head-line>keep pushing</span></span>
    <span class="head-line" aria-hidden="true"><span data-head-line>forward</span><span class="dot-end" data-head-dot>.</span></span>
  </h2>
  <nav class="foot-nav" aria-label="Footer"><ul>
    ${NAV.map(([l, h]) => `<li><a class="foot-link" href="${h}"><span data-foot-link>${l.toLowerCase()}</span><svg class="foot-link-arrow" viewBox="0 0 13.71 10.71" aria-hidden="true"><path d="M0 5.35H13M8 10.35L13 5.35L8 0.35"/></svg></a></li>`).join("")}
  </ul></nav>
  <p class="foot-copy" data-foot-rise="640">© 2026 GRID01 Racing Systems. All rights reserved.</p>
  <div class="foot-cta" data-foot-rise="720"><div class="foot-cta-shift">
    <a class="btn btn-legal" href="/legal">
      <svg class="btn-frame" viewBox="0 0 275 50" preserveAspectRatio="none" aria-hidden="true">
        <path class="flood" d="M0.5 0.5H274.5V41.165L266.165 49.5H0.5Z" style="fill:var(--accent)"/>
        <path d="M0.5 0.5H274.5V41.165L266.165 49.5H0.5Z" style="fill:none;stroke:var(--accent)" stroke-width="1" vector-effect="non-scaling-stroke"/>
      </svg>
      <span class="btn-label"><span class="cta-label">legal documents</span>${ARROW_SM}</span>
    </a>
  </div></div>
  <ul class="foot-social" data-foot-rise="800">${SOCIALS.map(([l, h]) => `<li><a class="hov" href="${h}">${l}</a></li>`).join("")}</ul>
  <p class="foot-credit" data-foot-rise="860"><span>Built and developed by</span><a class="hov" href="https://www.disruptivedodo.mu" target="_blank" rel="noopener">Disruptive Dodo</a></p>
</section>`;

export const bodyMarkup = (A, { PLATE_OUTLINE, PLATE_CLIP }) =>
  `<main>
<div class="stack" data-stack>
  <div class="layer layer-0" data-layer><div class="layer-inner" data-layer-inner>${hero(A)}</div><div class="layer-shade" data-layer-shade></div></div>
  <div class="layer layer-1" data-layer><div class="layer-inner" data-layer-inner>${season(A)}</div><div class="layer-shade" data-layer-shade></div></div>
  <div class="layer-last" data-layer-last>${timeline(A)}</div>
</div>
${paddock(A)}
${footer(A)}
</main>`
    .replaceAll("PLATE_OUTLINE", PLATE_OUTLINE)
    .replaceAll("PLATE_CLIP", PLATE_CLIP);
