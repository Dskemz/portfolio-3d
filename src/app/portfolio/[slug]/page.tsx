import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJETS } from "@/content/projets";
import { GenericProjetPage } from "@/components/portfolio/GenericProjetPage";
import { EtudeCasWithings } from "@/components/portfolio/EtudeCasWithings";
import { EtudeCasChateauLaCommanderie } from "@/components/portfolio/EtudeCasChateauLaCommanderie";
import { EtudeCasStudioSummum } from "@/components/portfolio/EtudeCasStudioSummum";
import { EtudeCasCartoon } from "@/components/portfolio/EtudeCasCartoon";
import { EtudeCasSalleDeBain } from "@/components/portfolio/EtudeCasSalleDeBain";
import { EtudeCasNft } from "@/components/portfolio/EtudeCasNft";
import { EtudeCasVelo } from "@/components/portfolio/EtudeCasVelo";
import { EtudeCasSteamOne } from "@/components/portfolio/EtudeCasSteamOne";
import { EtudeCasAlquyme } from "@/components/portfolio/EtudeCasAlquyme";
import { EtudeCasHorlogerie } from "@/components/portfolio/EtudeCasHorlogerie";
import type { SectionGrid } from "@/content/withings-layout-config";

// Configs layout par projet
import { SECTIONS_SUMMUM_3D } from "@/content/summum-3d-layout-config";
import { SECTIONS_AGENCES_GEORGES } from "@/content/agences-georges-layout-config";
import { SECTIONS_CREATION_ORIGINALES } from "@/content/creation-originales-layout-config";

// Mapping slug → sections
const SECTIONS_PAR_PROJET: Record<string, SectionGrid[]> = {
  "summum-3d": SECTIONS_SUMMUM_3D,
  "agences-georges": SECTIONS_AGENCES_GEORGES,
  "creation-originales": SECTIONS_CREATION_ORIGINALES,
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

  // Étude de cas sur-mesure — Architecture d'Intérieur · Salle de Bain (slug decotec)
  if (slug === "decotec") {
    return (
      <EtudeCasSalleDeBain
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Étude de cas sur-mesure — Floofies · Le shiba du futur (slug nft-floofies)
  if (slug === "nft-floofies") {
    return (
      <EtudeCasNft
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Étude de cas sur-mesure — VélyVélo · Conception de Vélo Électrique (slug velyv-elo)
  if (slug === "velyv-elo") {
    return (
      <EtudeCasVelo
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Étude de cas sur-mesure — SteamOne · Défroisseur vapeur (slug steamone)
  if (slug === "steamone") {
    return (
      <EtudeCasSteamOne
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Étude de cas sur-mesure — Alquyme · Flacon d'exception (slug alquyme)
  if (slug === "alquyme") {
    return (
      <EtudeCasAlquyme
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Étude de cas sur-mesure — Horlogerie · Mise en scène de montres (slug horlogerie-suisse)
  if (slug === "horlogerie-suisse") {
    return (
      <EtudeCasHorlogerie
        projet={projet}
        precedent={precedent}
        suivant={suivant}
      />
    );
  }

  // Étude de cas sur-mesure — Le Cartoon mis en scène (slug creation-originales)
  if (slug === "creation-originales") {
    return (
      <EtudeCasCartoon
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
