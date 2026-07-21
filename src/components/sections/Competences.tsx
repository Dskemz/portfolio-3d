import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

interface Competence {
  titre: string;
  description: string;
  icone: string;
}

const COMPETENCES: readonly Competence[] = [
  {
    titre: "Modélisation 3D",
    description:
      "Créations haute fidélité optimisées pour le web. Modèles légers en .glb garantissant fluidité et authenticité visuelle.",
    icone: "🎨",
  },
  {
    titre: "Web 3D & Babylon.js",
    description:
      "Expériences interactives temps réel dans le navigateur. Navigation immersive et performante sur tous les appareils.",
    icone: "⚡",
  },
  {
    titre: "Visites Virtuelles",
    description:
      "Immersion 3D complète pour l'immobilier. Solution clé en main : viewer et éditeur intégrés, prêts à déployer.",
    icone: "🏠",
  },
] as const;

export default function Competences() {
  return (
    <section className="border-t border-mine py-24 md:py-32">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        {/* Titre de section */}
        <div className="mb-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.5rem)] font-semibold tracking-tight text-papier">
              Expertise et savoir-faire
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-papier/75">
              Trois domaines d'excellence pour transformer vos projets en
              réalités visuelles captivantes et performantes.
            </p>
          </Reveal>
        </div>

        {/* Grille de compétences */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {COMPETENCES.map((competence, index) => (
            <Reveal key={index}>
              <div className="flex flex-col border border-mine p-8">
                <span className="text-5xl mb-4">{competence.icone}</span>
                <h3 className="font-display text-lg font-medium tracking-tight text-papier">
                  {competence.titre}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-papier/75">
                  {competence.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA pour la visite virtuelle */}
        <Reveal>
          <div className="mt-20 border border-mine p-12 text-center">
            <h3 className="font-display text-xl font-semibold text-papier">
              Découvrez mon approche en action
            </h3>
            <p className="mt-4 text-papier/75">
              Une démonstration interactive de la visite virtuelle 3D en temps réel.
            </p>
            <Link
              href="/visite-virtuelle"
              className="mt-6 inline-block bg-bleu-encre px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:bg-bleu-encre-clair"
            >
              Voir la solution en action
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
