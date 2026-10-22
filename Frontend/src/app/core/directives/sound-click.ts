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
    if (this.explicitSound) {
      // The service's document listener runs in the bubble phase, so stopping
      // propagation here prevents the same click from playing a second sound.
      event.stopPropagation();
      this.audioService.play(this.explicitSound);
    }
  }
}