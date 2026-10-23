import { processContactSubmission } from '../src/server/contact-handler';

const MAX_BODY_BYTES = 10 * 1024;

function jsonResponse(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' }
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return jsonResponse({ success: false, error: 'Method not allowed.' }, 405);
    }

    if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return jsonResponse({ success: false, error: 'Content-Type must be application/json.' }, 415);
    }

    let rawBody: string;
    try {
      rawBody = await request.text();
    } catch {
      return jsonResponse({ success: false, error: 'Could not read the submitted form data.' }, 400);
    }

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonResponse({ success: false, error: 'The submitted form is too large.' }, 413);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody) as unknown;
    } catch {
      return jsonResponse({ success: false, error: 'The submitted form data is not valid JSON.' }, 400);
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = request.headers.get('x-real-ip') || forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const outcome = await processContactSubmission(payload, clientIp);

    return jsonResponse(outcome.body, outcome.status);
  }
};
