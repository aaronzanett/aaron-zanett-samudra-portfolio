export const scene02Content = {
  sceneLabel: "The Mindset",
  intro: {
    heading:
      "I'm Aaron. A Frontend Developer focused on turning ideas, designs and requirements into thoughtful digital experiences.",
    lead: "I care about the details. How it looks. How it feels. How it behaves. How it works.",
    body: "Below is the whole route from a requirement to a shipped product, in seven phases. Scroll drives it — down advances, up reverses, and it moves at whatever speed you do.",
  },
  phases: [
    { num: "01", name: "Understand", tagline: "Make it clear" },
    { num: "02", name: "Design", tagline: "Make it feel right" },
    { num: "03", name: "Experience", tagline: "Make it easy to use" },
    { num: "04", name: "System", tagline: "Make it consistent" },
    { num: "05", name: "Build & Tools", tagline: "Make it work, with the right tools" },
    { num: "06", name: "Refine", tagline: "Make it better" },
  ],
  understand: {
    label: "Understand — Make it clear",
    items: [
      "Problem — what is actually broken",
      "Requirements — what it must do",
      "Users — who carries the cost of getting it wrong",
      "Information hierarchy — what to read first",
      "User flows — the route through the product",
      "Goals — how we know it worked",
    ],
    tags: ["Read the brief", "Ask what's missing", "Agree the goal"],
  },
  design: {
    label: "Design — Make it feel right",
    trials: [
      "Trial 01 — grotesk, bold",
      "Trial 02 — grotesk, tight",
      "Locked — Bodoni italic",
    ],
    scaleCaption: "64 · 24 · 16 · 11",
  },
  experience: {
    label: "Experience — Make it easy to use",
    steps: ["Click", "Feedback", "State change", "Understands"],
    notes: [
      "Four things happen at once. Nothing tells the user which one answered them.",
      "So put them back in the order a person actually lives them.",
      "Click, then feedback, then the state changes — and only then does it make sense.",
    ],
  },
  system: {
    label: "System — Make it consistent",
    atoms: ["Button", "Input", "Panel", "Label"],
    usage: [
      { context: "Header", preview: "Nav link" },
      { context: "Work index", preview: "Panel ×2" },
      { context: "Contact", preview: "Same component, no new rules" },
    ],
  },
  tools: {
    label: "Build & Tools — Make it work, with the right tools",
    groups: [
      {
        title: "Development",
        items: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "GSAP", "Node.js", "MySQL", "PostgreSQL"],
      },
      {
        title: "Tools & Workflow",
        items: ["Git", "GitHub", "Figma", "Claude"],
      },
    ],
  },
  refine: {
    label: "Refine — Make it better",
    steps: ["Build", "Test", "Find", "Improve", "Polish"],
    checklist: [
      "Six viewports, each one designed — not scaled down",
      "Edge cases, loading and error states",
      "Keyboard, contrast, reduced motion",
      "Performance under a real connection",
    ],
    resultLabel: "Faster",
  },
};
