/**
 * Types pour le formulaire de contact
 */

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  consent: boolean; // RGPD: consentement traitement données
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: {
    id: string;
    timestamp: string;
    email: string;
  };
}

export interface ContactEmailPayload {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

export interface AntiSpamCheck {
  isSpam: boolean;
  reason?: string;
  score: number;
}
