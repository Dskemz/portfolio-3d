import { Metadata } from 'next';
import { CarrouselProjets } from '@/components/portfolio/CarrouselProjets';
import { BandeauConfiance } from '@/components/portfolio/BandeauConfiance';
import { TheVault } from '@/components/portfolio/TheVault';

export const metadata: Metadata = {
  title: 'Mes Projets | Denis Masquet',
  description: 'Découvrez mes projets en 3D : visites virtuelles immersives, modélisations produits et expériences temps réel.',
  openGraph: {
    title: 'Mes Projets | Denis Masquet',
    description: 'Visites virtuelles 3D • Modélisations • Temps réel web',
  },
};

export default function PortfolioPage() {
  return (
    <>
      {/* Hero + Carrousel */}
      <main className="relative space-y-24 overflow-x-clip px-6 pt-20 lg:px-8 lg:pt-28">
        <section className="space-y-8">
          <div className="space-y-4">
            <h1 className="font-display text-[clamp(2.1rem,5.6vw,4rem)] leading-[1.02] tracking-[-0.02em]">
              Mes Projets
            </h1>
            <p className="max-w-2xl font-body text-trait">
              Une sélection de réalisations emblématiques : visite virtuelle interactive, modélisation produit haute définition, et expériences temps réel web. Chaque projet est une opportunité d'explorer les possibilités du digital 3D immersif.
            </p>
          </div>

          {/* Carrousel principal */}
          <CarrouselProjets />
        </section>

        {/* Bandeau défilant - Ils m'ont fait confiance */}
        <section className="space-y-6 py-12 lg:py-0">
          <h2 className="text-center font-body text-sm tracking-[0.24em] text-trait">
            ILS M'ONT FAIT CONFIANCE
          </h2>
          <BandeauConfiance />
        </section>
      </main>

      {/* The Vault - Grille complète */}
      <section className="space-y-16 border-t border-mine bg-noir px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl space-y-6">
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.01em]">
            The Vault
          </h2>
          <p className="max-w-2xl font-body text-trait">
            L'intégralité de mon portfolio : explorez par domaine, filtrez par technologie, découvrez chaque projet en détail.
          </p>
        </div>
        <TheVault />
      </section>

      {/* CTA Signature */}
      <footer className="border-t border-mine bg-noir px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-tight">
              Un projet en tête, discutons-en
            </h2>
            <div className="h-px w-12 bg-gradient-to-r from-[#ed8936] to-transparent opacity-60 blur-[1px] mx-auto" />
          </div>
          <p className="mx-auto max-w-md font-body text-trait">
            Vous avez une vision, je l'amène en 3D. Prêt à transformer votre idée en réalité immersive ?
          </p>
          <a
            href="/contact"
            className="inline-block border border-white/[0.14] px-6 py-3 font-mono text-xs tracking-[0.24em] text-papier transition-all hover:border-[#ed8936] hover:shadow-[0_0_20px_rgba(237,137,54,0.18)]"
          >
            Commençons
          </a>
        </div>
      </footer>
    </>
  );
}
