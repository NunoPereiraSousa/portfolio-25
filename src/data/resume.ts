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
    title: "Software Engineer, carbmee",
    date: {
      highlight: "Promoted",
      text: "March 2025 - Present, Remote",
    },
    bullets: [
      "Own customer-facing features from discovery and technical design through implementation, release, and iteration within a global enterprise SaaS platform.",
      "Own end-to-end development of sales demonstration features used by commercial teams to support enterprise opportunities valued above EUR100k.",
      "Deliver data-intensive workflows handling imports of 1-10 million rows, maintaining responsive user experiences through server-driven pagination, caching, debounced filtering, and virtualization.",
      "Design and implement API extensions, validation logic, and PostgreSQL schema migrations supporting new product capabilities across frontend and backend systems.",
      "Partner with Product, Design, and Engineering stakeholders to define requirements, evaluate trade-offs, and deliver scalable solutions for complex customer workflows.",
      "Collaborate with commercial teams to rapidly prototype and validate product concepts for enterprise prospects.",
    ],
  },
  {
    id: "junior-software-engineer-carbmee",
    title: "Junior Software Engineer, carbmee",
    date: {
      text: "February 2024 - March 2025",
    },
    bullets: [
      "Delivered customer-facing features and workflow improvements using React and TypeScript within an enterprise B2B SaaS platform.",
      "Implemented UI enhancements focused on responsiveness, accessibility, and usability across complex product experiences.",
      "Supported end-to-end feature delivery through API integrations, PostgreSQL schema changes, and resolution of cross-system edge cases.",
      "Collaborated closely with senior engineers, Product, and Design teams to translate requirements into production-ready solutions.",
    ],
  },
  {
    id: "programming-university-teacher",
    title: "Programming University Teacher, School of Media Arts and Design",
    date: {
      text: "October 2023 - February 2024 / January 2025 - March 2025",
    },
    bullets: [
      "Taught web programming to 100+ students across JavaScript, HTML, CSS, Git, and Bootstrap.",
      "Designed curriculum, assessments, lectures, and practical exercises to help students build production-oriented web fundamentals.",
    ],
  },
  {
    id: "frontend-developer-web-master-carbmee",
    title: "Frontend Developer & Web Master, carbmee",
    date: {
      text: "June 2021 - February 2024",
    },
    bullets: [
      "Built and maintained the public website, improving performance, UX, and SEO while shipping campaign landing pages with marketing.",
      "Integrated HubSpot workflows, analytics, SEMrush audit findings, and CMS-driven content management processes used across multiple regions.",
    ],
  },
  {
    id: "frontend-developer-ui-designer-freelancer",
    title: "Freelance Front-end Developer & UI Designer",
    date: {
      text: "June 2021 - October 2023",
    },
    bullets: [
      "Designed and developed award-winning websites for international clients, including the British Government, across public sector, technology, and commercial industries.",
      "Combined UI design and frontend development to deliver polished, responsive websites from concept to launch.",
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
      "PostgreSQL/SQL",
      "SQL migrations",
      "REST APIs",
      "DTO validation",
    ],
  },
  {
    id: "auth-monitoring",
    title: "Auth / Monitoring",
    items: [
      "FusionAuth",
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
      "MSc, Communication and Web Technologies - University of Aveiro, 2021-2023 (Aveiro)",
    bottomText: {
      highlight: "GPA: 4.5 / 5.",
      text: "Top 1% of students ranking.",
    },
  },
  {
    id: "bsc-web-information-systems-technologies",
    topText:
      "BSc, Web Information Systems and Technologies - School of Media Arts and Design, 2018-2021 (Porto)",
    bottomText: {
      highlight: "Valedictorian student award.",
      text: "GPA: 4.5 / 5. Student with the highest GPA (top 1%)",
    },
  },
] satisfies ResumeTextItem[];
