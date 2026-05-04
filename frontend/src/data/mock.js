// Mock data for portfolio. Replace with real content / backend later.

export const profile = {
  name: "Alex Mercer",
  role: "Full-Stack Engineer",
  tagline: "Designing systems where code meets craft.",
  location: "Berlin, DE",
  available: true,
  email: "hello@alexmercer.dev",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    x: "https://x.com",
    dribbble: "https://dribbble.com",
  },
  about: [
    "I build performant, accessible products at the intersection of design and engineering. Five years shipping web platforms for startups and growth-stage teams \u2014 from internal tools to consumer apps with millions of monthly events.",
    "Currently focused on real-time interfaces, design systems, and tooling that makes other engineers faster. Off-screen: synthwave records, brutalist architecture, long walks at unreasonable hours.",
  ],
  stats: [
    { label: "Years building", value: "05" },
    { label: "Projects shipped", value: "42" },
    { label: "Open-source stars", value: "3.1K" },
    { label: "Coffee / day", value: "\u221E" },
  ],
};

export const skills = [
  {
    group: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "Three.js"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "Redis", "GraphQL"],
  },
  {
    group: "Infra & Tooling",
    items: ["Docker", "AWS", "Vercel", "GitHub Actions", "Terraform", "Linux"],
  },
  {
    group: "Craft",
    items: ["Design systems", "DX tooling", "A11y", "Performance", "Motion design"],
  },
];

export const projects = [
  {
    id: "p01",
    title: "Neon Console",
    summary:
      "Real-time observability dashboard for distributed systems. WebSocket pipelines, sub-100ms render budgets, custom canvas charts.",
    tags: ["React", "WebSockets", "Canvas", "Rust"],
    year: "2025",
    role: "Lead Engineer",
    image:
      "https://images.unsplash.com/photo-1720962158883-b0f2021fb51e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxmdXR1cmlzdGljJTIwVUl8ZW58MHx8fHwxNzc3OTMzNzc2fDA&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
  {
    id: "p02",
    title: "Atlas / Design System",
    summary:
      "A 120+ component design system shipped across four product surfaces. Token-driven theming, motion primitives, full a11y audit.",
    tags: ["Design System", "Tokens", "Storybook", "a11y"],
    year: "2024",
    role: "Staff Engineer",
    image:
      "https://images.unsplash.com/photo-1720962158789-9389a4f399da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwVUl8ZW58MHx8fHwxNzc3OTMzNzc2fDA&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
  {
    id: "p03",
    title: "Synth.fm",
    summary:
      "Generative audio playground in the browser. WebAudio + WebGL, persistent presets, collaborative jam rooms.",
    tags: ["WebAudio", "WebGL", "Realtime"],
    year: "2024",
    role: "Solo build",
    image:
      "https://images.unsplash.com/photo-1720962158858-5fb16991d2b8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwzfHxmdXR1cmlzdGljJTIwVUl8ZW58MHx8fHwxNzc3OTMzNzc2fDA&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
  {
    id: "p04",
    title: "Vector Atlas",
    summary:
      "AI-assisted research tool for engineers. Semantic search across 2M+ documents, citation graphs, in-line annotations.",
    tags: ["AI", "Vectors", "Next.js", "Postgres"],
    year: "2023",
    role: "Founding Eng",
    image:
      "https://images.unsplash.com/photo-1741795990628-7ec99d7d2044?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxuZW9uJTIwY29kZXxlbnwwfHx8fDE3Nzc5MzM3NzZ8MA&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
  {
    id: "p05",
    title: "Grid OS",
    summary:
      "Operations console for an electricity startup. Map-driven UI over 40k sensors, alarm pipelines, role-based control.",
    tags: ["Mapbox", "Streams", "Auth", "FastAPI"],
    year: "2023",
    role: "Senior Eng",
    image:
      "https://images.unsplash.com/photo-1720962158937-7ea890052166?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxjeWJlcnB1bmslMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzc3OTMzNzc2fDA&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
  {
    id: "p06",
    title: "Halftone",
    summary:
      "Open-source CLI for component scaffolding. 3.1K stars, used by 200+ teams. Fully extensible plugin system.",
    tags: ["OSS", "CLI", "Node", "DX"],
    year: "2022",
    role: "Maintainer",
    image:
      "https://images.unsplash.com/photo-1632765743329-3b257fe779a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzc3OTMzNzc2fDA&ixlib=rb-4.1.0&q=85",
    href: "#",
  },
];

export const experience = [
  {
    id: "e01",
    company: "Northwind Labs",
    role: "Staff Software Engineer",
    period: "2023 \u2014 Present",
    location: "Berlin",
    bullets: [
      "Lead the platform pod \u2014 design system, tooling, performance.",
      "Cut p95 page-load by 38% via streaming SSR + render budget.",
      "Mentor 6 engineers across two product squads.",
    ],
  },
  {
    id: "e02",
    company: "Cobalt Studio",
    role: "Senior Frontend Engineer",
    period: "2021 \u2014 2023",
    location: "Remote",
    bullets: [
      "Shipped 4 client products from zero to launch.",
      "Built motion-first design language adopted across studio.",
    ],
  },
  {
    id: "e03",
    company: "Mercer Indie",
    role: "Independent Engineer",
    period: "2019 \u2014 2021",
    location: "\u2014",
    bullets: [
      "Side-project to revenue: launched 3 micro-SaaS products.",
      "OSS maintainer \u2014 3.1K stars across repos.",
    ],
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Path", href: "#path" },
  { label: "Contact", href: "#contact" },
];
