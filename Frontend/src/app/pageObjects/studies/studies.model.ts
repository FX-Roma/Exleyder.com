// ARCHIVO: src/app/pageObjects/studies/studies.model.ts

export interface StudyItem {
  id: string;
  title: string;
  institution: string;
  period: string;
  type: 'academic' | 'certification' | 'specialization';
  description: string;
  skills: string[];
  credentialId?: string;
  isFeatured: boolean;
}

export const STUDIES_DATA: StudyItem[] = [
  {
    id: 'sena-adso',
    title: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    institution: 'SENA (Servicio Nacional de Aprendizaje)',
    period: '2024 - Presente',
    type: 'academic',
    description: 'Formación profesional enfocada en arquitectura de software, modelado UML, desarrollo de APIs RESTful, bases de datos relacionales/NoSQL y metodologías ágiles (Scrum/Kanban).',
    skills: ['Software Architecture', 'UML', 'REST APIs', 'SQL & NoSQL', 'Agile / Scrum'],
    credentialId: 'SENA-ADSO-2026-REG',
    isFeatured: true
  },
  {
    id: 'bit-fullstack',
    title: 'Bootcamp Full Stack Software Engineering',
    institution: 'BIT Institute (Bogotá, Colombia)',
    period: '2026',
    type: 'specialization',
    description: 'Programa intensivo de desarrollo web fullstack con dominio del stack MEAN/MERN, TypeScript, Angular, React.js, Node.js, Express y despliegue continuo (CI/CD).',
    skills: ['Angular 18+', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript'],
    credentialId: 'BIT-FS-2026-CERT',
    isFeatured: true
  },
  {
    id: 'smart-english-c1',
    title: 'C1 Advanced Fluent English Certification',
    institution: 'Smart Academy',
    period: 'Certificado 2026',
    type: 'certification',
    description: 'Certificación oficial de competencia lingüística C1 Advanced. Habilidad comprobada para liderazgo técnico bilingüe, negociación con clientes globales y soporte técnico en entornos bilingües.',
    skills: ['Bilingual Technical Support', 'C1 Advanced English', 'Cross-Cultural Communication', 'De-escalation'],
    credentialId: 'SMART-C1-ENG-2026',
    isFeatured: true
  },
  {
    id: 'google-cloud-prep',
    title: 'Google Cloud & System Architecture Professional Certificate',
    institution: 'Google / Coursera Platform',
    period: '2025 - 2026',
    type: 'specialization',
    description: 'Formación especializada en infraestructura cloud, microservicios, seguridad en contenedores (Docker), integración continua y optimización de latencia en peticiones HTTP.',
    skills: ['Google Cloud Platform', 'Docker', 'Microservices', 'HTTP/2 Protocol', 'Webhooks'],
    credentialId: 'GOOGLE-CLOUD-ARCH-882',
    isFeatured: true
  },
  {
    id: 'sena-cpp',
    title: 'Certificación Estructura del Lenguaje de Programación C++ (Nivel I)',
    institution: 'SENA',
    period: 'Abril 2023',
    type: 'certification',
    description: 'Fundamentos sólidos de algoritmos, gestión eficiente de memoria, punteros, tipos de datos abstractos y lógica orientada a objetos.',
    skills: ['C++', 'Data Structures', 'Memory Management', 'Algorithms'],
    credentialId: 'SENA-CPP-N1-2023',
    isFeatured: false
  },
  {
    id: 'multimedial-brasillia',
    title: 'Técnico en Diseño Multimedial (400 Horas)',
    institution: 'Colegio Brasilia Bosa IED',
    period: 'Feb 2021 - Dic 2023',
    type: 'academic',
    description: 'Especialización técnica en diseño UI/UX, maquetación adaptativa, producción gráfica digital, identidad visual y estándares de accesibilidad web (WCAG 2.1).',
    skills: ['UI/UX Wireframing', 'Graphic Design', 'Figma', 'WCAG 2.1 Accessibility'],
    credentialId: 'IED-MULTIMEDIA-400H',
    isFeatured: false
  },
  {
    id: 'meta-frontend-cert',
    title: 'Meta Front-End Developer Specialization',
    institution: 'Meta (Online Professional Coursework)',
    period: '2025',
    type: 'specialization',
    description: 'Optimización de rendimiento en el cliente, manipulación del DOM, pruebas unitarias y patron de diseño moderno para aplicaciones web de alto impacto.',
    skills: ['React.js', 'DOM Performance', 'CSS Flexbox/Grid', 'Jest Unit Testing'],
    credentialId: 'META-FRONTEND-991',
    isFeatured: false
  }
];