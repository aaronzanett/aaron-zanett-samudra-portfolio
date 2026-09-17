# Souville Editorial Design System

An editorial, print-derived visual system for **Constance Souville**, a French front-end developer based in Montreal (currently at LG2). The system is warm-grey and shadowless: oversized type, hairline rules, and flat colour panels that interrupt the headline instead of sitting in cards.

## Sources

- `uploads/Screenshot 2026-09-10 163001.png` — a single screenshot of the portfolio hero. **This is the only source provided.** No codebase, Figma file, or font binaries were supplied, so every value below is either sampled from that image or inferred from it. Treat spacing and the below-the-fold content as a proposal, not a recreation.

## Index

- `styles.css` — the single entry point consumers link. Imports everything in `tokens/`.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `borders.css`, `motion.css`, `base.css`.
- `guidelines/` — foundation specimen cards (colours, type, spacing, rules & panels).
- `components/core/` — **Button**, **Label**, **Rule**.
- `components/site/` — **Wordmark**, **MetaBar**, **NavTile**, **DisplayRow**.
- `ui_kits/portfolio/` — the assembled single-page site (`index.html`).
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent Skills entry point.

### Components

| Component | What it is |
| --- | --- |
| `Button` | Flat action in ink / cream / amber / red / ghost, optional `index` ordinal |
| `Label` | 11px bold uppercase micro label — all secondary text in the system |
| `Rule` | 1px hairline, soft or ink |
| `Wordmark` | Given + family name in display italic, split to both edges |
| `MetaBar` | Hairline-topped grid of micro labels (role, employer, contact, location) |
| `NavTile` | Flat colour panel used as navigation: label bottom-left, ordinal bottom-right |
| `DisplayRow` | One line of the oversized headline grid with a centre slot for a tile |

**Intentional additions:** `Button`, `Label` and `Rule` are not visible as discrete components in the screenshot but are unavoidable primitives; their styling is derived from the tile and meta-row treatments.

## Visual foundations

**Colour.** A warm clay ground (`--clay-200` #c1c0b6) carries everything. Text is a warm near-black (`--ink-900` #3f3b37), never pure black. Three accents — cream #fbefdf, amber #e7aa2c, red #db4c44 — appear **only as full panels**, never as text or borders. One panel colour per element; no gradients anywhere.

**Type.** Two families. A high-contrast display italic for the wordmark only, set enormous (clamp 3.5→10.5rem) at 0.86 line-height. A grotesk for everything else: headline rows at 0.9 line-height and −0.035em tracking, body at 16/1.5, and a 11px bold uppercase micro label at 0.09em tracking that does all the labelling work. Nothing sits between 16px and headline scale except the 18–24px lead paragraph.

**Layout.** A page-inset card (22px radius) floats on a slightly darker clay backdrop. Inside, content is organised as full-width rows separated by hairlines — an editorial grid, not a card grid. Headline rows push text to the left and right edges and leave a hole in the middle where a colour tile drops in. Type is allowed to run nearly edge to edge.

**Corners, borders, shadow.** No shadows at all. Panels take a single soft bottom-right corner (`--radius-panel`, 0 0 20px 0) — the system's one signature gesture. Borders are hairlines (1px `--clay-300`, or ink for section starts); nothing is outlined on all four sides.

**Motion & states.** Restrained: 140–520ms on `cubic-bezier(.22,.61,.36,1)`. Hover is an opacity drop (links, ~0.55) or a colour fill (work rows fill with the project's accent). Press states shift, they don't shrink. No bounces, no parallax, no entrance animations. Focus uses a solid ink ring.

**Transparency, blur, imagery, texture.** None of the above appear in the source. Keep surfaces opaque and flat; if imagery is added, use warm, slightly desaturated photography full-bleed inside a panel, and never overlay type on it without a solid panel behind the type.

## Content fundamentals

First person, lowercase-in-spirit but set in caps at label scale. Copy is short, factual and slightly dry — role, employer, city, time. No exclamation marks, no marketing verbs, no emoji. Numbers are two-digit ordinals ("01", "02", "03"). Location is always paired with local time. Examples: "FRONT-END WEB DEVELOPER", "PUSHING PIXELS @ LG2", "MONTREAL 5:29:53 AM", "French Frontend Developer Based in Montreal".

## Iconography

The source contains **no icons, no logo, and no emoji** — navigation is text plus two-digit numerals, and colour panels do the work an icon would. Accordingly this system ships no icon set and no logo: render the name in the display italic (`Wordmark`) wherever a mark would go. If a future surface needs icons, use a 1.25px-stroke line set (Lucide from CDN is the closest match to the hairline weight) and flag it as an addition.

## Substitutions to fix

- **Fonts.** The real faces are licensed and were not provided. The display italic is substituted with **Bodoni Moda** (italic) and the grotesk with **Archivo**, both loaded from Google Fonts in `tokens/fonts.css`. Please supply the real font files.
- **Spacing and below-the-fold content** are inferred from one screenshot.
