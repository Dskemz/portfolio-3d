import Link from "next/link";
import { Parallax, Reveal } from "@/components/ui/Reveal";
import Viewer3D from "@/components/ui/Viewer3D";

interface TechnologieProps {
  modelUrl: string;
  modelAlt?: string;
}

interface Atout {
  titre: string;
  detail: string;
}

/**
 * Arguments produit. Volontairement qualitatifs : aucun chiffre de délai,
 * de poids ou de performance n'est avancé tant qu'il n'est pas mesuré.
 */
const ATOUTS: readonly Atout[] = [
  {
    titre: "Moteur temps réel",
    detail:
      "La visite s'ouvre dans le navigateur. Ni plugin, ni application, ni compte à créer pour le visiteur.",
  },
  {
    titre: "Éditeur intégré",
    detail:
      "Points de vue, cotations, matériaux et éclairage se règlent dans mon propre outil, sans repasser par un logiciel tiers.",
  },
  {
    titre: "Aux couleurs de votre marque",
    detail:
      "Interface, palette et signalétique sont déclinées sur votre identité, pas sur la mienne.",
  },
  {
    titre: "Clé en main",
    detail:
      "Du relevé du bien à la mise en ligne, je prends tout en charge. Vous recevez un lien à diffuser.",
  },
] as const;

/**
 * Section « Technologie Graphite 3D ».
 *
 * Porte la démonstration ET le discours produit. Un seul viewer sur la page :
 * le dupliquer coûterait un second téléchargement de modèle pour rien.
 * Nom, métier et repères restent l'affaire exclusive de HeroIntro.
 */
export default function Technologie({
  modelUrl,
  modelAlt = "Visite virtuelle 3D interactive d'un bien immobilier",
}: TechnologieProps) {
  return (
    <section
      id="technologie"
      aria-labelledby="technologie-titre"
      className="scroll-mt-24 border-t border-mine py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bleu-encre-clair">
            Technologie Graphite 3D
          </p>
          <h2
            id="technologie-titre"
            className="mt-4 font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-tight tracking-tight text-papier"
          >
            Une visite virtuelle 3D, dans le navigateur, sans installation
          </h2>
          <p className="mt-5 text-base leading-relaxed text-papier/75">
            Le rendu est calculé en temps réel : mêmes matériaux, même éclairage
            et mêmes cotations que sur les visites livrées aux agences.
          </p>
        </Reveal>

        <Reveal delai={120} className="mt-14">
          <Parallax intensite={0.07}>
            <Viewer3D src={modelUrl} alt={modelAlt} ratio="16 / 9" />
          </Parallax>
        </Reveal>

        {/* Atouts de l'outil propriétaire */}
        <Reveal delai={80} className="mt-20">
          <dl className="grid grid-cols-1 gap-px border-t border-mine sm:grid-cols-2">
            {ATOUTS.map(({ titre, detail }) => (
              <div
                key={titre}
                className="border-b border-mine py-7 sm:odd:pr-8 sm:even:border-l sm:even:pl-8"
              >
                <dt className="font-display text-base font-medium text-papier">
                  {titre}
                </dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-papier/70">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delai={140} className="mt-14 text-center">
          <p className="mx-auto max-w-xl text-base leading-relaxed text-papier/75">
            L'outil est développé et maintenu en interne : ce qui manque à votre
            projet peut être ajouté, sans dépendre du calendrier d'un éditeur.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-block border border-mine px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:border-trait"
          >
            Voir le détail des prestations
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
