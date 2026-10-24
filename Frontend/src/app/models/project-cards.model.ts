import { SITE_LINKS } from './links.model';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  role: string;
  architectureDetails: string[];
  technologies: string[];
  metrics: ProjectMetric[];
  githubUrl: string;
  fullstackRepoUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  filterCategory: 'all' | 'fullstack' | 'frontend' | 'api';
  isFeatured: boolean;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'kefex-platform',
    title: 'KEFEX Platform Engine',
    subtitle: 'Social Media & E-Commerce Synchronizer',
    category: 'Social Media Application',
    description: 'Decoupled BookmarkManager.js engine built with repository design patterns and Set structures. Features real-time atomic cross-tab state synchronization via Web Storage API.',
    role: 'Scrum Master & Full Stack Developer',
    architectureDetails: [
      'Real-time atomic state sync across tabs using Web Storage API & Custom Events',
      'Multivariate product and publication search with < 50ms search latency',
      'Decoupled client architecture seamlessly connected to Node.js/Express backend'
    ],
    technologies: ['Angular', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Web Storage API'],
    metrics: [
      { label: 'Search Latency', value: '< 50ms' },
      { label: 'Layout Shift', value: '0 CLS' }
    ],
    ...SITE_LINKS.projectExternalLinks['kefex-platform'],
    imageUrl: 'Images/Kefex-live-demo.png',
    filterCategory: 'fullstack',
    isFeatured: true
  },
  {
    id: 'brasilia-bosa-ied',
    title: 'Brasilia Bosa IED Portal',
    subtitle: 'Institutional Public Portal & Accessible UI',
    category: 'Institutional Website',
    description: 'High-accessibility public web portal engineered for institutional communication. Complies with WCAG 2.1 AA standards with optimized CSS Grid semantic layouts.',
    role: 'Frontend Developer',
    architectureDetails: [
      'Fully responsive UI adhering to WCAG 2.1 AA accessibility guidelines',
      'Optimized CSS Grid layout with custom CSS variables and zero external bloat',
      'Cross-browser rendering stability and sub-second initial page load'
    ],
    technologies: ['JavaScript ES6+', 'HTML5', 'CSS Grid', 'Bootstrap 5', 'WCAG AA'],
    metrics: [
      { label: 'Accessibility', value: '100% WCAG' },
      { label: 'Load Speed', value: '0.4s' }
    ],
    ...SITE_LINKS.projectExternalLinks['brasilia-bosa-ied'],
    imageUrl: 'Images/Colegio-Brasilia-Bosa.png',
    filterCategory: 'frontend',
    isFeatured: true
  },
  {
    id: 'fullstack-colegio',
    title: 'School Management Core',
    subtitle: 'Academic Management & Administrative System',
    category: 'Full Stack System',
    description: 'Enterprise academic backend and administrative core engineered to manage student records, Role-Based Access Control (RBAC), and automated institutional workflows.',
    role: 'Full Stack Developer',
    architectureDetails: [
      'RESTful API architecture separating administrative logic from data entities',
      'Role-Based Access Control (RBAC) securing student records and user data',
      'Structured exception handling pipelines and database schema validation'
    ],
    technologies: ['Node.js', 'Express', 'JavaScript', 'MongoDB', 'REST APIs', 'RBAC'],
    metrics: [
      { label: 'API Endpoints', value: '20+ Routes' },
      { label: 'Auth Pipeline', value: 'RBAC Secured' }
    ],
    ...SITE_LINKS.projectExternalLinks['fullstack-colegio'],
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    filterCategory: 'fullstack',
    isFeatured: true
  },
  {
    id: 'taller-consumo-api',
    title: 'REST API Fetcher Suite',
    subtitle: 'Asynchronous JavaScript & Dynamic DOM Renderer',
    category: 'REST API / Exleyder Anime',
    description: 'Interactive API client demonstrator focusing on asynchronous JavaScript pipelines, defensive HTTP error handling, dynamic UI updates, and payload parsing.',
    role: 'JavaScript Developer',
    architectureDetails: [
      'Asynchronous JS Promise handling & Async/Await data fetching',
      'Dynamic DOM updates with defensive error fallbacks for failed network calls',
      'Minimalist responsive UI with zero external runtime dependencies'
    ],
    technologies: ['JavaScript ES6+', 'Fetch API', 'REST APIs', 'HTML5', 'CSS3'],
    metrics: [
      { label: 'HTTP Resilience', value: '100% Handled' },
      { label: 'Parse Time', value: '< 15ms' }
    ],
    ...SITE_LINKS.projectExternalLinks['taller-consumo-api'],
    imageUrl: 'Images/Taller-Consumo-API.png',
    filterCategory: 'api',
    isFeatured: false
  }
];