# Étape 5 - Guide Formulaire de Contact

Formulaire sécurisé, performant et conforme RGPD avec protection anti-spam.

---

## 📋 Architecture complète

```
┌─────────────────────────────────────────┐
│ ContactForm.tsx (Client)                │
│ ├─ react-hook-form (validation)         │
│ ├─ Zod schema (type-safe)               │
│ ├─ Honeypot anti-spam                   │
│ └─ RGPD checkbox                        │
└────────────┬────────────────────────────┘
             │ POST /api/contact
             ↓
┌─────────────────────────────────────────┐
│ API route (Server)                      │
│ ├─ Validation Zod (double-check)        │
│ ├─ Rate limiting (IP)                   │
│ ├─ Spam detection (patterns)            │
│ ├─ Sanitization (XSS prevention)        │
│ └─ Email sending (Resend)               │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│ Email backend (Resend)                  │
│ ├─ HTML template                        │
│ └─ Rate limiting                        │
└─────────────────────────────────────────┘
```

---

## 🎨 Composant formulaire

**Fichier:** `src/components/ContactForm.tsx`

### Features:

✅ **Client-side validation**
- react-hook-form pour la perfo (lazy validation)
- Zod schema pour typage TypeScript
- Feedback instantané sur erreurs

✅ **Anti-spam**
- Honeypot (champ caché `website`)
- Temps de soumission (< 2s = suspect)
- Détection patterns spam (keywords, répétitions, URLs)

✅ **UX optimisé**
- Messages d'erreur en temps réel
- Loading state pendant soumission
- Success/error feedback
- Auto-reset après succès

✅ **Accessibilité**
- Labels associés (htmlFor)
- ARIA attributes
- Tab navigation correcte

### Utilisation:

```typescript
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <ContactForm
      onSuccess={() => {
        // Analytics event
        gtag('event', 'contact_form_submitted');
      }}
      onError={(error) => {
        console.error('Form error:', error);
      }}
    />
  );
}
```

---

## ✔️ Validation Zod

**Fichier:** `src/lib/validators/contact.ts`

### Schema:

```typescript
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(50, 'Maximum 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Lettres uniquement'),

  lastName: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/),

  email: z
    .string()
    .email('Email invalide')
    .max(254),

  phone: z
    .string()
    .regex(/^[\d\s+()-]{10,20}$/)
    .optional()
    .or(z.literal('')),

  company: z
    .string()
    .max(100)
    .optional()
    .or(z.literal('')),

  subject: z
    .string()
    .min(5, 'Minimum 5 caractères')
    .max(100, 'Maximum 100 caractères'),

  message: z
    .string()
    .min(20, 'Minimum 20 caractères')
    .max(5000, 'Maximum 5000 caractères'),

  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Consentement RGPD obligatoire'
    }),

  // Honeypot
  website: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0, {
      message: 'Validation échouée'
    })
});
```

### Validation côté serveur:

```typescript
// À TOUJOURS faire (ne pas faire confiance au client)
const validatedData = contactFormSchema.parse(body);
```

---

## 🤖 Anti-spam

### Stratégies multi-couches:

#### 1. Honeypot (pièce à miel)

```html
<!-- Invisible pour humains -->
<input
  type="url"
  placeholder="Website"
  {...register('website')}
  style={{ display: 'none' }}
  tabIndex={-1}
  aria-hidden="true"
/>
```

**Logique côté client:**

```typescript
if (websiteValue && websiteValue.trim().length > 0) {
  // Bot détecté
  showSuccessMessage(); // Menssonge intentionnel
  return;
}
```

**Logique côté serveur:**

```typescript
if (body.website && body.website.trim().length > 0) {
  console.warn('Honeypot triggered');
  // Retourner success (ne pas révéler)
  return NextResponse.json({ success: true });
}
```

#### 2. Submission Time Check

```typescript
// Client enregistre temps au focus
const [submitStartTime, setSubmitStartTime] = useState<number | null>(null);

const handleFormStart = () => {
  if (!submitStartTime) {
    setSubmitStartTime(Date.now());
  }
};

// Envoyer timestamp au serveur
const submissionTime = submitStartTime ? Date.now() - submitStartTime : 5000;
```

**Côté serveur:**

```typescript
const submissionTime = body.submissionTime || 0;

if (submissionTime < 2000) {
  // Trop rapide = bot suspect
  console.warn(`Suspicious submission: ${submissionTime}ms`);
  spamScore += 20;
}
```

#### 3. Pattern Detection

```typescript
export function detectSpamPatterns(input: ContactFormInput): {
  isSpam: boolean;
  score: number;
} {
  let spamScore = 0;

  // 1. URLs (> 2 links = spam)
  const urlCount = (input.message.match(/https?:\/\//g) || []).length;
  if (urlCount > 2) spamScore += 30;

  // 2. Caractères spéciaux (> 30% = spam)
  const specialChars = (input.message.match(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>?/]/g) || []).length;
  if (specialChars / input.message.length > 0.3) spamScore += 20;

  // 3. Répétition mots (> 30% = spam)
  const words = input.message.toLowerCase().split(/\s+/);
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });
  const maxRepetition = Math.max(...wordCounts.values());
  if (maxRepetition > words.length * 0.3) spamScore += 25;

  // 4. Mots-clés spam
  const spamKeywords = ['viagra', 'casino', 'lottery', 'cryptocurrency'];
  const hasSpamKeyword = spamKeywords.some(keyword =>
    input.message.toLowerCase().includes(keyword)
  );
  if (hasSpamKeyword) spamScore += 40;

  return {
    isSpam: spamScore > 50,
    score: Math.min(spamScore, 100)
  };
}
```

**Utilisation:**

```typescript
const spamCheck = detectSpamPatterns(validatedData);
if (spamCheck.isSpam) {
  console.warn(`Spam detected (score: ${spamCheck.score})`);
  // Optionnel: rejeter ou logger seulement
}
```

#### 4. Rate Limiting

```typescript
// Simple memory-based (pour dev)
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

// Dans l'API route
if (!checkRateLimit(clientIP)) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
```

**Production: utiliser Redis**

```typescript
// Avec Redis (Vercel KV, etc.)
import { kv } from '@vercel/kv';

async function checkRateLimitRedis(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  const current = await kv.incr(key);

  if (current === 1) {
    await kv.expire(key, 3600); // 1 heure
  }

  return current <= 5; // Max 5 par heure
}
```

---

## 📧 Envoi email

**Utilisez Resend (simple, gratuit):**

```typescript
// Installation
npm install resend

// ENV
RESEND_API_KEY=re_xxxxx

// Utilisation
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
  to: EMAIL_CONFIG.toEmail,
  replyTo: sanitized.email,
  subject: `[Contact] ${sanitized.subject}`,
  html: generateEmailHTML(sanitized),
  tags: [
    { name: 'type', value: 'contact-form' }
  ]
});
```

**Template HTML:**

```typescript
function generateEmailHTML(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; }
          .header { background: #f8f9fa; padding: 20px; }
          .section { margin: 15px 0; }
          .divider { border-top: 1px solid #ddd; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nouveau message de contact</h2>
            <p>${new Date().toLocaleString('fr-FR')}</p>
          </div>

          <div class="section">
            <p><strong>Nom:</strong> ${sanitizeText(data.firstName)} ${sanitizeText(data.lastName)}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.phone ? `<p><strong>Téléphone:</strong> ${sanitizeText(data.phone)}</p>` : ''}
            ${data.company ? `<p><strong>Entreprise:</strong> ${sanitizeText(data.company)}</p>` : ''}
          </div>

          <div class="divider"></div>

          <div class="section">
            <p><strong>Sujet:</strong> ${sanitizeText(data.subject)}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f8f9fa; padding: 15px;">
              ${sanitizeText(data.message)}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

---

## 🔒 Sécurité

### Sanitization (prévient XSS)

```typescript
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
```

### Headers sécurité (next.config.js)

```javascript
export const headers = async () => {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=()'
        }
      ]
    }
  ];
};
```

---

## 🧪 Testing

### Unit tests (Jest)

```typescript
import { contactFormSchema, detectSpamPatterns } from '@/lib/validators/contact';

describe('Contact Form Validation', () => {
  it('should validate correct data', () => {
    const data = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      subject: 'Test subject',
      message: 'This is a test message with enough characters',
      consent: true,
      website: ''
    };

    expect(() => contactFormSchema.parse(data)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const data = {
      email: 'invalid',
      // ...other fields
    };

    expect(() => contactFormSchema.parse(data)).toThrow();
  });

  it('should detect spam patterns', () => {
    const spamData = {
      firstName: 'Spam',
      message: 'viagra viagra viagra casino casino casino lottery lottery lottery'
      // ...
    };

    const result = detectSpamPatterns(spamData);
    expect(result.isSpam).toBe(true);
  });
});
```

### E2E tests (Cypress)

```typescript
describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });

  it('should submit form successfully', () => {
    cy.get('#firstName').type('Jean');
    cy.get('#lastName').type('Dupont');
    cy.get('#email').type('jean@example.com');
    cy.get('#subject').type('Test Subject');
    cy.get('#message').type('This is a test message with enough characters');
    cy.get('#consent').check();
    cy.get('button[type="submit"]').click();

    cy.contains('Merci pour votre message').should('be.visible');
  });

  it('should show validation errors', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Le prénom doit contenir au moins 2 caractères').should('be.visible');
  });

  it('should block honeypot bots', () => {
    cy.get('input[name="website"]').type('http://bot-site.com');
    // Form should appear to succeed but not actually send
  });
});
```

---

## 📊 Analytics

### Track form events

```typescript
import { event } from '@/lib/gtag';

// Dans ContactForm.tsx
const handleSubmit = async (data) => {
  event('contact_form_submitted', {
    event_category: 'contact',
    event_label: data.subject,
    value: 1
  });
};
```

### Monitor spam

```typescript
// Créer dashboard Resend/Vercel Analytics
// Track:
// - Spam detected (per day)
// - Honeypot triggers (per day)
// - Form abandonment rate
// - Submission time distribution
```

---

## 📋 Checklist

- [ ] Composant ContactForm intégré
- [ ] Zod validation côté serveur
- [ ] Honeypot field caché
- [ ] Rate limiting en place
- [ ] Spam detection patterns
- [ ] Email template HTML
- [ ] RGPD checkbox + consentement
- [ ] Sanitization XSS
- [ ] Error handling
- [ ] Success/error feedback
- [ ] Analytics events
- [ ] Unit tests
- [ ] E2E tests
- [ ] Monitoring spam
- [ ] Documentation pour admin

---

## 🚀 Déploiement

### Vercel

1. Définir variables d'environnement:
```bash
RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL_FROM=noreply@example.com
CONTACT_EMAIL_TO=contact@example.com
```

2. Déployer:
```bash
git push
# Auto-deployed on Vercel
```

3. Tester:
```bash
curl -X POST https://your-site.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message with enough characters",
    "consent": true
  }'
```

### Monitoring

- Vercel Dashboard: Fonction logs
- Resend Dashboard: Email status
- Google Analytics: Form events
- Sentry: Error tracking

---

## ⚠️ Erreurs courantes

❌ **Ne pas valider côté serveur**
```typescript
// MAUVAIS: faire confiance au client
const email = req.body.email;
```

✅ **TOUJOURS valider côté serveur**
```typescript
// BON
const validated = contactFormSchema.parse(req.body);
```

❌ **Pas de rate limiting**
```typescript
// MAUVAIS: 1000 emails spam possibles par minute
```

✅ **Rate limiting obligatoire**
```typescript
if (!checkRateLimit(ip)) {
  return 429; // Too many requests
}
```

❌ **HTML non-escaped en email**
```typescript
// MAUVAIS: XSS possible
html: `<p>${data.message}</p>`
```

✅ **Toujours échapper**
```typescript
html: `<p>${sanitizeText(data.message)}</p>`
```
