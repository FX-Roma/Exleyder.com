'use strict';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_REQUEST_BYTES = 10 * 1024;
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_RATE_LIMIT_ENTRIES = 5_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimitByIp = new Map();

const ALLOWED_SERVICES = new Set([
  'Full-Stack Development (MEAN/MERN)',
  'Frontend UI/UX Architecture (Angular/React)',
  'Backend REST API & Database Design',
  'Technical Consulting & Code Audit',
  'Other Opportunities / Recruitment'
]);

function sendJson(res, statusCode, payload) {
  return res.status(statusCode).json(payload);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : null;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}


function getClientIp(req) {
  const forwardedFor = req.headers?.['x-forwarded-for'];
  const forwardedValue = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  const forwardedIp = typeof forwardedValue === 'string'
    ? forwardedValue.split(',')[0].trim()
    : '';

  return forwardedIp || req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(clientIp) {
  const now = Date.now();
  const current = rateLimitByIp.get(clientIp);

  if (!current || now >= current.resetAt) {
    if (rateLimitByIp.size >= MAX_RATE_LIMIT_ENTRIES) {
      for (const [ip, record] of rateLimitByIp) {
        if (now >= record.resetAt) rateLimitByIp.delete(ip);
      }

      // Keep memory bounded if a large number of unique IPs arrive within one window.
      if (rateLimitByIp.size >= MAX_RATE_LIMIT_ENTRIES) rateLimitByIp.clear();
    }

    rateLimitByIp.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) return true;

  current.count += 1;
  return false;
}

function getRequestSize(req) {
  const rawContentLength = req.headers?.['content-length'];
  const declaredLength = Number(rawContentLength);

  if (Number.isFinite(declaredLength) && declaredLength > 0) {
    return declaredLength;
  }

  try {
    return Buffer.byteLength(JSON.stringify(req.body ?? null), 'utf8');
  } catch {
    return MAX_REQUEST_BYTES + 1;
  }
}

function getProviderErrorName(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'UnknownProviderError';
  }

  const candidate = payload.name || payload.code;
  return typeof candidate === 'string' ? candidate.slice(0, 80) : 'UnknownProviderError';
}

module.exports = async function contactHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, {
      success: false,
      error: 'Método no permitido. Utiliza POST.'
    });
  }

  const contentType = req.headers?.['content-type'];
  if (typeof contentType !== 'string' || !/^application\/json(?:\s*;|\s*$)/i.test(contentType)) {
    return sendJson(res, 415, {
      success: false,
      error: 'El formulario debe enviarse como JSON.'
    });
  }

  if (getRequestSize(req) > MAX_REQUEST_BYTES) {
    return sendJson(res, 413, {
      success: false,
      error: 'El contenido enviado supera el tamaño permitido.'
    });
  }

  if (!isPlainObject(req.body)) {
    return sendJson(res, 400, {
      success: false,
      error: 'Los datos del formulario no tienen un formato válido.'
    });
  }

  const fields = req.body;
  const honeypot = getTrimmedString(fields.website);

  // Los bots que completan el campo trampa reciben una respuesta neutra; no se envía correo.
  if (honeypot) {
    return sendJson(res, 200, {
      success: true,
      message: 'Mensaje recibido.'
    });
  }

  if (isRateLimited(getClientIp(req))) {
    return sendJson(res, 429, {
      success: false,
      error: 'Has enviado demasiados mensajes. Inténtalo de nuevo en 15 minutos.'
    });
  }

  const clientName = getTrimmedString(fields.clientName);
  const clientEmail = getTrimmedString(fields.clientEmail);
  const serviceType = getTrimmedString(fields.serviceType);
  const projectMessage = getTrimmedString(fields.projectMessage);

  if (!clientName || clientName.length < 2 || clientName.length > 100) {
    return sendJson(res, 400, {
      success: false,
      error: 'Ingresa un nombre de entre 2 y 100 caracteres.'
    });
  }

  if (
    !clientEmail ||
    clientEmail.length > 150 ||
    /[\r\n]/.test(clientEmail) ||
    !EMAIL_PATTERN.test(clientEmail)
  ) {
    return sendJson(res, 400, {
      success: false,
      error: 'Ingresa una dirección de correo válida.'
    });
  }

  if (!serviceType || !ALLOWED_SERVICES.has(serviceType)) {
    return sendJson(res, 400, {
      success: false,
      error: 'Selecciona uno de los servicios disponibles.'
    });
  }

  if (!projectMessage || projectMessage.length < 10 || projectMessage.length > 2_000) {
    return sendJson(res, 400, {
      success: false,
      error: 'El mensaje debe contener entre 10 y 2.000 caracteres.'
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();

  const missingVariables = [
    ['RESEND_API_KEY', resendApiKey],
    ['CONTACT_TO_EMAIL', toEmail],
    ['CONTACT_FROM_EMAIL', fromEmail]
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missingVariables.length > 0) {
    console.error('[CONTACT_API_CONFIG_ERROR] Missing environment variables:', missingVariables);
    return sendJson(res, 503, {
      success: false,
      error: 'El servicio de contacto no está configurado. Inténtalo más tarde o utiliza los enlaces de contacto directo.'
    });
  }

  const safeSubjectName = clientName.replace(/[\r\n]+/g, ' ').trim();
  const safeName = escapeHtml(clientName);
  const safeEmail = escapeHtml(clientEmail);
  const safeService = escapeHtml(serviceType);
  const safeMessage = escapeHtml(projectMessage);

  const emailPayload = {
    from: fromEmail,
    to: [toEmail],
    reply_to: clientEmail,
    subject: `Portfolio contact: ${serviceType} - ${safeSubjectName}`,
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
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Service:</strong> ${safeService}</p>
        <hr style="border: 0; border-top: 1px solid #253246; margin: 20px 0;" />
        <p><strong>Message</strong></p>
        <div style="background: #101a28; padding: 16px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</div>
      </div>
    `
  };

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify(emailPayload)
    });

    let providerPayload = null;
    try {
      providerPayload = await resendResponse.json();
    } catch {
      // A non-JSON upstream response is treated as a provider failure below.
    }

    if (!resendResponse.ok) {
      console.error('[RESEND_API_REJECTED]', {
        status: resendResponse.status,
        errorName: getProviderErrorName(providerPayload)
      });

      return sendJson(res, 502, {
        success: false,
        error: 'Resend no pudo aceptar el mensaje. Inténtalo más tarde o utiliza un enlace de contacto directo.'
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: 'El proveedor de correo aceptó el mensaje.'
    });
  } catch (error) {
    console.error(
      '[CONTACT_API_PROVIDER_ERROR]',
      error instanceof Error ? error.name : 'UnknownError'
    );

    return sendJson(res, 502, {
      success: false,
      error: 'No fue posible conectar con el servicio de correo. Inténtalo más tarde.'
    });
  }
};
