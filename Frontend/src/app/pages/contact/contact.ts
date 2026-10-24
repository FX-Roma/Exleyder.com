import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SITE_LINKS } from '../../models/links.model';

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
  public readonly links = SITE_LINKS;
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
      this.dispatchError = 'Please complete and correct the highlighted fields before sending.';
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
          this.dispatchError = response.error || 'The request could not be processed.';
        }
      },
      error: (httpError) => {
        this.isSubmitting = false;
        const serverError = httpError?.error?.error;
        this.dispatchError = serverError || 'Could not connect to the server. Check your connection and try again later.';
      }
    });
  }
}