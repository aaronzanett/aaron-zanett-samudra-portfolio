"use client";

/*
 * Scene 05 — The Playground. Ported from `Aaron Portfolio.dc.html`
 * (section[data-scene="05"] plus `initPlayground()` and `initRise()`).
 * Markup and inline styles are the design's; the five experiments keep the
 * design's defaults, ranges, colour maths and state tables.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useRegisterScene } from "@/lib/hooks/useSceneProgress";

const label: CSSProperties = {
  fontSize: "var(--type-label)",
  fontWeight: 700,
  letterSpacing: "var(--type-label-tracking)",
  textTransform: "uppercase",
};

const article: CSSProperties = {
  flex: "1 1 300px",
  borderTop: "var(--hairline-ink)",
  paddingTop: "var(--space-3)",
  display: "grid",
  gap: "var(--space-4)",
  alignContent: "start",
  minWidth: 0,
};

const articleTitle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  ...label,
};

const articleNote: CSSProperties = {
  margin: 0,
  fontSize: "var(--type-small)",
  lineHeight: 1.45,
  color: "var(--text-secondary)",
};

function ArticleHeader({ title, num, note }: { title: string; num: string; note: string }) {
  return (
    <header style={{ display: "grid", gap: "var(--space-2)" }}>
      <div style={articleTitle}>
        <span>{title}</span>
        <span style={{ color: "var(--text-muted)" }}>{num}</span>
      </div>
      <p style={articleNote}>{note}</p>
    </header>
  );
}

/* ---------- 01 — Type ---------- */

const TYPE_DEFAULTS = { size: 42, weight: 400, tracking: -3, leading: 105 };
type TypeKey = keyof typeof TYPE_DEFAULTS;
const TYPE_CONTROLS: { key: TypeKey; title: string; min: number; max: number; step: number; unit: string }[] = [
  { key: "size", title: "Size", min: 18, max: 72, step: 1, unit: "px" },
  { key: "weight", title: "Weight", min: 300, max: 800, step: 50, unit: "" },
  { key: "tracking", title: "Tracking", min: -6, max: 8, step: 0.5, unit: "/100em" },
  { key: "leading", title: "Leading", min: 90, max: 180, step: 5, unit: "%" },
];

function TypeExperiment() {
  const [v, setV] = useState(TYPE_DEFAULTS);
  return (
    <article style={article}>
      <ArticleHeader title="Type" num="01" note="Size, weight, tracking and leading — the four dials that decide whether a page can be read." />
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <div
          data-type-stage
          style={{
            background: "var(--surface-raised)",
            borderRadius: "var(--radius-panel-lg)",
            padding: "var(--space-5)",
            minHeight: 128,
            display: "grid",
            alignContent: "center",
            overflow: "hidden",
          }}
        >
          <span
            data-type-specimen
            style={{
              display: "block",
              textWrap: "balance",
              fontSize: v.size + "px",
              fontWeight: v.weight,
              letterSpacing: v.tracking / 100 + "em",
              lineHeight: v.leading / 100,
            }}
          >
            Type is an experience.
          </span>
        </div>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {TYPE_CONTROLS.map((c) => (
            <label key={c.key} style={{ display: "grid", gap: 4 }}>
              <span style={{ display: "flex", justifyContent: "space-between", ...label, color: "var(--text-secondary)" }}>
                <span>{c.title}</span>
                <span data-out={c.key}>{v[c.key] + c.unit}</span>
              </span>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={v[c.key]}
                onChange={(e) => setV((prev) => ({ ...prev, [c.key]: +e.target.value }))}
                style={{ width: "100%", accentColor: "var(--ink-900)" }}
              />
            </label>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ---------- 02 — Color, with a live WCAG contrast read-out ---------- */

const COLOR_DEFAULTS = { primary: "#3f3b37", secondary: "#e7aa2c", bg: "#fbefdf", text: "#3f3b37" };
type ColorKey = keyof typeof COLOR_DEFAULTS;

const lum = (hex: string) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.substring(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const readable = (bg: string) => (lum(bg) > 0.45 ? "#3f3b37" : "#fbefdf");

const COLOR_INPUTS: { key: ColorKey; title: string }[] = [
  { key: "primary", title: "Primary" },
  { key: "secondary", title: "Secondary" },
  { key: "bg", title: "Background" },
  { key: "text", title: "Text" },
];

function ColorExperiment() {
  const [v, setV] = useState(COLOR_DEFAULTS);
  const l1 = lum(v.text);
  const l2 = lum(v.bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const chip: CSSProperties = { borderRadius: "var(--radius-panel)", padding: "7px 13px", ...label };
  return (
    <article style={article}>
      <ArticleHeader
        title="Color"
        num="02"
        note="Four values, one relationship. Contrast is reported live, because a palette that fails is not a palette."
      />
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <div
          data-color-stage
          style={{
            borderRadius: "var(--radius-panel-lg)",
            padding: "var(--space-5)",
            minHeight: 128,
            display: "grid",
            gap: "var(--space-3)",
            alignContent: "center",
            background: v.bg,
          }}
        >
          <span data-color-title style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: v.text }}>
            Colour carries meaning.
          </span>
          <span data-color-body style={{ fontSize: "var(--type-small)", lineHeight: 1.5, color: v.text }}>
            Primary sets the tone, secondary answers it.
          </span>
          <span style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
            <span data-color-chip="primary" style={{ ...chip, background: v.primary, color: readable(v.primary) }}>
              Primary
            </span>
            <span data-color-chip="secondary" style={{ ...chip, background: v.secondary, color: readable(v.secondary) }}>
              Secondary
            </span>
          </span>
        </div>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {COLOR_INPUTS.map((c) => (
            <label
              key={c.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-3)",
                ...label,
                color: "var(--text-secondary)",
              }}
            >
              <span>{c.title}</span>
              <input
                type="color"
                value={v[c.key]}
                onChange={(e) => setV((prev) => ({ ...prev, [c.key]: e.target.value }))}
                style={{ width: 42, height: 26, padding: 0, border: "var(--hairline-ink)", borderRadius: 6, background: "none", cursor: "pointer" }}
              />
            </label>
          ))}
          <div
            data-contrast
            style={{
              borderTop: "var(--hairline)",
              paddingTop: "var(--space-2)",
              ...label,
              color: ratio >= 4.5 ? "var(--text-secondary)" : "var(--red-500)",
            }}
          >
            {"Contrast " + ratio.toFixed(2) + ":1 — " + (ratio >= 4.5 ? "passes AA" : ratio >= 3 ? "large text only" : "fails")}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- 03 — Motion ---------- */

function MotionExperiment({ reducedMotion }: { reducedMotion: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // Written straight to the elements, as the design does — no re-render per pointer move.
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const dot = dotRef.current;
    if (reducedMotion || !stage || !card || !dot) return;
    const b = stage.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    card.style.transition = "transform 140ms var(--ease-editorial)";
    card.style.transform = "translate(" + (x * 22).toFixed(1) + "px, " + (y * 16).toFixed(1) + "px) rotate(" + (x * 2.2).toFixed(2) + "deg)";
    dot.style.left = e.clientX - b.left + "px";
    dot.style.top = e.clientY - b.top + "px";
    dot.style.opacity = "1";
  };
  const onLeave = () => {
    const card = cardRef.current;
    const dot = dotRef.current;
    if (!card || !dot) return;
    card.style.transition = "transform 520ms var(--ease-editorial)";
    card.style.transform = "none";
    dot.style.opacity = "0";
  };

  return (
    <article style={article}>
      <ArticleHeader title="Motion" num="03" note="Motion should answer the cursor, not perform for it. Move across the panel." />
      <div
        ref={stageRef}
        data-motion-stage
        tabIndex={0}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          position: "relative",
          background: "var(--surface-raised)",
          borderRadius: "var(--radius-panel-lg)",
          minHeight: 200,
          overflow: "hidden",
          cursor: "crosshair",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          ref={cardRef}
          data-motion-card
          style={{
            position: "relative",
            width: "min(72%, 240px)",
            background: "var(--surface-page)",
            border: "var(--hairline-ink)",
            borderRadius: "var(--radius-panel)",
            padding: "var(--space-4)",
            display: "grid",
            gap: "var(--space-2)",
            transition: "transform 420ms var(--ease-editorial)",
          }}
        >
          <span style={{ ...label, color: "var(--text-secondary)" }}>Follows you</span>
          <span style={{ fontSize: "var(--type-lead)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Subtle beats clever.</span>
        </div>
        <span
          ref={dotRef}
          data-motion-dot
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "var(--amber-500)",
            pointerEvents: "none",
            opacity: 0,
            transform: "translate(-50%, -50%)",
            transition: "opacity 200ms var(--ease-editorial)",
          }}
        />
      </div>
    </article>
  );
}

/* ---------- 04 — Component states ---------- */

const CMP_STATES = {
  default: { label: "Save changes", bg: "var(--ink-900)", fg: "var(--cream-100)", border: "var(--hairline-ink)", t: "none" },
  hover: { label: "Save changes", bg: "transparent", fg: "var(--ink-900)", border: "var(--hairline-ink)", t: "none" },
  active: { label: "Save changes", bg: "var(--clay-300)", fg: "var(--ink-900)", border: "var(--hairline-ink)", t: "translateY(1px)" },
  loading: { label: "Saving…", bg: "var(--clay-300)", fg: "var(--text-secondary)", border: "var(--hairline)", t: "none" },
  success: { label: "Saved", bg: "var(--amber-500)", fg: "var(--ink-900)", border: "var(--hairline-ink)", t: "none" },
  error: { label: "Couldn't save", bg: "var(--red-500)", fg: "var(--cream-100)", border: "var(--hairline-ink)", t: "none" },
} as const;
type CmpState = keyof typeof CMP_STATES;
const CMP_ORDER: { key: CmpState; title: string }[] = [
  { key: "default", title: "Default" },
  { key: "hover", title: "Hover" },
  { key: "active", title: "Active" },
  { key: "loading", title: "Loading" },
  { key: "success", title: "Success" },
  { key: "error", title: "Error" },
];

function ComponentExperiment() {
  const [state, setState] = useState<CmpState>("default");
  const s = CMP_STATES[state];
  return (
    <article style={article}>
      <ArticleHeader title="Component" num="04" note="One button, six states. A component is only finished when every state is designed." />
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <div
          style={{
            background: "var(--surface-raised)",
            borderRadius: "var(--radius-panel-lg)",
            padding: "var(--space-5)",
            minHeight: 128,
            display: "grid",
            placeItems: "center",
          }}
        >
          <button
            data-cmp-button
            type="button"
            aria-busy={state === "loading"}
            style={{
              border: s.border,
              borderRadius: "var(--radius-panel)",
              padding: "12px 22px",
              minHeight: 44,
              fontFamily: "inherit",
              fontStyle: "inherit",
              lineHeight: "inherit",
              fontSize: "var(--type-small)",
              fontWeight: 700,
              letterSpacing: "var(--type-label-tracking)",
              textTransform: "uppercase",
              background: s.bg,
              color: s.fg,
              transform: s.t,
              cursor: "pointer",
              transition: "background 200ms var(--ease-editorial), color 200ms var(--ease-editorial), transform 140ms var(--ease-editorial)",
            }}
          >
            {s.label}
          </button>
        </div>
        <div data-cmp-states style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {CMP_ORDER.map((o) => {
            const on = o.key === state;
            return (
              <button
                key={o.key}
                type="button"
                data-state={o.key}
                aria-pressed={on}
                onClick={() => setState(o.key)}
                style={{
                  border: "var(--hairline-ink)",
                  borderRadius: "var(--radius-panel)",
                  background: on ? "var(--ink-900)" : "transparent",
                  color: on ? "var(--cream-100)" : "var(--ink-900)",
                  padding: "8px 13px",
                  minHeight: 36,
                  fontFamily: "inherit",
                  fontStyle: "inherit",
                  lineHeight: "inherit",
                  fontSize: "var(--type-label)",
                  fontWeight: 700,
                  letterSpacing: "var(--type-label-tracking)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {o.title}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

/* ---------- 05 — Responsive frame ---------- */

function ResponsiveExperiment() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  // null until the first measure (the design also starts at width:100% and measures on the next frame).
  const [width, setWidth] = useState<number | null>(null);

  const applyWidth = useCallback((px: number) => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.clientWidth - 32;
    setWidth(Math.max(240, Math.min(max, px)));
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (track) applyWidth(track.clientWidth - 32);
    });
    const onResize = () => {
      const track = trackRef.current;
      const frame = frameRef.current;
      if (track && frame) applyWidth(frame.getBoundingClientRect().width || track.clientWidth - 32);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [applyWidth]);

  const tier = width === null ? "Desktop" : width < 300 ? "Mobile" : width < 460 ? "Tablet" : "Desktop";
  const cols = tier === "Mobile" ? "1fr" : tier === "Tablet" ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))";

  return (
    <article style={{ ...article, flex: "1 1 100%" }}>
      <ArticleHeader title="Responsive" num="05" note="Drag the edge. Each width is a different design decision, not the same one scaled." />
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <div
          ref={trackRef}
          data-rs-track
          style={{
            background: "var(--surface-raised)",
            borderRadius: "var(--radius-panel-lg)",
            padding: "var(--space-4)",
            display: "block",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            ref={frameRef}
            data-rs-frame
            style={{
              width: width === null ? "100%" : width + "px",
              maxWidth: "100%",
              resize: "none",
              border: "var(--hairline-ink)",
              borderRadius: 8,
              overflow: "hidden",
              background: "var(--surface-page)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 8px", borderBottom: "var(--hairline)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red-500)" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber-500)" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rule)" }} />
              <span
                data-rs-label
                style={{
                  marginLeft: "auto",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "var(--type-label-tracking)",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {tier}
              </span>
            </div>
            <div
              data-rs-body
              style={{ padding: tier === "Mobile" ? "var(--space-3)" : "var(--space-4)", display: "grid", gap: "var(--space-3)" }}
            >
              <div data-rs-nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15 }}>Studio</span>
                <span
                  data-rs-links
                  style={{
                    display: tier === "Desktop" ? "flex" : "none",
                    gap: "var(--space-3)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "var(--type-label-tracking)",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>Work</span>
                  <span>About</span>
                  <span>Contact</span>
                </span>
                <span
                  data-rs-burger
                  style={{
                    display: tier === "Desktop" ? "none" : "block",
                    width: 16,
                    height: 10,
                    borderTop: "2px solid var(--ink-900)",
                    borderBottom: "2px solid var(--ink-900)",
                  }}
                />
              </div>
              <div data-rs-grid style={{ display: "grid", gridTemplateColumns: cols, gap: "var(--space-2)" }}>
                <span style={{ height: 46, background: "var(--cream-100)", borderRadius: 6 }} />
                <span style={{ height: 46, background: "var(--amber-500)", borderRadius: 6 }} />
                <span style={{ height: 46, background: "var(--rule)", borderRadius: 6 }} />
              </div>
            </div>
            <div
              data-rs-handle
              role="separator"
              aria-label="Drag to resize the preview"
              tabIndex={0}
              onPointerDown={(e) => {
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                e.preventDefault();
              }}
              onPointerMove={(e) => {
                const frame = frameRef.current;
                if (dragging.current && frame) applyWidth(e.clientX - frame.getBoundingClientRect().left);
              }}
              onPointerUp={(e) => {
                dragging.current = false;
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
              onKeyDown={(e) => {
                const step = e.key === "ArrowLeft" ? -24 : e.key === "ArrowRight" ? 24 : undefined;
                const frame = frameRef.current;
                if (step === undefined || !frame) return;
                e.preventDefault();
                applyWidth(frame.getBoundingClientRect().width + step);
              }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 14,
                height: "100%",
                cursor: "ew-resize",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(to right, transparent, color-mix(in oklab, var(--clay-300) 60%, transparent))",
              }}
            >
              <span style={{ width: 2, height: 26, background: "var(--ink-900)", borderRadius: 1 }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", ...label, color: "var(--text-secondary)" }}>
          <span>Drag the right edge</span>
          <span data-rs-width>{width === null ? "—" : Math.round(width) + "px · " + tier}</span>
        </div>
      </div>
    </article>
  );
}

/* ---------- Scene ---------- */

export function ScenePlayground() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  useRegisterScene(sectionRef, "Scene 05 — The Playground");

  // The design's initRise(): the strip, the heading row and each article rise in once as they
  // settle into view, articles staggered 90ms apart. Skipped under reduced motion (the design's
  // static mode), where everything simply stays visible.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const groups: Element[][] = [
      [section.children[0]],
      [section.children[1]],
      Array.from(section.querySelectorAll("[data-play-grid] > article")),
    ];
    const items: HTMLElement[] = [];
    groups.forEach((g) =>
      g.filter(Boolean).forEach((el, i) => {
        const node = el as HTMLElement;
        node.setAttribute("data-rise", "");
        node.style.animationDelay = i * 90 + "ms";
        items.push(node);
      })
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.setAttribute("data-rise-in", "");
            obs.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    items.forEach((el) => obs.observe(el));
    return () => {
      obs.disconnect();
      items.forEach((el) => {
        el.removeAttribute("data-rise");
        el.removeAttribute("data-rise-in");
        el.style.animationDelay = "";
      });
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="s5-h"
      data-scene="05"
      style={{ padding: "var(--space-8) var(--gutter) var(--space-9)", borderTop: "var(--hairline)" }}
    >
      <div
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
        <span>Scene 05</span>
        <span>The Playground</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
          gap: "var(--gutter) var(--space-8)",
          alignItems: "baseline",
        }}
      >
        <h2
          id="s5-h"
          style={{
            margin: 0,
            fontSize: "var(--type-display-2)",
            lineHeight: "var(--type-display-lh)",
            letterSpacing: "var(--type-display-tracking)",
            fontWeight: 400,
            textWrap: "pretty",
          }}
        >
          Play with it.
        </h2>
        <p style={{ margin: 0, fontSize: "var(--type-lead)", lineHeight: 1.35, maxWidth: "46ch" }}>
          A few things I like to build when I&apos;m not building products.
        </p>
      </div>

      <div
        data-play-grid
        style={{
          marginTop: "var(--space-8)",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-8) var(--gutter)",
          alignItems: "flex-start",
        }}
      >
        <TypeExperiment />
        <ColorExperiment />
        <MotionExperiment reducedMotion={reducedMotion} />
        <ComponentExperiment />
        <ResponsiveExperiment />
      </div>
    </section>
  );
}
