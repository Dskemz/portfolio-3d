import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJETS } from "@/content/projets";
import { GenericProjetPage } from "@/components/portfolio/GenericProjetPage";
import { EtudeCasWithings } from "@/components/portfolio/EtudeCasWithings";
import { EtudeCasChateauLaCommanderie } from "@/components/portfolio/EtudeCasChateauLaCommanderie";
import { EtudeCasStudioSummum } from "@/components/portfolio/EtudeCasStudioSummum";
import type { SectionGrid } from "@/content/withings-layout-config";

// Configs layout par projet
import { SECTIONS_DECOTEC } from "@/content/decotec-layout-config";
import { SECTIONS_NFT_FLOOFIES } from "@/content/nft-floofies-layout-config";
import { SECTIONS_SUMMUM_3D } from "@/content/summum-3d-layout-config";
import { SECTIONS_VELYV_ELO } from "@/content/velyv-elo-layout-config";
import { SECTIONS_AGENCES_GEORGES } from "@/content/agences-georges-layout-config";
import { SECTIONS_ALQUYME } from "@/content/alquyme-layout-config";
import { SECTIONS_STEAMONE } from "@/content/steamone-layout-config";
import { SECTIONS_CREATION_ORIGINALES } from "@/content/creation-originales-layout-config";
import { SECTIONS_HORLOGERIE_SUISSE } from "@/content/horlogerie-suisse-layout-config";

// Mapping slug → sections
const SECTIONS_PAR_PROJET: Record<string, SectionGrid[]> = {
  "decotec": SECTIONS_DECOTEC,
  "nft-floofies": SECTIONS_NFT_FLOOFIES,
  "summum-3d": SECTIONS_SUMMUM_3D,
  "velyv-elo": SECTIONS_VELYV_ELO,
  "agences-georges": SECTIONS_AGENCES_GEORGES,
  "alquyme": SECTIONS_ALQUYME,
  "steamone": SECTIONS_STEAMONE,
  "creation-originales": SECTIONS_CREATION_ORIGINALES,
  "horlogerie-suisse": SECTIONS_HORLOGERIE_SUISSE,
};

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
      ...(projet.couverture && {
        images: [{ url: projet.couverture, width: 1200, height: 630 }],
      }),
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

  // Étude de cas sur-mesure — Château La Commanderie (slug agences-georges)
  if (slug === "agences-georges") {
    return (
      <EtudeCasChateauLaCommanderie
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Étude de cas sur-mesure — Studio Summum 3D (slug summum-3d)
  if (slug === "summum-3d") {
    return (
      <EtudeCasStudioSummum
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Étude de cas éditoriale sur-mesure (ex. Withings)
  if (projet.etudeCas) {
    return (
      <EtudeCasWithings
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Sections personnalisées du projet (si définies)
  const sections = SECTIONS_PAR_PROJET[projet.slug] ?? [];

  return (
    <GenericProjetPage
      projet={projet}
      precedent={precedent}
      suivant={suivant}
      sections={sections}
    />
  );
}
