
export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  skills: string[];
}

export const SKILLS_DATA: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    icon: 'bi-layout-text-window-reverse',
    description: 'Building high-performance, accessible, and responsive user interfaces with zero CLS.',
    skills: ['Angular 18+', 'TypeScript', 'React.js', 'JavaScript ES6+', 'HTML5 / CSS3', 'Bootstrap 5', 'Tailwind CSS']
  },
  {
    id: 'backend',
    title: 'Backend & REST APIs',
    icon: 'bi-server',
    description: 'Architecting scalable server-side applications, secure endpoints, and business logic.',
    skills: ['Node.js', 'Express.js', 'RESTful APIs', 'JWT Authentication', 'Middleware Pipelines', 'CORS & Security']
  },
  {
    id: 'databases',
    title: 'Databases & Storage',
    icon: 'bi-database-fill-gear',
    description: 'Designing relational and document-oriented database schemas for high data integrity.',
    skills: ['MongoDB', 'PostgreSQL', 'SQL Server', 'MySQL', 'Mongoose ORM', 'Web Storage API']
  },
  {
    id: 'ai-tools',
    title: 'AI & Digital Tooling',
    icon: 'bi-cpu-fill',
    description: 'Leveraging modern AI platforms and developer tooling to accelerate release cycles.',
    skills: ['LangChain', 'GitHub Copilot', 'OpenAI APIs', 'Docker', 'Vercel', 'Git / GitHub']
  },
  {
    id: 'soft-skills',
    title: 'Communication & Customer Success',
    icon: 'bi-chat-heart-fill',
    description: 'Bridging complex technical solutions with clear bilingual stakeholder communication.',
    skills: ['C1 Advanced English', 'Native Spanish', 'Customer Support Experience', 'Conflict Resolution', 'Team Collaboration']
  }
];