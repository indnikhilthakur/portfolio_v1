// Real portfolio data for Nikhil Thakur.
// Sourced from resume — keep this file as the single source of truth for content.

export const profile = {
  firstName: "Nikhil",
  lastName: "Thakur",
  name: "Nikhil Thakur",
  initials: "NT",
  role: "Founding Engineer & Tech Lead",
  specialization: "Snowflake Native Apps · Data · Python",
  tagline: "Shipping Snowflake Native Apps and data systems from zero to one.",
  location: "Pune, India",
  available: true,
  email: "nikhil.nt58@gmail.com",
  phone: "+91 98605 28221",
  socials: {
    github: "https://github.com/indnikhilthakur",
    linkedin: "https://www.linkedin.com/in/ind-nikhil-thakur",
    email: "mailto:nikhil.nt58@gmail.com",
  },
  about: [
    "Founding engineer and acting tech lead with deep focus on Snowflake Native Apps, data engineering, and Python backend systems. Currently driving end-to-end design and delivery of a production-grade Snowflake Native Application at an early-stage Singapore startup.",
    "I’ve shipped MVPs from scratch, owned system architecture, mentored engineers, and conducted technical hiring as part of a founding team. I care about clean architecture, security boundaries, and unblocking the people I build alongside.",
  ],
  stats: [
    { label: "Years building", value: "04+" },
    { label: "Native Apps shipped", value: "02" },
    { label: "Certifications", value: "06" },
    { label: "Coffee / day", value: "\u221E" },
  ],
};

export const skills = [
  {
    group: "Languages & Backend",
    items: [
      "Python",
      "SQL",
      "Java",
      "Django",
      "Flask",
      "REST APIs",
      "OAuth",
    ],
  },
  {
    group: "Data Platforms",
    items: [
      "Snowflake",
      "Snowflake Native Apps",
      "Snowpark",
      "Snowflake Cortex",
      "Streamlit",
      "Tasks & Streams",
      "UDFs / Stored Procs",
    ],
  },
  {
    group: "AI / ML",
    items: [
      "TensorFlow",
      "Keras",
      "scikit-learn",
      "LangChain",
      "RAG",
      "NumPy",
      "Pandas",
    ],
  },
  {
    group: "Cloud, Tools & Data",
    items: [
      "AWS",
      "Docker",
      "Linux",
      "Git",
      "Jira",
      "PostgreSQL",
      "MySQL",
      "Postman",
    ],
  },
];

export const projects = [
  {
    id: "p01",
    title: "Flow by Coridors",
    summary:
      "Production-grade Snowflake Native App platform enabling secure ingestion from external SaaS systems. Owned architecture, Native App lifecycle, security model, network rules, and EAI design.",
    tags: ["Snowflake Native Apps", "Snowpark", "Streamlit", "Python", "EAI"],
    year: "2024 — Present",
    role: "Lead App Engineer",
    image:
      "https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?auto=format&fit=crop&w=1400&q=80",
    href: "#",
  },
  {
    id: "p02",
    title: "RAG Document Assistant",
    summary:
      "RAG-based AI app to ingest PDFs and answer contextual questions inside Snowflake’s security boundary. Vector embeddings via Snowflake Cortex, retrieval pipeline integrated with external models.",
    tags: ["Snowflake Cortex", "LangChain", "Snowpark", "Python", "RAG"],
    year: "2024",
    role: "Builder",
    image:
      "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&w=1400&q=80",
    href: "#",
  },
  {
    id: "p03",
    title: "Secure Ingestion Connector",
    summary:
      "Metadata-driven connector framework for incremental data ingestion. OAuth-based auth, secure UDFs, External Access Integrations, and Snowflake Marketplace review collaboration.",
    tags: ["EAI", "Network Rules", "OAuth", "Snowpark", "Marketplace"],
    year: "2024",
    role: "Architect",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
    href: "#",
  },
  {
    id: "p04",
    title: "CARL — Investment App",
    summary:
      "Backend for a quantitative investment platform offering hedge-fund strategies via mobile. Designed REST APIs in Django and managed PostgreSQL data layer, partnering with mobile + frontend teams.",
    tags: ["Django", "REST APIs", "PostgreSQL", "Python"],
    year: "2022 — 2023",
    role: "Backend Dev",
    image:
      "https://images.unsplash.com/photo-1650959828226-f9d53a7c1f64?auto=format&fit=crop&w=1400&q=80",
    href: "#",
  },
  {
    id: "p05",
    title: "Autonomous Drone Delivery",
    summary:
      "Last-mile delivery prototype: GPS-based autonomous navigation with pathfinding. Led a 4-person team integrating Pixhawk/Ardupilot hardware with a Raspberry Pi software stack.",
    tags: ["Pixhawk", "Ardupilot", "Dronekit", "MAVLink", "Raspberry Pi"],
    year: "2020 — 2021",
    role: "Team Lead",
    image:
      "https://images.unsplash.com/photo-1644088379091-d574269d422f?auto=format&fit=crop&w=1400&q=80",
    href: "#",
  },
  {
    id: "p06",
    title: "Breast Cancer ML Classifier",
    summary:
      "Classification model predicting malignant vs. benign tumors over 569 instances and 30 features. Benchmarked multiple algorithms with Keras and scikit-learn for accuracy.",
    tags: ["Python", "scikit-learn", "Keras", "Pandas", "ML"],
    year: "2021",
    role: "ML Intern",
    image:
      "https://images.unsplash.com/photo-1643780668909-580822430155?auto=format&fit=crop&w=1400&q=80",
    href: "#",
  },
  {
    id: "p07",
    title: "LinkStash App",
    summary:
      "A sleek personal bookmarking and URL sharing hub. Organized by categories and tags with fast client-side filtering, automatic page metadata extraction, and collaborative public collections.",
    tags: ["React", "Express", "MongoDB", "Node.js", "OAuth"],
    year: "2024",
    role: "Creator",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1400&q=80",
    href: "https://github.com/indnikhilthakur/linkstash",
  },
  {
    id: "p08",
    title: "Portfolio v1",
    summary:
      "Interactive data-processing personal portfolio featuring a real-time rotating 3D particle space globe, connected directly to GitHub repositories via live cron synchronization, styled with premium glassmorphism.",
    tags: ["React", "FastAPI", "MongoDB", "Vercel", "Canvas"],
    year: "2026",
    role: "Creator",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80",
    href: "https://github.com/indnikhilthakur/portfolio_v1",
  },
];

export const experience = [
  {
    id: "e01",
    company: "Coridors Pte. Ltd.",
    role: "Founding Engineer · Tech Lead",
    period: "Nov 2023 — Present",
    location: "Singapore (Remote)",
    bullets: [
      "First founding engineer — built a Snowflake Native Application from scratch, owning architecture, delivery, and the long-term tech roadmap as acting CTO.",
      "Designed Native App lifecycle, security model, grants, network rules, and External Access Integrations (EAI). Shipped MVP within the first month.",
      "Hands-on Python backend; review architectural changes, PRs, and technical documentation.",
      "Built and mentored the technical team — engineers, UI/UX, docs — and ran technical interviews as part of founding hiring.",
    ],
  },
  {
    id: "e02",
    company: "Dynamisch IT Pvt. Ltd.",
    role: "Software Engineer · Python Developer",
    period: "Aug 2022 — May 2023",
    location: "Pune, India",
    bullets: [
      "Built backend systems with Python and Django (MVT), shipping REST APIs and CRUD layers across PostgreSQL and MySQL.",
      "Contributed across the SDLC — requirement analysis, development, testing, bug fixes, and documentation.",
      "Participated in code reviews and managed version control via GitHub.",
    ],
  },
  {
    id: "e03",
    company: "Elite Techno Groups",
    role: "Machine Learning Engineer Intern",
    period: "Aug 2021 — Sep 2021",
    location: "Remote",
    bullets: [
      "Built ML models on real-world datasets using NumPy and Pandas, including a breast-cancer classifier.",
      "Implemented data-visualisation and predictive-modelling workflows end-to-end.",
    ],
  },
  {
    id: "e04",
    company: "Tech Cryptors",
    role: "Software Developer Intern",
    period: "Dec 2019 — Jan 2020",
    location: "Maharashtra, India",
    bullets: [
      "Shipped Python projects spanning robotics, IoT, and computer vision using Arduino and OpenCV.",
      "Built chatbot systems, automation utilities, and small-scale games.",
    ],
  },
  {
    id: "e05",
    company: "SSPM College of Engineering · University of Mumbai",
    role: "B.E. Computer Engineering",
    period: "2015 — 2021",
    location: "Kankavali, India",
    bullets: [
      "Aggregate 60.13% · CGPA 6.39/10. Led multiple technical events, competitions, and student initiatives.",
    ],
  },
];

export const certifications = [
  "Snowflake Platform Associate",
  "SnowPro Core (in progress)",
  "Snowflake Native App Specialization (in progress)",
  "Data Science Bootcamp · Udemy",
  "Fundamentals of Python · Coding Ninjas",
  "Red Hat OpenShift (DO101)",
  "NPTEL — Linux",
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Path", href: "#path" },
  { label: "Contact", href: "#contact" },
];
