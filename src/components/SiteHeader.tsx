"use client";

import { useEffect, useRef } from "react";
import { useSceneProgress } from "@/lib/hooks/useSceneProgress";

/** Measures its own height and publishes it as --hdr so pinned scenes offset correctly under it. */
function useMeasuredHeaderHeight(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () => {
      document.documentElement.style.setProperty("--hdr", `${el.offsetHeight}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
}

export function SiteHeader() {
  const { activeLabel, progress } = useSceneProgress();
  const ref = useRef<HTMLElement | null>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header
      ref={ref}
      className="sticky top-0 z-20 rounded-t-(--radius-page) border-b border-(--rule) bg-(--surface-page) px-(--gutter) pt-(--space-5) pb-(--space-4)"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-(--space-5)">
        <h1 className="m-0 font-grotesk text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-none font-semibold [letter-spacing:-0.02em]">
          Aaron Zanett Samudra
        </h1>
        <div className="flex flex-wrap items-baseline gap-(--space-5) text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)]">
          <span>Frontend Developer</span>
          <span
            aria-live="polite"
            className="inline-block text-(--text-muted) transition-[opacity,transform] duration-(--dur-fast) ease-(--ease-editorial)"
          >
            {activeLabel}
          </span>
        </div>
      </div>
      <div className="mt-(--space-2) h-[2px] bg-(--rule)">
        <div className="h-[2px] bg-ink-900" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
