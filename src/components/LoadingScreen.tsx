"use client";

import { useEffect, useRef, useState } from "react";
import { FONT_LOADS, LOADING_DONE_EVENT, getPreloadImageUrls } from "@/lib/loading";

/** Give up waiting (e.g. a CDN that never answers) so the page can never be trapped behind the overlay. */
const MAX_WAIT_MS = 15000;
/** Slowest the counter is allowed to run, so even a fully cached load reads as a deliberate ~1.2s count. */
const MIN_RATE = 85; // percent per second
const HOLD_AT_100_MS = 300;
/** Curtain: content fades (see globals.css), then the overlay lifts. Total must cover both. */
const EXIT_MS = 1400;
const ALMOST_AT = 90;

type Phase = "loading" | "exiting" | "done";

export function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [almost, setAlmost] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;

    // Everything behind the overlay is unreachable (keyboard included) until it leaves.
    const inerted = root ? Array.from(document.body.children).filter((el) => el !== root && !el.hasAttribute("inert")) : [];
    inerted.forEach((el) => el.setAttribute("inert", ""));

    // --- what to wait for -------------------------------------------------------------
    const tasks: Promise<unknown>[] = [
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }),
      ...FONT_LOADS.map((face) => document.fonts.load(face).catch(() => undefined)),
      ...getPreloadImageUrls().map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // a missing asset must not stall the page
            img.src = src;
          })
      ),
    ];
    let settled = 0;
    let target = 0; // real progress, 0–100
    tasks.forEach((task) => {
      task.then(() => {
        settled += 1;
        target = (settled / tasks.length) * 100;
      });
    });
    let capped = false;
    const cap = window.setTimeout(() => {
      capped = true;
    }, MAX_WAIT_MS);

    // --- the counter: eases toward real progress, never backwards ----------------------
    let shown = 0;
    let last = performance.now();
    let raf = 0;
    let almostSet = false;
    const timers: number[] = [];

    const paint = (value: number) => {
      const whole = Math.round(value);
      if (numberRef.current) numberRef.current.textContent = String(whole);
      if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;
      if (meterRef.current) meterRef.current.setAttribute("aria-valuenow", String(whole));
    };

    const leave = () => {
      window.clearInterval(fallback);
      html.removeAttribute("data-hold-anim"); // let Scene 01's entrance play as the curtain lifts
      setPhase("exiting");
      timers.push(
        window.setTimeout(() => {
          setPhase("done");
          html.removeAttribute("data-loading"); // scrolling comes back
          inerted.forEach((el) => el.removeAttribute("inert")); // and so does the page itself
          window.dispatchEvent(new Event(LOADING_DONE_EVENT));
        }, EXIT_MS)
      );
    };

    // One step of the counter. Returns true once it has finished (and scheduled the hand-off).
    let finished = false;
    const step = (now: number) => {
      if (finished) return true;
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const goal = capped ? 100 : target;
      const rate = Math.max(MIN_RATE, (goal - shown) * 6);
      shown = Math.min(goal, shown + rate * dt);
      paint(shown);
      if (!almostSet && shown >= ALMOST_AT) {
        almostSet = true;
        setAlmost(true);
      }
      if (shown >= 100) {
        finished = true;
        timers.push(window.setTimeout(leave, HOLD_AT_100_MS));
      }
      return finished;
    };
    const frame = (now: number) => {
      if (!step(now)) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Animation frames don't fire in background tabs or some embedded webviews. Timers still do, so
    // they keep the count moving (and let the cap fire) whenever frames have gone quiet.
    const fallback = window.setInterval(() => {
      if (performance.now() - last > 400 && step(performance.now())) cancelAnimationFrame(raf);
    }, 250);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(fallback);
      window.clearTimeout(cap);
      timers.forEach((t) => window.clearTimeout(t));
      inerted.forEach((el) => el.removeAttribute("inert"));
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div ref={rootRef} data-loading-screen data-phase={phase}>
      <div data-loading-content>
        <div ref={meterRef} role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} data-loading-meter>
          <span data-loading-figure>
            <span ref={numberRef}>0</span>
            <span data-loading-percent>%</span>
          </span>
          <span data-loading-track aria-hidden="true">
            <span ref={barRef} data-loading-bar />
          </span>
        </div>
        <div data-loading-messages aria-live="polite">
          <span data-loading-msg data-on={!almost} aria-hidden={almost} style={{ "--off-y": "-6px" } as React.CSSProperties}>
            Getting things ready
          </span>
          <span data-loading-msg data-on={almost} aria-hidden={!almost} style={{ "--off-y": "6px" } as React.CSSProperties}>
            Almost there
          </span>
        </div>
      </div>
    </div>
  );
}
