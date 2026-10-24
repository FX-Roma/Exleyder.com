import { afterEach, describe, expect, it, vi } from 'vitest';
import { processContactSubmission } from './contact-handler';

const validPayload = {
  clientName: 'Alex Mercer',
  clientEmail: 'alex@example.com',
  serviceType: 'Full-Stack Development (MEAN/MERN)',
  projectMessage: 'I would like to discuss a new web application.',
  website: ''
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('processContactSubmission', () => {
  it('rejects invalid email addresses before contacting the provider', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await processContactSubmission(
      { ...validPayload, clientEmail: 'not-an-email' },
      'invalid-email-test-ip'
    );

    expect(outcome.status).toBe(400);
    expect(outcome.body.success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports success only when the email provider accepts the message', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test_api_key');
    vi.stubEnv('CONTACT_TO_EMAIL', 'owner@example.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'Portfolio <contact@example.com>');

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'test-message-id' }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await processContactSubmission(validPayload, 'provider-success-test-ip');

    expect(outcome.status).toBe(200);
    expect(outcome.body.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const requestOptions = fetchMock.mock.calls[0][1] as RequestInit;
    const requestBody = JSON.parse(String(requestOptions.body)) as { reply_to: string };
    expect(requestBody.reply_to).toBe(validPayload.clientEmail);
  });

  it('does not report success when the provider rejects the message', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test_api_key');
    vi.stubEnv('CONTACT_TO_EMAIL', 'owner@example.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'Portfolio <contact@example.com>');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ name: 'validation_error' }), {
        status: 422,
        headers: { 'content-type': 'application/json' }
      })
    ));

    const outcome = await processContactSubmission(validPayload, 'provider-rejection-test-ip');

    expect(outcome.status).toBe(502);
    expect(outcome.body.success).toBe(false);
  });

  it('requires all Resend environment variables', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('CONTACT_TO_EMAIL', '');
    vi.stubEnv('CONTACT_FROM_EMAIL', '');

    const outcome = await processContactSubmission(validPayload, 'missing-config-test-ip');

    expect(outcome.status).toBe(503);
    expect(outcome.body.success).toBe(false);
  });
});
