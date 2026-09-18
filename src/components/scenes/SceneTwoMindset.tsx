"use client";

import { useCallback, useRef } from "react";
import { scene02Content as content } from "@/content/scene-02";
import { useStagedScrub } from "@/lib/animation/useStagedScrub";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useRegisterScene } from "@/lib/hooks/useSceneProgress";
import { Label } from "@/components/ui/Label";

const PHASE_VARS = ["--f1", "--f2", "--f3", "--f4", "--f5", "--f6"];
// Reveal-once attribute per phase index — Understand (0) has no gated micro-animation, just the crossfade.
const REVEAL_ATTR = [null, "data-design-reveal", "data-xp-reveal", "data-sys-reveal", "data-tools-reveal", "data-ref-reveal"] as const;

export function SceneTwoMindset() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null, null, null]);
  const reducedMotion = useReducedMotion();

  useRegisterScene(sectionRef, "Scene 02 — The Mindset");

  // Outer crossfade: intro copy (--i) hands off to the phases group (--g) at 12% scroll.
  useStagedScrub({
    trackRef: sectionRef,
    targetRef: pinRef,
    thresholds: [0.12],
    vars: ["--i", "--g"],
    reducedMotion,
  });

  const onPhaseCommit = useCallback((index: number) => {
    const attr = REVEAL_ATTR[index];
    const el = frameRefs.current[index];
    if (attr && el) el.setAttribute(attr, "1");
  }, []);

  const registerFrameRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      frameRefs.current[index] = el;
    },
    []
  );

  // Inner crossfade: the remaining 88% of scroll is split evenly across the 6 phase frames.
  useStagedScrub({
    trackRef: sectionRef,
    targetRef: pinRef,
    thresholds: [1, 2, 3, 4, 5].map((k) => 0.12 + (k / 6) * 0.88),
    vars: PHASE_VARS,
    reducedMotion,
    onStageCommit: onPhaseCommit,
  });

  return (
    <section ref={sectionRef} aria-labelledby="s2-h" className="relative" style={{ height: reducedMotion ? "auto" : "760vh" }}>
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
          <Label>Scene 02</Label>
          <Label>The Mindset</Label>
        </div>

        <div
          className={
            reducedMotion
              ? "grid min-w-0 gap-(--space-9)"
              : "relative grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] items-center [grid-template-areas:'stack']"
          }
        >
          {/* Intro */}
          <div
            className="min-w-0"
            style={reducedMotion ? undefined : { gridArea: "stack", alignSelf: "center", opacity: "var(--i, 1)", transform: "translateY(calc((1 - var(--i, 1)) * -20px))" }}
          >
            <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-start gap-(--gutter)">
              <h2 id="s2-h" className="m-0 max-w-[20ch] text-balance font-grotesk text-[clamp(1.75rem,3.7vw,3.5rem)] leading-[1.06] font-normal [letter-spacing:-0.025em]">
                {content.intro.heading}
              </h2>
              <div className="grid max-w-[62ch] gap-(--space-5)">
                <p className="m-0 text-[length:var(--type-lead)] leading-[1.35]">{content.intro.lead}</p>
                <p className="m-0 text-[length:var(--type-body)] leading-[var(--type-body-lh)] text-(--text-secondary)">{content.intro.body}</p>
              </div>
            </div>
          </div>

          {/* Phases group */}
          <div
            aria-hidden={!reducedMotion}
            className={`min-w-0 grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-(--gutter) ${reducedMotion ? "" : "pointer-events-none"}`}
            style={reducedMotion ? undefined : { gridArea: "stack", alignSelf: "center", opacity: "var(--g, 0)", transform: "translateY(calc((1 - var(--g, 0)) * 24px))" }}
          >
            <ol className="m-0 grid max-w-[460px] list-none gap-(--space-1) p-0">
              {content.phases.map((phase, i) => (
                <li
                  key={phase.num}
                  className="grid grid-cols-[34px_1fr] gap-(--space-4) border-t border-(--rule) py-(--space-2)"
                  style={reducedMotion ? undefined : { opacity: `calc(0.3 + 0.7 * var(--f${i + 1}, ${i === 0 ? 1 : 0}))` }}
                >
                  <span className="text-[length:var(--type-label)] font-bold [letter-spacing:var(--type-label-tracking)]">{phase.num}</span>
                  <span>
                    <span className="text-[length:var(--type-lead)] leading-[1.1] [letter-spacing:-0.02em]">{phase.name}</span>
                    <br />
                    <span className="text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-secondary)">
                      {phase.tagline}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <div
              className={
                reducedMotion
                  ? "grid min-w-0 gap-(--space-6) rounded-(--radius-panel-lg) bg-(--surface-raised) p-(--space-2)"
                  : "relative grid min-w-0 grid-cols-[minmax(0,1fr)] items-stretch rounded-(--radius-panel-lg) bg-(--surface-raised) [grid-template-areas:'stack']"
              }
            >
              {/*
                No product-film video asset exists yet. The design calls for a scroll-scrubbed
                cinematic video behind these frames; wiring one in is a drop-in once Aaron has
                a video file — see PRD §3 and claude.md's scroll-scrubbed video pipeline.
              */}
              <PhaseFrame registerRef={registerFrameRef(0)} reducedMotion={reducedMotion} varName="--f1" isFirst>
                <UnderstandFrame />
              </PhaseFrame>
              <PhaseFrame registerRef={registerFrameRef(1)} reducedMotion={reducedMotion} varName="--f2">
                <DesignFrame />
              </PhaseFrame>
              <PhaseFrame registerRef={registerFrameRef(2)} reducedMotion={reducedMotion} varName="--f3">
                <ExperienceFrame />
              </PhaseFrame>
              <PhaseFrame registerRef={registerFrameRef(3)} reducedMotion={reducedMotion} varName="--f4">
                <SystemFrame />
              </PhaseFrame>
              <PhaseFrame registerRef={registerFrameRef(4)} reducedMotion={reducedMotion} varName="--f5">
                <ToolsFrame />
              </PhaseFrame>
              <PhaseFrame registerRef={registerFrameRef(5)} reducedMotion={reducedMotion} varName="--f6">
                <RefineFrame />
              </PhaseFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhaseFrame({
  registerRef,
  varName,
  isFirst = false,
  reducedMotion,
  children,
}: {
  registerRef: (el: HTMLDivElement | null) => void;
  varName: string;
  isFirst?: boolean;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={registerRef}
      data-frame
      className={reducedMotion ? "min-w-0 grid content-start gap-(--space-4) rounded-(--radius-panel) p-(--space-4)" : "min-w-0 grid content-between gap-(--space-4) p-(--space-5)"}
      style={reducedMotion ? undefined : { gridArea: "stack", opacity: `var(${varName}, ${isFirst ? 1 : 0})` }}
    >
      {children}
    </div>
  );
}

function UnderstandFrame() {
  const c = content.understand;
  return (
    <>
      <Label muted>{c.label}</Label>
      <div className="grid gap-(--space-2)">
        {c.items.map((item, i) => (
          <div key={item} className={`pt-(--space-2) text-[length:var(--type-small)] ${i === 0 ? "border-t border-ink-900" : "border-t border-(--rule)"}`}>
            {item}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-(--space-2)">
        {c.tags.map((tag) => (
          <span key={tag} className="rounded-(--radius-panel) bg-cream-100 px-3.5 py-2 text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)]">
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

function DesignFrame() {
  const c = content.design;
  return (
    <>
      <Label muted>{c.label}</Label>
      <div className="relative grid gap-(--space-4) overflow-hidden py-(--space-3)">
        <div className="grid grid-cols-[minmax(0,104px)_minmax(0,1fr)] items-center gap-(--space-4)">
          <span className="text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-secondary)">Font</span>
          <div className="flex min-w-0 items-baseline gap-(--space-4)">
            <span data-type-spec className="font-display text-[3.25rem] leading-[0.92] font-medium italic">Aa</span>
            <span className="grid text-[length:var(--type-label)] font-bold uppercase leading-[1.3] [letter-spacing:var(--type-label-tracking)]">
              {c.trials.map((trial, i) => (
                <span key={trial} data-trial={["a", "b", "c"][i]} className={`[grid-area:1/1] ${i < 2 ? "text-(--text-secondary)" : ""}`}>
                  {trial}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,104px)_minmax(0,1fr)] items-center gap-(--space-4)">
          <span className="text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-secondary)">Colour</span>
          <div className="flex min-w-0 gap-(--space-2)">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} data-sw={n} className="h-[38px] max-w-[64px] flex-1 rounded-(--radius-panel) bg-(--clay-400)" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,104px)_minmax(0,1fr)] items-center gap-(--space-4)">
          <span className="text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-secondary)">Scale</span>
          <div className="flex h-12 items-end gap-(--space-2)">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} data-bar={n} className="w-1 bg-(--clay-400)" style={{ height: 24 }} />
            ))}
            <span className="ml-(--space-3) self-end text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-secondary)">
              {c.scaleCaption}
            </span>
          </div>
        </div>
      </div>
      <div />
    </>
  );
}

function ExperienceFrame() {
  const c = content.experience;
  return (
    <>
      <Label muted>{c.label}</Label>
      <div className="grid grid-cols-2 gap-(--space-3) sm:grid-cols-4">
        {c.steps.map((step, i) => (
          <div key={step} data-xp-step={i + 1} className="relative grid min-h-[74px] content-start gap-(--space-1) rounded-(--radius-panel) border border-ink-900 p-(--space-3)">
            <span className="text-[length:var(--type-label)] font-bold [letter-spacing:var(--type-label-tracking)] text-(--text-muted)">0{i + 1}</span>
            <span className="text-[length:var(--type-small)]">{step}</span>
            {i === 0 && <span data-xp-ring className="absolute right-2 bottom-2 h-3.5 w-3.5 rounded-full border border-ink-900" />}
          </div>
        ))}
      </div>
      <div className="relative grid min-h-[2.6em] border-t border-(--rule) pt-(--space-3)">
        {c.notes.map((note, i) => (
          <p
            key={note}
            data-xp-note={["a", "b", "c"][i]}
            className={`m-0 [grid-area:1/1] text-[length:var(--type-small)] leading-[1.4] ${i < 2 ? "text-(--text-secondary)" : ""}`}
          >
            {note}
          </p>
        ))}
      </div>
    </>
  );
}

function SystemFrame() {
  const c = content.system;
  return (
    <>
      <Label muted>{c.label}</Label>
      <div className="grid gap-(--space-4)">
        <div className="flex flex-wrap items-center gap-(--space-3)">
          <span data-sys-asset="1" className="rounded-(--radius-panel) bg-ink-900 px-3.5 py-2 text-[length:var(--type-label)] font-bold uppercase text-cream-100 [letter-spacing:var(--type-label-tracking)]">
            {c.atoms[0]}
          </span>
          <span data-sys-asset="2" className="border-b border-ink-900 pb-1 text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)]">
            {c.atoms[1]}
          </span>
          <span data-sys-asset="3" className="rounded-(--radius-panel) bg-cream-100 px-3.5 py-2 text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)]">
            {c.atoms[2]}
          </span>
          <span data-sys-asset="4" className="border-t border-ink-900 pt-1 text-[length:var(--type-label)] font-bold uppercase text-(--text-secondary) [letter-spacing:var(--type-label-tracking)]">
            {c.atoms[3]}
          </span>
        </div>
        <div data-sys-rule className="h-px bg-ink-900" />
        <div className="grid gap-(--space-2)">
          {c.usage.map((row, i) => (
            <div key={row.context} data-sys-use={i + 1} className="grid grid-cols-[96px_1fr] items-center gap-(--space-3) border-t border-(--rule) pt-(--space-2)">
              <Label muted>{row.context}</Label>
              <span className="text-[length:var(--type-small)] text-(--text-secondary)">{row.preview}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ToolsFrame() {
  const c = content.tools;
  return (
    <>
      <Label muted>{c.label}</Label>
      <div className="grid gap-(--space-4)">
        {c.groups.map((group, gi) => (
          <div key={group.title}>
            <div data-tools-rule={gi + 1} className="mb-(--space-2) h-px origin-left bg-ink-900" />
            <Label muted className="mb-(--space-2) block">{group.title}</Label>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-(--space-3)">
              {group.items.map((tool, ti) => (
                <div
                  key={tool}
                  data-tool
                  className="grid justify-items-center gap-1.5"
                  style={{ animationDelay: `${(gi === 0 ? ti : c.groups[0].items.length + ti) * 55}ms` }}
                >
                  <span className="grid h-[30px] w-[30px] place-items-center rounded-(--radius-panel) bg-cream-100 text-[10px] font-bold uppercase">
                    {tool.slice(0, 2)}
                  </span>
                  <span className="text-center text-[10px] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-secondary)">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RefineFrame() {
  const c = content.refine;
  return (
    <>
      <Label muted>{c.label}</Label>
      <div className="flex flex-wrap gap-(--space-2)">
        {c.steps.map((step, i) => (
          <span
            key={step}
            data-ref-step={i + 1}
            className="rounded-(--radius-panel) border border-ink-900 px-3.5 py-2 text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)]"
          >
            {step}
          </span>
        ))}
      </div>
      <div className="grid gap-(--space-2) border-t border-(--rule) pt-(--space-3)">
        {c.checklist.map((item, i) => (
          <div key={item} data-ref-item={i + 1} className="flex items-start gap-(--space-2) text-[length:var(--type-small)]">
            <span data-ref-tick={i + 1} className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-ink-900" />
            {item}
          </div>
        ))}
        <div className="grid items-center gap-(--space-2)" style={{ gridTemplateColumns: "1fr auto" }}>
          <div className="h-1.5 overflow-hidden rounded-(--radius-panel) bg-(--clay-300)">
            <div data-ref-bar className="h-full rounded-(--radius-panel) bg-ink-900" />
          </div>
          <span data-ref-num className="text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)]">
            {c.resultLabel}
          </span>
        </div>
      </div>
    </>
  );
}
