"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOADING_DONE_EVENT } from "@/lib/loading";

/**
 * Drives Lenis smooth scroll and keeps it in lockstep with GSAP's ticker so
 * ScrollTrigger reads the same scroll position Lenis is animating toward.
 * Skips smoothing entirely under prefers-reduced-motion — native scroll only.
 */
export function useLenis(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

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

    // The loading screen locks scrolling; Lenis would otherwise still honour wheel input.
    if (document.documentElement.hasAttribute("data-loading")) lenis.stop();
    const onReady = () => lenis.start();
    window.addEventListener(LOADING_DONE_EVENT, onReady);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener(LOADING_DONE_EVENT, onReady);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);
}
