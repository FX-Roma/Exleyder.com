export type StudyType = 'academic' | 'certification' | 'autonomous';

export interface StudyItem {
  id: string;
  title: string;
  institution: string;
  period: string;
  type: StudyType | StudyType[]; // Permite un string o un arreglo de tipos
  description: string;
  skills: string[];
  credentialId?: string;
  isFeatured: boolean;
}

export const STUDIES_DATA: StudyItem[] = [
  {
    id: 'bit-fullstack',
    title: 'Bootcamp Full Stack Software Engineering',
    institution: 'BIT Institute (Bogotá, Colombia)',
    period: '2026',
    type: ['autonomous', 'certification'],
    description: 'Intensive full-stack web development program covering the MEAN/MERN stack, TypeScript, Angular, React.js, Node.js, Express, and continuous deployment (CI/CD).',
    skills: ['Angular 18+', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript'],
    credentialId: 'BIT-FS-2026-CERT',
    isFeatured: true
  },
  {
    id: 'smart-english-c1',
    title: 'C1 Advanced Fluent English Certification',
    institution: 'Smart Academy',
    period: 'Certified 2026',
    type: ['certification', 'autonomous'],
    description: 'Official C1 Advanced English proficiency certification, supporting bilingual technical leadership, communication with global clients, and technical support in bilingual environments.',
    skills: ['Bilingual Technical Support', 'C1 Advanced English', 'Cross-Cultural Communication', 'De-escalation'],
    credentialId: 'SMART-C1-ENG-2026',
    isFeatured: true
  },
  {
    id: 'google-cloud-prep',
    title: 'Google Cloud & System Architecture Professional Certificate',
    institution: 'Google / Coursera Platform',
    period: '2025 - 2026',
    type: 'autonomous',
    description: 'Specialized training in cloud infrastructure, microservices, Docker container security, continuous integration, and HTTP request latency optimization.',
    skills: ['Google Cloud Platform', 'Docker', 'Microservices', 'HTTP/2 Protocol', 'Webhooks'],
    credentialId: 'GOOGLE-CLOUD-ARCH-882',
    isFeatured: true
  },
  {
    id: 'sena-cpp',
    title: 'C++ Programming Language Structure Certification (Level I)',
    institution: 'SENA',
    period: 'April 2023',
    type: 'certification',
    description: 'Strong foundations in algorithms, efficient memory management, pointers, abstract data types, and object-oriented logic.',
    skills: ['C++', 'Data Structures', 'Memory Management', 'Algorithms'],
    credentialId: 'SENA-CPP-N1-2023',
    isFeatured: false
  },
  {
    id: 'multimedial-brasillia',
    title: 'Multimedia Design Technician (400 Hours)',
    institution: 'Colegio Brasilia Bosa IED',
    period: 'Feb 2021 - Dec 2023',
    type: ['academic', 'certification'],
    description: 'Technical training in UI/UX design, responsive layouts, digital graphic production, visual identity, and web accessibility standards (WCAG 2.1).',
    skills: ['UI/UX Wireframing', 'Graphic Design', 'Figma', 'WCAG 2.1 Accessibility'],
    credentialId: 'IED-MULTIMEDIA-400H',
    isFeatured: false
  },
  {
    id: 'meta-frontend-cert',
    title: 'Meta Front-End Developer autonomous',
    institution: 'Meta (Online Professional Coursework)',
    period: '2025',
    type: 'autonomous',
    description: 'Client-side performance optimization, DOM manipulation, unit testing, and modern design patterns for high-impact web applications.',
    skills: ['React.js', 'DOM Performance', 'CSS Flexbox/Grid', 'Jest Unit Testing'],
    credentialId: 'META-FRONTEND-991',
    isFeatured: false
  }
];