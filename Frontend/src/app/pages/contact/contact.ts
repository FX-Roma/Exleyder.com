import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface ContactDispatchPayload {
  clientName: string;
  clientEmail: string;
  serviceType: string;
  projectMessage: string;
  website?: string;
}

export interface ContactApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  public isSubmitting: boolean = false;
  public dispatchSuccess: boolean = false;
  public dispatchError: string | null = null;

  public availableServices: string[] = [
    'Full-Stack Development (MEAN/MERN)',
    'Frontend UI/UX Architecture (Angular/React)',
    'Backend REST API & Database Design',
    'Technical Consulting & Code Audit',
    'Other Opportunities / Recruitment'
  ];

  public contactForm: FormGroup = this.fb.group({
    clientName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    clientEmail: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    serviceType: [this.availableServices[0], [Validators.required]],
    projectMessage: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    website: ['']
  });

  public get f() {
    return this.contactForm.controls;
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  public sendDispatch(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.dispatchError = 'Por favor completa y corrige todos los campos marcados antes de enviar.';
      return;
    }

    this.isSubmitting = true;
    this.dispatchError = null;
    this.dispatchSuccess = false;

    const payload: ContactDispatchPayload = this.contactForm.value;

    this.http.post<ContactApiResponse>('/api/contact', payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response && response.success) {
          this.dispatchSuccess = true;
          this.contactForm.reset({
            clientName: '',
            clientEmail: '',
            serviceType: this.availableServices[0],
            projectMessage: '',
            website: ''
          });
        } else {
          this.dispatchError = response.error || 'No se pudo procesar la solicitud.';
        }
      },
      error: (httpError) => {
        this.isSubmitting = false;
        const serverError = httpError?.error?.error;
        this.dispatchError = serverError || 'Error al conectar con el servidor. Por favor verifica tu red o intenta más tarde.';
      }
    });
  }
}