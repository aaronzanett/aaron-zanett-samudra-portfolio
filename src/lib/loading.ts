import { scene02Content } from "@/content/scene-02";

/** Fired on `window` once the loading screen has fully left, so scroll can be handed back. */
export const LOADING_DONE_EVENT = "portfolio:ready";

// Keep in step with the project folders in public/projects/ (Scenes 03–04 show 4 shots each).
const PROJECT_KEYS = ["apotekpro", "alhikmah", "zanscode", "trimly", "wowrack"];
const SHOTS_PER_PROJECT = 4;

const DEVICON = (slug: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;

/** Full-colour tool logos served from public/icons (no devicon exists, or it is not solid). */
export const LOCAL_TOOL_ICONS: Record<string, string> = {
  gsap: "/icons/gsap.svg",
  microsoftteams: "/icons/microsoft-teams.svg",
};

/**
 * Tools with no full-colour devicon: a monochrome simple-icons glyph painted in the brand colour
 * through a CSS mask, so they read like the coloured devicons beside them.
 */
export const MASK_TOOL_ICONS: Record<string, { url: string; color: string }> = {
  claude: { url: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/claude.svg", color: "#d97757" },
  notion: { url: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/notion.svg", color: "#000000" },
  zoom: { url: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/zoom.svg", color: "#0b5cff" },
};

/** Every image the site shows that isn't in the initial HTML — fetched up front so scenes never pop in. */
export function getPreloadImageUrls(): string[] {
  const shots = PROJECT_KEYS.flatMap((key) => Array.from({ length: SHOTS_PER_PROJECT }, (_, i) => `/projects/${key}/${i + 1}.png`));
  const toolIcons = scene02Content.tools.groups
    .flatMap((group) => group.items)
    .map((tool) => tool.icon)
    .filter((icon) => !(icon in LOCAL_TOOL_ICONS) && !(icon in MASK_TOOL_ICONS))
    .map(DEVICON);
  return [...shots, "/projects/apotekpro-product.png", ...Object.values(LOCAL_TOOL_ICONS), ...toolIcons, ...Object.values(MASK_TOOL_ICONS).map((m) => m.url)];
}

/** Font faces that are otherwise only fetched when first painted (italic display, bold grotesk). */
export const FONT_LOADS = ['400 1em "Archivo"', '700 1em "Archivo"', 'italic 500 1em "Bodoni Moda"', '400 1em "Bodoni Moda"'];
