"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOADING_DONE_EVENT } from "@/lib/loading";

/** Tablets and phones (by width or by touch) keep the browser's own scrolling. */
const NATIVE_SCROLL_QUERY = "(max-width: 1024px), (pointer: coarse)";

/**
 * WHERE EACH SCROLL MODE APPLIES (desktop; tablets and phones are always standard scroll):
 *
 *   Standard (browser) scroll — the first part of Scenes 02 and 04:
 *     Scene 02  from its top reaching the header (0) to 30% of its pinned range
 *     Scene 04  from its top reaching the header (0) to 40% of its pinned range
 *   Smooth (Lenis) scroll — everywhere else:
 *     Scene 01, the rest of Scene 02, Scene 03, the rest of Scene 04, Scene 05, Scene 06.
 *
 * Elements marked `data-native-scroll` are the standard-scroll scenes; the attribute's value is the end
 * of that scene's standard zone as a fraction of its pinned range (0.3 for Scene 02; Scene 04 uses this
 * default). The mode is a pure function of scroll position, so it is identical scrolling down or up.
 */
const DEFAULT_NATIVE_ZONE_END = 0.4;

/**
 * True while a marked element is in the native part of its pinned range. The range runs from its top
 * reaching the header (progress 0) to its bottom reaching the viewport's bottom (progress 1, where the
 * pin releases) — the same span the scene's own scroll animation uses.
 */
function inNativeScrollZone(): boolean {
  const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr")) || 0;
  const pinnedHeight = window.innerHeight - headerHeight;
  return Array.from(document.querySelectorAll("[data-native-scroll]")).some((el) => {
    const rect = el.getBoundingClientRect();
    const scrollLength = rect.height - pinnedHeight;
    if (scrollLength <= 0) return false;
    const progress = (headerHeight - rect.top) / scrollLength;
    const end = parseFloat(el.getAttribute("data-native-scroll") ?? "") || DEFAULT_NATIVE_ZONE_END;
    return progress >= 0 && progress < end;
  });
}

/**
 * Drives Lenis smooth scroll and keeps it in lockstep with GSAP's ticker so
 * ScrollTrigger reads the same scroll position Lenis is animating toward.
 * Skips smoothing entirely under prefers-reduced-motion, and on tablet/mobile
 * screens — native scroll only there. The screen class is watched live, so
 * resizing or rotating across the breakpoint switches modes without a reload.
 */
export function useLenis(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const nativeScroll = window.matchMedia(NATIVE_SCROLL_QUERY);
    let teardown: (() => void) | null = null;

    const enable = () => {
      // Lenis asks `prevent` once per node along the event path; answer once per event.
      let lastAnswerAt = 0;
      let lastAnswer = false;
      const inStandardZone = () => {
        const now = performance.now();
        if (now - lastAnswerAt > 4) {
          lastAnswer = inNativeScrollZone();
          lastAnswerAt = now;
        }
        return lastAnswer;
      };

      const lenis: Lenis = new Lenis({
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
        // Inside a standard-scroll zone Lenis leaves wheel/touch input to the browser.
        prevent: inStandardZone,
      });

      lenis.on("scroll", () => {
        ScrollTrigger.update();
        // A smooth glide that carries the page into a standard-scroll zone is cut off right at its edge
        // (and the input from then on belongs to the browser). Without this the glide keeps calling
        // scrollTo through the zone, so the scene stays smooth in whichever direction it was entered.
        if (lenis.isScrolling === "smooth" && inNativeScrollZone()) {
          lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        }
      });

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
