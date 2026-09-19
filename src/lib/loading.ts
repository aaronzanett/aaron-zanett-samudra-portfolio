import { scene02Content } from "@/content/scene-02";

/** Fired on `window` once the loading screen has fully left, so scroll can be handed back. */
export const LOADING_DONE_EVENT = "portfolio:ready";

// Keep in step with the project folders in public/projects/ (Scenes 03–04 show 4 shots each).
const PROJECT_KEYS = ["apotekpro", "alhikmah", "zanscode", "trimly", "wowrack"];
const SHOTS_PER_PROJECT = 4;

const DEVICON = (slug: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;
const CLAUDE_MASK_URL = "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/claude.svg";

/** Every image the site shows that isn't in the initial HTML — fetched up front so scenes never pop in. */
export function getPreloadImageUrls(): string[] {
  const shots = PROJECT_KEYS.flatMap((key) => Array.from({ length: SHOTS_PER_PROJECT }, (_, i) => `/projects/${key}/${i + 1}.png`));
  const toolIcons = scene02Content.tools.groups
    .flatMap((group) => group.items)
    .map((tool) => tool.icon)
    .filter((icon) => icon !== "gsap" && icon !== "claude")
    .map(DEVICON);
  return [...shots, "/projects/apotekpro-product.png", "/icons/gsap.svg", ...toolIcons, CLAUDE_MASK_URL];
}

/** Font faces that are otherwise only fetched when first painted (italic display, bold grotesk). */
export const FONT_LOADS = ['400 1em "Archivo"', '700 1em "Archivo"', 'italic 500 1em "Bodoni Moda"', '400 1em "Bodoni Moda"'];
