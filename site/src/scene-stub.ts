// Runtime-build stand-in for scene.ts. The main-thread bundle must not contain
// three.js (the scene runs in a worker), so the Instatic build aliases
// `./scene.ts` to this file. `HeroScene` forwards to the worker host the deps
// script put on `globalThis.__LK_LIBS__`; the pure params come from hero-params.
export {
  CAMERA_FOV,
  CAMERA_Y,
  fitSubjectToBox,
  visibleWorldHeight,
  DEFAULT_PARAMS,
} from "./hero-params";
export type { HeroSceneParams } from "./hero-params";

export class HeroScene {
  constructor(canvas: HTMLCanvasElement) {
    // A constructor may return an object; this makes `new HeroScene(c)` yield
    // the host instance, so every later call lands on it.
    return new (
      globalThis as unknown as { __LK_LIBS__: { HeroScene: new (c: HTMLCanvasElement) => unknown } }
    ).__LK_LIBS__.HeroScene(canvas) as unknown as HeroScene;
  }
}
