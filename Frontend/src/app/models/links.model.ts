// ARCHIVO: src/app/models/links.model.ts

export interface NavRoute {
  label: string;
  path: string;
  fragment?: string; // Evaluado estrictamente como string | undefined (nunca null)
}

export interface SocialLink {
  platform: string;
  url: string;
  iconClass: string;
  displayText: string;
}

export interface ContactChannel {
  key: string;
  label: string;
  value: string;
  url: string;
  iconClass: string;
  displayText?: string;
}

export interface ProjectExternalLinks {
  githubUrl: string;
  fullstackRepoUrl?: string;
  liveUrl?: string;
}

export interface PortfolioLinksModel {
  routes: {
    home: string;
    projects: string;
    experience: string;
    studies: string;
    skills: string;
    contact: string;
  };
  navigation: NavRoute[];
  footerNavigation: NavRoute[];
  socials: Record<string, SocialLink>;
  contactChannels: Record<string, ContactChannel>;
  whatsappCtaUrl: string;
  projectExternalLinks: Record<string, ProjectExternalLinks>;
}

const WHATSAPP_NUMBER = '573134500680';
const WHATSAPP_MESSAGE = 'Hello Over, I saw your portfolio and would like to discuss an opportunity!';

export const SITE_LINKS: PortfolioLinksModel = {
  routes: {
    home: '/home',
    projects: '/projects',
    experience: '/experience',
    studies: '/studies',
    skills: '/skills',
    contact: '/contact'
  },
  navigation: [
    { label: 'Home', path: '/home' },
    { label: 'Experience', path: '/experience' },
    { label: 'Studies', path: '/studies' },
    { label: 'Skills', path: '/skills' },
    { label: 'Contact', path: '/contact' }
  ],
  footerNavigation: [
    { label: 'Overview & Architecture', path: '/home', fragment: 'overview' },
    { label: 'Projects & Experience', path: '/experience' },
    { label: 'Tech Stack & Skills', path: '/skills' },
    { label: 'Get in Touch', path: '/contact' }
  ],
  socials: {
    github: {
      platform: 'GitHub',
      url: 'https://github.com/FX-Roma',
      iconClass: 'bi bi-github',
      displayText: 'FX-Roma'
    },
    linkedin: {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/exleyder-gallego-4207b3320/',
      iconClass: 'bi bi-linkedin',
      displayText: 'Exleyder Gallego'
    }
  },
  contactChannels: {
    email: {
      key: 'PRIMARY_EMAIL',
      label: 'Email Address',
      value: 'exjobs7@gmail.com',
      url: 'mailto:exjobs7@gmail.com',
      iconClass: 'bi bi-envelope-at-fill'
    },
    whatsapp: {
      key: 'DIRECT_WHATSAPP',
      label: 'WhatsApp Direct',
      value: '+57 313 450 0680',
      url: `https://wa.me/${WHATSAPP_NUMBER}`,
      iconClass: 'bi bi-whatsapp'
    },
    location: {
      key: 'LOCATION_MODE',
      label: 'Location',
      value: 'Bogotá, Colombia',
      url: 'https://maps.google.com/?q=Bogota,Colombia',
      iconClass: 'bi bi-geo-alt-fill',
      displayText: 'Bogotá, Colombia · Remote & Relocation'
    }
  },
  whatsappCtaUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  projectExternalLinks: {
    'kefex-platform': {
      githubUrl: 'https://github.com/FX-Roma/KEFEX',
      fullstackRepoUrl: 'https://github.com/FX-Roma/Kefex-Fullstack',
      liveUrl: 'https://fx-roma.github.io/KEFEX/Home.html'
    },
    'brasilia-bosa-ied': {
      githubUrl: 'https://github.com/FX-Roma/Brasilia-Bosa-IED',
      liveUrl: 'https://fx-roma.github.io/Brasilia-Bosa-IED/'
    },
    'fullstack-colegio': {
      githubUrl: 'https://github.com/CubbbMc/FullstackColegio',
      fullstackRepoUrl: 'https://github.com/CubbbMc/FullstackColegio'
    },
    'taller-consumo-api': {
      githubUrl: 'https://github.com/FX-Roma/tallerConsumoApi',
      liveUrl: 'https://fx-roma.github.io/tallerConsumoApi/'
    }
  }
};

export const NAV_LINKS_CONFIG = SITE_LINKS;