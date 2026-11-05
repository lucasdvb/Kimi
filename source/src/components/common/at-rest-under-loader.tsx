"use client";

import { useEffect, useState, type ReactNode } from "react";

import { RobotProvider } from "./robot-view";

/**
 * First-screen copy served **at rest** beneath an opaque loader, then handed to
 * its entrance (the fleet's "at rest under the curtain", D-028 lever 1).
 *
 * Every `Spring` / `TextEngine` renders its `from` state into the server HTML,
 * so the hero headline shipped invisible and first painted when the loader
 * handed over — after the whole 3D scene was built. On a phone that frame was
 * the LCP (Render Delay ~8 s under Lighthouse's 4G / 4x model).
 *
 * Here the subtree renders in the robot form's at-rest shape (`robot-spring`,
 * `robot-text`: plain elements at their `to` state) through the server render
 * and hydration — where the opaque loader already covers the first screen, so
 * a visitor sees nothing — and switches to the live springs once a frame has
 * been presented, still covered. Those mount at their `from` state and play the same
 * entrance when the loader hands over. The LCP is recorded at first paint.
 *
 * Wrap only content the loader covers; never the loader itself.
 */
/** Gap between steps — long enough that React renders each in its own task. */
const STEP_MS = 40;

export const AtRestUnderLoader = ({
  robot,
  step = 0,
  children,
}: {
  /** The page's own robot flag — the robot form stays at rest for good. */
  robot: boolean;
  /**
   * This region's turn in the switch. Each step goes live in its own task,
   * `STEP_MS` after the one before: switching the whole hero at once mounted
   * every spring and the headline's text engine in one render — a 23–27 ms
   * task twice over (observed, unthrottled; ~100 ms each in Lighthouse's 4x
   * model). All of it is still under the opaque loader. D-028 wave 6.
   */
  step?: number;
  children: ReactNode;
}) => {
  // At rest until the browser has **presented** a frame with this copy in it;
  // live after that. Not "the render after hydration", and not two rAFs: on a
  // slow or busy first paint, hydration (and rAFs) can run before any frame is
  // presented, and the copy then never paints at rest — Chrome recorded the
  // LCP at the reveal again (1 run in 3 locally, under load). A paint entry is
  // the browser saying the frame went out. The loader still covers it all.
  const [live, setLive] = useState(false);
  useEffect(() => {
    const supported = PerformanceObserver.supportedEntryTypes ?? [];
    const type = supported.includes("largest-contentful-paint")
      ? "largest-contentful-paint"
      : supported.includes("paint")
        ? "paint"
        : null;
    let frame = 0;
    let stagger: ReturnType<typeof setTimeout> | undefined;
    const goLive = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (step === 0) setLive(true);
        else stagger = setTimeout(() => setLive(true), step * STEP_MS);
      });
    };
    // Nothing to wait on (or it never comes): go live after a beat — at worst
    // the copy is shown at rest, without its entrance.
    const fallback = setTimeout(goLive, 3000);
    if (!type) return () => clearTimeout(fallback);
    const observer = new PerformanceObserver((list) => {
      if (list.getEntries().length === 0) return;
      observer.disconnect();
      clearTimeout(fallback);
      goLive();
    });
    observer.observe({ type, buffered: true });
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
      clearTimeout(stagger);
      cancelAnimationFrame(frame);
    };
  }, [step]);
  return <RobotProvider robot={robot || !live}>{children}</RobotProvider>;
};
