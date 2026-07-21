import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import IframeScrollIsolator from "@/components/IframeScrollIsolator";

export const metadata: Metadata = {
  title: "Visite Virtuelle 3D | Graphite 3D",
  description:
    "Découvrez notre solution de visite virtuelle 3D interactive. Navigation immersive temps réel dans le navigateur, sans installation requise.",
  alternates: { canonical: "/visite-virtuelle" },
  openGraph: {
    title: "Visite Virtuelle 3D | Graphite 3D",
    description:
      "Solution clé en main de visite virtuelle 3D : visualisation temps réel et navigation intuitive pour transformer vos propriétés.",
    url: "/visite-virtuelle",
    type: "website",
  },
};

const MODELE_DEMO = "/models/demo.glb";

export default function VisiteVirtuelle() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      {/* Hero section */}
      <section className="border-b border-mine pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto w-full max-w-3xl px-6 text-center md:px-10">
          <Reveal>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-papier">
              Une{" "}
              <span className="text-bleu-encre">visite virtuelle 3D</span>, dans
              le navigateur
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-papier/75">
              Visualisation temps réel et navigation intuitive sans installation.
              Découvrez notre solution clé en main pour transformer vos propriétés
              en expériences immersives captivantes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Viewer 3D */}
      <section className="border-b border-mine py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <Reveal>
            <div className="w-full overflow-hidden border border-mine bg-black">
              <IframeScrollIsolator
                src="https://hub-visite-3d.vercel.app/viewer.html"
                title="Visite virtuelle 3D"
                style={{ height: "70vh", maxHeight: "800px" }}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
                  maîtrisez votre contenu sans dépendre d'outils externes.
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

      {/* CTA Section */}
      <section className="border-t border-mine py-24 md:py-32">
        <div className="mx-auto w-full max-w-3xl px-6 text-center md:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tight text-papier">
              Prêt à transformer votre bien en expérience virtuelle ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-papier/75">
              Envoyez-moi le plan ou les photos : je vous conseille sur l'impact
              d'une visite 3D et les délais de mise en place.
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-block bg-bleu-encre px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:bg-bleu-encre-clair"
            >
              Demander une démonstration
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
