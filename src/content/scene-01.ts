export const scene01Content = {
  sceneLabel: "The Idea",
  heading: ["Everything starts", "with an idea."],
  brief: {
    kicker: "New project",
    prompt: "What's the idea?",
    body: "No code yet. First I need the problem, the people it belongs to, and what the thing actually has to do. Keep scrolling — I'll show you.",
  },
  information: {
    caption: "Idea → Information",
    items: [
      {
        icon: "alert",
        title: "Problem",
        body: "What is actually broken today, stated in one sentence.",
        note: "If I can't name it plainly, I don't understand it yet.",
      },
      {
        icon: "users",
        title: "User",
        body: "Who it is for, where they are, and what they already know.",
        note: "The context decides the interface more than taste does.",
      },
      {
        icon: "lightbulb",
        title: "Idea",
        body: "The smallest thing that solves it — sharpened until it fits one line.",
        note: null,
      },
      {
        icon: "checklist",
        title: "Requirements",
        body: "What it must do, what it must never do, what can wait.",
        note: "Constraints first: device, connection, data, deadline.",
      },
    ],
  },
  structure: {
    caption: "Information → Structure",
    rows: [
      { label: "One sentence", value: "What it is", size: "display" as const },
      {
        label: "Core objects",
        value: "The few nouns the whole product is made of, and how they relate",
        size: "lead" as const,
      },
      {
        label: "Primary flow",
        value: "The one route that has to be effortless — everything else can be longer",
        size: "lead" as const,
      },
      {
        label: "Hierarchy",
        value: "What is read first, second, and only on request — decided before layout",
        size: "lead" as const,
      },
    ],
  },
  interface: {
    caption: "Structure → Interface",
    cards: [
      { num: "01", title: "Mobile app", caption: "One task per screen, thumb-reachable actions." },
      { num: "02", title: "Dashboard", caption: "Dense data, but only one thing shouting at a time." },
      { num: "03", title: "Marketing page", caption: "Claim, proof, one action — in that order." },
      { num: "04", title: "Search & results", caption: "Query, narrow, result — no dead ends, no empty screens." },
    ],
  },
  exitLine: "So, how do I turn an idea into an experience?",
};
