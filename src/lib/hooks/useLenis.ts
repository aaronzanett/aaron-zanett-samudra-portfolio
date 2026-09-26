"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getScrollStops } from "@/lib/animation/scrollStops";
import { LOADING_DONE_EVENT } from "@/lib/loading";

/** Tablets and phones (by width or by touch) keep the browser's own scrolling. */
const NATIVE_SCROLL_QUERY = "(max-width: 1024px), (pointer: coarse)";

/** Within this many px of a stop counts as being on it. */
const STOP_TOLERANCE = 2;
/** A gesture is over once the wheel has been quiet this long (trackpad momentum keeps events coming). */
const GESTURE_QUIET_MS = 150;
/**
 * Stops only engage for a hard flick: a gesture must have travelled at least this many px (summed wheel
 * delta) before the next stop can cap it. Slow or small scrolling — a notch at a time, a gentle drag —
 * never reaches it, so it flows straight through the slides with nothing to catch on.
 */
const MIN_GESTURE_TRAVEL = 500;
/** Seconds the glide to a stop takes — short, so arriving on a slide feels immediate, not dragged out. */
const STOP_GLIDE_SECONDS = 0.5;
/** Same curve as the page's normal smooth scroll, so a glide to a stop feels like the rest of the site. */
const SMOOTH_EASING = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Makes smooth scrolling come to rest at the registered scroll stops (see scrollStops.ts) instead of
 * letting one hard flick fly past several slides. Once a gesture is a hard flick (see
 * MIN_GESTURE_TRAVEL), wheel input is clamped so a glide can travel at most to the next stop in its
 * direction; once it arrives, the rest of that same gesture (more notches or
 * trackpad momentum) is ignored until the wheel goes quiet or reverses. Runs after Lenis's own wheel
 * handler (registered later on the same target), so it can correct the target Lenis just set.
 */
function attachScrollStops(lenis: Lenis): () => void {
  let heldAt: number | null = null; // the stop this gesture has come to rest at
  let heldDirection = 0;
  let travellingTo: number | null = null; // the stop currently being glided to
  let travelDirection = 0;
  let quietTimer = 0;
  let gestureTravel = 0; // summed |wheel delta| of the current gesture
  let lastDirection = 0;

  const onWheel = (event: WheelEvent) => {
    if (lenis.isStopped) return;
    const direction = Math.sign(event.deltaY);
    if (direction === 0) return;

    if (direction !== lastDirection) gestureTravel = 0; // reversing starts a new gesture
    lastDirection = direction;
    gestureTravel += Math.abs(event.deltaY);

    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(() => {
      heldAt = null;
      gestureTravel = 0;
      // A glide that ended short of its stop for some other reason must not keep clamping later input.
      if (travellingTo !== null && lenis.isScrolling !== "smooth") travellingTo = null;
    }, GESTURE_QUIET_MS);

    if (heldAt !== null && direction !== heldDirection) heldAt = null; // reversing starts a new gesture
    if (travellingTo !== null && direction !== travelDirection) travellingTo = null;

    if (heldAt !== null) {
      // Same gesture, already at rest on the stop: stay put.
      lenis.scrollTo(heldAt, { immediate: true, force: true });
      return;
    }

    if (travellingTo === null) {
      const stops = getScrollStops();
      const position = lenis.animatedScroll;
      const next =
        direction > 0
          ? (stops.find((stop) => stop > position + STOP_TOLERANCE) ?? null)
          : ([...stops].reverse().find((stop) => stop < position - STOP_TOLERANCE) ?? null);
      if (next === null) return;
      if (gestureTravel < MIN_GESTURE_TRAVEL) return; // not a hard flick: leave it to Lenis, uncapped
      const target = lenis.targetScroll;
      const wouldReachOrPass = direction > 0 ? target >= next : target <= next;
      if (!wouldReachOrPass) return; // a short flick that stops on its own before the next stop
      travellingTo = next;
      travelDirection = direction;
    }

    // Every event of a gesture that is heading for a stop is pinned to it. (Non-programmatic, so
    // Lenis keeps the stop as its target instead of following the moving position — otherwise the
    // small tail events of trackpad momentum look like a short flick and the glide dies early.)
    // An explicit duration and easing are required: with `programmatic: false` Lenis has none by default
    // and would complete the animation in a single frame, teleporting the page to the stop.
    lenis.scrollTo(travellingTo, { force: true, programmatic: false, duration: STOP_GLIDE_SECONDS, easing: SMOOTH_EASING });
  };

  // Arrival: the glide has reached its stop, so the remainder of the gesture is held.
  const offScroll = lenis.on("scroll", () => {
    if (travellingTo === null) return;
    if (Math.abs(lenis.animatedScroll - travellingTo) <= STOP_TOLERANCE) {
      heldAt = travellingTo;
      heldDirection = travelDirection;
      travellingTo = null;
    }
  });

  window.addEventListener("wheel", onWheel, { passive: true });
  return () => {
    window.clearTimeout(quietTimer);
    window.removeEventListener("wheel", onWheel);
    offScroll();
  };
}

/**
 * Drives Lenis smooth scroll and keeps it in lockstep with GSAP's ticker so
 * ScrollTrigger reads the same scroll position Lenis is animating toward.
 * Smooth scrolling applies to the whole page on larger screens. It is skipped entirely under
 * prefers-reduced-motion and on tablet/mobile screens (NATIVE_SCROLL_QUERY), which keep the browser's
 * standard scrolling. The screen class is watched live, so resizing or rotating across the breakpoint
 * switches modes without a reload.
 */
export function useLenis(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const nativeScroll = window.matchMedia(NATIVE_SCROLL_QUERY);
    let teardown: (() => void) | null = null;

    const enable = () => {
      const lenis = new Lenis({
        duration: 1.1,
        easing: SMOOTH_EASING,
        smoothWheel: true,
        // <html> is height:100% (see layout.tsx's h-full) so its own box always equals the viewport —
        // it never resizes when page content does. Lenis's autoResize watches `content` with a
        // ResizeObserver to keep its scroll limit in sync, so watching <html> (its default) would
        // never see height changes from scenes that resize after mount (e.g. Scene 05's Type dials),
        // leaving the scrollable range stale and the page unreachable past the old limit. <body> has
        // no fixed height, so its box tracks real content height and the observer fires correctly.
        content: document.body,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const detachStops = attachScrollStops(lenis);

      // The loading screen locks scrolling; Lenis would otherwise still honour wheel input.
      if (document.documentElement.hasAttribute("data-loading")) lenis.stop();
      const onReady = () => lenis.start();
      window.addEventListener(LOADING_DONE_EVENT, onReady);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      teardown = () => {
        window.removeEventListener(LOADING_DONE_EVENT, onReady);
        gsap.ticker.remove(tick);
        detachStops();
        lenis.destroy();
      };
    };

    const sync = () => {
      if (nativeScroll.matches) {
        teardown?.();
        teardown = null;
      } else if (!teardown) {
        enable();
      }
    };

    sync();
    nativeScroll.addEventListener("change", sync);

    return () => {
      nativeScroll.removeEventListener("change", sync);
      teardown?.();
    };
  }, [reducedMotion]);
}
