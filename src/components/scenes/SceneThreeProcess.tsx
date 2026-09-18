"use client";

import { useCallback, useRef, useState } from "react";
import { scene03Content as content, type RowMode } from "@/content/scene-03";
import { useStagedScrub } from "@/lib/animation/useStagedScrub";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useRegisterScene } from "@/lib/hooks/useSceneProgress";
import { Label } from "@/components/ui/Label";

const BEAT_VARS = ["--b1", "--b2", "--b3", "--b4", "--b5", "--b6"];
const BEAT_THRESHOLDS = [0.15, 0.32, 0.49, 0.66, 0.83];

/**
 * The source design drives this scene with a virtual-canvas camera panning
 * across a 2700×2100 composition (three workflow rows, SVG connector draws,
 * a convergence zoom, a product-shot morph). Reimplementing that literal
 * camera system was judged not worth the risk/complexity here — instead this
 * reuses the same staged-crossfade mechanism as Scenes 01–02: six sequential
 * beats (intro, 3 workflow rows, convergence, handoff), each revealed once as
 * scroll reaches it. Visual outcome (three paths converging on one maker,
 * then holding into "Selected work") is preserved; the pixel-perfect camera
 * move is not.
 */
export function SceneThreeProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState<boolean[]>([true, false, false, false, false, false]);

  useRegisterScene(sectionRef, "Scene 03 — The Process");

  const onBeatCommit = useCallback((index: number) => {
    setRevealed((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  useStagedScrub({
    trackRef: sectionRef,
    targetRef: pinRef,
    thresholds: BEAT_THRESHOLDS,
    vars: BEAT_VARS,
    reducedMotion,
    onStageCommit: onBeatCommit,
  });

  const isRevealed = (i: number) => reducedMotion || revealed[i];

  return (
    <section ref={sectionRef} aria-labelledby="s3-h" className="relative" style={{ height: reducedMotion ? "auto" : "640vh" }}>
      <div
        ref={pinRef}
        className={
          reducedMotion
            ? "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-(--space-9) px-(--gutter) py-(--space-8)"
            : "box-border grid min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden px-(--gutter) py-(--space-4)"
        }
        style={reducedMotion ? undefined : { position: "sticky", top: "var(--hdr)", height: "calc(100vh - var(--hdr))" }}
      >
        <div className="mb-(--space-6) flex items-baseline justify-between border-t border-ink-900 pt-(--space-2)">
          <Label>Scene 03</Label>
          <Label>The Process</Label>
        </div>

        <div
          className={
            reducedMotion ? "grid min-w-0 gap-(--space-9)" : "relative grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] items-center [grid-template-areas:'stack']"
          }
        >
          <Beat index={0} reducedMotion={reducedMotion}>
            <Label muted>{content.heading.kicker}</Label>
            <h2 id="s3-h" className="m-0 mt-(--space-3) max-w-[22ch] text-balance text-[length:var(--type-display-2)] leading-[var(--type-display-lh)] font-normal [letter-spacing:var(--type-display-tracking)]">
              {content.heading.title}
            </h2>
            <p className="m-0 mt-(--space-4) text-[length:var(--type-lead)] text-(--text-secondary)">{content.heading.lead}</p>
          </Beat>

          {content.rows.map((row, i) => (
            <Beat key={row.num} index={i + 1} reducedMotion={reducedMotion}>
              <RowDiagram
                num={row.num}
                title={row.title}
                mode={row.mode}
                steps={row.steps}
                proves={row.proves}
                revealed={isRevealed(i + 1)}
              />
            </Beat>
          ))}

          <Beat index={4} reducedMotion={reducedMotion}>
            <div className="grid justify-items-start gap-(--space-3)">
              <Label muted>{content.convergence.caption}</Label>
              <div className="grid h-[180px] w-[180px] place-items-center rounded-(--radius-panel-lg) bg-red-500 text-cream-100 sm:h-[220px] sm:w-[220px]">
                <div className="grid justify-items-center gap-2">
                  <Label className="opacity-80">{content.convergence.label}</Label>
                  <span className="font-display text-[3.25rem] leading-none italic">{content.convergence.word}</span>
                </div>
              </div>
            </div>
          </Beat>

          <Beat index={5} reducedMotion={reducedMotion}>
            <div className="grid justify-items-start gap-(--space-5)">
              <p className="m-0 max-w-[18ch] text-balance font-display text-[clamp(1.75rem,4vw,3rem)] italic leading-[1.05]">{content.handoff.line1}</p>
              <p className="m-0 max-w-[22ch] text-balance font-display text-[clamp(1.25rem,2.6vw,2rem)] italic leading-[1.1] text-(--text-secondary)">
                {content.handoff.line2}
              </p>
              <Label muted>{content.handoff.cue}</Label>
            </div>
          </Beat>
        </div>
      </div>
    </section>
  );
}

function Beat({ index, reducedMotion, children }: { index: number; reducedMotion: boolean; children: React.ReactNode }) {
  return (
    <div
      className="min-w-0"
      style={
        reducedMotion
          ? undefined
          : { gridArea: "stack", alignSelf: "center", opacity: `var(--b${index + 1}, ${index === 0 ? 1 : 0})`, transform: `translateY(calc((1 - var(--b${index + 1}, ${index === 0 ? 1 : 0})) * 20px))` }
      }
    >
      {children}
    </div>
  );
}

function RowDiagram({
  num,
  title,
  mode,
  steps,
  proves,
  revealed,
}: {
  num: string;
  title: string;
  mode: RowMode;
  steps: string[];
  proves: string;
  revealed: boolean;
}) {
  return (
    <div data-row-mode={mode} data-row-revealed={revealed || undefined}>
      <div className="mb-(--space-4) flex items-baseline gap-(--space-3)">
        <Label muted>{num}</Label>
        <span className="text-[length:var(--type-lead)] [letter-spacing:-0.02em]">{title}</span>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-(--space-2)">
        {steps.map((step, i) => (
          <div key={step} className="flex min-w-0 flex-1 items-center gap-(--space-2)" style={{ minWidth: 110 }}>
            <span
              data-row-tile
              className={`grid h-[68px] flex-1 place-items-center rounded-(--radius-panel) px-(--space-3) text-center text-[length:var(--type-small)] font-medium ${
                i === steps.length - 1 ? "bg-amber-500" : "bg-cream-100"
              }`}
              style={{
                transitionDelay: `${i * 70}ms`,
                ...(mode === "chaos" && i < steps.length - 1 ? ({ "--jitter": i % 2 === 0 ? "-3.4deg" : "3.4deg" } as React.CSSProperties) : undefined),
              }}
            >
              {step}
            </span>
            {i < steps.length - 1 && <span data-row-connector className="h-px w-(--space-4) flex-none bg-(--rule-strong)" style={{ transitionDelay: `${i * 70 + 40}ms` }} />}
          </div>
        ))}
      </div>
      <p className="m-0 mt-(--space-3) text-[length:var(--type-small)] text-(--text-secondary)">{proves}</p>
    </div>
  );
}
