"use client";

/*
 * Scene 06 — The End. Ported from `Aaron Portfolio.dc.html`
 * (section[data-scene="06"] and the s6 half of `initRise()`).
 */

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useRegisterScene } from "@/lib/hooks/useSceneProgress";

const label: CSSProperties = {
  fontSize: "var(--type-label)",
  fontWeight: 700,
  letterSpacing: "var(--type-label-tracking)",
  textTransform: "uppercase",
};

const contactLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-2)",
  padding: "8px 0",
  textDecoration: "none",
  borderBottom: 0,
  ...label,
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// The design leaves the résumé as a dead "#" placeholder; the file is expected at public/resume.pdf.
const RESUME_HREF = "/resume.pdf";

export function SceneEnd() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  useRegisterScene(sectionRef, "Scene 06 — The End");

  // The design's initRise() for scene 06: the strip, then the heading block and the contact row
  // (90ms apart) rise in once as they settle into view. Skipped under reduced motion.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const groups: Element[][] = [[section.children[0]], Array.from(section.children).slice(1)];
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
      aria-labelledby="s6-h"
      data-scene="06"
      style={{
        borderTop: "var(--hairline-ink)",
        padding: "clamp(var(--space-9), 24vh, 260px) var(--gutter) clamp(var(--space-9), 16vh, 180px)",
        display: "grid",
        gap: "clamp(var(--space-8), 9vh, 96px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          borderTop: "var(--hairline-ink)",
          paddingTop: "var(--space-2)",
          ...label,
        }}
      >
        <span>Scene 06</span>
        <span>The End</span>
      </div>
      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        <h2
          id="s6-h"
          style={{
            margin: 0,
            fontSize: "var(--type-display-1)",
            lineHeight: "var(--type-display-lh)",
            letterSpacing: "var(--type-display-tracking)",
            fontWeight: 400,
            maxWidth: "16ch",
            textWrap: "pretty",
          }}
        >
          An idea is only the beginning.
        </h2>
        <p style={{ margin: 0, fontSize: "var(--type-lead)", lineHeight: 1.3, color: "var(--text-secondary)", maxWidth: "30ch" }}>
          Let&apos;s turn it into an experience.
        </p>
      </div>
      <div
        data-s6-foot
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4) var(--space-8)",
          borderTop: "var(--hairline)",
          paddingTop: "var(--space-4)",
        }}
      >
        <nav aria-label="Contact" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-2) var(--space-5)" }}>
          <a href="mailto:aaronzanettsamudra@gmail.com" style={contactLink}>
            <Icon>
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m2.5 6 9.5 7 9.5-7"></path>
            </Icon>
            <span>Email</span>
          </a>
          <a href="https://github.com/aaronzanett" target="_blank" rel="noreferrer noopener" style={contactLink}>
            <Icon>
              <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"></path>
            </Icon>
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/aaronzanettsamudra" target="_blank" rel="noreferrer noopener" style={contactLink}>
            <Icon>
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-11h4v1.5A6 6 0 0 1 16 8z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </Icon>
            <span>LinkedIn</span>
          </a>
          <a href={RESUME_HREF} target="_blank" rel="noreferrer noopener" data-resume style={contactLink}>
            <Icon>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <path d="M8 13h8"></path>
              <path d="M8 17h5"></path>
            </Icon>
            <span>Résumé</span>
          </a>
        </nav>
        <span style={{ ...label, color: "var(--text-muted)" }}>Aaron Zanett Samudra — 2026</span>
      </div>
    </section>
  );
}
