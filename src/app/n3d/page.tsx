import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import GlbExperience from "@/components/n3d/GlbExperience";

export const metadata: Metadata = {
  title: "Nexus — L'écosystème des expériences 3D | M3D Studio",
  description:
    "Nexus combine des blocs 3D optimisés, la création d'expériences sur mesure et un hub de suivi en temps réel.",
  alternates: { canonical: "/n3d" },
};

export default function N3DPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-black text-white">
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-32 md:px-10 md:pt-40">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/15 pb-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#FF7F50]">M3D Studio / Écosystème</p>
              <p className="mt-5 font-display text-4xl font-semibold tracking-tight text-papier md:text-6xl">NEXUS</p>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-papier/70 md:text-lg">
              Construire, déployer et piloter des expériences 3D sur mesure à partir de blocs déjà disponibles et optimisés.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <NexusVideoPlaceholder />
          <Reveal>
            <div className="border-l border-[#FF7F50] pl-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF7F50]">La proposition Nexus</p>
              <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.8rem)] font-light leading-[1.05] tracking-tight text-papier">
                Une expérience 3D pensée comme un écosystème.
              </h1>
              <p className="mt-6 text-base leading-relaxed text-papier/65">
                Nexus ne se limite pas à afficher un modèle. Il met à disposition des briques de construction, les assemble selon votre besoin et donne une vision en temps réel de l&apos;usage de l&apos;expérience.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid border-y border-white/10 md:grid-cols-3">
          {[
            ["01", "Construire", "Des blocs 3D, interactifs et optimisés, prêts à composer une expérience cohérente."],
            ["02", "Déployer", "Une expérience sur mesure adaptée à votre produit, votre lieu ou votre identité."],
            ["03", "Piloter", "Un hub centralisé pour garder un regard en temps réel sur le trafic et l’usage."],
          ].map(([numero, titre, texte]) => (
            <article key={numero} className="border-b border-white/10 px-0 py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <p className="font-mono text-xs tracking-[0.2em] text-[#FF7F50]">{numero}</p>
              <h2 className="mt-4 font-display text-2xl font-light text-papier">{titre}</h2>
              <p className="mt-3 text-sm leading-relaxed text-papier/60">{texte}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#101114] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-trait">Au fil du scroll</p>
            <h2 className="mt-5 font-display text-3xl font-light leading-tight text-papier md:text-5xl">Un système qui grandit avec chaque expérience.</h2>
          </div>
          <GlbExperience />
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

function NexusVideoPlaceholder() {
  return (
    <div className="relative aspect-video overflow-hidden border border-white/15 bg-[#111216]">
      <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" aria-label="Vidéo de présentation de Nexus">
        <source src="/videos/nexus-presentation.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,127,80,0.12),transparent_45%)] px-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF7F50]">Vidéo de présentation</span>
        <p className="mt-4 max-w-sm font-display text-2xl font-light text-papier md:text-4xl">L&apos;écosystème Nexus en action</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-papier/50">Cet emplacement accueillera la vidéo promotionnelle enregistrée depuis Nexus.</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/55 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        <span>Nexus / introduction</span>
        <span>00:30</span>
      </div>
    </div>
  );
}
