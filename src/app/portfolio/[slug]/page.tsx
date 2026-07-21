import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjet, getSlugs } from "@/content/projets";
import LienSobre from "@/components/portfolio/LienSobre";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Génère une page statique par projet au build. */
export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) return {};

  return {
    title: projet.titre,
    description: projet.resume,
    alternates: { canonical: `/portfolio/${projet.slug}` },
    openGraph: {
      title: projet.titre,
      description: projet.resume,
      images: [projet.couverture],
    },
  };
}

export default async function ProjetPage({ params }: PageProps) {
  const { slug } = await params;
  const projet = getProjet(slug);

  if (!projet) notFound();

  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      <article className="mx-auto w-full max-w-5xl px-6 pb-24 pt-40 lg:px-10 lg:pt-48">
        <Link
          href="/portfolio/tous"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-trait transition-colors duration-300 ease-sobre hover:text-bleu-encre"
        >
          ← Tous les projets
        </Link>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.24em] text-bleu-encre">
          {projet.categorie} — {projet.annee}
        </p>

        <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.08] tracking-tight text-papier">
          {projet.titre}
        </h1>

        <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-papier/70">
          {projet.intro ?? projet.resume}
        </p>

        {/* Visuel de couverture */}
        <div
          style={{ aspectRatio: "16 / 9" }}
          className="relative mt-16 w-full overflow-hidden bg-graphite-950"
        >
          <Image
            src={projet.couverture}
            alt={`${projet.titre} — ${projet.categorie}`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
            className="object-cover"
          />
        </div>

        <dl className="mt-12 grid grid-cols-1 border-t border-mine sm:grid-cols-3">
          {[
            { cle: "Client", valeur: projet.client },
            { cle: "Catégorie", valeur: projet.categorie },
            { cle: "Année", valeur: projet.annee },
          ].map(({ cle, valeur }) => (
            <div
              key={cle}
              className="border-b border-mine py-5 sm:border-b-0 sm:border-r sm:pr-6 sm:last:border-r-0"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-trait">
                {cle}
              </dt>
              <dd className="mt-2 text-sm font-light text-papier/90">
                {valeur}
              </dd>
            </div>
          ))}
        </dl>
        
        {/* SECTION DESCRIPTION LONGUE */}
{projet.descriptionComplete && (
  <section className="mt-16 border-t border-mine pt-12">
    <div className="prose prose-invert max-w-none text-papier/80">
      {/* On utilise .split('\n') si tu veux gérer les sauts de ligne */}
      {projet.descriptionComplete.split('\n').map((para, i) => (
        <p key={i} className="mb-4 leading-relaxed">{para}</p>
      ))}
    </div>
  </section>
)}

{/* SECTION GALERIE */}
{projet.galerie && projet.galerie.length > 0 && (
  <section className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
    {projet.galerie.map((src, index) => (
      // C'EST CETTE LIGNE CI-DESSOUS QU'IL FAUT MODIFIER :
      <div key={index} className="relative aspect-[4/4] w-full overflow-hidden bg-graphite-950">
        <Image 
          src={src} 
          alt={`Détail ${index + 1}`} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover" 
        />
      </div>
    ))}
  </section>
)}

        {projet.visiteUrl && (
          <div className="mt-12">
            <LienSobre href={projet.visiteUrl}>Ouvrir la visite</LienSobre>
          </div>
        )}
      </article>
    </div>
  );
}
