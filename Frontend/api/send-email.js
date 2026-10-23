// Frontend/api/send-email.js

export default async function handler(req, res) {
  // Configuración de cabeceras CORS para permitir peticiones desde el cliente Angular
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Los campos Nombre, Email y Mensaje son obligatorios.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'La clave RESEND_API_KEY no está configurada en Vercel.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kefex Portfolio <onboarding@resend.dev>', // Cambia por tu dominio en Resend cuando esté verificado
        to: ['overexleyder47@gmail.com'], // Email destino donde recibirás los mensajes
        reply_to: email,
        subject: `[PORTAFOLIO] ${subject || 'Nuevo mensaje de contacto'} - ${name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #0f172a; background-color: #f8fafc; border-radius: 12px;">
            <h2 style="color: #0284c7; margin-bottom: 16px;">Nuevo Mensaje del Portafolio</h2>
            <p style="margin: 6px 0;"><strong>Remitente:</strong> ${name}</p>
            <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 6px 0;"><strong>Asunto:</strong> ${subject || 'Sin asunto'}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="margin-bottom: 8px;"><strong>Mensaje:</strong></p>
            <div style="white-space: pre-wrap; background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #cbd5e1;">${message}</div>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Error al procesar el envío con Resend.' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor al enviar el correo.' });
  }
}