---
tags: [meta, performance, seo, history]
updated: 2026-10-06
---

# Optimization history — Kimi (GRIDO1 — Kimi Antonelli)

What the LucasKimi optimization pipeline changed in this project, why, and what
must not be undone. Maintained by the pipeline
(`lucaskimi-pipeline/optimization-pipeline`, primary record
`obsidian/Projects/kimi.md`; owner decisions `obsidian/Meta/decisions-log.md`).
Condensed for the next agent who edits this repo. Day-to-day notes stay in
[[changelog]] (2026-10-02 and 2026-10-03 entries carry the detail), conventions
in [[decisions-log]] — this file links, not duplicates. Last updated 2026-10-06.

The repo is `textura-agency/lucaskimi-lando`; the pipeline calls the project
`kimi`. A duplicate `lando` folder (same repo, same commits) was removed on
2026-10-01 (D-026: one folder per project).

## Current state

| | Desktop | Mobile | measured |
|---|---|---|---|
| Lighthouse Performance (people, production) | 99 | 94 | 2026-10-03 D-029 sweep |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 | 2026-10-03 (people + robot) |
| Robot form (Googlebot / PSI view) | 100 all | 98 / 100 / 100 / 100 | 2026-10-03 |
| Scroll test (production) | ideal (0 %, max 10.4 ms) | **smooth** (2.39 % cold, max 26.3 ms; warm ideal) | 2026-10-05 D-031 sweep |

- Status: **optimized** (D-028/D-029 bar met in a quiet hosted window
  2026-10-04: PC 99 / mobile 96, scroll ideal both). Not named in the owner's
  phone reviews (D-033 → approved as is).
- Production: Vercel project `lucaskimi-lando` (team textura-agency, deploys
  `main`), domain `lucaskimi-lando-mcxnbv78sdk.vercel.app` (protected except
  custom domains). `repackage: needed` (the owner decides).

## Invariants — do not undo

| what | why / measured effect | where |
|---|---|---|
| **Hero copy at rest under the loader** — server HTML and hydration render the at-rest shape; a reported paint entry switches it to the springs (still under the opaque loader) | the headline was the LCP and painted only at hand-over: PC 80 → 96, mobile 52 → 73. A rAF-only switch lost the race 1 in 3 under load — keep the paint entry | `src/components/common/at-rest-under-loader.tsx`, `src/views/home/sections/hero/index.tsx` |
| The hero goes live in **four steps 40 ms apart** (nav, identity, panels, actions) | one switch was two 23–27 ms tasks: TBT 355 → 282 ms | `at-rest-under-loader.tsx` (`step`), `hero/index.tsx` |
| **Scene setup yields** — one task per texture upload, PMREM, build, compile, prewarm; `update()` waits for `ready` | mobile 73 → 77 | `src/views/home/sections/hero-scene/scene.ts` |
| Portrait maps via **`ImageBitmapLoader`** (off-thread decode, flipY baked) | the 2048² diffuse was a ~250 ms decode inside `texImage2D` | `hero-scene/scene.ts` |
| **Phone tier loads light assets**: `helmet3-mobile.glb` (1024² textures, 0.42 vs 0.80 MB) below 768 px; 1024² `person-diffuse-1024.webp` / `person-alpha-1024.webp`; the never-drawn scanning wireframe isn't built on mobile (`retune()` builds it on a tier change) | TBT 510 → 345 ms, mobile 81 → 89 | `hero-scene/scene.ts`, `public/assets/hero/scene/` |
| **Below-fold leaves hydrate one per idle period** (season, timeline, paddock, footer) | whole-page hydration was a ~670 ms task; → mobile 86 | `src/components/common/hydrate-when-idle.tsx` |
| **`IdleText`** — each below-fold text engine hydrates in its own idle period | TBT 262 → 229 ms, 92 → 93 | `src/components/common/robot-text.tsx` |
| The loader's name is **CSS generated content** (`before:content-[attr(data-text)]`, `aria-hidden`) | it repeats the `<h1>`; axe read it mid-fade at 1.1–2.8:1 | `src/views/home/sections/hero/hero-loader.tsx` |
| Paddock portrait is **not** `priority` | it is four screens down | paddock section |
| **No `await isBot()` in the view** — the proxy rewrites robots to the prerendered robot form; `/` is static (`x-vercel-cache: PRERENDER`) | `isBot()` read `headers()` and made `/` dynamic for everyone | `src/proxy.ts`, `src/app/robot-view/` |
| **Robot form** (D-016): no hero loader, page starts revealed, springs/text engines at rest, the project's poster path kept | robot PC 94 → 100, mobile 74 → 99 (TBT 816 → 70 ms) | `src/components/common/robot-*.tsx` |
| AI crawlers in the bot list | fleet fix 2026-10-02 | `src/utils/bot-ua.ts` |
| Six looping springs are `loop: !useMotionOff()` (season dots/globe/map, paddock calendar) | a loop under reduced motion / robot form never yields — the page freezes | `src/hooks/animation/use-motion-off.ts` + the season/paddock components |
| Unbuilt nav pages are **`#` hashes** (15 links: `/driver`, `/garage`, `/journal`, `/next-race`, `/season`, `/store`, `/trailer`…) | Next prefetched 404s: BP 96 → 100 (D-026) | `src/data/mocks/home.ts` |
| Italy flag `iconAlt=""` (decorative — the label says it) | axe `image-redundant-alt`: A11y 99 → 100 | home data / hero |
| No `app/loading.tsx`; `/privacy-policy` exists; D-019 origin fallback; mask colour `black` not `#000` | non-JS crawlers; BP 404; localhost canonical; verify | `src/app/`, `src/lib/site.ts` |

## Owner decisions

- **D-016** (2026-09-29) — robots get a static page, same content, via the proxy.
- **D-017 / D-026 / D-028 / D-029** — A11y/BP/SEO 100 everywhere (people +
  robot); performance ≥ 90 desktop and mobile; **cutting the mobile scene needs
  a discussion first** (D-026); unbuilt nav links → `#` (D-026).
- **D-026** — one folder per project: the `lando` clone removed (#23).
- **D-031 / #43** (2026-10-05) — at-rest contrast over the hero canvas (cyan
  eyebrows 1.76:1, `--foreground-muted` 2.33:1 incl. the phone's `DRIVER_012`):
  **skip — the colours stay as designed.** Do not "fix" them.
- **D-027 / D-034** — pass work is merged to `main`; the owner reviews live.
- **D-033** — not mentioned in the owner's phone review → approved as is.
- **D-038** — this file.

## History by pass

**pass-1 — 2026-09-29, `e19bbdc`.** Hosted baseline (5 runs): PC 77, mobile 46
(Lantern LCP 10.4 s, observed 2.57 s; TBT 1,713 ms), A11y 99, BP 96; scroll
ideal/ideal; robot 94/74; PSI 57/66.
- Robot path replaces `await isBot()` — `/` static; robot 100 / 99.
- Six loops on `useMotionOff()`; flag alt `""` (A11y 100); `/privacy-policy`;
  D-019; `math.ts`; mask `black`.
- Result: PC 83, mobile 50, A11y 100; PSI 99 / 94. Blocked on #21 (nav 404s)
  and #23 (duplicate folder).
- Follow-ups: `509cc00` robot-text typing, `e4a16ef` robot-text flex row.

**D-026 round — 2026-10-01, `651b890`.** Nav 404s → `#` (15 links, BP 100);
phone helmet build (`helmet3-mobile.glb`) — did not move mobile; empty
`loading.tsx` removed. Hosted: PC 85 / mobile 52 — the LCP headline waited for
the helmet scene (render delay 8.2 s). Blocked for the owner's mobile discussion.

**D-028 wave 1 — 2026-10-02, `12bcfa1`.** Copy at rest under the loader
(52 → 73), scene setup yields (→ 77), `ImageBitmapLoader`, paddock portrait not
priority, idle hydration (→ 86). Hosted: PC 100 / mobile 87, robot 100.
`dfb5b67` AI crawlers → robot form.

**D-028 wave 6 — 2026-10-03, `9de327b`.** Phone 1024² portrait maps + no mobile
wireframe (81 → 89), hero in four steps (TBT → 282), `IdleText` (→ 93), loader
name as generated content. Local mobile 83 → 94. Loaded hosted run read mobile
scroll janky; the **quiet record** (2026-10-04, 5 runs): PC **99** / mobile
**96**, scroll **ideal / ideal**. **optimized.**

**D-029 sweep — 2026-10-03/04:** people 99 / 94, robot 100 / 98, all else 100.
**D-031 sweep — 2026-10-05:** desktop ideal, mobile smooth (2.39 %).

## Tried and reverted / didn't help

- **HydrateNear** (hydrate on approach, relay's pattern): mobile 92 but the phone
  scroll went janky (75–100 ms frames as a block hydrated under the swipe) —
  reverted for idle hydration. kimi is the fleet's counter-case for it.
- `experimental.inlineCss`: 87.5 vs 89 — reverted.
- Drawing the paddock/footer contour canvases only near the viewport: TBT 375 vs
  370 — reverted.
- Chaining idle leaves (each after the previous committed): 370 vs 369 — reverted.
- The phone helmet alone (D-026) did not move mobile — the hand-over was the cost.

## Open items / leads

- **Phone scroll** read smooth (2.39 %) in the 2026-10-05 production sweep, ideal
  in the 2026-10-04 record; no frame > 50 ms in either.
- `public/assets/block 2/` holds an unreferenced 9.4 MB PNG and `tracks.glb`
  (464 KB) is not loaded by the scene — no page cost, left for the owner.
- Fleet candidate lists (pattern match only): a phone frame cap in the scene
  (fleet rule since D-033: no fixed phone cap — but kimi is approved, so only
  if the owner notices, #50); one CSS background by raw path.
- Leads recorded after wave 1 (wave 6 addressed part of them): idle
  hydration tasks 100–160 ms (season dissolve, circuit, dots),
  `PaddockBackdrop` drawing twice off-screen, an ~80 ms texture upload.

## How to measure

From `lucaskimi-pipeline/optimization-pipeline/` (records only via `measure.mjs`):

```sh
node tools/measure.mjs kimi --hosted              # production: Lighthouse + scroll, PC + mobile ×3
node tools/measure.mjs kimi --hosted --as-bot     # the robot form (what PSI / Googlebot see)
node tools/measure.mjs kimi --tag check           # local production build, while iterating
node tools/measure.mjs kimi --only scroll --devices mobile --runs 1 --no-build   # iterate on a freeze
node tools/axe-sweep.mjs <url> --device both       # at-rest contrast over the canvas (#43: owner keeps the colours)
node tools/fps-probe.mjs <url>                     # if the phone scene rate is ever questioned
```
