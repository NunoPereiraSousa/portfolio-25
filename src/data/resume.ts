export type ResumeRole = {
  id: string;
  title: string;
  date: {
    highlight?: string;
    text: string;
  };
  bullets: string[];
};

export type ResumeTextItem = {
  id: string;
  topText: string;
  bottomText: {
    highlight?: string;
    text: string;
  };
};

export type EducationItem = ResumeTextItem;

export type ResumeGroup = {
  id: string;
  title: string;
  items: string[];
};

export const resumeRoles = [
  {
    id: "software-engineer-carbmee",
    title: "Software Engineer, carbmee | Compliance & Risk Automation",
    date: {
      highlight: "Promoted",
      text: "March 2025 - Present, Remote",
    },
    bullets: [
      "Proposed and secured Product approval to limit the Data Collection Framework's first release to Greenhouse-gas Items, then led engineering refinement and end-to-end delivery of configurable supplier questionnaires; adopted by 30 customers across 6,000 submissions.",
      "Led product and engineering refinement of the EU Deforestation Regulation (EUDR) supplier questionnaire from UI to APIs, cutting median completion time by 30%; the feature supported €600k in signed contracts.",
      "Built questionnaire submissions that detect conflicting edits, handle repeated requests safely and commit GHG record changes with audit history; added automated tests for failure cases.",
      "Cut supplier-data API p95 latency 65% (1.8s to 630ms) and Node.js peak heap 70% (1.5GB to 450MB) on 2M+ rows by moving pagination, sorting and aggregation into PostgreSQL.",
      "Built candidate detection for the Packaging and Packaging Waste Regulation (PPWR), processing 2M+ GHG items with configurable exclusion rules and preserving customer review decisions across scheduled runs; reduced review time by 40%.",
      "Standardized custom-property forms, columns and filtering across seven entity areas, cutting development time for subsequent configurable workflows by 35% (4 to 2.6 days).",
    ],
  },
  {
    id: "junior-software-engineer-carbmee",
    title: "Junior Software Engineer, carbmee",
    date: {
      text: "February 2024 - March 2025, Remote",
    },
    bullets: [
      "Built FusionAuth authentication screens and email templates, alongside role-based permissions spanning React interfaces, REST APIs, database models and authorization guards.",
    ],
  },
  {
    id: "programming-university-teacher",
    title: "Programming University Teacher, School of Media Arts and Design",
    date: {
      text: "October 2023 - February 2024 / January 2025 - March 2025, Porto, Portugal",
    },
    bullets: [
      "Taught web programming to 100+ students, covering JavaScript, HTML, CSS and Git, while developing practical assignments, assessments and learning materials.",
    ],
  },
  {
    id: "frontend-developer-web-master-carbmee",
    title: "Freelance Web Engineer, carbmee",
    date: {
      text: "June 2021 - February 2024, Remote",
    },
    bullets: [
      "Developed and maintained carbmee's public website, serving 10,000+ monthly visitors, delivering campaign landing pages, HubSpot/CMS integrations, and UX, performance and SEO improvements.",
    ],
  },
  {
    id: "frontend-developer-ui-designer-freelancer",
    title: "Freelance Frontend Developer & UI Designer",
    date: {
      text: "June 2021 - October 2023, Remote",
    },
    bullets: [
      "Delivered frontend development and UI/UX design projects for 30+ companies and 80+ additional individual and organizational clients, including a project for the UK government.",
      "Created responsive websites for international public-sector, technology and commercial clients, earning recognition from Awwwards and CSS Design Awards.",
    ],
  },
] satisfies ResumeRole[];

export const resumeGroups = [
  {
    id: "awards",
    title: "awards & recognitions",
    items: [
      "2x Honorable mention (Awwwards)",
      "1x Mobile excellence award (Awwwards)",
      "1x Website of the day (CSS Design Awards)",
      "2x UI Design award (CSS Design Awards)",
      "2x UX Design award (CSS Design Awards)",
      "2x Innovation Design award (CSS Design Awards)",
      "1x Special Kudos Design award (CSS Design Awards)",
      "1x Valedictorian University student (ESMAD)",
      "3rd best European swimming time, 4x200m freestyle relay (FPN)",
      "5x national swimming titles (CFP)",
      "70x state swimming titles (FCP & CFP)",
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "Next.js",
      "Server-side rendering (SSR)",
      "TanStack Query",
      "Redux",
      "Tailwind CSS",
      "SCSS",
      "HTML/CSS",
      "GSAP",
      "Three.js",
    ],
  },
  {
    id: "product-ux",
    title: "Product & UX",
    items: [
      "Design systems",
      "Accessibility (WCAG 2.1 AA)",
      "Analytics instrumentation",
      "Data-heavy UI performance",
      "Web Vitals (LCP/INP/CLS)",
    ],
  },
  {
    id: "testing",
    title: "Testing",
    items: [
      "Unit / integration testing",
      "Jest",
      "React Testing Library",
      "Playwright",
      "Cypress",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "MikroORM",
      "PostgreSQL/SQL",
      "SQL / CTEs",
      "SQL migrations",
      "Transactions",
      "Idempotency",
      "REST APIs",
      "DTO validation",
      "Queues",
      "Audit logging",
    ],
  },
  {
    id: "auth-monitoring",
    title: "Auth / Monitoring",
    items: [
      "FusionAuth",
      "Authorization",
      "AWS CloudWatch",
    ],
  },
  {
    id: "workflow-tools",
    title: "Workflow / Tools",
    items: [
      "CI/CD",
      "LaunchDarkly",
      "Code reviews",
      "Git",
      "Docker",
      "Jenkins",
      "Figma",
      "HubSpot",
      "Prismic",
      "ClickUp",
      "Miro",
    ],
  },
  {
    id: "languages",
    title: "Languages",
    items: [
      "English (C2)",
      "Portuguese (Native)",
      "Spanish (Intermediate)",
    ],
  },
] satisfies ResumeGroup[];

export const educationItems = [
  {
    id: "msc-communication-web-technologies",
    topText:
      "MSc, Communication and Web Technologies - University of Aveiro, October 2021 - January 2024 (Aveiro)",
    bottomText: {
      highlight: "GPA: 4.5 / 5.",
      text: "Top 1% of students ranking.",
    },
  },
  {
    id: "bsc-web-information-systems-technologies",
    topText:
      "BSc, Web Information Systems and Technologies - School of Media Arts and Design, October 2018 - July 2021 (Porto)",
    bottomText: {
      highlight: "Valedictorian student award.",
      text: "GPA: 4.5 / 5. Student with the highest GPA (top 1%)",
    },
  },
] satisfies ResumeTextItem[];
