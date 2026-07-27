import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJETS } from "@/content/projets";
import { ProjectHeader } from "@/components/portfolio/ProjectHeader";
import { ProjectViewer } from "@/components/portfolio/ProjectViewer";
import { ProjectBrief } from "@/components/portfolio/ProjectBrief";
import { ProjectComparison } from "@/components/portfolio/ProjectComparison";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { ProjectNavigation } from "@/components/portfolio/ProjectNavigation";
import { CtaSignature } from "@/components/portfolio/CtaSignature";
import { EtudeCasWithings } from "@/components/portfolio/EtudeCasWithings";

export function generateStaticParams() {
  return PROJETS.map((projet) => ({ slug: projet.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projet = PROJETS.find((p) => p.slug === slug);
  if (!projet) return {};

  return {
    title: `${projet.titre} — ${projet.client}`,
    description: projet.resume,
    alternates: { canonical: `/portfolio/${projet.slug}` },
    openGraph: {
      title: `${projet.titre} — ${projet.client}`,
      description: projet.resume,
      url: `/portfolio/${projet.slug}`,
      type: "article",
      images: [{ url: projet.couverture, width: 1200, height: 630 }],
    },
  };
}

export default async function ProjetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = PROJETS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const projet = PROJETS[index];
  const precedent = PROJETS[(index - 1 + PROJETS.length) % PROJETS.length];
  const suivant = PROJETS[(index + 1) % PROJETS.length];

  // Étude de cas éditoriale sur-mesure (ex. Withings ScanWatch).
  if (projet.etudeCas) {
    return (
      <EtudeCasWithings
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      <ProjectHeader
        client={projet.client}
        titre={projet.titre}
        role={projet.role}
        outils={projet.outils}
        annee={projet.annee}
      />

      <div className="mx-auto w-full max-w-6xl space-y-20 px-6 pb-24 lg:space-y-28 lg:px-16 xl:px-24">
        {/* Viewer 3D / visuel grand format */}
        <ProjectViewer
          src={projet.viewer ?? projet.couverture}
          alt={projet.titre}
          ratio={projet.ratioViewer ?? "16/9"}
          isIframe={projet.hasIframe ?? false}
        />

        {/* Défi & solution */}
        <ProjectBrief
          defi={projet.defi}
          solution={projet.solution}
          resultats={projet.resultats}
        />

        {/* Wireframe → rendu final */}
        {projet.wireframe && projet.final && (
          <ProjectComparison
            wireframeUrl={projet.wireframe}
            wireframeLabel={projet.wireframeLabel ?? "Wireframe"}
            finalUrl={projet.final}
            finalLabel={projet.finalLabel ?? "Rendu final"}
          />
        )}

        {/* Galerie de détails */}
        {projet.galerie && projet.galerie.length > 0 && (
          <ProjectGallery images={projet.galerie} />
        )}

        {/* Navigation précédent / suivant */}
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      {/* CTA signature partagé */}
      <CtaSignature />
    </div>
  );
}
