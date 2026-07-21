/**
 * Composant JSON-LD pour données structurées schema.org
 */

export function OrganizationJsonLD() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': process.env.NEXT_PUBLIC_SITE_URL || 'https://ton-site.com',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Visite3D',
    description: 'Visite virtuelle immersive 3D pour immobilier résidentiel et commercial.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ton-site.com',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      width: 250,
      height: 250
    },
    image: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`,
      width: 1200,
      height: 630
    },
    sameAs: [
      'https://twitter.com/visite3d',
      'https://linkedin.com/company/visite3d',
      'https://github.com/dskemz/visite3d'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales Support',
      telephone: process.env.NEXT_PUBLIC_PHONE || '+33123456789',
      email: process.env.CONTACT_EMAIL_TO || 'contact@example.com',
      availableLanguage: ['fr', 'en']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: process.env.NEXT_PUBLIC_ADDRESS_STREET || '123 Rue de Paris',
      addressLocality: process.env.NEXT_PUBLIC_ADDRESS_CITY || 'Paris',
      postalCode: process.env.NEXT_PUBLIC_ADDRESS_POSTAL || '75000',
      addressCountry: 'FR'
    },
    founder: {
      '@type': 'Person',
      name: 'D',
      url: 'https://github.com/dskemz'
    },
    foundingDate: new Date().getFullYear().toString(),
    knowsAbout: [
      'Virtual Tours',
      'Real Estate Photography',
      '3D Visualization',
      'Babylon.js',
      'WebGL'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData, null, 2)
      }}
      suppressHydrationWarning
    />
  );
}
/**
 * ProfessionalService schema
 *
 * Describes the virtual tour service offering
 * Improves Google Local Services Ads ranking
 */
export function ProfessionalServiceJsonLD() {
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
    name: 'Visites Virtuelles 3D Immersives',
    description:
      'Création de visites virtuelles 3D professionnelles pour propriétés immobilières avec navigation interactive en Babylon.js.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
    image: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/service-hero.png`,
      width: 1200,
      height: 675
    },
    priceRange: '€€€',
    // Organización que proporciona el servicio
    provider: {
      '@type': 'Organization',
      '@id': process.env.NEXT_PUBLIC_SITE_URL,
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Visite3D',
      url: process.env.NEXT_PUBLIC_SITE_URL
    },
    // Área geográfica de servicio
    areaServed: [
      {
        '@type': 'Country',
        name: 'France'
      },
      {
        '@type': 'Country',
        name: 'Belgium'
      }
    ],
    // Servicios específicos
    hasOfferingChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`
    },
    // Horarios de servicio
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
      availableLanguage: 'fr'
    },
    // Certificaciones/Awards
    award: ['Best Virtual Tours 2024'],
    // Reviews (si applicable)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceData, null, 2)
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * LocalBusiness schema (si applicable)
 *
 * Décrit votre agence immobilière ou studio de visite virtuelle
 */
export function LocalBusinessJsonLD() {
  const businessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': process.env.NEXT_PUBLIC_SITE_URL,
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Visite3D',
    description: 'Studio de visite virtuelle 3D pour immobilier professionnel',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    telephone: process.env.NEXT_PUBLIC_PHONE,
    email: process.env.CONTACT_EMAIL_TO,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: process.env.NEXT_PUBLIC_ADDRESS_STREET || '123 Rue de Paris',
      addressLocality: process.env.NEXT_PUBLIC_ADDRESS_CITY || 'Paris',
      postalCode: process.env.NEXT_PUBLIC_ADDRESS_POSTAL || '75000',
      addressCountry: 'FR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: process.env.NEXT_PUBLIC_GEO_LAT || '48.8566',
      longitude: process.env.NEXT_PUBLIC_GEO_LNG || '2.3522'
    },
    priceRange: '€€€',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(businessData, null, 2)
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * Breadcrumb schema
 */
export function BreadcrumbJsonLD({ items }: { items: Array<{ name: string; url: string }> }) {
  // Sécurité : si items est vide ou non défini, on renvoie une structure vide
  const itemList = Array.isArray(items) ? items : [];

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itemList.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url, // Attention : dans ton type initial c'est 'url', pas 'item'
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
}

/**
 * FAQPage schema
 *
 * Pour améliorer le ranking en featured snippets
 */
interface FAQ {
  question: string;
  answer: string;
}

export function FAQJsonLD(faqs: FAQ[]) {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData, null, 2)
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * Product/Service schema (pour vente)
 */
interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price: string;
  priceCurrency: string;
  offers?: string;
}

export function ProductJsonLD(product: ProductSchema) {
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '12'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productData, null, 2)
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * Composant wrapper: ajoute tous les schemas par défaut
 */
export function JsonLDHead() {
  return (
    <>
      <OrganizationJsonLD />
      <ProfessionalServiceJsonLD />
      <LocalBusinessJsonLD />
    </>
  );
}
