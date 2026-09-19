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
