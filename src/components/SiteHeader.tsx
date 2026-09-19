"use client";

import { useEffect, useRef, useState } from "react";
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

// Same beat as the design: fade the old label out, swap the text at 160ms, fade the new one in.
const LABEL_SWAP_MS = 160;

/**
 * The scene label in the header. Text changes fade out, swap, and fade back in, and the label's
 * width animates to the new text's width so the right-aligned "Frontend Developer" beside it
 * glides into place instead of jumping. Fades and width are written straight to the elements
 * (no state per frame); state only holds which text is currently shown.
 */
function useSceneLabelSwap(activeLabel: string) {
  const [shown, setShown] = useState(activeLabel);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (activeLabel === shown) return;
    const label = labelRef.current;
    if (label) {
      label.style.opacity = "0";
      label.style.transform = "translateY(-4px)";
    }
    const t = setTimeout(() => setShown(activeLabel), LABEL_SWAP_MS);
    return () => clearTimeout(t);
  }, [activeLabel, shown]);

  useEffect(() => {
    const label = labelRef.current;
    const wrap = wrapRef.current;
    const text = textRef.current;
    const fit = () => {
      if (wrap && text) wrap.style.width = `${text.offsetWidth}px`;
    };
    fit();
    if (label) {
      label.style.opacity = "1";
      label.style.transform = "none";
    }
    // Re-fit if the text's own size changes later (e.g. the web font finishes loading).
    const ro = text ? new ResizeObserver(fit) : null;
    if (text && ro) ro.observe(text);
    return () => ro?.disconnect();
  }, [shown]);

  return { shown, labelRef, wrapRef, textRef };
}

export function SiteHeader() {
  const { activeLabel, progress } = useSceneProgress();
  const ref = useRef<HTMLElement | null>(null);
  useMeasuredHeaderHeight(ref);
  const { shown, labelRef, wrapRef, textRef } = useSceneLabelSwap(activeLabel);

  return (
    <header
      ref={ref}
      // Rounded only at the very top of the page, where it forms the card's corners. Once stuck to the
      // viewport the corners would be transparent and let scrolling content (e.g. a scene's full-width
      // border) peek out at the edges, so they square off.
      className={`sticky top-0 z-20 border-b border-(--rule) bg-(--surface-page) px-(--gutter) pt-(--space-5) pb-(--space-4) transition-[border-radius] duration-(--dur-fast) ease-(--ease-editorial) ${
        progress > 0 ? "rounded-t-none" : "rounded-t-(--radius-page)"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-(--space-5)">
        <h1 className="m-0 font-grotesk text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-none font-semibold [letter-spacing:-0.02em]">
          Aaron Zanett Samudra
        </h1>
        <div className="flex flex-wrap items-baseline gap-(--space-5) text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)]">
          <span>Frontend Developer</span>
          <span
            ref={wrapRef}
            aria-live="polite"
            className="inline-block whitespace-nowrap transition-[width] duration-(--dur-base) ease-(--ease-editorial)"
          >
            <span
              ref={labelRef}
              className="inline-block text-(--text-muted) transition-[opacity,transform] duration-(--dur-fast) ease-(--ease-editorial)"
            >
              <span ref={textRef} className="inline-block">
                {shown}
              </span>
            </span>
          </span>
        </div>
      </div>
      <div className="mt-(--space-2) h-[2px] bg-(--rule)">
        <div className="h-[2px] bg-ink-900" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
