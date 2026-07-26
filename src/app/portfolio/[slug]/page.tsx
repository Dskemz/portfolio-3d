import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJETS } from '@/content/projets';
import { ProjectHeader } from '@/components/portfolio/ProjectHeader';
import { ProjectViewer } from '@/components/portfolio/ProjectViewer';
import { ProjectBrief } from '@/components/portfolio/ProjectBrief';
import { ProjectComparison } from '@/components/portfolio/ProjectComparison';
import { ProjectGallery } from '@/components/portfolio/ProjectGallery';
import { ProjectNavigation } from '@/components/portfolio/ProjectNavigation';

export async function generateStaticParams() {
  return PROJETS.map((projet) => ({
    slug: projet.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const projet = PROJETS.find((p) => p.slug === params.slug);

  if (!projet) {
    return {};
  }

  return {
    title: `${projet.nom} | ${projet.client} | Denis Masquet`,
    description: projet.resume,
    openGraph: {
      title: `${projet.nom} | ${projet.client}`,
      description: projet.resume,
      images: [
        {
          url: projet.couverture,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function ProjetPage({ params }: { params: { slug: string } }) {
  const projetIndex = PROJETS.findIndex((p) => p.slug === params.slug);

  if (projetIndex === -1) {
    notFound();
  }

  const projet = PROJETS[projetIndex];
  const projetPrecedent = PROJETS[(projetIndex - 1 + PROJETS.length) % PROJETS.length];
  const projetSuivant = PROJETS[(projetIndex + 1) % PROJETS.length];

  return (
    <>
      {/* Header minimaliste */}
      <ProjectHeader
        client={projet.client}
        nom={projet.nom}
        role={projet.role}
        outils={projet.outils}
        annee={projet.annee}
      />

      {/* Conteneur principal */}
      <main className="relative space-y-24 overflow-x-clip px-6 py-20 lg:px-8 lg:py-32">
        {/* Viewer 3D / Visuel grand format */}
        <ProjectViewer
          src={projet.viewer || projet.couverture}
          alt={projet.nom}
          ratio={projet.ratioViewer || '16/9'}
          isIframe={projet.hasIframe || false}
        />

        {/* Brief du projet - 2 colonnes */}
        <ProjectBrief
          defi={projet.defi}
          solution={projet.solution}
          resultats={projet.resultats}
        />

        {/* Comparatif Wireframe <-> Rendu final */}
        {projet.wireframe && projet.final && (
          <ProjectComparison
            wireframeUrl={projet.wireframe}
            wireframeLabel={projet.wireframeLabel || 'Concept'}
            finalUrl={projet.final}
            finalLabel={projet.finalLabel || 'Rendu Final'}
          />
        )}

        {/* Galerie de détails */}
        {projet.galerie && projet.galerie.length > 0 && (
          <ProjectGallery images={projet.galerie} />
        )}

        {/* Navigation fluide */}
        <ProjectNavigation
          current={projet}
          previous={projetPrecedent}
          next={projetSuivant}
        />
      </main>

      {/* CTA signature */}
      <footer className="border-t border-mine bg-noir px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-tight">
              Votre projet mérite cette excellence
            </h2>
            <div className="h-px w-12 bg-gradient-to-r from-[#ed8936] to-transparent opacity-60 blur-[1px] mx-auto" />
          </div>
          <a
            href="/contact"
            className="inline-block border border-white/[0.14] px-6 py-3 font-mono text-xs tracking-[0.24em] text-papier transition-all hover:border-[#ed8936] hover:shadow-[0_0_20px_rgba(237,137,54,0.18)]"
          >
            Parlons de votre idée
          </a>
        </div>
      </footer>
    </>
  );
}
