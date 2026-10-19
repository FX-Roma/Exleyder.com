import 'dotenv/config';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middleware de parsing JSON restringido a 10kb contra ataques DoS
app.use(express.json({ limit: '10kb' }));

// Control de tasa (Rate Limiting) en memoria por IP
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_REQUESTS_PER_WINDOW = 5;

const rateLimiterMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = ipRateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    ipRateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: 'Has excedido el límite de envíos. Por favor intenta de nuevo en 15 minutos.'
    });
  }

  record.count++;
  return next();
};

// Servicios permitidos (Whitelist)
const ALLOWED_SERVICES = [
  'Full-Stack Development (MEAN/MERN)',
  'Frontend UI/UX Architecture (Angular/React)',
  'Backend REST API & Database Design',
  'Technical Consulting & Code Audit',
  'Other Opportunities / Recruitment'
];

// Helper de escape HTML contra inyecciones XSS en el correo
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Endpoint oficial de contacto POST /api/contact
 */
app.post('/api/contact', rateLimiterMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { clientName, clientEmail, serviceType, projectMessage, website } = req.body || {};

    // 1. Trampa Antispam Honeypot: si el campo 'website' tiene valor, es un bot
    if (website && typeof website === 'string' && website.trim() !== '') {
      return res.status(200).json({ success: true, message: 'Message dispatched successfully.' });
    }

    // 2. Validaciones Backend
    if (!clientName || typeof clientName !== 'string' || clientName.trim().length < 2 || clientName.trim().length > 100) {
      return res.status(400).json({ success: false, error: 'Nombre inválido. Debe tener entre 2 y 100 caracteres.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail || typeof clientEmail !== 'string' || !emailRegex.test(clientEmail.trim()) || clientEmail.trim().length > 150) {
      return res.status(400).json({ success: false, error: 'Dirección de correo electrónico inválida.' });
    }

    if (!serviceType || typeof serviceType !== 'string' || !ALLOWED_SERVICES.includes(serviceType.trim())) {
      return res.status(400).json({ success: false, error: 'Tipo de servicio no permitido.' });
    }

    if (!projectMessage || typeof projectMessage !== 'string' || projectMessage.trim().length < 10 || projectMessage.trim().length > 2000) {
      return res.status(400).json({ success: false, error: 'El mensaje debe contener entre 10 y 2000 caracteres.' });
    }

    // 3. Verificación de variables de entorno del servidor
    const resendApiKey = process.env['RESEND_API_KEY'];
    const toEmail = process.env['CONTACT_TO_EMAIL'] || 'exjobs7@gmail.com';
    const fromEmail = process.env['CONTACT_FROM_EMAIL'] || 'Portfolio Contact <onboarding@resend.dev>';

    if (!resendApiKey) {
      console.error('[CONTACT_API_ERROR]: RESEND_API_KEY no configurada en las variables de entorno.');
      return res.status(503).json({
        success: false,
        error: 'El servicio de mensajería no está disponible actualmente. Por favor contáctame directamente a exjobs7@gmail.com o vía WhatsApp.'
      });
    }

    // 4. Petición HTTP a Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: clientEmail.trim(),
        subject: `[Portafolio Contacto] ${serviceType.trim()} - ${clientName.trim()}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background-color: #060d16; color: #f8fafc; border-radius: 12px; border: 1px solid #00e5ff;">
            <h2 style="color: #00e5ff; margin-top: 0; font-size: 20px;">Nuevo mensaje recibido desde el Portafolio</h2>
            <div style="margin-bottom: 16px; font-size: 14px;">
              <p style="margin: 4px 0;"><strong>Remitente:</strong> ${escapeHtml(clientName.trim())} (&lt;${escapeHtml(clientEmail.trim())}&gt;)</p>
              <p style="margin: 4px 0;"><strong>Servicio solicitado:</strong> ${escapeHtml(serviceType.trim())}</p>
            </div>
            <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 20px 0;" />
            <p style="font-weight: bold; margin-bottom: 8px;">Mensaje:</p>
            <div style="background-color: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${escapeHtml(projectMessage.trim())}</div>
          </div>
        `
      })
    });

    const responseData = await resendResponse.json() as { id?: string; name?: string; message?: string };

    if (!resendResponse.ok) {
      console.error('[RESEND_API_REJECTED]:', responseData);
      return res.status(502).json({
        success: false,
        error: 'No se pudo entregar el correo a través del proveedor. Inténtalo de nuevo más tarde.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado exitosamente.'
    });

  } catch (error) {
    console.error('[CONTACT_API_CRITICAL_ERROR]:', error);
    return res.status(500).json({
      success: false,
      error: 'Ocurrió un error interno procesando la solicitud.'
    });
  }
});

/**
 * Servir archivos estáticos desde /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Fallback para Angular SSR (Se remueve '/**' para prevenir error de path-to-regexp)
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);