# Étape 5 - Guide Légal & RGPD

Conformité complète avec le RGPD et législation française.

---

## ✅ Checklist de conformité

### 1. Pages légales obligatoires

- [ ] Mentions légales (`/mentions-legales`)
- [ ] Politique de confidentialité (`/confidentialite`)
- [ ] Conditions d'utilisation (`/conditions-utilisation`)
- [ ] Politique des cookies (`/cookies`)

### 2. Données personnelles

- [ ] Formulaire de contact: consentement RGPD explicite
- [ ] Collecte minimale (données strictement nécessaires)
- [ ] Base légale documentée (consentement, contrat, intérêt légitime)
- [ ] Durée de conservation définie

### 3. Droits RGPD accessibles

- [ ] Droit d'accès (Data Subject Access Request)
- [ ] Droit de rectification
- [ ] Droit à l'oubli (suppression)
- [ ] Droit d'opposition
- [ ] Droit à la portabilité
- [ ] Droit de limitation

### 4. Sécurité

- [ ] HTTPS/SSL obligatoire
- [ ] Chiffrement données sensibles
- [ ] Authentification forte (JWT)
- [ ] Logs d'audit
- [ ] Politique de retention de backups

### 5. Cookies & trackers

- [ ] Consentement préalable (avant trackers)
- [ ] Bandeau cookie visible
- [ ] Opt-in (pas opt-out)
- [ ] Transparence des trackers tiers

### 6. Tiers (sous-traitants)

- [ ] Contrat de traitement signé (DPA)
- [ ] Clause standard (Standard Contractual Clauses)
- [ ] Documentation sous-traitants

---

## 📋 Modèles fournis

### Mentions Légales
**Fichier:** `src/app/mentions-legales/page.tsx`

Sections obligatoires:
1. Éditeur du site (nom, adresse, contact)
2. Hébergeur (Vercel, etc.)
3. Propriété intellectuelle (licences)
4. Limitation de responsabilité
5. Liens externes
6. Services fournis
7. Données personnelles (lien vers politique)
8. Cookies
9. Contact et réclamations
10. Modifications

**À adapter:**
```typescript
<strong>Nom:</strong> [Votre nom/SIRET]
<strong>Adresse:</strong> [Votre adresse]
<strong>Email:</strong> [Votre email]
<strong>Téléphone:</strong> [Votre téléphone]
```

### Politique de Confidentialité
**Fichier:** `src/app/confidentialite/page.tsx`

Sections couvertes:
1. Quelles données (contact, utilisation, compte, paiement, contenu)
2. Base légale (consentement, contrat, obligation, intérêt légitime)
3. Utilisation (répondre, service, analytics, sécurité)
4. Partage (prestataires, analytics, marketing, autorités)
5. Durée conservation (3 ans, pendant compte, 26 mois, etc.)
6. Droits RGPD (accès, rectification, oubli, opposition, portabilité, limitation)
7. Sécurité (SSL/TLS, JWT, bcrypt, Docker, logs)
8. Cookies (essentiels, analytics, marketing)
9. Sous-traitants (Vercel, Resend, Stripe, Google Analytics)
10. Contact/reclamations (email, DPO, CNIL)

**À adapter:**
- Noms/emails des responsables de traitement et DPO
- Liste exacte des sous-traitants
- Durées conservation selon votre politique

---

## 🔐 Implémentation RGPD

### 1. Consentement pour formulaire de contact

**Côté client:** `src/components/ContactForm.tsx`

```tsx
<div className="flex items-start gap-3">
  <input
    id="consent"
    type="checkbox"
    {...register('consent')}
    required
  />
  <label htmlFor="consent">
    J'accepte la{' '}
    <a href="/confidentialite" target="_blank">
      politique de confidentialité
    </a>{' '}
    et le traitement de mes données *
  </label>
</div>
```

**Validation Zod:** `src/lib/validators/contact.ts`

```typescript
consent: z
  .boolean()
  .refine((val) => val === true, {
    message: 'Vous devez accepter la politique de confidentialité'
  })
```

**Côté serveur:** `src/app/api/contact/route.ts`

```typescript
// Vérifier consentement
if (!validatedData.consent) {
  return NextResponse.json(
    { success: false, error: 'Consent required' },
    { status: 400 }
  );
}

// Logger consentement
console.log('✓ Consent granted by:', validatedData.email);
```

### 2. Base légale documentée

**Commentaires dans le code:**

```typescript
// Art. 6.1.a RGPD - Consentement
// Utilisateur doit explicitement cocher case
const consentValue = watch('consent');

// Art. 6.1.b RGPD - Contrat
// Données nécessaires à la fourniture du service
const serviceData = await loadUserData(userId);

// Art. 6.1.c RGPD - Obligation légale
// Factures: 6 ans (code du commerce)
await archiveInvoice(invoiceId, { years: 6 });

// Art. 6.1.f RGPD - Intérêts légitimes
// Prévention fraude, sécurité système
const spamCheck = detectSpamPatterns(formData);
```

### 3. Droit d'accès - Data Subject Access Request (DSAR)

**Endpoint à ajouter:**

```typescript
// POST /api/data-access
// Permet aux utilisateurs de télécharger leurs données

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Vérifier identité
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Collecter toutes les données
    const userData = {
      profile: user,
      projects: await getProjects(user.id),
      contact_submissions: await getContactSubmissions(user.email),
      analytics_events: await getAnalyticsEvents(user.id),
      consent_records: await getConsentRecords(user.id)
    };

    // Exporter en JSON
    const json = JSON.stringify(userData, null, 2);

    // Envoyer par email ou retourner
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="data.json"'
      }
    });
  } catch (error) {
    console.error('DSAR error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4. Droit à l'oubli - Suppression de compte

**Endpoint:**

```typescript
// DELETE /api/account
// Supprime le compte et toutes les données associées

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await verifyAuth(request);

    // Soft delete (retention légale possible)
    await db.users.update(userId, {
      deleted_at: new Date(),
      email: `${userId}+deleted@example.com` // Anonymiser
    });

    // Supprimer données personnelles
    await db.projects.deleteMany({ user_id: userId });
    await db.contact_submissions.deleteMany({ user_id: userId });

    // Log
    console.log(`Account deleted: ${userId} at ${new Date().toISOString()}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 5. Politique de conservation

**Exemple avec commentaires:**

```typescript
// Durées de conservation définies (Art. 5.1.e RGPD)

const RETENTION_POLICIES = {
  // Données de contact via formulaire (3 ans)
  CONTACT_SUBMISSION: 3 * 365 * 24 * 60 * 60 * 1000,

  // Compte utilisateur actif (indefini) + 30j après suppression
  USER_ACCOUNT: Infinity,
  USER_ACCOUNT_DELETED: 30 * 24 * 60 * 60 * 1000,

  // Analytics (26 mois GA4 default)
  ANALYTICS: 26 * 30 * 24 * 60 * 60 * 1000,

  // Logs serveur (30 jours pour sécurité)
  SERVER_LOGS: 30 * 24 * 60 * 60 * 1000,

  // Données fiscales (6 ans obligatoire)
  INVOICES: 6 * 365 * 24 * 60 * 60 * 1000
};

// Fonction de cleanup automatique
async function cleanupExpiredData() {
  const now = Date.now();

  // Supprimer submissions anciennes
  await db.contact_submissions.deleteMany({
    created_at: { $lt: new Date(now - RETENTION_POLICIES.CONTACT_SUBMISSION) }
  });

  // Supprimer comptes supprimés (grace period)
  await db.users.deleteMany({
    deleted_at: { $lt: new Date(now - RETENTION_POLICIES.USER_ACCOUNT_DELETED) }
  });

  // Archiver logs
  await archiveOldLogs(RETENTION_POLICIES.SERVER_LOGS);
}

// Scheduler (Vercel Cron ou externe)
// Lancer daily
```

### 6. Audit trail & Logging

**Middleware pour logging:**

```typescript
// lib/audit.ts

export async function auditLog(
  action: string,
  userId?: string,
  details?: any
) {
  const log = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    ip: getClientIP(),
    details
  };

  // Logger
  console.log('[AUDIT]', JSON.stringify(log));

  // Persister (audit trail)
  await db.audit_logs.insert(log);
}

// Utilisation
await auditLog('user_created', user.id, { email: user.email });
await auditLog('data_accessed', userId, { dsar_request: true });
await auditLog('account_deleted', userId);
```

---

## 🍪 Gestion des cookies

### Bandeau cookie obligatoire

**Composant:**

```typescript
'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent');
    setAccepted(saved === 'true');
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setAccepted(true);
    // Charger trackers
    loadAnalytics();
    loadMarketingPixels();
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 border-t">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <p className="text-sm">
          Nous utilisons des cookies pour améliorer votre expérience.{' '}
          <a href="/cookies" className="underline">
            En savoir plus
          </a>
        </p>
        <button
          onClick={handleAccept}
          className="bg-blue-600 px-4 py-2 rounded text-sm"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
```

**Placement:**

```typescript
// app/layout.tsx
import { CookieBanner } from '@/components/CookieBanner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
```

---

## 📋 Contrats & Clauses

### DPA (Data Processing Agreement)

Avec sous-traitants (Vercel, Resend, Stripe):

```
Clauses standards à inclure:
1. Objet et durée du traitement
2. Nature et finalité du traitement
3. Types de données personnelles
4. Catégories de personnes concernées
5. Obligations du sous-traitant (sécurité, confidentialité)
6. Conditions de sous-traitance (pas de transfert sans accord)
7. Assistance pour exercer droits RGPD
8. Suppression/restitution de données
9. Audit et inspection
10. Standard Contractual Clauses (SCC)
```

**Vercel DPA:**
- Voir: https://vercel.com/legal/dpa

**Resend DPA:**
- Demander: support@resend.com

**Google Analytics (CCPA/GDPR):**
- Setup Data Residency: EU
- Anonymize IPs
- Consent Mode

---

## 🔍 Vérifications CNIL

### CNIL Compliance Check

1. **Audit CNIL**: https://www.cnil.fr/audit
2. **Questionnaire conformité**: https://www.cnil.fr/normes/rgpd/question

### PIA (Privacy Impact Assessment)

Pour services à risque élevé:

```
Éléments à documenter:
1. Description du traitement
2. Évaluation des risques
3. Mesures de sécurité
4. Tests et résultats
5. Remédiation des risques détectés
```

---

## 📞 Support & Ressources

### Organismes

- **CNIL** (France): https://www.cnil.fr
- **EDPB** (Europe): https://edpb.ec.europa.eu
- **ICO** (UK): https://ico.org.uk

### Outils

- **CNIL Generators**: https://www.cnil.fr/outils
- **Privacy Policy Generator**: https://www.privacypolicygenerator.info
- **DPA Generator**: https://app.privasee.io/

### Légal

- Consulter un **Data Protection Officer (DPO)**
- Contacter un **cabinet juridique** spécialisé RGPD
- Insurance: **Cyber & Data protection**

---

## ⚠️ Points critiques

❌ **NE PAS:**
- Utiliser cookies sans consentement
- Vendre données personnelles
- Conserver données au-delà du nécessaire
- Ignorer droits RGPD
- Sous-traitant non contractualisé

✅ **TOUJOURS:**
- Demander consentement explicite (opt-in)
- Documenter base légale
- Anonymiser données possible
- Répondre demandes RGPD (30 jours)
- Contractualiser sous-traitants

---

## 📝 Checklist finale

- [ ] Mentions légales complètes et mises à jour
- [ ] Politique de confidentialité RGPD compliant
- [ ] Consentement cookie dans formulaires
- [ ] Politique de retention documentée
- [ ] DPA signé avec sous-traitants
- [ ] Endpoint DSAR fonctionnel
- [ ] Endpoint suppression compte
- [ ] Audit trail/logging en place
- [ ] Bandeau cookie visible
- [ ] Canonical URLs configurées
- [ ] Audit CNIL complété
- [ ] Assurance cyber incluant RGPD
