export interface SkillItem {
  name: string;
  contextTag: string; // ej. "RxJS / Signals / SSR" (Sin porcentajes)
  isHighlighted?: boolean;
}

export interface SkillCategory {
  id: string;
  categoryLabel: string;
  title: string;
  description: string;
  iconType: 'frontend' | 'backend' | 'database' | 'ai';
  skills: SkillItem[];
  projectEvidence: {
    label: string;
    url: string;
    isExternal?: boolean;
  };
}

export const SKILLS_DATA: SkillCategory[] = [
  {
    id: 'frontend',
    categoryLabel: 'FRONTEND ARCHITECTURE',
    title: 'Reactive UIs & Web Performance',
    description: 'Engineering scalable, accessible, and high-performance user interfaces with zero layout shifts and sub-second load times.',
    iconType: 'frontend',
    skills: [
      { name: 'Angular 18+', contextTag: 'Signals, Standalone, SSR', isHighlighted: true },
      { name: 'TypeScript', contextTag: 'Strict Typing, Design Patterns', isHighlighted: true },
      { name: 'RxJS & State Management', contextTag: 'Async Pipelines, Reactive Streams' },
      { name: 'React & Next.js', contextTag: 'CSR/SSR, Component Architecture' },
      { name: 'TailwindCSS & CSS3', contextTag: 'CSS Houdini, Responsive Grid, A11y' }
    ],
    projectEvidence: {
      label: 'Applied in KEFEX Platform',
      url: 'https://github.com/FX-Roma/KEFEX',
      isExternal: true
    }
  },
  {
    id: 'backend',
    categoryLabel: 'BACKEND & CLOUD APIs',
    title: 'RESTful Services & Microservices',
    description: 'Designing secure, decoupled backend architectures, API gateways, and robust authentication pipelines.',
    iconType: 'backend',
    skills: [
      { name: 'Node.js & Express', contextTag: 'REST APIs, SSR Integration', isHighlighted: true },
      { name: 'NestJS', contextTag: 'Modular Architecture, Dependency Injection' },
      { name: 'Security & Auth', contextTag: 'JWT, OAuth2, RBAC, Rate Limiting', isHighlighted: true },
      { name: 'REST & GraphQL', contextTag: 'Endpoint Design, Payload Validation' }
    ],
    projectEvidence: {
      label: 'Applied in School Core System',
      url: 'https://github.com/CubbbMc/FullstackColegio',
      isExternal: true
    }
  },
  {
    id: 'database-devops',
    categoryLabel: 'DATABASES & DEVOPS',
    title: 'Data Modeling & CI/CD Pipelines',
    description: 'Relational and NoSQL database optimization, containerized environments, and automated continuous deployment.',
    iconType: 'database',
    skills: [
      { name: 'PostgreSQL & MySQL', contextTag: 'Relational Schemas, Indexing', isHighlighted: true },
      { name: 'MongoDB & Redis', contextTag: 'NoSQL, Caching Layers' },
      { name: 'Docker & Git', contextTag: 'Containerization, Version Control', isHighlighted: true },
      { name: 'CI/CD & Linux', contextTag: 'Nginx, Cloud Hosting, Bash Scripting' }
    ],
    projectEvidence: {
      label: 'Applied in Brasilia Bosa Portal',
      url: 'https://github.com/FX-Roma/Brasilia-Bosa-IED',
      isExternal: true
    }
  },
  {
    id: 'ai-engineering',
    categoryLabel: 'AI & AGENTIC TOOLS',
    title: 'AI Workflows & Code Auditing',
    description: 'Leveraging AI coding partners, LLM integrations, and automated testing standards to accelerate product delivery.',
    iconType: 'ai',
    skills: [
      { name: 'Copilot & AI Collaborators', contextTag: 'Contextual Prompting, Fast Prototyping', isHighlighted: true },
      { name: 'LLM Integration', contextTag: 'REST API Wrappers, Prompt Engineering' },
      { name: 'Code Quality & Testing', contextTag: 'Jasmine, Jest, Static Code Analysis', isHighlighted: true }
    ],
    projectEvidence: {
      label: 'Applied in Portfolio Architecture',
      url: 'https://github.com/FX-Roma',
      isExternal: true
    }
  }
];