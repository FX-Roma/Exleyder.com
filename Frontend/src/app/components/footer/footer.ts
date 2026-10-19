// ARCHIVO: src/app/components/footer/footer.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  public developerName: string = 'OVER EXLEYDER OREJUELA GALLEGO';
  public currentYear: number = new Date().getFullYear();
  
  readonly email = 'orejuelabreiman@gmail.com';
  readonly linkedinUrl = 'https://www.linkedin.com/in/exleyder-gallego-4207b3320';
  readonly githubUrl = 'https://github.com/FX-Roma';

  copiarEmail(): void {
    navigator.clipboard.writeText(this.email);
  }
}