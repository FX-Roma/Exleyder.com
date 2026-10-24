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

export interface ContactHandlerResult {
  status: number;
  body: ContactApiResponse;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ALLOWED_SERVICES = [
  'Full-Stack Development (MEAN/MERN)',
  'Frontend UI/UX Architecture (Angular/React)',
  'Backend REST API & Database Design',
  'Technical Consulting & Code Audit',
  'Other Opportunities / Recruitment'
] as const;

const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const rateLimitByIp = new Map<string, RateLimitRecord>();

function result(status: number, body: ContactApiResponse): ContactHandlerResult {
  return { status, body };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getTrimmedString(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() : null;
}

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const current = rateLimitByIp.get(clientIp);

  if (!current || now >= current.resetAt) {
    rateLimitByIp.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  current.count += 1;
  return false;
}

export async function processContactSubmission(
  input: unknown,
  clientIp: string
): Promise<ContactHandlerResult> {
  if (isRateLimited(clientIp || 'unknown')) {
    return result(429, {
      success: false,
      error: 'Too many messages have been submitted. Please try again in 15 minutes.'
    });
  }

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return result(400, { success: false, error: 'The submitted form data is invalid.' });
  }

  const fields = input as Record<string, unknown>;
  const honeypot = getTrimmedString(fields['website']);

  if (honeypot) {
    return result(200, { success: true, message: 'Your message has been submitted successfully.' });
  }

  const clientName = getTrimmedString(fields['clientName']);
  const clientEmail = getTrimmedString(fields['clientEmail']);
  const serviceType = getTrimmedString(fields['serviceType']);
  const projectMessage = getTrimmedString(fields['projectMessage']);

  if (!clientName || clientName.length < 2 || clientName.length > 100) {
    return result(400, { success: false, error: 'Please enter a name between 2 and 100 characters.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!clientEmail || clientEmail.length > 150 || !emailPattern.test(clientEmail)) {
    return result(400, { success: false, error: 'Please enter a valid email address.' });
  }

  if (!serviceType || !ALLOWED_SERVICES.includes(serviceType as (typeof ALLOWED_SERVICES)[number])) {
    return result(400, { success: false, error: 'Please select a valid service.' });
  }

  if (!projectMessage || projectMessage.length < 10 || projectMessage.length > 2000) {
    return result(400, { success: false, error: 'Your message must contain between 10 and 2,000 characters.' });
  }

  const resendApiKey = process.env['RESEND_API_KEY'];
  const toEmail = process.env['CONTACT_TO_EMAIL'];
  const fromEmail = process.env['CONTACT_FROM_EMAIL'];

  if (!resendApiKey || !toEmail || !fromEmail) {
    const missingVariables = [
      ['RESEND_API_KEY', resendApiKey],
      ['CONTACT_TO_EMAIL', toEmail],
      ['CONTACT_FROM_EMAIL', fromEmail]
    ].filter(([, value]) => !value).map(([name]) => name);

    console.error('[CONTACT_API_CONFIG_ERROR] Missing required environment variables:', missingVariables);
    return result(503, {
      success: false,
      error: 'The contact service is not configured yet. Please use the direct email or WhatsApp links instead.'
    });
  }

  const safeNameForSubject = clientName.replace(/[\r\n]+/g, ' ').trim();
  const escapedName = escapeHtml(clientName);
  const escapedEmail = escapeHtml(clientEmail);
  const escapedService = escapeHtml(serviceType);
  const escapedMessage = escapeHtml(projectMessage);

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(7000),
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: clientEmail,
        subject: `Portfolio contact: ${serviceType} - ${safeNameForSubject}`,
        text: [
          'New message from your portfolio',
          `Name: ${clientName}`,
          `Email: ${clientEmail}`,
          `Service: ${serviceType}`,
          '',
          'Message:',
          projectMessage
        ].join('\n'),
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #060d16; color: #f8fafc; border-radius: 12px;">
            <h2 style="color: #00e5ff; margin-top: 0;">New portfolio message</h2>
            <p><strong>Name:</strong> ${escapedName}</p>
            <p><strong>Email:</strong> ${escapedEmail}</p>
            <p><strong>Service:</strong> ${escapedService}</p>
            <hr style="border: 0; border-top: 1px solid #253246; margin: 20px 0;" />
            <p><strong>Message</strong></p>
            <div style="background: #101a28; padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">${escapedMessage}</div>
          </div>
        `
      })
    });

    if (!resendResponse.ok) {
      let providerErrorName = 'UnknownProviderError';
      try {
        const providerError = await resendResponse.json() as { name?: unknown };
        if (typeof providerError.name === 'string') {
          providerErrorName = providerError.name;
        }
      } catch {
        providerErrorName = 'UnreadableProviderResponse';
      }

      console.error('[RESEND_API_REJECTED]', {
        status: resendResponse.status,
        errorName: providerErrorName
      });

      return result(502, {
        success: false,
        error: 'The email provider could not accept your message. Please try again later or use a direct contact link.'
      });
    }

    return result(200, {
      success: true,
      message: 'Your message was accepted by the email provider.'
    });
  } catch (error) {
    console.error('[CONTACT_API_PROVIDER_ERROR]', error instanceof Error ? error.name : 'UnknownError');
    return result(502, {
      success: false,
      error: 'The email service could not be reached. Please try again later or use a direct contact link.'
    });
  }
}
