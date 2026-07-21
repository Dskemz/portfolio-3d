# Étape 5 - Structure complète des fichiers

Vue d'ensemble de tous les fichiers fournis pour SEO, Légal et Contact.

---

## 📁 Structure de dossiers

```
your-portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts                    ← API handler (formulaire)
│   │   ├── contact/
│   │   │   └── page.tsx                        ← Page contact
│   │   ├── mentions-legales/
│   │   │   └── page.tsx                        ← Modèle Mentions Légales
│   │   ├── confidentialite/
│   │   │   └── page.tsx                        ← Modèle Politique Confidentialité
│   │   ├── robots.ts                           ← robots.txt structuré
│   │   ├── sitemap.ts                          ← sitemap.xml structuré
│   │   └── layout.tsx                          ← Root layout (metadata global)
│   │
│   ├── components/
│   │   ├── ContactForm.tsx                     ← Composant formulaire (client)
│   │   ├── JsonLD.tsx                          ← JSON-LD structured data
│   │   └── CookieBanner.tsx                    ← (optionnel) Bandeau cookie
│   │
│   ├── lib/
│   │   ├── validators/
│   │   │   └── contact.ts                      ← Zod schema + utilitaires
│   │   ├── email/
│   │   │   └── templates.ts                    ← Templates emails (optionnel)
│   │   └── gtag.ts                             ← Google Analytics helpers
│   │
│   └── types/
│       └── contact.ts                          ← Types TypeScript
│
├── guides/
│   ├── GUIDE_SEO_TECHNIQUE.md                  ← SEO complet
│   ├── GUIDE_LEGAL_RGPD.md                     ← RGPD conformité
│   └── GUIDE_FORMULAIRE_CONTACT.md             ← Formulaire anti-spam
│
├── schemas/
│   └── professional-service.json-ld            ← Exemple JSON-LD
│
├── .env.example                                ← Variables d'environnement
├── .env.local                                  ← (À créer) Secrets locaux
│
└── next.config.js                              ← (À adapter) Headers sécurité
```

---

## 📦 Fichiers fournis

### 1. Types TypeScript

**`src/types/contact.ts`**
- `ContactFormData` — Données soumises
- `ContactFormResponse` — Réponse API
- `ContactEmailPayload` — Email payload
- `AntiSpamCheck` — Résultat spam detection

### 2. Validation & Sécurité

**`src/lib/validators/contact.ts`**
- `contactFormSchema` — Zod schema validation
- `serverContactSchema` — Validation serveur stricte
- `detectSpamPatterns()` — Anti-spam heuristique
- `sanitizeText()` — XSS prevention
- `sanitizeEmail()` — Email normalization

### 3. Composants

**`src/components/ContactForm.tsx`**
- Formulaire React avec react-hook-form
- Validation client temps réel
- Honeypot anti-spam
- Loading states + feedback
- 400 lignes, prêt à l'emploi

**`src/components/JsonLD.tsx`**
- `OrganizationJsonLD` — Schéma organisation
- `ProfessionalServiceJsonLD` — Schéma service
- `LocalBusinessJsonLD` — Schéma localisation
- `BreadcrumbJsonLD` — Navigation fil d'Ariane
- `FAQJsonLD` — FAQ structurée

### 4. API Route

**`src/app/api/contact/route.ts`**
- POST handler pour soumissions
- Validation Zod (double-check)
- Rate limiting par IP
- Spam detection (patterns)
- Email envoi (Resend)
- Error handling robuste

**Features:**
- ✅ Honeypot check
- ✅ Submission time verification
- ✅ Pattern-based spam detection
- ✅ Input sanitization
- ✅ Rate limiting
- ✅ Email template HTML
- ✅ Logging d'audit
- 300+ lignes, production-ready

### 5. Pages

**`src/app/contact/page.tsx`**
- Page contact avec formulaire
- Infos entreprise (email, téléphone, adresse)
- FAQ section
- JSON-LD breadcrumb
- SEO optimisé

**`src/app/mentions-legales/page.tsx`**
- Modèle Mentions Légales RGPD
- 10 sections légales
- Adaptable (placeholders)
- Styling Tailwind

**`src/app/confidentialite/page.tsx`**
- Modèle Politique Confidentialité RGPD
- 11 sections complètes
- Conformité CNIL
- Tableaux sous-traitants
- Droits RGPD documentés

### 6. Configuration SEO

**`src/app/robots.ts`**
- Règles crawlers (Googlebot, Bingbot, etc.)
- Disallow pour bot malveillants
- Sitemap reference

**`src/app/sitemap.ts`**
- Génération dynamique sitemap
- Pages statiques + dynamiques
- Priorités + frequency

**`src/app/layout.tsx` (snippet)**
- Metadata complet (title, description, keywords)
- Open Graph (réseaux sociaux)
- Twitter Card
- Robots + canonicals
- Alternates (hreflang)
- Icons + manifest

### 7. Guides

**`guides/GUIDE_SEO_TECHNIQUE.md`** (500+ lignes)
- Metadata & Open Graph
- JSON-LD structured data
- robots.ts & sitemap.ts
- Performance & Core Web Vitals
- Google Analytics 4
- Image optimization
- Font optimization
- Checklist SEO complet

**`guides/GUIDE_LEGAL_RGPD.md`** (600+ lignes)
- Checklist conformité RGPD
- Modèles fournis
- Implémentation RGPD (consentement, DSAR, suppression)
- Audit trail & logging
- Gestion cookies
- Contrats DPA
- Vérifications CNIL
- Points critiques

**`guides/GUIDE_FORMULAIRE_CONTACT.md`** (500+ lignes)
- Architecture complète
- react-hook-form + Zod
- Anti-spam (honeypot, timing, patterns, rate limit)
- Email templates (Resend)
- Sécurité (sanitization, headers)
- Tests (Jest, Cypress)
- Déploiement Vercel
- Erreurs courantes

### 8. Configuration

**`.env.example`**
- 60+ variables d'environnement
- Commentaires expliquant chacune
- Sections logiques (site, contact, analytics, etc.)
- Notes sécurité
- Instructions setup

---

## 🔗 Dépendances requises

### npm packages

```bash
npm install react-hook-form @hookform/resolvers zod resend next-auth
```

**Versions suggérées:**
- react-hook-form: ^7.48+
- zod: ^3.22+
- resend: ^0.16+
- @hookform/resolvers: ^3.3+

### Services externes

1. **Resend** (Email)
   - Signup gratuit: https://resend.com
   - API key requis
   - Gratuit jusqu'à 100 emails/jour

2. **Vercel** (Hosting)
   - Auto-configuré
   - HTTPS/SSL gratuit
   - Analytics intégré

3. **Google Analytics** (Monitoring)
   - Gratuit
   - GA4 (nouvelle version)
   - Setup: https://analytics.google.com

4. **Sentry** (Error tracking, optionnel)
   - Gratuit (plan community)
   - Monitoring production
   - Alerts

---

## 📋 Checklist d'intégration

### Phase 1: Setup (30 min)
- [ ] Copier fichiers dans `src/`
- [ ] Installer dépendances npm
- [ ] Créer `.env.local` depuis `.env.example`
- [ ] Configurer RESEND_API_KEY
- [ ] Tester localement: `npm run dev`

### Phase 2: Configuration (1h)
- [ ] Adapter Mentions Légales (SIRET, adresse, etc.)
- [ ] Adapter Politique Confidentialité (DPO, durées)
- [ ] Setup Google Analytics ID
- [ ] Vérifier ALLOWED_ORIGINS dans postMessage (Étape 4)
- [ ] Tester formulaire localement

### Phase 3: Déploiement (30 min)
- [ ] Push sur GitHub
- [ ] Déployer sur Vercel
- [ ] Configurer env vars production
- [ ] Tester formulaire en production
- [ ] Soumettre sitemap à Google Search Console

### Phase 4: Validation (1h)
- [ ] Tester form submission
- [ ] Tester honeypot (ne rien envoyer)
- [ ] Vérifier email reçu
- [ ] Vérifier Google Analytics events
- [ ] Checker mentions légales sont accessibles
- [ ] Vérifier https://www.pagespeed.web.dev

### Phase 5: Monitoring (ongoing)
- [ ] Monitorer spam dans logs
- [ ] Vérifier Google Search Console
- [ ] Analyser form abandonment rate
- [ ] Tracker conversion rate
- [ ] Mettre à jour contenu légal annuellement

---

## 🚀 Démarrage rapide (5 min)

```bash
# 1. Copier fichiers fournis
cp -r etape-5/src/* your-project/src/
cp etape-5/.env.example your-project/.env.local

# 2. Installer dépendances
npm install react-hook-form @hookform/resolvers zod resend

# 3. Configuration ENV
# Éditer .env.local:
# - NEXT_PUBLIC_SITE_URL=http://localhost:3000 (dev)
# - RESEND_API_KEY=re_xxxxx (https://resend.com)

# 4. Tester localement
npm run dev
# Visiter http://localhost:3000/contact

# 5. Déployer
git push
# Vercel auto-deploy
```

---

## 📊 Tailles fichiers

| Fichier | Lignes | Taille |
|---------|--------|--------|
| ContactForm.tsx | 350+ | 12 KB |
| api/contact/route.ts | 300+ | 11 KB |
| JsonLD.tsx | 250+ | 9 KB |
| contact/page.tsx | 150+ | 6 KB |
| mentions-legales/page.tsx | 300+ | 11 KB |
| confidentialite/page.tsx | 400+ | 15 KB |
| validators/contact.ts | 200+ | 8 KB |
| GUIDE_SEO_TECHNIQUE.md | 500+ | 20 KB |
| GUIDE_LEGAL_RGPD.md | 600+ | 25 KB |
| GUIDE_FORMULAIRE_CONTACT.md | 500+ | 22 KB |
| **TOTAL** | **3700+** | **139 KB** |

---

## 🔍 Fonctionnalités key

### SEO

✅ Metadata dynamique (title, description)
✅ Open Graph (Facebook, LinkedIn)
✅ Twitter Card
✅ JSON-LD structured data (Organization, Service, LocalBusiness)
✅ Breadcrumb navigation
✅ robots.txt + sitemap.xml
✅ Canonical URLs
✅ hreflang (multilingue)
✅ Core Web Vitals optimized
✅ Google Analytics 4 integration

### Legal & RGPD

✅ Mentions Légales complètes
✅ Politique Confidentialité RGPD
✅ Consentement RGPD (checkbox)
✅ Droit d'accès (DSAR)
✅ Droit à l'oubli
✅ Audit trail & logging
✅ Data retention policies
✅ Sub-processor documentation

### Contact Form

✅ react-hook-form + Zod validation
✅ Client-side validation (real-time)
✅ Server-side validation (mandatory)
✅ Honeypot anti-spam
✅ Submission timing check
✅ Pattern-based spam detection
✅ Rate limiting by IP
✅ Email sending (Resend)
✅ Input sanitization (XSS)
✅ Error handling
✅ Success/error feedback
✅ Analytics tracking

---

## 💡 Bonnes pratiques

1. **SEO**: Utiliser JSON-LD pour rich snippets
2. **Sécurité**: Valider TOUJOURS côté serveur
3. **Performance**: Images optimisées, fonts optimisées
4. **RGPD**: Consentement explicite, durées définies
5. **Testing**: Unit + E2E tests
6. **Monitoring**: Analytics + Error tracking

---

## 🔗 Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Zod Validation](https://zod.dev)
- [react-hook-form](https://react-hook-form.com)
- [Schema.org](https://schema.org)
- [CNIL RGPD](https://www.cnil.fr/rgpd)
- [Web.dev Metrics](https://web.dev/vitals)

---

## ✨ Résumé

**Étape 5 est la dernière étape du portfolio Visite3D.**

Après Étape 5, le site est:
✅ SEO optimisé (Google, structure data)
✅ RGPD compliant (Mentions légales, privacy)
✅ Conversion optimisé (formulaire anti-spam)
✅ Production-ready (erreurs gérées, sécurisé)

**Prochaine étape:** Maintenance, monitoring, analytics.

Bon développement! 🚀
