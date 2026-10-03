// ARCHIVO: src/app/components/contact/contact.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  public primaryEmail: string = 'orejuelabreiman@gmail.com';
  public phoneNumber: string = '+57 313 450 0680';
  public location: string = 'Bogotá, Colombia // Open for Remote & Relocation';
  public linkedinUrl: string = 'https://linkedin.com/in/exleyder-gallego-4207b3320';
  public githubUrl: string = 'https://github.com/FX-Roma';

  public formData = {
    senderName: '',
    senderEmail: '',
    serviceType: 'Full-Stack Development',
    message: ''
  };

  public isSubmitting: boolean = false;
  public submitSuccess: boolean = false;
  public copiedToast: string | null = null;

  public sendDispatch(): void {
    if (!this.formData.senderName || !this.formData.senderEmail || !this.formData.message) {
      return;
    }

    this.isSubmitting = true;

    // Simulación de respuesta de API REST
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.formData = { senderName: '', senderEmail: '', serviceType: 'Full-Stack Development', message: '' };
    }, 1500);
  }

  public copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text);
    this.copiedToast = `${label} copiado al portapapeles!`;
    setTimeout(() => {
      this.copiedToast = null;
    }, 2500);
  }
}