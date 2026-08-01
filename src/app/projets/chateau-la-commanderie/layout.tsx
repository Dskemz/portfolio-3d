import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Château La Commanderie, Modélisation 3D & Packaging | D. Portfolio',
  description:
    'Étude de cas : accompagnement complet du développement de la marque Château La Commanderie. Modélisation 3D de toute la gamme, direction artistique et mise en scène publicitaire haut de gamme de 2013 à 2021.',
  keywords: [
    '3D Modeling',
    'Product Visualization',
    'Wine Packaging',
    'Rendering',
    'Direction Artistique',
    'Luxury Brand',
  ],
  authors: [{ name: 'D.', url: 'https://example.com' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://example.com/projets/chateau-la-commanderie',
    title: 'Château La Commanderie, Modélisation 3D & Packaging',
    description:
      'Accompagnement complet du développement de la marque de vin Château La Commanderie',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608270861620-7a0be7e3c4d0?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Château La Commanderie, Modélisation 3D',
      },
    ],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
