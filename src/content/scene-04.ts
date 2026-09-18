export interface Project {
  key: string;
  num: string;
  name: string;
  role: string;
  year: string;
  description: string;
  shots: number;
}

export const scene04Content = {
  sceneLabel: "The Work",
  heading: {
    kicker: "Selected work",
    title: "Things I've actually built.",
    lead: "Real products, shipped — not a portfolio grid.",
  },
  projects: [
    {
      key: "apotekpro",
      num: "01",
      name: "Apotek Pro",
      role: "Full-stack",
      year: "2024",
      description: "A pharmacy operating system — point of sale, prescriptions, stock and expiry, finance. Built end to end, from schema to interface.",
      shots: 4,
    },
    {
      key: "alhikmah",
      num: "02",
      name: "Al-Hikmah",
      role: "Frontend",
      year: "2024",
      description: "Public site and portals for a modern Islamic boarding school: admissions, guardian and student dashboards, billing and savings.",
      shots: 4,
    },
    {
      key: "zanscode",
      num: "03",
      name: "Zanscode",
      role: "Frontend",
      year: "2025",
      description: "Company site and internal OS for a software studio — service pages, product suite, and an operations dashboard behind one system.",
      shots: 4,
    },
    {
      key: "trimly",
      num: "04",
      name: "Trimly",
      role: "Frontend",
      year: "2026",
      description: "Barbershop management across owner, staff and customer roles: booking, cashier, commission and multi-branch reporting.",
      shots: 4,
    },
    {
      key: "wowrack",
      num: "05",
      name: "Wowrack Recruitment Portal",
      role: "Frontend",
      year: "2026",
      description: "Careers site and candidate portal — job listings, a long structured application flow, and applicant stage tracking.",
      shots: 4,
    },
  ] satisfies Project[],
};
