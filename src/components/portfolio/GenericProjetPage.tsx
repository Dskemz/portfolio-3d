/**
 * Composant générique pour les pages de projet.
 * 
 * Utilisable par n'importe quel projet, tu peux composer ta mise en page
 * en assemblant des sections génériques (hero, texte, grille d'images, etc.)
 */

import { Reveal } from "../ui/Reveal";
import { SectionGridWithings } from "./SectionGridWithings";
import type { SectionGrid } from "@/content/withings-layout-config";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectViewer } from "./ProjectViewer";
import { ProjectNavigation } from "./ProjectNavigation";
import type { ProjetData } from "@/content/projets";

interface GenericProjetPageProps {
  projet: ProjetData;
  precedent: ProjetData;
  suivant: ProjetData;
  sections?: SectionGrid[]; // Sections optionnelles
}

/**
 * Page générique de projet.
 * 
 * Pour un nouveau projet :
 * 1. Crée une config dans src/content/mon-projet-layout-config.ts
 * 2. Importe les sections
 * 3. Passe-les en prop à ce composant
 * 
 * C'est tout. Zéro composition JSX, juste du data.
 */
export function GenericProjetPage({
  projet,
  precedent,
  suivant,
  sections = [],
}: GenericProjetPageProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      <ProjectHeader
        client={projet.client}
        titre={projet.titre}
        role={projet.role}
        outils={projet.outils}
        annee={projet.annee}
      />

      <div className="mx-auto w-full max-w-7xl gouttiere space-y-20 pb-24 lg:space-y-28">
        {/* Viewer ou image hero */}
        <ProjectViewer
          src={projet.viewer ?? projet.couverture}
          alt={projet.titre}
          ratio={projet.ratioViewer ?? "16/9"}
          isIframe={projet.hasIframe ?? false}
          slug={projet.slug}
        />

        {/* Sections dynamiques */}
        {sections.length > 0 ? (
          <div className="space-y-24 lg:space-y-32">
            {sections.map((section, idx) => (
              <SectionGridWithings key={idx} section={section} slug={projet.slug} />
            ))}
          </div>
        ) : (
          // Fallback : contenu de base
          <div className="mx-auto max-w-2xl space-y-12">
            <Reveal>
              <h2 className="text-2xl font-light tracking-tight text-papier">
                Défi
              </h2>
              <p className="mt-4 text-base font-light leading-relaxed text-papier/70">
                {projet.defi}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="text-2xl font-light tracking-tight text-papier">
                Solution
              </h2>
              <p className="mt-4 text-base font-light leading-relaxed text-papier/70">
                {projet.solution}
              </p>
            </Reveal>

            {projet.resultats && (
              <Reveal>
                <h2 className="text-2xl font-light tracking-tight text-papier">
                  Résultats
                </h2>
                <p className="mt-4 text-base font-light leading-relaxed text-papier/70">
                  {projet.resultats}
                </p>
              </Reveal>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <ProjectNavigation previous={precedent} next={suivant} />
    </div>
  );
}
