"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseStagedScrubOptions {
  /** The tall scroll track that defines how much scroll the sequence consumes. */
  trackRef: RefObject<HTMLElement | null>;
  /** The element the CSS custom properties are written to (read by descendants via var(--a) etc). */
  targetRef: RefObject<HTMLElement | null>;
  /** Progress thresholds (0–1) at which the next stage becomes the committed one. Length = stageCount - 1. */
  thresholds: number[];
  /** CSS custom property names, one per stage, in order (e.g. ['--a', '--b', '--c', '--d']). */
  vars: string[];
  reducedMotion: boolean;
  /** Fires once, the first time a given stage index becomes committed (for reveal-once choreography). */
  onStageCommit?: (index: number) => void;
}

/**
 * Drives a scroll-scrubbed "commit crossfade": scroll progress across `trackRef`
 * maps to a target stage index via `thresholds`, and a time-based tween eases a
 * floating position toward that target. Each stage's CSS var is a triangular
 * falloff of the eased position, so stages crossfade rather than hard-cut —
 * the same mechanism the design's Scene 01 stage and Scene 02 phase reveals use.
 */
export function useStagedScrub({
  trackRef,
  targetRef,
  thresholds,
  vars,
  reducedMotion,
  onStageCommit,
}: UseStagedScrubOptions) {
  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    const target = targetRef.current;
    if (!track || !target) return;

    const committed = new Set<number>();
    const state = { pos: 0 };
    let lastTargetIndex = 0;

    const applyVars = () => {
      vars.forEach((varName, i) => {
        const value = Math.max(0, 1 - Math.abs(state.pos - i));
        target.style.setProperty(varName, value.toFixed(4));
      });
    };

    applyVars();

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        let index = 0;
        for (const threshold of thresholds) {
          if (progress >= threshold) index += 1;
        }

        if (index !== lastTargetIndex) {
          lastTargetIndex = index;
          const distance = Math.abs(index - state.pos);
          gsap.to(state, {
            pos: index,
            duration: Math.min(0.6, 0.32 * Math.max(distance, 1)),
            ease: "power2.inOut",
            overwrite: true,
            onUpdate: applyVars,
          });
        }

        if (!committed.has(index)) {
          committed.add(index);
          onStageCommit?.(index);
        }
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(state);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
}
