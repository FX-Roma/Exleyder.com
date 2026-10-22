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
  /** Public URL served by Angular from the assets directory. */
  src: string;
  defaultVolume: number;
  loop?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private initialized = false;

  /**
   * Use root-relative URLs. Audio URLs are resolved by the browser against the
   * current document URL, not against this TypeScript file's location.
   */
  private readonly soundRegistry: Record<SoundKey, SoundConfig> = {
    buttonProjects: {
      src: '/assets/audio/buttonToViewProjectsExperience.wav',
      defaultVolume: 0.4
    },
    footerClick: {
      src: '/assets/audio/footer-click.wav',
      defaultVolume: 0.35
    },
    loaderBackground: {
      src: '/assets/audio/loader-background.wav',
      defaultVolume: 0.25,
      loop: true
    },
    navbarClick: {
      src: '/assets/audio/navbar-click.wav',
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

  private readonly soundsCache = new Map<SoundKey, HTMLAudioElement>();

  /** Initialize explicitly from the browser root component. Safe during SSR. */
  public initialize(): void {
    if (!this.isBrowser || this.initialized) return;
    this.initialized = true;
    this.preloadAllSounds();
    this.initGlobalClickListener();
  }

  private preloadAllSounds(): void {
    (Object.keys(this.soundRegistry) as SoundKey[]).forEach((key) => {
      const config = this.soundRegistry[key];
      const audio = new Audio(config.src);
      audio.preload = 'auto';
      audio.volume = config.defaultVolume;
      audio.loop = config.loop ?? false;

      // Do not hide asset 404s / unsupported formats: these were being masked
      // by the old empty play().catch() handler.
      audio.addEventListener('error', () => {
        const source = audio.currentSrc || audio.src || config.src;
        const mediaError = audio.error;
        console.error(
          `[AudioService] Failed to load sound "${key}" from "${source}".`,
          mediaError ? { code: mediaError.code, message: mediaError.message } : 'Unknown media error'
        );
      });

      this.soundsCache.set(key, audio);
      audio.load();
    });
  }

  /** Play in response to a user interaction. Browsers may block script-driven autoplay. */
  public play(key: SoundKey, customVolume?: number): void {
    if (!this.isBrowser) return;

    // Makes calls safe if play() is triggered before the root initialization hook.
    this.initialize();

    const audio = this.soundsCache.get(key);
    const config = this.soundRegistry[key];
    if (!audio || !config) {
      console.error(`[AudioService] Unknown or uninitialized sound key: "${key}".`);
      return;
    }

    try {
      audio.volume = this.clampVolume(customVolume ?? config.defaultVolume);

      // Reuse the cached element and restart short UI sounds. This avoids
      // creating unmanaged cloned Audio elements on every click.
      if (audio.readyState > 0) audio.currentTime = 0;

      const playResult = audio.play();
      if (playResult && typeof playResult.catch === 'function') {
        void playResult.catch((error: unknown) => {
          const errorName = (error as { name?: string } | null)?.name ?? 'UnknownError';
          if (errorName === 'NotAllowedError') {
            console.warn(
              `[AudioService] Browser blocked "${key}" playback by its media policy. ` +
              'Playback must be triggered by a permitted user interaction.'
            );
            return;
          }
          console.error(`[AudioService] Could not play sound "${key}" from "${audio.currentSrc || audio.src}".`, error);
        });
      }
    } catch (error) {
      console.error(`[AudioService] Playback error for "${key}" from "${audio.currentSrc || audio.src}".`, error);
    }
  }

  public stop(key: SoundKey): void {
    if (!this.isBrowser) return;
    const audio = this.soundsCache.get(key);
    if (!audio) return;

    audio.pause();
    try {
      audio.currentTime = 0;
    } catch (error) {
      console.warn(`[AudioService] Could not reset sound "${key}".`, error);
    }
  }

  private clampVolume(volume: number): number {
    if (!Number.isFinite(volume)) return 0.35;
    return Math.min(1, Math.max(0, volume));
  }

  /** Register one document-level listener for click sounds across the app. */
  private initGlobalClickListener(): void {
    const handler = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const clickable = target.closest(
        'button, a, .apple-circle-btn, .footer-social-btn, .btn-lets-talk'
      ) as HTMLElement | null;
      if (!clickable) return;

      const soundKey = this.resolveSoundKeyFromElement(clickable);
      if (soundKey) this.play(soundKey);
    };

    // Bubble phase is intentional: appSoundClick can stop propagation after
    // playing an explicit sound, preventing a duplicate from the global listener.
    document.addEventListener('click', handler);
  }

  private resolveSoundKeyFromElement(el: HTMLElement): SoundKey {
    const explicitKey = el.getAttribute('data-sound') as SoundKey | null;
    if (explicitKey && Object.prototype.hasOwnProperty.call(this.soundRegistry, explicitKey)) {
      return explicitKey;
    }

    if (
      el.classList.contains('btn-lets-talk') ||
      el.classList.contains('btn-lets-talk-secondary') ||
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

    if (el.closest('footer') || el.classList.contains('footer-social-btn') || el.classList.contains('footer-link')) {
      return 'footerClick';
    }

    return 'navbarClick';
  }
}
