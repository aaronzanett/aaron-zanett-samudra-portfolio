"use client";

import { useCallback, useRef, type CSSProperties } from "react";
import { scene02Content as content } from "@/content/scene-02";
import { useStagedScrub } from "@/lib/animation/useStagedScrub";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useRegisterScene } from "@/lib/hooks/useSceneProgress";
import { LOCAL_TOOL_ICONS, MASK_TOOL_ICONS } from "@/lib/loading";

const PHASE_VARS = ["--f1", "--f2", "--f3", "--f4", "--f5", "--f6"];
// Reveal-once attribute per phase index — Understand (0) has no gated micro-animation, just the crossfade.
const REVEAL_ATTR = [null, "data-design-reveal", "data-xp-reveal", "data-sys-reveal", "data-tools-reveal", "data-ref-reveal"] as const;

const label: CSSProperties = {
  fontSize: "var(--type-label)",
  fontWeight: 700,
  letterSpacing: "var(--type-label-tracking)",
  textTransform: "uppercase",
};
const labelMuted: CSSProperties = { ...label, color: "var(--text-muted)" };

const DEVICON = (slug: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;
const TOOL_ICON_SRC: Record<string, string> = {
  javascript: DEVICON("javascript"),
  typescript: DEVICON("typescript"),
  react: DEVICON("react"),
  nextjs: DEVICON("nextjs"),
  tailwindcss: DEVICON("tailwindcss"),
  nodejs: DEVICON("nodejs"),
  mysql: DEVICON("mysql"),
  postgresql: DEVICON("postgresql"),
  git: DEVICON("git"),
  github: DEVICON("github"),
  figma: DEVICON("figma"),
};

export function SceneTwoMindset() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null, null, null]);
  const framewrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useRegisterScene(sectionRef, "Scene 02 — The Mindset");

  const onOuterCommit = useCallback((index: number) => {
    // index 1 = the phases group (--g) becoming current — this is when panel
    // 01 (Understand) first paints, so its content fade/rise fires here.
    if (index === 1) framewrapRef.current?.setAttribute("data-reveal", "1");
  }, []);

  // Outer crossfade: intro copy (--i) hands off to the phases group (--g) at 12% scroll.
  useStagedScrub({
    trackRef: sectionRef,
    targetRef: pinRef,
    thresholds: [0.12],
    vars: ["--i", "--g"],
    reducedMotion,
    onStageCommit: onOuterCommit,
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

  // Inner crossfade: the remaining 88% of scroll is split across the 6 phase frames. Divided by 5.5
  // rather than 6 so the last phase (Refine) holds for only half a phase's scroll before the pin
  // releases — otherwise the scene lingers on its final step and hands off to Scene 03 late.
  useStagedScrub({
    trackRef: sectionRef,
    targetRef: pinRef,
    thresholds: [1, 2, 3, 4, 5].map((k) => 0.12 + (k / 5.5) * 0.88),
    vars: PHASE_VARS,
    reducedMotion,
    onStageCommit: onPhaseCommit,
  });

  return (
    <section ref={sectionRef} aria-labelledby="s2-h" style={{ height: reducedMotion ? "auto" : "var(--s2-track)", position: "relative" }}>
      <div
        ref={pinRef}
        data-pin
        style={{
          position: reducedMotion ? "static" : "sticky",
          top: "var(--hdr, 58px)",
          height: reducedMotion ? "auto" : "calc(100svh - var(--hdr, 58px))",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateRows: reducedMotion ? undefined : "auto minmax(0, 1fr)",
          padding: reducedMotion ? "var(--space-8) var(--gutter)" : "var(--space-4) var(--gutter)",
          overflow: reducedMotion ? "visible" : "hidden",
          gap: reducedMotion ? "var(--space-9)" : undefined,
        }}
      >
        <div
          data-s2-strip
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderTop: "var(--hairline-ink)",
            paddingTop: "var(--space-2)",
            marginBottom: "var(--space-6)",
            ...label,
          }}
        >
          <span>Scene 02</span>
          <span>The Mindset</span>
        </div>

        <div
          data-stagewrap
          style={
            reducedMotion
              ? { display: "grid", gap: "var(--space-9)", minWidth: 0 }
              : { position: "relative", display: "grid", gridTemplateAreas: "'stack'", alignItems: "center", minHeight: 0 }
          }
        >
          {/* Intro */}
          <div
            data-stage
            data-s2-intro
            style={
              reducedMotion
                ? { minWidth: 0 }
                : { gridArea: "stack", alignSelf: "center", opacity: "var(--i, 1)", transform: "translateY(calc((1 - var(--i, 1)) * -20px))" }
            }
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", columnGap: "var(--gutter)", rowGap: "var(--space-5)", alignItems: "start" }}>
              <h2
                id="s2-h"
                style={{
                  margin: 0,
                  fontSize: "clamp(1.75rem, 3.7vw, 3.5rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.025em",
                  fontWeight: 400,
                  textWrap: "pretty",
                  maxWidth: "20ch",
                }}
              >
                {content.intro.heading}
              </h2>
              <div style={{ display: "grid", gap: "var(--space-5)", maxWidth: "62ch" }}>
                <p data-lead style={{ margin: 0, fontSize: "var(--type-lead)", lineHeight: 1.35 }}>
                  {content.intro.lead}
                </p>
                <p style={{ margin: 0, fontSize: "var(--type-body)", lineHeight: "var(--type-body-lh)", color: "var(--text-secondary)" }}>
                  {content.intro.body}
                </p>
              </div>
            </div>
          </div>

          {/* Phases group */}
          <div
            data-stage
            data-phases
            aria-hidden={!reducedMotion}
            style={
              reducedMotion
                ? { minWidth: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "var(--gutter)", alignItems: "start" }
                : {
                    gridArea: "stack",
                    alignSelf: "center",
                    opacity: "var(--g, 0)",
                    transform: "translateY(calc((1 - var(--g, 0)) * 24px))",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
                    gap: "var(--gutter)",
                    alignItems: "start",
                    minWidth: 0,
                    pointerEvents: reducedMotion ? undefined : "none",
                  }
            }
          >
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "var(--space-1)", maxWidth: 460 }}>
              {content.phases.map((phase, i) => (
                <li
                  key={phase.num}
                  data-phase
                  style={{
                    opacity: reducedMotion ? 1 : `calc(0.3 + 0.7 * var(--f${i + 1}, ${i === 0 ? 1 : 0}))`,
                    borderTop: "var(--hairline)",
                    borderBottom: i === content.phases.length - 1 ? "var(--hairline-ink)" : undefined,
                    padding: "var(--space-2) 0",
                    display: "grid",
                    gridTemplateColumns: "34px 1fr",
                    gap: "var(--space-4)",
                  }}
                >
                  <span style={{ fontSize: "var(--type-label)", fontWeight: 700, letterSpacing: "var(--type-label-tracking)" }}>{phase.num}</span>
                  <span>
                    <span style={{ fontSize: "var(--type-lead)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{phase.name}</span>
                    <br />
                    <span style={{ ...label, color: "var(--text-secondary)" }}>{phase.tagline}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div
              ref={framewrapRef}
              data-framewrap
              style={{
                position: "relative",
                display: "grid",
                gridTemplateAreas: "'stack'",
                alignItems: "stretch",
                background: "var(--surface-raised)",
                borderRadius: "var(--radius-panel-lg)",
              }}
            >
              {/*
                No product-film video asset exists yet. The design conditionally renders a
                scroll-scrubbed <video> behind these frames (sc-if hasVideo, defaulting to
                false); wiring one in is a drop-in once Aaron has a file — see PRD §3.
              */}
              <PhaseFrame registerRef={registerFrameRef(0)} reducedMotion={reducedMotion} varName="--f1" isFirst>
                <UnderstandFrame />
              </PhaseFrame>
              <PhaseFrame registerRef={registerFrameRef(1)} reducedMotion={reducedMotion} varName="--f2">
                <DesignFrame />
              </PhaseFrame>
              <PhaseFrame registerRef={registerFrameRef(2)} reducedMotion={reducedMotion} varName="--f3" centered>
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
  centered = false,
  children,
}: {
  registerRef: (el: HTMLDivElement | null) => void;
  varName: string;
  isFirst?: boolean;
  reducedMotion: boolean;
  /** Experience (f3) is the one panel whose source frame centers its content
   * in a flexible row instead of pinning children to top/bottom via
   * space-between — see the distinct `grid-template-rows` style below. */
  centered?: boolean;
  children: React.ReactNode;
}) {
  const layout: CSSProperties = centered
    ? { display: "grid", gridTemplateRows: "auto minmax(0, 1fr)", gap: "var(--space-4)" }
    : { display: "grid", alignContent: "space-between", gap: "var(--space-4)" };
  return (
    <div
      ref={registerRef}
      data-frame
      style={
        reducedMotion
          ? { ...layout, padding: "var(--space-5)" }
          : { gridArea: "stack", opacity: `var(${varName}, ${isFirst ? 1 : 0})`, padding: "var(--space-5)", ...layout }
      }
    >
      {children}
    </div>
  );
}

function UnderstandFrame() {
  const c = content.understand;
  return (
    <>
      <div style={labelMuted}>{c.label}</div>
      <div style={{ display: "grid", gap: "var(--space-2)" }}>
        {c.items.map((item, i) => (
          <div
            key={item}
            style={{ borderTop: i === 0 ? "var(--hairline-ink)" : "var(--hairline)", paddingTop: "var(--space-2)", fontSize: "var(--type-small)" }}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {c.tags.map((tag) => (
          <span key={tag} style={{ background: "var(--cream-100)", borderRadius: "var(--radius-panel)", padding: "8px 14px", ...label }}>
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
      <div style={labelMuted}>{c.label}</div>
      <div data-design="group" style={{ position: "relative", overflow: "hidden", display: "grid", gap: "var(--space-4)", padding: "var(--space-3) 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 104px) minmax(0, 1fr)", gap: "var(--space-4)", alignItems: "center" }}>
          <span style={{ ...label, color: "var(--text-secondary)" }}>Font</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)", minWidth: 0 }}>
            <span data-type-spec style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: "3.25rem", lineHeight: 0.92 }}>
              Aa
            </span>
            <span style={{ display: "inline-grid", ...label, lineHeight: 1.3 }}>
              {c.trials.map((trial, i) => (
                <span
                  key={trial}
                  data-trial={["a", "b", "c"][i]}
                  style={{ gridArea: "1 / 1", color: i < 2 ? "var(--text-secondary)" : undefined }}
                >
                  {trial}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 104px) minmax(0, 1fr)", gap: "var(--space-4)", alignItems: "center" }}>
          <span style={{ ...label, color: "var(--text-secondary)" }}>Colour</span>
          <div style={{ display: "flex", gap: "var(--space-2)", minWidth: 0 }}>
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                data-sw={n}
                style={{ flex: 1, maxWidth: 64, height: 38, background: "var(--clay-400)", borderRadius: "var(--radius-panel)" }}
              />
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 104px) minmax(0, 1fr)", gap: "var(--space-4)", alignItems: "center" }}>
          <span style={{ ...label, color: "var(--text-secondary)" }}>Scale</span>
          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-end", height: 48 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} data-bar={n} style={{ width: 4, height: 24, background: "var(--clay-400)" }} />
            ))}
            <span style={{ marginLeft: "var(--space-3)", ...label, color: "var(--text-secondary)", alignSelf: "flex-end" }}>{c.scaleCaption}</span>
          </div>
        </div>
        <span
          data-gloss
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "38%",
            pointerEvents: "none",
            background: "linear-gradient(100deg, transparent, rgba(251, 239, 223, 0.85), transparent)",
          }}
        />
      </div>
    </>
  );
}

function ExperienceFrame() {
  const c = content.experience;
  return (
    <>
      <div style={labelMuted}>{c.label}</div>
      <div data-xp style={{ display: "grid", gap: "var(--space-4)", alignContent: "center" }}>
        <div data-xp-steps style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "var(--space-2)" }}>
          {c.steps.map((step, i) => (
            <div
              key={step}
              data-xp-step={i + 1}
              style={{
                position: "relative",
                border: "var(--hairline-ink)",
                borderRadius: "var(--radius-panel)",
                padding: "var(--space-2) var(--space-3)",
                minHeight: 74,
                display: "grid",
                gap: 4,
                alignContent: "start",
                ...label,
              }}
            >
              <span>0{i + 1}</span>
              <span style={{ overflowWrap: "anywhere" }}>{step}</span>
              {i === 0 && (
                <span
                  data-xp-ring
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "var(--space-3)",
                    bottom: "var(--space-3)",
                    width: 14,
                    height: 14,
                    border: "1px solid var(--ink-900)",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", borderTop: "var(--hairline)", paddingTop: "var(--space-3)", fontSize: "var(--type-small)", lineHeight: 1.45 }}>
          {c.notes.map((note, i) => (
            <span key={note} data-xp-note={["a", "b", "c"][i]} style={{ gridArea: "1 / 1", color: i < 2 ? "var(--text-secondary)" : undefined }}>
              {note}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function SystemFrame() {
  const c = content.system;
  const atomStyle = (variant: string): CSSProperties => {
    switch (variant) {
      case "filled":
        return { background: "var(--ink-900)", color: "var(--cream-100)", borderRadius: "var(--radius-panel)", padding: "8px 14px", ...label };
      case "underline":
        return { borderBottom: "var(--hairline-ink)", padding: "6px 28px 6px 0", ...label, color: "var(--text-secondary)" };
      case "cream":
        return { background: "var(--cream-100)", borderRadius: "var(--radius-panel)", padding: "8px 20px", ...label };
      default:
        return { ...label, borderTop: "var(--hairline-ink)", paddingTop: 4 };
    }
  };
  return (
    <>
      <div style={labelMuted}>{c.label}</div>
      <div data-sys style={{ display: "grid", gap: "var(--space-3)" }}>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
          {c.atoms.map((atom, i) => (
            <span key={atom.name} data-sys-asset={i + 1} style={atomStyle(atom.variant)}>
              {atom.name}
            </span>
          ))}
        </div>
        <div data-sys-rule aria-hidden="true" style={{ height: 1, background: "var(--ink-900)" }} />
        {c.usage.map((row, i) => (
          <div
            key={row.context}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 96px) minmax(0, 1fr)",
              gap: "var(--space-3)",
              alignItems: "center",
              borderTop: "var(--hairline)",
              padding: "var(--space-2) 0",
            }}
          >
            <span style={{ ...label, color: "var(--text-secondary)" }}>{row.context}</span>
            <span data-sys-use={i + 1} style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
              <SystemUsagePreview element={row.element} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function SystemUsagePreview({ element }: { element: "labelField" | "panels" | "button" }) {
  if (element === "labelField") {
    return (
      <>
        <span style={{ ...label, borderTop: "var(--hairline-ink)", paddingTop: 4 }}>Label</span>
        <span style={{ borderBottom: "var(--hairline-ink)", width: 72, height: 14 }} />
      </>
    );
  }
  if (element === "panels") {
    return (
      <>
        <span style={{ background: "var(--cream-100)", borderRadius: "var(--radius-panel)", width: 54, height: 22 }} />
        <span style={{ background: "var(--cream-100)", borderRadius: "var(--radius-panel)", width: 54, height: 22 }} />
        <span style={{ ...label, color: "var(--text-secondary)" }}>Panel ×2</span>
      </>
    );
  }
  return (
    <>
      <span style={{ background: "var(--ink-900)", color: "var(--cream-100)", borderRadius: "var(--radius-panel)", padding: "6px 12px", ...label }}>
        Button
      </span>
      <span style={{ ...label, color: "var(--text-secondary)" }}>Same component, no new rules</span>
    </>
  );
}

function ToolsFrame() {
  const c = content.tools;
  // Delay steps continuously across both groups (0ms, 55ms, 110ms...), matching the
  // design's single staggered cascade over all 16 badges — offset is each group's
  // starting index, i.e. the item count of every group before it.
  const groupOffset = (gi: number) => c.groups.slice(0, gi).reduce((sum, group) => sum + group.items.length, 0);

  return (
    <>
      <div style={labelMuted}>{c.label}</div>
      <div data-tools style={{ display: "grid", gap: "var(--space-4)" }}>
        {c.groups.map((group, gi) => (
          <div key={group.title} style={{ display: "grid", gap: "var(--space-3)" }}>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              <div data-tools-rule={gi + 1} aria-hidden="true" style={{ height: 1, background: "var(--ink-900)" }} />
              <span style={label}>{group.title}</span>
            </div>
            <div data-tools-grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))", gap: "var(--space-3) var(--space-2)" }}>
              {group.items.map((tool, ti) => {
                const delay = (groupOffset(gi) + ti) * 55;
                return (
                  <span key={tool.name} data-tool style={{ animationDelay: `${delay}ms`, display: "grid", gap: 6, justifyItems: "center", textAlign: "center" }}>
                    <span style={{ position: "relative", width: 30, height: 30, display: "grid", placeItems: "center" }}>
                      {MASK_TOOL_ICONS[tool.icon] ? (
                        <span
                          aria-hidden="true"
                          style={{
                            width: 26,
                            height: 26,
                            background: MASK_TOOL_ICONS[tool.icon].color,
                            WebkitMask: `url(${MASK_TOOL_ICONS[tool.icon].url}) center / contain no-repeat`,
                            mask: `url(${MASK_TOOL_ICONS[tool.icon].url}) center / contain no-repeat`,
                          }}
                        />
                      ) : LOCAL_TOOL_ICONS[tool.icon] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={LOCAL_TOOL_ICONS[tool.icon]} alt="" width={26} height={26} loading="lazy" style={{ width: 26, height: 26, objectFit: "contain" }} />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={TOOL_ICON_SRC[tool.icon]} alt="" width={26} height={26} loading="lazy" style={{ width: 26, height: 26, objectFit: "contain" }} />
                      )}
                    </span>
                    <span style={{ fontSize: 10, lineHeight: 1.2, fontWeight: 700, letterSpacing: "0.04em", color: "var(--text-secondary)" }}>{tool.name}</span>
                  </span>
                );
              })}
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
      <div style={labelMuted}>{c.label}</div>
      <div data-ref style={{ display: "grid", gap: "var(--space-4)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: "var(--space-2)", ...label }}>
          {c.steps.map((step, i) => (
            <span key={step} data-ref-step={i + 1} style={{ border: "var(--hairline-ink)", borderRadius: "var(--radius-panel)", padding: "var(--space-3)" }}>
              {step}
            </span>
          ))}
        </div>
        <div style={{ display: "grid", gap: "var(--space-2)", borderTop: "var(--hairline)", paddingTop: "var(--space-3)", fontSize: "var(--type-small)" }}>
          {c.checklist.map((item, i) => (
            <span
              key={item}
              data-ref-item={i + 1}
              style={{ display: "grid", gridTemplateColumns: "14px minmax(0, 1fr)", gap: "var(--space-2)", alignItems: "baseline" }}
            >
              <span
                data-ref-tick={i + 1}
                aria-hidden="true"
                style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink-900)", transform: "translateY(-2px)" }}
              />
              <span>{item}</span>
            </span>
          ))}
          <span data-ref-item={5} style={{ display: "grid", gridTemplateColumns: "14px minmax(0, 1fr)", gap: "var(--space-2)", alignItems: "center", paddingTop: 2 }}>
            <span />
            <span style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "var(--space-2)", alignItems: "center" }}>
              <span aria-hidden="true" style={{ position: "relative", height: 6, background: "var(--clay-300)", borderRadius: "var(--radius-panel)" }}>
                <span
                  data-ref-bar
                  style={{ position: "absolute", top: 0, bottom: 0, left: 0, background: "var(--ink-900)", borderRadius: "var(--radius-panel)" }}
                />
              </span>
              <span data-ref-num style={{ ...label, color: "var(--text-secondary)" }}>
                {c.resultLabel}
              </span>
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
