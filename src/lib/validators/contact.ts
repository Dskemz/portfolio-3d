/**
 * Validation schemas pour contact form
 * Utilisés côté client (react-hook-form) et serveur (API)
 */

import { z } from 'zod';

/**
 * Schema de validation principal
 */
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom ne peut contenir que des lettres'),

  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres'),

  email: z
    .string()
    .email('Veuillez entrer une adresse email valide')
    .max(254, 'L\'email ne peut pas dépasser 254 caractères'),

  phone: z
    .string()
    .regex(/^[\d\s+()-]{10,20}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),

  company: z
    .string()
    .max(100, 'Le nom de la société ne peut pas dépasser 100 caractères')
    .optional()
    .or(z.literal('')),

  subject: z
    .string()
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(100, 'Le sujet ne peut pas dépasser 100 caractères'),

  message: z
    .string()
    .min(20, 'Le message doit contenir au moins 20 caractères')
    .max(5000, 'Le message ne peut pas dépasser 5000 caractères'),

  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Vous devez accepter la politique de confidentialité'
    }),

  // Honeypot (champ anti-spam caché)
  website: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0, {
      message: 'Validation échouée'
    })
});

/**
 * Type inféré du schema Zod
 */
export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * Schema pour validation côté serveur (stricte)
 */
export const serverContactSchema = contactFormSchema.extend({
  // Champs additionnels côté serveur
  honeypot: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0, {
      message: 'Validation échouée'
    }),

  // Rate limiting: timestamp entre 2-60 secondes (bot vs humain)
  submissionTime: z.number().optional()
});

export type ServerContactInput = z.infer<typeof serverContactSchema>;

/**
 * Utilitaires
 */

/**
 * Sanitizer d'email (éxpédition sécurisée)
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Sanitizer de texte (prévient XSS)
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Vérifier si la soumission semble être un bot
 */
export function detectSpamPatterns(input: ContactFormInput): {
  isSpam: boolean;
  score: number;
} {
  let spamScore = 0;

  // 1. Trop de liens
  const urlCount = (input.message.match(/https?:\/\//g) || []).length;
  if (urlCount > 2) spamScore += 30;

  // 2. Trop de caractères spéciaux
  const specialChars = (input.message.match(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>?/]/g) || []).length;
  if (specialChars / input.message.length > 0.3) spamScore += 20;

  // 3. Répétition de mots
  const words = input.message.toLowerCase().split(/\s+/);
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });
  const maxRepetition = Math.max(...wordCounts.values());
  if (maxRepetition > words.length * 0.3) spamScore += 25;

  // 4. Mots-clés spam communs
  const spamKeywords = ['viagra', 'casino', 'lottery', 'cryptocurrency', 'crypto', 'bitcoin', 'forex'];
  const hasSpamKeyword = spamKeywords.some(keyword =>
    input.message.toLowerCase().includes(keyword)
  );
  if (hasSpamKeyword) spamScore += 40;

  return {
    isSpam: spamScore > 50,
    score: Math.min(spamScore, 100)
  };
}
