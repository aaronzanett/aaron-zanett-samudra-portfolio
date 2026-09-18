"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { scene04Content as content, type Project } from "@/content/scene-04";
import { useStagedScrub } from "@/lib/animation/useStagedScrub";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useRegisterScene } from "@/lib/hooks/useSceneProgress";
import { Label } from "@/components/ui/Label";

const PROJECT_COUNT = content.projects.length;
const BEAT_VARS = Array.from({ length: PROJECT_COUNT + 1 }, (_, i) => `--w${i + 1}`);
// Intro gets a 10% slice; the remaining 90% is split evenly across the projects.
const BEAT_THRESHOLDS = Array.from({ length: PROJECT_COUNT }, (_, k) => 0.1 + (k / PROJECT_COUNT) * 0.9);

const SLIDE_INTERVAL_MS = 2200;

export function SceneFourWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeProject, setActiveProject] = useState(0);

  useRegisterScene(sectionRef, "Scene 04 — The Work");

  const onBeatCommit = useCallback((index: number) => {
    // index 0 = intro heading, index 1..N = projects[index - 1]
    if (index > 0) setActiveProject(index - 1);
  }, []);

  useStagedScrub({
    trackRef: sectionRef,
    targetRef: pinRef,
    thresholds: BEAT_THRESHOLDS,
    vars: BEAT_VARS,
    reducedMotion,
    onStageCommit: onBeatCommit,
  });

  return (
    <section ref={sectionRef} aria-labelledby="s4-h" className="relative" style={{ height: reducedMotion ? "auto" : `${(PROJECT_COUNT + 1) * 110}vh` }}>
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
          <Label>Scene 04</Label>
          <Label>The Work</Label>
        </div>

        <div
          className={
            reducedMotion ? "grid min-w-0 gap-(--space-9)" : "relative grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] items-center [grid-template-areas:'stack']"
          }
        >
          <WorkBeat index={0} reducedMotion={reducedMotion}>
            <Label muted>{content.heading.kicker}</Label>
            <h2 id="s4-h" className="m-0 mt-(--space-3) max-w-[18ch] text-balance text-[length:var(--type-display-2)] leading-[var(--type-display-lh)] font-normal [letter-spacing:var(--type-display-tracking)]">
              {content.heading.title}
            </h2>
            <p className="m-0 mt-(--space-4) text-[length:var(--type-lead)] text-(--text-secondary)">{content.heading.lead}</p>
          </WorkBeat>

          {content.projects.map((project, i) => (
            <WorkBeat key={project.key} index={i + 1} reducedMotion={reducedMotion}>
              <ProjectShowcase project={project} active={reducedMotion || activeProject === i} reducedMotion={reducedMotion} />
            </WorkBeat>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkBeat({ index, reducedMotion, children }: { index: number; reducedMotion: boolean; children: React.ReactNode }) {
  return (
    <div
      className="min-w-0"
      style={
        reducedMotion
          ? undefined
          : {
              gridArea: "stack",
              alignSelf: "center",
              opacity: `var(--w${index + 1}, ${index === 0 ? 1 : 0})`,
              transform: `translateY(calc((1 - var(--w${index + 1}, ${index === 0 ? 1 : 0})) * 20px))`,
            }
      }
    >
      {children}
    </div>
  );
}

function ProjectShowcase({ project, active, reducedMotion }: { project: Project; active: boolean; reducedMotion: boolean }) {
  const [shotIndex, setShotIndex] = useState(0);
  const displayIndex = active ? shotIndex : 0;

  useEffect(() => {
    if (!active || reducedMotion) return;
    const id = setInterval(() => setShotIndex((i) => (i + 1) % project.shots), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [active, reducedMotion, project.shots]);

  return (
    <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(264px,100%),1fr))] items-start gap-(--gutter)">
      <div className="grid min-w-0 max-w-[36ch] gap-(--space-4)">
        <span className="font-display text-[2.125rem] leading-none italic">{project.num}</span>
        <h3 className="m-0 text-[clamp(1.875rem,3.2vw,3.25rem)] leading-[1.02] font-semibold [letter-spacing:-0.02em]">{project.name}</h3>
        <div className="flex items-center gap-(--space-3) text-[length:var(--type-label)] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-secondary)">
          <span>{project.role}</span>
          <span className="h-px w-4 bg-(--rule-strong)" />
          <span>{project.year}</span>
        </div>
        <div className="h-px bg-ink-900" />
        <p className="m-0 min-h-[6em] max-w-[34ch] text-[length:var(--type-body)] leading-[var(--type-body-lh)] text-(--text-secondary)">{project.description}</p>
        <div className="flex gap-(--space-2)">
          {Array.from({ length: project.shots }).map((_, i) => (
            <span key={i} className={`h-0.5 w-[26px] rounded-full transition-opacity duration-300 ${i === displayIndex ? "bg-ink-900 opacity-100" : "bg-ink-900 opacity-25"}`} />
          ))}
        </div>
      </div>

      <div className="relative min-w-0 overflow-hidden rounded-(--radius-panel-lg) bg-(--surface-raised)" style={{ aspectRatio: "812 / 400" }}>
        {Array.from({ length: project.shots }).map((_, i) => (
          <Image
            key={i}
            src={`/projects/${project.key}/${i + 1}.png`}
            alt={`${project.name} — screenshot ${i + 1} of ${project.shots}`}
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
            className="object-contain p-(--space-4) transition-opacity duration-500"
            style={{ opacity: i === displayIndex ? 1 : 0 }}
            priority={project.num === "01" && i === 0}
          />
        ))}
      </div>
    </div>
  );
}
