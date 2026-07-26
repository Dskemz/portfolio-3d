import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Visite virtuelle interactive dans le navigateur | Graphite 3D",
  description:
    "Visualisation temps réel et navigation légère et intuitive, sans installation. Solution clé en main pour transformer vos propriétés en expériences automatisées, sur mesure et immersives.",
  alternates: { canonical: "/visite-virtuelle" },
  openGraph: {
    title: "Visite virtuelle interactive dans le navigateur | Graphite 3D",
    description:
      "Solution clé en main de visite virtuelle 3D : temps réel, navigation légère et intuitive pour transformer vos propriétés en expériences immersives.",
    url: "/visite-virtuelle",
    type: "website",
  },
};

// La page HTML chargée dans l'iframe : fausse annonce + bouton qui bascule vers
// le viewer 3D. Tout se passe DANS l'iframe, aucune redirection externe.
const SRC = "https://hub-visite-3d.vercel.app/index-laforet.html";

export default function VisiteVirtuelle() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      {/* Hero — titre + sous-titre en continuité, aucun trait de coupure */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto w-full max-w-3xl px-6 text-center md:px-10">
          <Reveal>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-papier">
              Une{" "}
              <span className="text-[#FF7F50]">
                visite virtuelle interactive
              </span>{" "}
              dans le navigateur
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-papier/75">
              Visualisation en{" "}
              <strong className="font-semibold text-papier">temps réel</strong>{" "}
              et navigation{" "}
              <strong className="font-semibold text-papier">légère</strong> et{" "}
              <strong className="font-semibold text-papier">intuitive</strong>{" "}
              sans installation. Découvrez cette solution clé en main pour
              transformer vos propriétés en{" "}
              <strong className="font-semibold text-papier">
                expériences automatisées
              </strong>
              ,{" "}
              <strong className="font-semibold text-papier">sur mesures</strong>{" "}
              et{" "}
              <strong className="font-semibold text-papier">immersives</strong>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mise en abyme — fenêtre plus étroite que la page, hauteur immersive.
          Le bouton d'entrée dans le viewer vit DANS l'iframe : la bascule
          annonce → viewer se fait entièrement à l'intérieur, sans redirection. */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <Reveal>
            <div className="relative mx-auto w-full max-w-5xl">
              {/* Glow subtil derrière la fenêtre pour la détacher du fond noir */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(255,127,80,0.14),transparent_70%)] blur-2xl"
              />
              <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_50px_-12px_rgba(255,127,80,0.12)]">
                <iframe
                  src={SRC}
                  title="Visite virtuelle interactive"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  scrolling="no"
                  className="block min-h-[1100px] w-full border-none"
                  style={{ overflow: "hidden" }}
                />
              </div>
            </div>
          </Reveal>

          {/* Points clés */}
          <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-3">
            <Reveal>
              <div>
                <h3 className="font-display text-sm font-medium tracking-tight text-papier">
                  Écosystème tout-en-un
                </h3>
                <p className="mt-4 text-base leading-relaxed text-papier/75">
                  Viewer haute performance et éditeur propriétaire intégré : vous
                  maîtrisez votre contenu sans dépendre d&apos;outils externes.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h3 className="font-display text-sm font-medium tracking-tight text-papier">
                  Contrôle total
                </h3>
                <p className="mt-4 text-base leading-relaxed text-papier/75">
                  Intégration adaptée à votre charte graphique, hébergement
                  sécurisé et support continu.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h3 className="font-display text-sm font-medium tracking-tight text-papier">
                  Déploiement simple
                </h3>
                <p className="mt-4 text-base leading-relaxed text-papier/75">
                  Solution prête à vendre avec tous les outils nécessaires pour
                  démarrer immédiatement.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-3xl px-6 text-center md:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tight text-papier">
              Prêt à transformer votre bien en expérience virtuelle ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-papier/75">
              Envoyez-moi le plan ou les photos : je vous conseille sur
              l&apos;impact d&apos;une visite 3D et les délais de mise en place.
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-block bg-[#FF7F50] px-6 py-3 font-display text-sm font-medium tracking-wide text-black transition-colors hover:bg-[#E67E22]"
            >
              Demander une démonstration
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
