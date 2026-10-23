// src/app/models/links.model.ts

export interface NavRoute {
  label: string;
  path: string;
  fragment?: string;
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
}

export interface PortfolioNavigationModel {
  internalRoutes: NavRoute[];
  socials: Record<string, SocialLink>;
  contactChannels: Record<string, ContactChannel>;
}

export const NAV_LINKS_CONFIG: PortfolioNavigationModel = {
  internalRoutes: [
    { label: 'Overview', path: '/home', fragment: 'overview' },
    { label: 'Projects', path: '/home', fragment: 'projects' },
    { label: 'Skills', path: '/home', fragment: 'skills' },
    { label: 'Studies', path: '/home', fragment: 'studies' },
    { label: 'Contact', path: '/home', fragment: 'contact' }
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
      url: 'https://wa.me/573134500680',
      iconClass: 'bi bi-whatsapp'
    },
    location: {
      key: 'LOCATION_MODE',
      label: 'Location',
      value: 'Bogotá, Colombia • Remote & Relocation',
      url: 'https://maps.google.com/?q=Bogota,Colombia',
      iconClass: 'bi bi-geo-alt-fill'
    }
  }
};