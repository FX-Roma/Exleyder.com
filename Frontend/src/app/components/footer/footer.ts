// ARCHIVO: src/app/components/footer/footer.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SITE_LINKS } from '../../models/links.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  public readonly developerName: string = 'OVER EXLEYDER OREJUELA GALLEGO';
  public readonly currentYear: number = new Date().getFullYear();
  public readonly links = SITE_LINKS;

  public readonly email: string = SITE_LINKS.contactChannels['email'].value;

  public copyEmail(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.email);
    }
  }
}