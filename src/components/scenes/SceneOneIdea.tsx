"use client";

import { useRef } from "react";
import { scene01Content as content } from "@/content/scene-01";
import { useStagedScrub } from "@/lib/animation/useStagedScrub";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useRegisterScene } from "@/lib/hooks/useSceneProgress";
import { AlertIcon, ChecklistIcon, LightbulbIcon, UsersIcon } from "@/components/icons";
import { Label } from "@/components/ui/Label";

const INFO_ICONS = { alert: AlertIcon, users: UsersIcon, lightbulb: LightbulbIcon, checklist: ChecklistIcon } as const;

const STAGE_VARS = ["--a", "--b", "--c", "--d"];

export function SceneOneIdea() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useRegisterScene(sectionRef, "Scene 01 — The Idea");
  useStagedScrub({
    trackRef: sectionRef,
    targetRef: pinRef,
    thresholds: [0.19, 0.46, 0.72],
    vars: STAGE_VARS,
    reducedMotion,
    // Slower than the hook's default so the view switches read more calmly.
    tween: { perStage: 0.5, max: 0.9 },
  });

  const stageStyle = (varName: string, hidden: boolean) =>
    reducedMotion
      ? undefined
      : ({
          gridArea: "stack",
          minWidth: 0,
          opacity: `var(${varName}, ${varName === "--a" ? 1 : 0})`,
          transform: `translateY(calc((1 - var(${varName}, ${varName === "--a" ? 1 : 0})) * ${hidden ? 24 : -20}px))`,
          alignSelf: "center",
        } as React.CSSProperties);

  return (
    <>
    <section
      ref={sectionRef}
      aria-labelledby="s1-h"
      className="relative"
      style={{ height: reducedMotion ? "auto" : "460vh" }}
    >
      <div
        ref={pinRef}
        className={
          reducedMotion
            ? "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-(--space-9) px-(--gutter) py-(--space-8)"
            : "box-border grid min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] px-(--gutter) py-(--space-4)"
        }
        style={
          reducedMotion
            ? undefined
            : { position: "sticky", top: "var(--hdr)", height: "calc(100vh - var(--hdr))" }
        }
      >
        <div className="mb-(--space-6) flex items-baseline justify-between border-t border-ink-900 pt-(--space-2)">
          <Label>Scene 01</Label>
          <Label>The Idea</Label>
        </div>

        <div
          className={
            reducedMotion
              ? "grid min-w-0 gap-(--space-9)"
              : "relative grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] items-center [grid-template-areas:'stack']"
          }
        >
          {/* Stage A — the brief */}
          <div className="min-w-0" style={stageStyle("--a", false)}>
            <h2
              id="s1-h"
              data-enter="1"
              className="m-0 font-grotesk text-[length:var(--type-display-1)] leading-[var(--type-display-lh)] font-normal text-balance [letter-spacing:var(--type-display-tracking)] max-[720px]:text-[clamp(2rem,9vw,3rem)]"
            >
              {content.heading[0]}
              <br />
              {content.heading[1]}
            </h2>
            <div className="mt-(--space-8) max-w-[720px]">
              <div data-enter="2">
                <Label muted>{content.brief.kicker}</Label>
              </div>
              <div
                data-enter="2"
                className="mt-(--space-3) flex items-center gap-(--space-2) pb-(--space-3) text-[length:var(--type-lead)] max-[720px]:text-[1.0625rem]"
              >
                <span className="text-(--text-secondary)">{content.brief.prompt}</span>
                <span data-caret className="inline-block h-[1.1em] w-[10px] bg-amber-500" />
              </div>
              <div data-enter="rule" className="h-px bg-ink-900" />
              <p
                data-enter="3"
                className="mt-(--space-4) mb-0 max-w-[58ch] text-[length:var(--type-body)] leading-[var(--type-body-lh)] text-(--text-secondary) max-[720px]:text-[0.9375rem]"
              >
                {content.brief.body}
              </p>
            </div>
          </div>

          {/* Stage B — Idea → Information */}
          <div aria-hidden={!reducedMotion} style={stageStyle("--b", true)} className={`min-w-0 ${reducedMotion ? "" : "pointer-events-none"}`}>
            <div className="border-b border-(--rule) pb-(--space-2)">
              <Label muted>{content.information.caption}</Label>
            </div>
            <div className="mt-(--space-5) grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] gap-(--gutter) max-[720px]:grid-cols-2 max-[720px]:gap-(--space-4)">
              {content.information.items.map((item) => {
                const Icon = INFO_ICONS[item.icon as keyof typeof INFO_ICONS];
                return (
                  <div key={item.title} className="grid content-start gap-(--space-3)">
                    <div className="flex items-center gap-(--space-2) border-t border-ink-900 pt-(--space-2)">
                      <Icon />
                      <Label>{item.title}</Label>
                    </div>
                    <p className="m-0 text-[length:var(--type-body)] leading-[var(--type-body-lh)]">{item.body}</p>
                    {item.note && (
                      <p className="m-0 text-[length:var(--type-body)] leading-[var(--type-body-lh)] text-(--text-secondary)">
                        {item.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage C — Information → Structure */}
          <div aria-hidden={!reducedMotion} style={stageStyle("--c", true)} className={`min-w-0 ${reducedMotion ? "" : "pointer-events-none"}`}>
            <div className="border-b border-(--rule) pb-(--space-2)">
              <Label muted>{content.structure.caption}</Label>
            </div>
            <div className="mt-(--space-5) grid max-w-[1100px]">
              {content.structure.rows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)] gap-(--gutter) border-t py-(--space-4) max-[720px]:grid-cols-1 max-[720px]:gap-(--space-1) max-[720px]:py-(--space-3) ${
                    i === 0 ? "border-ink-900" : "border-(--rule)"
                  } ${i === content.structure.rows.length - 1 ? "border-b border-b-(--rule)" : ""}`}
                >
                  <Label muted>{row.label}</Label>
                  <span
                    className={
                      row.size === "display"
                        ? "text-[length:var(--type-display-2)] leading-[var(--type-display-lh)] [letter-spacing:var(--type-display-tracking)]"
                        : "text-[length:var(--type-lead)] leading-[1.3] max-[720px]:text-[1.0625rem]"
                    }
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stage D — Structure → Interface */}
          <div aria-hidden={!reducedMotion} style={stageStyle("--d", true)} className={`min-w-0 ${reducedMotion ? "" : "pointer-events-none"}`}>
            <div className="border-b border-(--rule) pb-(--space-2)">
              <Label muted>{content.interface.caption}</Label>
            </div>
            <div className="mt-(--space-5) grid min-w-0 max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] items-start gap-(--space-4) max-[720px]:grid-cols-2 max-[720px]:gap-(--space-3)">
              <InterfaceCard num="01" title="Mobile app" caption={content.interface.cards[0].caption}>
                <MobilePreview />
              </InterfaceCard>
              <InterfaceCard num="02" title="Dashboard" caption={content.interface.cards[1].caption}>
                <DashboardPreview />
              </InterfaceCard>
              <InterfaceCard num="03" title="Marketing page" caption={content.interface.cards[2].caption}>
                <MarketingPreview />
              </InterfaceCard>
              <InterfaceCard num="04" title="Search & results" caption={content.interface.cards[3].caption}>
                <SearchPreview />
              </InterfaceCard>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="border-t border-ink-900 px-(--gutter) py-(--space-9)">
      <p className="m-0 max-w-[20ch] text-balance text-[length:var(--type-display-2)] leading-[var(--type-display-lh)] [letter-spacing:var(--type-display-tracking)]">
        {content.exitLine}
      </p>
    </div>
    </>
  );
}

function InterfaceCard({
  num,
  title,
  caption,
  children,
}: {
  num: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-(--space-3) rounded-(--radius-panel-lg) bg-(--surface-raised) p-(--space-4) max-[720px]:gap-(--space-2) max-[720px]:p-(--space-3)">
      <div className="flex items-baseline justify-between">
        <Label>{title}</Label>
        <Label muted>{num}</Label>
      </div>
      {children}
      <p className="m-0 text-[length:var(--type-small)] leading-[1.45] text-(--text-secondary) max-[720px]:hidden">{caption}</p>
    </div>
  );
}

function MobilePreview() {
  return (
    <div className="grid gap-(--space-2) rounded-[18px_18px_var(--space-5)_18px] border border-ink-900 p-(--space-3)">
      <div className="flex h-[clamp(56px,9vh,96px)] items-center justify-center gap-2 rounded-(--radius-panel) bg-cream-100 text-[10px] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-secondary)">
        <span>app-screen.png</span>
      </div>
      <div className="h-2 w-[70%] bg-(--rule)" />
      <div className="h-2 w-[45%] bg-(--rule)" />
      <div className="mt-(--space-1) flex gap-(--space-2)">
        <span className="h-[26px] flex-1 rounded-(--radius-panel) bg-ink-900" />
        <span className="h-[26px] w-[26px] rounded-(--radius-panel) border border-ink-900" />
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="grid grid-cols-[34px_minmax(0,1fr)] gap-(--space-3) rounded-(--radius-panel) border border-ink-900 p-(--space-3)">
      <div className="grid content-start gap-1.5">
        <span className="h-2 bg-ink-900" />
        <span className="h-2 bg-(--rule)" />
        <span className="h-2 bg-(--rule)" />
      </div>
      <div className="grid gap-(--space-2)">
        <div className="flex gap-(--space-2)">
          <span className="h-[clamp(22px,3.4vh,34px)] flex-1 rounded-(--radius-panel) bg-amber-500" />
          <span className="h-[clamp(22px,3.4vh,34px)] flex-1 rounded-(--radius-panel) bg-cream-100" />
        </div>
        <div className="grid gap-[5px]">
          <span className="h-[7px] bg-(--rule)" />
          <span className="h-[7px] bg-(--rule)" />
          <span className="h-[7px] w-[68%] bg-(--rule)" />
          <span className="h-[7px] w-[52%] bg-(--rule)" />
        </div>
      </div>
    </div>
  );
}

function MarketingPreview() {
  return (
    <div className="grid gap-(--space-2) rounded-(--radius-panel) border border-ink-900 p-(--space-3)">
      <div className="text-[clamp(1.1rem,2.4vh,1.6rem)] leading-none [letter-spacing:-0.03em]">Headline</div>
      <div className="h-[7px] w-[80%] bg-(--rule)" />
      <div className="flex items-center gap-(--space-2)">
        <span className="rounded-(--radius-panel) bg-ink-900 px-3 py-1.5 text-[10px] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-cream-100">
          Start
        </span>
        <span className="border-b border-ink-900 text-[10px] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-muted)">
          Learn more
        </span>
      </div>
      <div className="flex h-[clamp(34px,6vh,64px)] items-center justify-center gap-2 rounded-(--radius-panel) bg-red-500 text-[10px] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-cream-100">
        <span>hero.jpg</span>
      </div>
    </div>
  );
}

function SearchPreview() {
  return (
    <div className="grid gap-(--space-2) rounded-(--radius-panel) border border-ink-900 p-(--space-3)">
      <div className="flex items-center gap-(--space-2)">
        <span className="h-[14px] flex-1 border-b border-ink-900" />
        <span className="h-[18px] w-[30px] rounded-(--radius-panel) bg-ink-900" />
      </div>
      <div className="flex flex-wrap gap-[5px]">
        <span className="rounded-(--radius-panel) border border-ink-900 px-2 py-1 text-[9px] font-bold uppercase [letter-spacing:var(--type-label-tracking)]">
          Filter
        </span>
        <span className="rounded-(--radius-panel) border border-(--rule) px-2 py-1 text-[9px] font-bold uppercase [letter-spacing:var(--type-label-tracking)] text-(--text-muted)">
          Sort
        </span>
      </div>
      <div className="grid grid-cols-2 gap-(--space-2)">
        <span className="h-[clamp(26px,4.4vh,46px)] rounded-(--radius-panel) bg-cream-100" />
        <span className="h-[clamp(26px,4.4vh,46px)] rounded-(--radius-panel) bg-amber-500" />
      </div>
    </div>
  );
}
