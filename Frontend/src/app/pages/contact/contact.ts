import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SITE_LINKS } from '../../models/links.model';
import { STATIC_FORMS_API_KEY } from './static-forms.config';

export interface ContactDispatchPayload {
  clientName: string;
  clientEmail: string;
  serviceType: string;
  projectMessage: string;
  website?: string;
}

export interface StaticFormsResponse {
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
      this.dispatchError =
        'Please complete and correct the highlighted fields before sending.';
      return;
    }

    if (!STATIC_FORMS_API_KEY) {
      this.dispatchError =
        'The contact form is not configured yet. Please use the direct email or WhatsApp links.';
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.dispatchError = null;
    this.dispatchSuccess = false;

    const payload = this.contactForm.getRawValue() as ContactDispatchPayload;
    const formData = new FormData();

    formData.append('apiKey', STATIC_FORMS_API_KEY);
    formData.append('name', payload.clientName.trim());
    formData.append('email', payload.clientEmail.trim());
    formData.append('serviceType', payload.serviceType);
    formData.append('message', payload.projectMessage.trim());
    formData.append(
      'subject',
      `Portfolio contact: ${payload.serviceType} - ${payload.clientName.trim().replace(/[\r\n]+/g, ' ')}`
    );
    formData.append('honeypot', payload.website?.trim() ?? '');

    this.http
      .post<StaticFormsResponse>(
        'https://api.staticforms.dev/submit',
        formData
      )
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;

          if (response?.success === true) {
            this.dispatchSuccess = true;

            this.contactForm.reset({
              clientName: '',
              clientEmail: '',
              serviceType: this.availableServices[0],
              projectMessage: '',
              website: ''
            });
          } else {
            this.dispatchError =
              response?.error ||
              response?.message ||
              'Static Forms did not confirm the submission. Please try again.';
          }
        },
        error: (httpError) => {
          this.isSubmitting = false;

          const body = httpError?.error;
          const providerError =
            typeof body?.error === 'string'
              ? body.error
              : typeof body?.message === 'string'
                ? body.message
                : null;

          this.dispatchError =
            providerError ||
            `Could not submit the message (HTTP ${httpError.status || 'unknown'}). Please try again later or use the direct contact links.`;
        }
      });
  }

}