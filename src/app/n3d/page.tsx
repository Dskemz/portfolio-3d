import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import GlbExperience from "@/components/n3d/GlbExperience";

export const metadata: Metadata = {
  title: "N3D — Expériences 3D web | M3D Studio",
  description:
    "N3D transforme vos fichiers GLB en expériences 3D interactives, légères et directement accessibles dans un navigateur.",
  alternates: { canonical: "/n3d" },
};

export default function N3DPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-black text-white">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-32 md:grid-cols-[0.8fr_1.2fr] md:items-center md:px-10 md:pt-40">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#FF7F50]">N3D / GLB EXPERIENCE</p>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[0.95] tracking-tight text-papier">
            Le GLB devient une expérience.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-papier/70">
            Une solution pour publier des modèles 3D interactifs, fluides et personnalisables directement dans le navigateur — sans installation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-zinc-400">
            <span className="border border-white/15 px-3 py-2">WebGL temps réel</span>
            <span className="border border-white/15 px-3 py-2">GLB / glTF 2.0</span>
            <span className="border border-white/15 px-3 py-2">Responsive</span>
          </div>
        </Reveal>

        <GlbExperience />
      </section>

      <section className="border-t border-white/10 bg-[#101114] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-3">
          {[
            ["01", "Un fichier propre", "Le modèle est préparé, optimisé et prêt à s'intégrer dans votre environnement."],
            ["02", "Une scène maîtrisée", "Caméra, lumière, matières et interactions sont ajustées pour raconter l'objet."],
            ["03", "Une diffusion simple", "Un lien ou une intégration suffit pour rendre l'expérience accessible sur tous les écrans."],
          ].map(([numero, titre, texte]) => (
            <article key={numero}>
              <p className="font-mono text-xs tracking-[0.2em] text-[#FF7F50]">{numero}</p>
              <h2 className="mt-4 font-display text-xl text-papier">{titre}</h2>
              <p className="mt-3 text-sm leading-relaxed text-papier/60">{texte}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 text-center md:py-28">
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-papier/70">Vous avez un produit, un lieu ou un univers à faire explorer ?</p>
        <Link href="/contact" className="mt-7 inline-block bg-[#FF7F50] px-6 py-3 font-display text-sm font-medium tracking-wide text-black transition-colors hover:bg-[#E67E22]">
          Parlons-en
        </Link>
      </section>
    </main>
  );
}
