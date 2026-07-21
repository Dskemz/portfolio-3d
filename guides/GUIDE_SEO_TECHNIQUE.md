# Étape 5 - Guide SEO Technique (Next.js 16)

Configuration SEO complète pour Next.js 16 App Router avec données structurées.

---

## 📋 Contenu du guide

1. [Metadata & Open Graph](#metadata--open-graph)
2. [JSON-LD (Structured Data)](#json-ld-structured-data)
3. [robots.ts & sitemap.ts](#robotsts--sitemapsts)
4. [Performance & Core Web Vitals](#performance--core-web-vitals)
5. [Intégration Analytics](#intégration-analytics)
6. [Checklist SEO](#checklist-seo)

---

## Metadata & Open Graph

### app/layout.tsx (Root Layout)

```typescript
import type { Metadata } from 'next';
import { JsonLDHead } from '@/components/JsonLD';

export const metadata: Metadata = {
  // Métadonnées basiques
  title: {
    default: 'Visite3D - Visites Virtuelles 3D Immersives | Babylon.js',
    template: '%s | Visite3D'
  },
  description:
    'Créez des visites virtuelles 3D professionnelles avec Babylon.js. Solutions innovantes pour immobilier résidentiel et commercial. ✓ Gratuit • Sécurisé • Performant',

  // Métadonnées SEO
  keywords: [
    'visite virtuelle',
    'tour 3D',
    'immobilier',
    'babylon.js',
    'visite virtuelle immobilière',
    'visite 3D en ligne',
    'visualisation 3D'
  ],

  authors: [
    {
      name: 'D',
      url: 'https://github.com/dskemz'
    }
  ],

  creator: 'D / Dskemz',

  // Mobile
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5
  },

  // Open Graph (réseaux sociaux)
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://visite3d.example.com',
    siteName: 'Visite3D',
    title: 'Visite3D - Visites Virtuelles 3D Immersives',
    description:
      'Créez des visites virtuelles 3D professionnelles avec Babylon.js',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Visite3D - Visites Virtuelles 3D',
        type: 'image/png'
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image-square.png`,
        width: 800,
        height: 800,
        alt: 'Visite3D'
      }
    ]
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@visite3d',
    creator: '@dskemz',
    title: 'Visite3D - Visites Virtuelles 3D',
    description: 'Visites virtuelles 3D immersives avec Babylon.js',
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`
    ]
  },

  // Robots & indexation
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },

  // Alternates (hreflang pour multilingue)
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    languages: {
      'en-US': `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
      'fr-FR': `${process.env.NEXT_PUBLIC_SITE_URL}/fr`
    }
  },

  // Verifications (Google Search Console, etc.)
  verification: {
    google: 'google-site-verification-token',
    yandex: 'yandex-verification-token'
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },

  manifest: '/manifest.json'
};

// RootLayout component
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* JSON-LD Structured Data */}
        <JsonLDHead />

        {/* Canonical URL (important pour éviter duplicate content) */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />

        {/* Preconnect pour performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch pour services externes */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

---

## JSON-LD (Structured Data)

### Composants disponibles

**Fichier:** `src/components/JsonLD.tsx`

**Composants:**
- `<OrganizationJsonLD />` - Infos entreprise/studio
- `<ProfessionalServiceJsonLD />` - Service de visite virtuelle
- `<LocalBusinessJsonLD />` - Localisation, horaires
- `<BreadcrumbJsonLD />` - Navigation (fil d'Ariane)
- `<FAQJsonLD />` - FAQ structurée
- `<ProductJsonLD />` - Produits/services payants

**Utilisation:**

```typescript
// Dans pages individuelles
import { BreadcrumbJsonLD, FAQJsonLD } from '@/components/JsonLD';

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLD
        items={[
          { name: 'Accueil', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Visite Virtuelle', url: '/services/visite-virtuelle' }
        ]}
      />
      
      <FAQJsonLD
        faqs={[
          {
            question: 'Qu\'est-ce qu\'une visite virtuelle?',
            answer: '...'
          }
        ]}
      />
    </>
  );
}
```

**Impact:**
- ✅ Rich snippets dans Google
- ✅ Featured snippets (FAQ)
- ✅ Knowledge Graph
- ✅ Google Local Services Ads (pour ProfessionalService)

---

## robots.ts & sitemap.ts

### robots.ts

**Fichier:** `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  return {
    rules: [
      // Bots normaux (Allow)
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/*.json',
          '/*.xml',
          '/search?*'
        ],
        crawlDelay: 0 // Pas de délai (rapide)
      },

      // Google bot (Allow tout, pas de delai)
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0
      },

      // Bing bot
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1
      },

      // Bad bots (Disallow)
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot'],
        disallow: '/'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
```

### sitemap.ts

**Fichier:** `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date('2024-01-20'),
      changeFrequency: 'weekly' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date('2024-01-20'),
      changeFrequency: 'monthly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date('2024-01-20'),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2024-01-20'),
      changeFrequency: 'yearly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date('2024-01-20'),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: new Date('2024-01-20'),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    }
  ];

  // Pages dynamiques (blog posts, projets, etc.)
  const dynamicPages = await fetchDynamicPages();

  return [...staticPages, ...dynamicPages];
}

async function fetchDynamicPages() {
  // À implémenter selon votre CMS/DB
  // Exemple:
  // const projects = await db.projects.findAll();
  // return projects.map(p => ({
  //   url: `${baseUrl}/portfolio/${p.slug}`,
  //   lastModified: p.updatedAt,
  //   changeFrequency: 'monthly',
  //   priority: 0.7
  // }));

  return [];
}
```

---

## Performance & Core Web Vitals

### Next.js Image Optimization

```typescript
import Image from 'next/image';

// ✅ Optimisé (lazy load, responsive, formats modernes)
<Image
  src="/hero.png"
  alt="Description pour SEO"
  width={1200}
  height={675}
  priority // Pour LCP (hero image)
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
  quality={85} // JPEG quality
/>

// ❌ Non optimisé
<img src="/hero.png" alt="..." /> {/* Pas de compression, pas de lazy load */}
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap' // Évite FOUT (Flash of Unstyled Text)
});

export default function RootLayout() {
  return (
    <html lang="fr" className={inter.className}>
      {/* ... */}
    </html>
  );
}
```

### Script Loading

```typescript
// Pour Google Analytics, Tag Manager (chargement optimisé)
import Script from 'next/script';

<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
  strategy="afterInteractive" // Après hydration
/>

<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `window.dataLayer = window.dataLayer || []; ...`
  }}
/>
```

### Core Web Vitals

**Métrics à monitorer:**
- **LCP** (Largest Contentful Paint) < 2.5s
  - Optimize images (WebP, compression)
  - Server rendering (Next.js default)
  - Preload ressources critiques

- **FID** (First Input Delay) < 100ms
  - Minimiser JavaScript
  - Code splitting
  - Web Workers

- **CLS** (Cumulative Layout Shift) < 0.1
  - Réserver espace images/vidéos
  - Éviter fonts qui changent
  - Pas d'injections dynamiques de contenu

---

## Intégration Analytics

### Google Analytics 4

```typescript
// lib/gtag.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  if (typeof window === 'undefined') return;
  
  window.gtag?.('event', 'page_view', {
    page_path: url
  });
};

export const event = (action: string, params: any) => {
  window.gtag?.('event', action, params);
};
```

```typescript
// app/layout.tsx
import { GA_ID } from '@/lib/gtag';

export default function RootLayout() {
  return (
    <html>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                anonymize_ip: true
              });
            `
          }}
        />
      </head>
    </html>
  );
}
```

### Track Events

```typescript
// Dans composants
'use client';

import { event } from '@/lib/gtag';

export function ContactButton() {
  const handleClick = () => {
    // Track event
    event('contact_form_opened', {
      event_category: 'engagement',
      event_label: 'contact_button'
    });
  };

  return <button onClick={handleClick}>Nous contacter</button>;
}
```

---

## Checklist SEO

### On-Page SEO

- [ ] **Meta titles** (50-60 chars)
  - Unique, descriptive, keyword-rich

- [ ] **Meta descriptions** (150-160 chars)
  - Call-to-action, keyword naturel

- [ ] **Headings** (H1 > H2 > H3)
  - Un seul H1 par page
  - Hiérarchie correcte

- [ ] **Images**
  - Alt text descriptif
  - Compression (WebP)
  - Lazy loading

- [ ] **Internal links**
  - Anchor text descriptif
  - Contexte pertinent

- [ ] **Structured data**
  - JSON-LD pour entreprise, service
  - Schema.org types appropriés

### Technical SEO

- [ ] **Sitemap**
  - `sitemap.xml` soumis à Google Search Console
  - Mise à jour automatique

- [ ] **robots.txt**
  - Règles appropriées pour crawlers
  - Pas de blocage des assets CSS/JS

- [ ] **Mobile responsiveness**
  - Testé sur Lighthouse
  - Touch-friendly

- [ ] **Core Web Vitals**
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

- [ ] **SSL/HTTPS**
  - Certificat valide
  - Redirection HTTP → HTTPS

- [ ] **Canonical URLs**
  - Éviter duplicate content
  - rel="canonical" sur variantes

### Off-Page SEO

- [ ] **Backlinks**
  - Quality > Quantity
  - Diverse anchor texts

- [ ] **Social signals**
  - Share buttons
  - Open Graph tags

- [ ] **Local SEO**
  - Google My Business
  - LocalBusiness schema

---

## Outils de test

1. **Google Pagespeed Insights**
   - https://pagespeed.web.dev

2. **Google Search Console**
   - https://search.google.com/search-console

3. **Structured Data Tool**
   - https://schema.org/validator

4. **Lighthouse**
   - DevTools > Lighthouse tab

5. **SEMrush Site Audit**
   - https://www.semrush.com (paid)

---

## Variables d'environnement (.env.local)

```bash
NEXT_PUBLIC_SITE_URL=https://visite3d.example.com
NEXT_PUBLIC_SITE_NAME=Visite3D
NEXT_PUBLIC_GA_ID=G-XXXXX
NEXT_PUBLIC_PHONE=+33123456789
NEXT_PUBLIC_ADDRESS_STREET="123 Rue de Paris"
NEXT_PUBLIC_ADDRESS_CITY="Paris"
NEXT_PUBLIC_ADDRESS_POSTAL="75000"
NEXT_PUBLIC_GEO_LAT="48.8566"
NEXT_PUBLIC_GEO_LNG="2.3522"
```

---

## Ressources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Schema.org](https://schema.org)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
