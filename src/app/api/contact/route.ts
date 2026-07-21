/**
 * POST /api/contact
 *
 * Traite les soumissions de formulaire de contact
 * - Validation Zod
 * - Anti-spam (honeypot, patterns)
 * - Rate limiting (simple)
 * - Envoi email (Resend ou SendGrid)
 * - Logging
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  contactFormSchema,
  detectSpamPatterns,
  sanitizeEmail,
  sanitizeText
} from '@/lib/validators/contact';
import { ContactFormData, ContactFormResponse } from '@/types/contact';

/**
 * Configuration
 */
const EMAIL_CONFIG = {
  fromName: process.env.NEXT_PUBLIC_SITE_NAME || 'Visite3D',
  fromEmail: process.env.CONTACT_EMAIL_FROM || 'noreply@example.com',
  toEmail: process.env.CONTACT_EMAIL_TO || 'contact@example.com',
  replyToEmail: process.env.CONTACT_EMAIL_REPLY_TO
};

/**
 * Simple rate limiter (memory-based)
 * En production, utiliser Redis
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 5, window: number = 3600000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Extraire IP du request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const direct = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0].trim() || direct || 'unknown';
}

/**
 * Envoyer email (Resend)
 */
async function sendEmailViaResend(
  to: string,
  replyTo: string,
  subject: string,
  html: string
): Promise<{ id: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to,
      replyTo,
      subject,
      html,
      tags: [
        {
          name: 'type',
          value: 'contact-form'
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend error: ${error.message}`);
  }

  return response.json();
}

/**
 * Générer HTML email
 */
function generateEmailHTML(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .section { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .divider { border-top: 1px solid #ddd; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nouveau message de contact</h2>
            <p style="margin: 0; color: #666; font-size: 12px;">
              ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>

          <div class="section">
            <p><span class="label">Nom:</span> ${sanitizeText(data.firstName)} ${sanitizeText(data.lastName)}</p>
            <p><span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.phone ? `<p><span class="label">Téléphone:</span> ${sanitizeText(data.phone)}</p>` : ''}
            ${data.company ? `<p><span class="label">Entreprise:</span> ${sanitizeText(data.company)}</p>` : ''}
          </div>

          <div class="divider"></div>

          <div class="section">
            <p><span class="label">Sujet:</span> ${sanitizeText(data.subject)}</p>
            <p><span class="label">Message:</span></p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
              ${sanitizeText(data.message)}
            </div>
          </div>

          <div class="divider"></div>

          <p style="font-size: 12px; color: #999;">
            Ce message a été envoyé via le formulaire de contact de ${EMAIL_CONFIG.fromName}.
          </p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Handler POST
 */
export async function POST(request: NextRequest): Promise<NextResponse<ContactFormResponse>> {
  try {
    const clientIP = getClientIP(request);

    // 1. Vérifier rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Trop de demandes. Veuillez réessayer plus tard.',
          error: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    // 2. Parser le body
    const body = await request.json();

    // 3. Valider le schema
    const validatedData = contactFormSchema.parse(body);

    // 4. Vérifier honeypot
    if (body.website && body.website.trim().length > 0) {
      console.warn(`[ContactForm] Honeypot triggered from IP: ${clientIP}`);
      // Retourner success quand même (pour pas révéler qu'on spam-check)
      return NextResponse.json(
        {
          success: true,
          message: 'Merci pour votre message.',
          data: {
            id: 'honeypot',
            timestamp: new Date().toISOString(),
            email: validatedData.email
          }
        },
        { status: 200 }
      );
    }

    // 5. Vérifier patterns spam
    const spamCheck = detectSpamPatterns(validatedData);
    if (spamCheck.isSpam) {
      console.warn(
        `[ContactForm] Spam detected (score: ${spamCheck.score}) from IP: ${clientIP}`
      );
      // Log mais ne pas rejeter (peut être faux positif)
    }

    // 6. Vérifier temps de soumission (< 2 sec = bot suspect)
    const submissionTime = body.submissionTime || 0;
    if (submissionTime < 2000) {
      console.warn(`[ContactForm] Suspicious submission time: ${submissionTime}ms from IP: ${clientIP}`);
    }

    // 7. Sanitizer
    const sanitized = {
      firstName: sanitizeText(validatedData.firstName),
      lastName: sanitizeText(validatedData.lastName),
      email: sanitizeEmail(validatedData.email),
      phone: validatedData.phone ? sanitizeText(validatedData.phone) : undefined,
      company: validatedData.company ? sanitizeText(validatedData.company) : undefined,
      subject: sanitizeText(validatedData.subject),
      message: sanitizeText(validatedData.message),
      consent: validatedData.consent
    };

    // 8. Envoyer email
    let emailId = '';
    try {
      const emailResult = await sendEmailViaResend(
        EMAIL_CONFIG.toEmail,
        sanitized.email,
        `[Contact] ${sanitized.subject}`,
        generateEmailHTML(sanitized)
      );
      emailId = emailResult.id;

      console.log(`[ContactForm] Email sent successfully (ID: ${emailId})`);
    } catch (emailError) {
      console.error('[ContactForm] Email sending failed:', emailError);
      // Continuer même si email échoue (utiliser fallback)

      // Fallback: log en base de données ou fichier
      // await logContactToDB(sanitized, clientIP);
    }

    // 9. Répondre au client
    return NextResponse.json(
      {
        success: true,
        message: 'Merci pour votre message! Nous vous contacterons bientôt.',
        data: {
          id: emailId || `contact-${Date.now()}`,
          timestamp: new Date().toISOString(),
          email: sanitized.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ContactForm] Error:', error);

    // Validation error (Zod)
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          {
            success: false,
            message: 'Données invalides',
            error: 'VALIDATION_ERROR'
          },
          { status: 400 }
        );
      }
    }

    // Server error
    return NextResponse.json(
      {
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
        error: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * Reject autres méthodes HTTP
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
