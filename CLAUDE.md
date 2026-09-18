@AGENTS.md

# claude.md — Project Guide

Operating rules for this repository. **Binding.** `PRD.md` defines *what* to build; this file defines *how* to build it. When they appear to conflict, ask before proceeding.

---

## Project

Aaron's personal portfolio — a single continuous, scroll-driven narrative site with cinematic scroll-scrubbed video and interactive experiments. See `PRD.md` for the narrative and scene specifications.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js — routing, rendering, optimization, metadata, structure |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS — layout, spacing, typography, design tokens |
| Animation | GSAP + ScrollTrigger — timelines, scroll-driven animation, pinning, parallax, scene transitions, video scrubbing |
| Smooth scroll | Lenis |
| Video | HTML5 `<video>`, scroll-scrubbed |
| Data | PostgreSQL only where genuinely dynamic; REST where external integration is needed |
| Version control | Git / GitHub |
| Design | Figma |

**Rules:**
- Do not add a library without asking. Justify by problem, not preference.
- Static content lives in typed local content files, not the database. Reach for PostgreSQL only when data is genuinely dynamic.
- Never surface a technology in the UI that isn't used in the build.

---

## Architecture

Each scene must be independently understandable while the site remains one continuous experience.

```
app/                  # Next.js routes, layout, metadata
components/
  scenes/             # One directory per scene, self-contained
  ui/                 # Shared primitives — buttons, inputs, cards
  media/              # Video, image, responsive media wrappers
lib/
  animation/          # GSAP timeline factories, ScrollTrigger helpers, scrub utils
  hooks/              # useLenis, useScrollProgress, useReducedMotion, useBreakpoint
content/              # Typed project + copy data
styles/               # Tokens, Tailwind config extensions
public/               # Optimized media
```

- Scene components own their own timelines and clean up after themselves.
- Shared logic — animation utilities, typography utilities, media components, responsive primitives — is extracted to `lib/` and `components/`.
- **Do not over-engineer.** No abstraction layer until a third real use case exists. Duplication is cheaper than a wrong abstraction here.

---

## Animation

- Motion communicates hierarchy, progression, transformation, interaction, and storytelling. Motion that exists only to look impressive gets cut.
- No bounce-heavy easing, no gratuitous effects.
- Parallax is applied deliberately, never blanket-applied. Depth relationship when used: background slow → content normal → foreground slightly faster. Depth must never cost readability or usability.
- Every GSAP timeline and ScrollTrigger is registered in a `useLayoutEffect` with `gsap.context()` and reverted on unmount. No orphaned triggers, no leaked listeners.
- `ScrollTrigger.refresh()` after layout-affecting async content (fonts, media) resolves.
- Prefer transform and opacity. Avoid animating layout properties.

**Scroll-scrubbed video pipeline:**

```
Scroll position → normalized progress (0–1) → video progress → video.currentTime → visual
```

- The video seeks to scroll progress. It is never an autoplay background loop.
- Keep scrubbing performant: preload appropriately, encode for frequent seeking (short keyframe interval), throttle seeks to animation frames, and watch for CPU spikes or unstable frame delivery.
- If scrubbing cannot run well on a device, degrade to a static or stepped fallback that preserves the narrative.

---

## Responsive

Responsive design is a product requirement, not a finishing pass. **Never scale the desktop layout down.**

Design and test at: **large desktop, desktop, laptop, tablet, mobile, small mobile.**

What adapts intentionally per viewport: layout, typography, spacing, navigation, media, video composition, interactions, project presentation, workflow diagrams, playground experiments, parallax, and animation intensity.

- **Desktop:** wider compositions, larger type, richer layering, larger media, more complex arrangements.
- **Laptop:** adapts to reduced width without feeling compressed.
- **Tablet:** horizontal structures may reorganize vertically.
- **Mobile:** intentionally designed. Simplify complex compositions, reduce animation and parallax intensity, prevent horizontal overflow, keep type readable, use large touch targets, optimize video behavior, and preserve the narrative.

---

## Accessibility

Required throughout, not per-scene:

- Semantic HTML and a correct heading hierarchy
- Full keyboard navigation with visible focus states
- Sufficient color contrast
- Accessible buttons and links; meaningful alt text where appropriate
- Accessible video and media handling
- **`prefers-reduced-motion`:** reduce or disable parallax, scroll effects, transitions, and animation intensity — while keeping all content and navigation fully usable. Never gate content behind motion.

---

## Performance

The site carries animation, video, and interactive media, so performance is a core requirement.

- Lazy loading, modern image formats, responsive image sizes, video compression
- Dynamic imports for heavy, below-the-fold, or interactive-only modules
- Large media must never block the initial experience
- Avoid unnecessary React re-renders; keep animation values out of state where possible
- Optimize fonts and avoid layout shift on font load

**Progressive enhancement is mandatory.** The portfolio stays functional when animation is reduced, media fails to load, or the device is limited.

---

## Code Conventions

- TypeScript strict. No `any`. Type content and props explicitly.
- Functional components; server components by default, `"use client"` only where interaction or animation requires it.
- Tailwind utilities with tokens from the config. No arbitrary magic values once a token exists.
- Descriptive names — `useScrollProgress`, not `useSP`.
- Comment *why*, not *what*. Animation sequencing deserves comments; obvious code doesn't.
- Handle loading, error, and empty states as part of the component, not as an afterthought.

---

## Working With Aaron

- **Build one scene at a time.** Complete, review, then move on. Don't scaffold all six at once.
- **Ask before:** adding a dependency, changing the stack, restructuring directories, altering PRD-specified copy, or introducing an abstraction across scenes.
- **Flag, don't silently resolve:** ambiguity in the PRD, a spec that fights performance or accessibility, or a transition that can't be built as described.
- Propose the approach for any complex scroll or video sequence before writing it.
- Say when something won't work. A correction now beats a rewrite later.
- Keep responses focused on the change at hand. No summary essays after small edits.

---

## Definition of Done (per scene)

- [ ] Matches the PRD spec, including its explicit "reject / forbidden" items
- [ ] Verified at all six viewport sizes
- [ ] Keyboard navigable with visible focus
- [ ] Reduced-motion path tested and fully usable
- [ ] GSAP contexts and ScrollTriggers cleaned up on unmount
- [ ] No horizontal overflow at any width
- [ ] Media optimized and lazy-loaded where appropriate
- [ ] Loading and error states handled
- [ ] Transition into the next scene preserves narrative continuity
- [ ] No console errors or warnings

---

## Build log

- **Scene 01 (The Idea) — done.** Pinned/sticky 4-stage scroll-scrubbed crossfade (`useStagedScrub` in `lib/animation/`), reused for future scenes. Mobile breakpoint overrides ported from the design export at ≤720px. Reduced-motion renders a static stacked layout instead of the pinned crossfade.
- **Scene 02 (The Mindset) — done, ported verbatim from the Claude Design export.** Nested crossfade (intro → 6 phases) using `useStagedScrub` for both levels. Every phase's markup, inline styles, and reveal-once keyframes (font/colour/scale trials, step reordering, atom→usage reveal, tool stagger, checklist + progress bar) are copied 1:1 from `_design_import/Aaron Portfolio.dc.html`, including the real devicon/simple-icons CDN logos and local `gsap.svg` for Build & Tools, and the exact height/width breakpoint overrides (≤760px/≤620px height, ≤860px/≤720px width) via the source's own `data-*` attribute selectors. Verified phase-by-phase in-browser against the source and at mobile width — no overflow.
  - No product-film video asset exists yet — the design conditionally renders a scroll-scrubbed `<video>` behind the phase frames (defaults to no video); dropping one in is a small follow-up once Aaron has a file.
  - Panel 01 (Understand)'s content fade/rise-in (`om-panel-content`, staggered across the label, the six problem rows, and the tag row) was initially missed — it's gated at the `data-framewrap` level via its own one-time `data-reveal`, separate from the per-phase `data-*-reveal` attributes the other five panels use. Added and verified.
  - Panel 03 (Experience) initially reused the same `align-content: space-between` frame layout as the other five panels, but its source frame is actually `grid-template-rows: auto minmax(0, 1fr)` with the content centered in the flexible row — the one panel that centers instead of pinning to top/bottom. Fixed via a `centered` prop on `PhaseFrame`. Its 4-column step grid also had no mobile override in the source; added a 2x2 layout at ≤720px (own addition, not literally in the export) since 4 equal columns were too tight on a phone.
- **Scenes 03 (The Process) + 04 (The Work) — done, ported directly from `Scene 03 Process.dc.html`.** The design builds both from ONE component on a single 2560vh track (a camera flying over a 2700x2100 world for the three workflow rows, convergence, and the held product, then the work showcase, with the product frame morphing into the first project), so they live together in `components/scenes/SceneProcessWork.tsx` rather than one directory per scene. The design's logic, constants, and camera/row/showcase math are kept as-is (as a class component with the same measure/rAF-pump loop); only the template syntax became JSX and the design-system `Label` is inlined with its exact styles. Header label flips 03→04 at the design's 48% split via two marker divs. Project screenshots are in `public/projects/<key>/<n>.png`; the standalone Apotek Pro product shot is `public/projects/apotekpro-product.png`.
  - Deviation from the source: under `prefers-reduced-motion`, the time-based clocks (intro fade, typing, shot cross-fade, hold/"more" fades) snap to their end state. Scroll still drives the camera; nothing is gated. The design has no reduced-motion handling here.
  - The design has no per-project technology tags in this scene, so none are shown (PRD: never show a tool that wasn't used).
- Scenes 05–06: not yet built. See `PRD.md` and the design export spec for content.
