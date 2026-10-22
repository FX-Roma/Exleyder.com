// src/app/core/services/audio.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type SoundKey =
  | 'buttonProjects'
  | 'footerClick'
  | 'loaderBackground'
  | 'navbarClick'
  | 'sendEmailWhatsApp'
  | 'viewLiveDemoGithub';

interface SoundConfig {
  src: string;
  defaultVolume: number;
  loop?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser: boolean = isPlatformBrowser(this.platformId);
  private initialized = false;

  private readonly soundRegistry: Record<SoundKey, SoundConfig> = {
    buttonProjects: {
      src: '/assets/audio/buttonToViewProjectsExperience.wav',
      defaultVolume: 0.4
    },
    footerClick: {
      src: '/assets/audio/footerClick.wav',
      defaultVolume: 0.35
    },
    loaderBackground: {
      src: '/assets/audio/loader-background.wav',
      defaultVolume: 0.2,
      loop: true
    },
    navbarClick: {
      src: '/assets/audio/navbarClick.wav',
      defaultVolume: 0.35
    },
    sendEmailWhatsApp: {
      src: '/assets/audio/send-email-whatsappme.wav',
      defaultVolume: 0.5
    },
    viewLiveDemoGithub: {
      src: '/assets/audio/ViewLiveDemoOrGitHub.wav',
      defaultVolume: 0.4
    }
  };

  private readonly cache = new Map<SoundKey, HTMLAudioElement>();

  constructor() {
    if (this.isBrowser) {
      this.init();
    }
  }

  /**
   * Inicializa precarga de audio y listeners globales.
   */
  public init(): void {
    if (this.initialized || !this.isBrowser) return;
    this.initialized = true;

    this.preloadSounds();
    this.attachGlobalClickListener();
  }

  private preloadSounds(): void {
    (Object.keys(this.soundRegistry) as SoundKey[]).forEach((key) => {
      const config = this.soundRegistry[key];
      const audio = new Audio();
      
      audio.preload = 'auto';
      audio.src = config.src;
      audio.volume = config.defaultVolume;
      audio.loop = config.loop ?? false;

      audio.onerror = () => {
        console.error(`[AudioService] Error al cargar recurso HTTP/Format: ${config.src} (key: ${key})`);
      };

      this.cache.set(key, audio);
    });
  }

  /**
   * Reproduce un efecto de sonido clonando el nodo para evitar latencia en clics continuos.
   */
  public play(key: SoundKey, customVolume?: number): void {
    if (!this.isBrowser) return;

    const baseAudio = this.cache.get(key);
    if (!baseAudio) {
      console.warn(`[AudioService] Clave de sonido no registrada: ${key}`);
      return;
    }

    try {
      if (this.soundRegistry[key].loop) {
        baseAudio.volume = customVolume ?? this.soundRegistry[key].defaultVolume;
        baseAudio.play().catch((err) => {
          console.warn(`[AudioService] Autoplay bloqueado para audio continuo (${key}):`, err);
        });
      } else {
        const clone = baseAudio.cloneNode(true) as HTMLAudioElement;
        clone.volume = customVolume ?? this.soundRegistry[key].defaultVolume;
        clone.play().catch((err) => {
          console.warn(`[AudioService] Fallo de reproducción interactiva (${key}):`, err);
        });
      }
    } catch (error) {
      console.error(`[AudioService] Excepción en ejecución de audio (${key}):`, error);
    }
  }

  /**
   * Detiene la reproducción de un audio específico (ej. preloader o sonido ambiente).
   */
  public stop(key: SoundKey): void {
    if (!this.isBrowser) return;

    const audio = this.cache.get(key);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Listener delegado global para capturar eventos de UI sin acoplar cada componente.
   */
  private attachGlobalClickListener(): void {
    document.addEventListener(
      'click',
      (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        const clickable = target.closest<HTMLElement>(
          'button, a, .apple-circle-btn, .footer-social-btn, .btn-lets-talk, .btn-filter-pill'
        );

        if (!clickable) return;

        // Si el elemento fue gestionado por appSoundClick con cancelation, ignorar
        if (clickable.dataset['soundHandled'] === 'true') {
          delete clickable.dataset['soundHandled'];
          return;
        }

        const soundKey = this.resolveSoundKey(clickable);
        if (soundKey) {
          this.play(soundKey);
        }
      },
      { capture: false } // Fase bubble para respetar stopPropagation si aplica
    );
  }

  private resolveSoundKey(el: HTMLElement): SoundKey | null {
    const explicitKey = el.getAttribute('data-sound') as SoundKey | null;
    if (explicitKey && this.soundRegistry[explicitKey]) {
      return explicitKey;
    }

    if (
      el.classList.contains('btn-lets-talk') ||
      el.getAttribute('href')?.includes('wa.me') ||
      el.getAttribute('href')?.includes('mailto:') ||
      el.getAttribute('type') === 'submit'
    ) {
      return 'sendEmailWhatsApp';
    }

    if (
      el.classList.contains('apple-circle-btn') ||
      el.classList.contains('btn-view-projects') ||
      el.classList.contains('btn-filter-pill')
    ) {
      return 'buttonProjects';
    }

    if (
      el.classList.contains('btn-evidence-link') ||
      el.getAttribute('href')?.includes('github.com') ||
      el.getAttribute('href')?.includes('github.io')
    ) {
      return 'viewLiveDemoGithub';
    }

    if (el.closest('footer') || el.classList.contains('footer-social-btn')) {
      return 'footerClick';
    }

    return 'navbarClick';
  }
}