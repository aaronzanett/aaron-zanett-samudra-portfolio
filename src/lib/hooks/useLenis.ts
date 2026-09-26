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
 * Makes smooth scrolling come to rest at the registered scroll stops (see scrollStops.ts) instead of
 * letting one hard flick fly past several slides. Wheel input is clamped so a glide can travel at most
 * to the next stop in its direction; once it arrives, the rest of that same gesture (more notches or
 * trackpad momentum) is ignored until the wheel goes quiet or reverses. Runs after Lenis's own wheel
 * handler (registered later on the same target), so it can correct the target Lenis just set.
 */
function attachScrollStops(lenis: Lenis): () => void {
  let heldAt: number | null = null; // the stop this gesture has come to rest at
  let heldDirection = 0;
  let travellingTo: number | null = null; // the stop currently being glided to
  let travelDirection = 0;
  let quietTimer = 0;

  const onWheel = (event: WheelEvent) => {
    if (lenis.isStopped) return;
    const direction = Math.sign(event.deltaY);
    if (direction === 0) return;

    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(() => {
      heldAt = null;
    }, GESTURE_QUIET_MS);

    if (heldAt !== null && direction !== heldDirection) heldAt = null; // reversing starts a new gesture
    if (travellingTo !== null && direction !== travelDirection) travellingTo = null;

    if (heldAt !== null) {
      lenis.scrollTo(heldAt, { force: true }); // still the same gesture: stay put
      return;
    }

    let next = travellingTo;
    if (next === null) {
      const stops = getScrollStops();
      const position = lenis.animatedScroll;
      next =
        direction > 0
          ? (stops.find((stop) => stop > position + STOP_TOLERANCE) ?? null)
          : ([...stops].reverse().find((stop) => stop < position - STOP_TOLERANCE) ?? null);
    }
    if (next === null) return;

    const target = lenis.targetScroll;
    const wouldReachOrPass = direction > 0 ? target >= next : target <= next;
    if (!wouldReachOrPass) return; // a short flick that stops on its own before the next stop
    travellingTo = next;
    travelDirection = direction;
    if (target !== next) lenis.scrollTo(next, { force: true });
  };

  // Arrival: the glide has reached its stop, so the remainder of the gesture is held.
  const offScroll = lenis.on("scroll", () => {
    if (travellingTo === null) return;
    if (Math.abs(lenis.animatedScroll - travellingTo) <= STOP_TOLERANCE) {
      heldAt = travellingTo;
      heldDirection = travelDirection;
      travellingTo = null;
    } else if (lenis.isScrolling !== "smooth") {
      travellingTo = null; // the glide was interrupted (e.g. a scrollbar drag); don't stay clamped to it
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
        easing: (t) => 1 - Math.pow(1 - t, 3),
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
