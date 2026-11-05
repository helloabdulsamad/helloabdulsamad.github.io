// The featured work, in the order the home page shows it. Every line here comes
// from the fact-checked case studies in /content.
export type Project = {
  slug: string;
  file: string;
  name: string;
  line: string; // one sentence for the index row
  hook: string; // the big line on the hover card and the case-study cover
  role: string;
  year: string;
  status: string;
  link?: string;
  ink: string; // flat card colour
  paper: string; // text colour on the card
};

export const projects: Project[] = [
  {
    slug: "eventhome",
    file: "01-eventhome.md",
    name: "EventHome",
    line: "Ticketing and venue booking where every naira moves exactly once.",
    hook: "200 buyers. 100 tickets. Exactly 100 sold.",
    role: "Co-founder and sole engineer",
    year: "2026",
    status: "Live",
    link: "https://eventhome.app",
    ink: "#171717",
    paper: "#f5f5f5",
  },
  {
    slug: "upsert",
    file: "02-upsert.md",
    name: "Upsert",
    line: "A control plane that creates and runs one isolated online store per merchant.",
    hook: "One store fails. The rest stay up.",
    role: "Founder and lead engineer",
    year: "2026",
    status: "Live",
    link: "https://upsert.ng",
    ink: "#1f3a2e",
    paper: "#eef3ef",
  },
  {
    slug: "upsert-scout",
    file: "03-upsert-scout.md",
    name: "Upsert Scout",
    line: "Messy careers pages turned into one clean, public jobs API.",
    hook: "242 companies. One clean feed.",
    role: "Sole engineer",
    year: "2026",
    status: "Live",
    link: "https://scout.upsert.ng",
    ink: "#e9e2d0",
    paper: "#1a1a1a",
  },
  {
    slug: "tredar",
    file: "04-tredar-pos.md",
    name: "Tredar",
    line: "A till that keeps selling when the light or the network goes.",
    hook: "No network. Still selling.",
    role: "Sole builder and operator",
    year: "2026",
    status: "Live",
    ink: "#3b2a1e",
    paper: "#f3ece4",
  },
  {
    slug: "smarttasker-indonesia",
    file: "05-smarttasker-indonesia.md",
    name: "SmartTasker Indonesia",
    line: "Launching a live task marketplace in a new country, inside the client's team.",
    hook: "Every release from 1.2.5 to 1.2.9.",
    role: "Second engineer",
    year: "2026",
    status: "Live",
    link: "https://www.smarttasker.id",
    ink: "#d9e6f2",
    paper: "#10202e",
  },
  {
    slug: "milo",
    file: "07-milo.md",
    name: "Milo",
    line: "A WhatsApp sales agent for my own watch store, made safe near orders and money.",
    hook: "It never acts for the wrong customer.",
    role: "Owner and sole engineer",
    year: "2026",
    status: "Built",
    link: "https://watchshop.ng",
    ink: "#0f2f27",
    paper: "#e8f1ee",
  },
  {
    slug: "inkznpaint",
    file: "08-inkznpaint.md",
    name: "Inkz ’N’ Paint",
    line: "A web-to-print platform for a printing press, with a print editor and partner payouts.",
    hook: "From artwork to a printer in your state.",
    role: "Upsert Labs, client build",
    year: "2026",
    status: "Built",
    ink: "#f1e6dc",
    paper: "#2a1a12",
  },
  {
    slug: "the-standard",
    file: "06-open-source-the-standard.md",
    name: "The Standard, open source",
    line: "Reviewed, test-first contributions to EventHighway and RESTFulSense, shipped on NuGet.",
    hook: "228 review comments on one pull request.",
    role: "Contributor",
    year: "2024 to 2026",
    status: "Shipped",
    link: "https://github.com/The-Standard-Organization/EventHighway",
    ink: "#262626",
    paper: "#fafafa",
  },
];

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
