'use client';

import { Reveal } from "@/components/ui/Reveal";
import IframeScrollIsolator from "@/components/IframeScrollIsolator";

export default function Solution() {
  return (
    <section className="border-t border-mine py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        {/* Titre + description */}
        <div className="mb-16">
          <Reveal>
            <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.2rem)] font-semibold tracking-tight text-papier">
              Une visite virtuelle 3D, dans le navigateur, sans installation
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-papier/75">
              Découvrez notre solution clé en main : visualisation temps réel
              et navigation intuitive pour transformer vos propriétés en
              expériences immersives.
            </p>
          </Reveal>
        </div>

        {/* Viewer 3D */}
        <div className="w-full overflow-hidden border border-mine bg-black">
          <IframeScrollIsolator
            src="https://hub-visite-3d.vercel.app/viewer.html"
            title="Visite virtuelle 3D"
            style={{ height: '70vh', maxHeight: '800px' }}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Texte sous le viewer */}
        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2">
          <Reveal>
            <div>
              <h3 className="font-display text-sm font-medium tracking-tight text-papier">
                Un écosystème tout-en-un
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
                Contrôle total, déploiement simple
              </h3>
              <p className="mt-4 text-base leading-relaxed text-papier/75">
                Intégration adaptée à votre charte graphique, hébergement
                sécurisé et support continu. Une solution prête à vendre.
              </p>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal>
          <div className="mt-16 flex justify-center">
            <a
              href="/contact"
              className="bg-[#FF7F50] px-6 py-3 font-display text-sm font-medium tracking-wide text-papier transition-colors hover:bg-[#E67E22]"
        >
              Demander une démonstration personnalisée
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
