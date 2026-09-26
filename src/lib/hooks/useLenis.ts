"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOADING_DONE_EVENT } from "@/lib/loading";

/** Tablets and phones (by width or by touch) keep the browser's own scrolling. */
const NATIVE_SCROLL_QUERY = "(max-width: 1024px), (pointer: coarse)";

/**
 * Scenes 02 and 04 (elements marked `data-native-scroll`) keep the browser's own scrolling on desktop
 * too — but only for the first part of each one's pinned scroll range. Once its progress passes the end
 * fraction, smooth scrolling resumes, so the hand-off to the next scene is smooth rather than native
 * all the way to the very end. The marker's value overrides this default per scene (lower = smooth
 * resumes earlier).
 */
const DEFAULT_NATIVE_ZONE_END = 0.6;

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
      // Which scroller currently owns wheel/touch input. It only changes while Lenis has no smooth
      // animation in flight: flipping mid-glide leaves Lenis's tween still calling scrollTo while the
      // browser scrolls natively, and the two fight over the position (the jerk at the hand-off). Waiting
      // for the glide to settle makes the switch invisible; when leaving native scroll there is nothing
      // in flight (Lenis re-syncs to the real position on native scroll), so that flip is immediate.
      let nativeOwnsScroll = false;
      let lastEvaluated = 0;
      const decideOwner = () => {
        // Lenis asks once per node along the event path; answer once per event.
        const now = performance.now();
        if (now - lastEvaluated < 8) return nativeOwnsScroll;
        lastEvaluated = now;
        const wantsNative = inNativeScrollZone();
        if (wantsNative !== nativeOwnsScroll && lenis.isScrolling !== "smooth") nativeOwnsScroll = wantsNative;
        return nativeOwnsScroll;
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
        // Inside a native-scroll zone Lenis leaves wheel/touch input to the browser (see decideOwner).
        prevent: decideOwner,
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
