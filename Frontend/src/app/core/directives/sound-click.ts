// src/app/core/directives/sound-click.ts
import { Directive, HostListener, Input, inject } from '@angular/core';
import { AudioService, SoundKey } from '../services/audio';

@Directive({
  selector: '[appSoundClick]',
  standalone: true
})
export class SoundClickDirective {
  private readonly audioService = inject(AudioService);

  @Input('appSoundClick') explicitSound?: SoundKey | '';

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement | null;
    
    if (this.explicitSound) {
      if (target) {
        target.dataset['soundHandled'] = 'true';
      }
      this.audioService.play(this.explicitSound);
    }
  }
}