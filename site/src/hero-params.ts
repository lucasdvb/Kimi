// Pure (three.js-free) hero parameters and framing maths. Split out of
// scene.ts so the main-thread runtime can import them without bundling three —
// the scene itself runs in a worker (see worker/ and host/). scene.ts imports
// these back, so the full single-file build is unchanged.

export interface HeroSceneParams {
  cameraZ: number;
  /** Uniform scale of the head + helmet pair, about the world origin. */
  subjectScale: number;
  /** Vertical placement of that pair, so it frames like the Figma hero. */
  /**
   * Horizontal placement of the whole subject, in world units. 0 puts the
   * head plane on the camera axis — dead centre of the canvas. The pose in
   * the photograph is not symmetric, so the optical centre can sit a little
   * off the geometric one; this is the lever for that.
   */
  subjectX: number;
  subjectY: number;
  /**
   * How far the composition rises into place on load, in **CSS pixels** — a
   * screen-space distance, so it reads the same on any viewport rather than
   * scaling with the world. Converted against the frustum each frame.
   */
  riseDistance: number;
  /** Seconds the rise takes, easing out to a stop. */
  riseDuration: number;
  /**
   * How far the whole composition — portrait and helmet together — slides
   * with the cursor. Distinct from `headParallax`, which shifts the
   * portrait's UVs against its own depth map, and from `helmetFollow`, which
   * moves only the helmet. This one moves the pair bodily.
   */
  subjectParallax: number;
  headScale: number;
  headY: number;
  headParallax: number;
  /** Strength of the cursor-driven relight read off the portrait's normals. */
  headRelight: number;
  helmetScale: number;
  helmetX: number;
  helmetY: number;
  helmetZ: number;
  helmetFollow: number;
  /**
   * Pitch — the turn about x — the helmet reaches with the cursor at the top
   * or bottom edge of the window, in **degrees**. Signed: negative looks up
   * as the cursor goes down. See `swing`.
   */
  helmetAmpX: number;
  /** Shape of the pitch between centre and edge: 0 linear, higher steeper. */
  helmetCurveX: number;
  /** Yaw — the turn about y — at the left or right edge, in degrees. */
  helmetAmpY: number;
  helmetCurveY: number;
  /** Brightness multiplier on the helmet shell's baked base colour. */
  helmetBrightness: number;
  /** Brush size of the cursor trail that masks the helmet in. */
  trailRadius: number;
  /** Fraction of `trailRadius` the brush shrinks to at rest. */
  trailIdleScale: number;
  /** Base taper exponent — higher thins the tail faster. */
  trailTaper: number;
  /** Taper multiplier at rest (short tail → a blob). */
  trailTaperIdle: number;
  /** Taper multiplier at full pace (long tail → a streak). */
  trailTaperFast: number;
  /** Fraction of the sample history that contributes, 0–1. */
  trailLength: number;
  /** Trail value at which the helmet becomes solid. */
  revealThreshold: number;
  revealEdge: number;
  /** How far the noise displaces the sample point — the blob's wobble. */
  revealWarp: number;
  /** Frequency of that noise; higher is a finer, busier edge. */
  revealWarpScale: number;
  revealSpeed: number;
  pointerLerp: number;
  /** Pointer speed (NDC/frame) counted as fully "fast". */
  pacePeak: number;
  /** Easing toward a rising pace — the trail swelling. */
  paceAttack: number;
  /** Easing toward a falling pace — the trail draining. */
  paceRelease: number;
  /** Pace below which nothing is revealed at all. */
  paceThreshold: number;
  /** Pace range over which the reveal fades up past that threshold. */
  paceRamp: number;
  /** Seconds for one crown-to-chin pass of a single outline wave. */
  outlinePeriod: number;
  /**
   * The idle sweep's own warp and history length, kept separate from the
   * cursor's. It runs unattended and constantly, so it is the trail worth
   * making cheap — and nobody is watching its edge closely enough to miss
   * the detail. 0 warp skips two texture fetches per fragment outright.
   */
  sweepWarp: number;
  sweepLength: number;
  /** Brush size of the idle sweep, independent of the cursor's. */
  sweepRadius: number;
  /** Seconds between wave starts. Below `outlinePeriod`, waves overlap. */
  outlineStagger: number;
  /** Peak opacity at the centre of the wave. */
  outlineOpacity: number;
  /** Thickness of the wave, as a fraction of the helmet's height. */
  outlineWidth: number;
  /** Opacity of the wireframe outside the wave — 0 keeps the helmet hidden. */
  outlineBase: number;
  /** Lifts the outline from the foreground token toward white. 0 = token. */
  outlineLightness: number;
  /** Spatial frequency of the backdrop contours. */
  bgLineScale: number;
  /** How many contour bands the noise field is sliced into. */
  bgLineCount: number;
  /** Stroke width of each contour, in screen-derivative units. */
  bgLineThickness: number;
  bgLineOpacity: number;
  /** Amplitude of the rolling wave displacement. */
  bgWaveAmount: number;
  bgWaveSpeed: number;
  /** Grey level of the backdrop half of the reveal. 0 = black, 1 = white. */
  bgRevealLightness: number;
  /** The alternate grey, used in every other band between the lines. */
  bgRevealLightnessAlt: number;
  bgRevealOpacity: number;
  /** Seconds the entrance takes, from prewarmed scene to cursor control. */
  introDuration: number;
  /** Point in the entrance (0–1) where the helmet starts burning away. */
  burnStart: number;
  /** Width of the burn's dissolve front. */
  burnSoftness: number;
  /** Brightness of the glowing edge that leads the burn. */
  burnGlow: number;
  /** Extent of the idle sweep's path. 0 turns the whole thing off. */
  autoSweepAmount: number;
  /** Seconds between the start of one idle sweep and the next. */
  autoSweepPeriod: number;
  /** Seconds one stroke takes to travel its leg. */
  autoSweepStroke: number;
  /** Seconds held still between strokes. */
  autoSweepHold: number;
}

export const CAMERA_FOV = 35;
export const CAMERA_Y = 0.1;

/**
 * World-space height visible at the subject's depth. The camera's vertical
 * field of view is fixed, so this — not the canvas width — is what a pixel is
 * measured against.
 */
export const visibleWorldHeight = (cameraZ: number) =>
  2 * cameraZ * Math.tan((CAMERA_FOV * Math.PI) / 360);

/**
 * Keeps the subject at the size and place a *box* would have given it, while
 * the canvas itself is some other size — which is how the backdrop can be
 * stretched over the whole block without the portrait growing with it.
 *
 * The subject scales about its own origin and the world-to-pixel factor is
 * proportional to canvas height, so the size term is the plain ratio of the
 * two heights. The position term is the box's centre moving relative to the
 * canvas's, converted back into world units.
 *
 * With `box` equal to the canvas both terms collapse to identity, so a
 * full-bleed scene is unaffected.
 */
export const fitSubjectToBox = (
  params: Pick<HeroSceneParams, "subjectScale" | "subjectY" | "cameraZ">,
  box: { top: number; height: number },
  canvasHeight: number,
): Pick<HeroSceneParams, "subjectScale" | "subjectY"> => {
  if (canvasHeight <= 0 || box.height <= 0) {
    return { subjectScale: params.subjectScale, subjectY: params.subjectY };
  }
  const ratio = box.height / canvasHeight;
  const world = visibleWorldHeight(params.cameraZ);
  const centreShift = canvasHeight / 2 - (box.top + box.height / 2);
  return {
    subjectScale: params.subjectScale * ratio,
    subjectY:
      CAMERA_Y +
      (params.subjectY - CAMERA_Y) * ratio +
      (centreShift * world) / canvasHeight,
  };
};

export const DEFAULT_PARAMS: HeroSceneParams = {
  cameraZ: 6.5,
  subjectScale: 1.15,
  // The photograph is not symmetric: the head sits ~43px left of the 2048px
  // texture's centre while the shoulders sit ~14px right of it, so the figure
  // reads as leaning left. 0.09 world units (~19px at an 800px-tall canvas)
  // puts the head back on the axis. Tune live in the controls panel.
  subjectX: 0,
  subjectY: 0.42,
  subjectParallax: 0.02,
  riseDistance: 200,
  riseDuration: 2,
  headScale: 0.8,
  headY: 0.58,
  headParallax: 0.005,
  headRelight: 0.32,
  helmetScale: 0.69,
  helmetX: -0.08,
  helmetY: 0.45,
  helmetZ: 0,
  helmetFollow: 0.01,
  // The owner's pass on the degree sliders (2026-09-08, second tune of the
  // day): a small, **linear** turn on both axes, and the pitch now goes *with*
  // the cursor — positive looks down as the cursor goes down. Before it, the
  // shipped tilt was −8.6° at curve 6.67 (the old `−1 × 0.15 rad` restated),
  // steep through the middle and held at the ends; that read as too much
  // helmet, and once the angle was a number on a slider the owner took it to
  // a fraction. About 6px of crown travel across a full sweep at 1440×900 —
  // under the whole composition's own `subjectParallax`, which is the point:
  // the helmet is worn, it is not looking around.
  helmetAmpX: 2.5,
  helmetCurveX: 0,
  helmetAmpY: 2.1,
  helmetCurveY: 0,
  helmetBrightness: 1,
  trailRadius: 0.46,
  trailIdleScale: 0.28,
  trailTaper: 1.9,
  trailTaperIdle: 1.6,
  trailTaperFast: 1.25,
  trailLength: 0.64,
  revealThreshold: 0.08,
  revealEdge: 0.005,
  revealWarp: 1.29,
  revealWarpScale: 2.9,
  revealSpeed: 1.25,
  pointerLerp: 0.17,
  pacePeak: 0.029,
  paceAttack: 0.09,
  paceRelease: 0.205,
  paceThreshold: 0.06,
  paceRamp: 0.15,
  outlinePeriod: 3.1,
  sweepWarp: 0.86,
  sweepLength: 0.67,
  sweepRadius: 0.33,
  outlineStagger: 1.2,
  outlineOpacity: 0.09,
  outlineWidth: 0.15,
  outlineBase: 0,
  outlineLightness: 0.64,
  bgLineScale: 3.8,
  // 1 slices the noise field into a single band, so the backdrop draws one
  // sparse iso-line rather than a dense contour map.
  bgLineCount: 2.5,
  bgLineThickness: 1.4,
  bgLineOpacity: 0.85,
  bgWaveAmount: 0.37,
  bgWaveSpeed: 1.66,
  // Linear, so the sRGB encode lands this near mid grey — close to the lit
  // helmet's on-screen value, which is what makes the two halves read as one.
  bgRevealLightness: 0.62,
  bgRevealLightnessAlt: 0.44,
  bgRevealOpacity: 1,
  introDuration: 4,
  burnStart: 0.14,
  burnSoftness: 0.02,
  burnGlow: 4,
  // **Off.** The idle sweep is a second, synthetic cursor that runs on its own
  // cycle whether or not anyone is pointing at the scene, so the helmet kept
  // revealing itself with the mouse nowhere near it. The reveal is a hover
  // effect and nothing else. The slider still brings it back — 0.76 was the
  // tuned extent, if it is ever wanted.
  autoSweepAmount: 0,
  autoSweepPeriod: 5,
  autoSweepStroke: 0.45,
  autoSweepHold: 0,
};
