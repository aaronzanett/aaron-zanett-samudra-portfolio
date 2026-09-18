export type RowMode = "plain" | "chaos" | "zero";

export const scene03Content = {
  sceneLabel: "The Process",
  heading: {
    kicker: "How the work begins",
    title: "Every project starts differently.",
    lead: "Different beginnings. One finished product.",
  },
  rows: [
    {
      num: "01",
      title: "PRD to frontend",
      mode: "plain" as RowMode,
      steps: ["PRD", "Figma", "Frontend", "Integration", "Product"],
      proves: "Proves: can translate requirements and existing designs into a shipped frontend.",
    },
    {
      num: "02",
      title: "PRD without UI/UX",
      mode: "chaos" as RowMode,
      steps: ["PRD", "Research", "Design", "Frontend", "Integration", "Product"],
      proves: "Proves: independence with no designer.",
    },
    {
      num: "03",
      title: "From zero",
      mode: "zero" as RowMode,
      steps: ["Idea", "Research", "Design", "Frontend", "Integration", "Product"],
      proves: "Proves: full 0 → 1 capability.",
    },
  ],
  convergence: {
    caption: "Different starting points →",
    label: "Same maker",
    word: "me",
  },
  handoff: {
    line1: "And then, it came to life.",
    line2: "Built from an idea. Made for impact.",
    cue: "Selected work",
  },
};
