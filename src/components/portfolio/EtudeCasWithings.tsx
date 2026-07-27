import { Reveal } from "../ui/Reveal";
import { VisuelWithings } from "./VisuelWithings";
import { ProjectNavigation } from "./ProjectNavigation";
import { CtaSignature } from "./CtaSignature";
import type { ProjetData } from "../../content/projets";

interface EtudeCasWithingsProps {
  projet: ProjetData;
  precedent: {
    slug: string;
    titre: string;
    client: string;
    couverture: string;
  };
  suivant: {
    slug: string;
    titre: string;
    client: string;
    couverture: string;
  };
}

/**
 * Étude de cas éditoriale sur-mesure — WITHINGS ScanWatch 2, Light et Nova.
 *
 * Rythme de lecture volontairement varié d'un chapitre à l'autre (visuel maître
 * pleine largeur, triptyque, grille asymétrique, mise en scène de profil, vue
 * éclatée) pour éviter la redondance. Les visuels sont des encarts stylés en
 * attendant les rendus finaux ; chaque PlaceholderVisuel sera remplacé par un
 * <Image> sans toucher à la structure.
 */
export function EtudeCasWithings({
  projet,
  precedent,
  suivant,
}: EtudeCasWithingsProps) {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      {/* ================================================================== */}
      {/*  Hero                                                              */}
      {/* ================================================================== */}
      <header className="mx-auto w-full max-w-6xl px-6 pb-12 pt-36 md:pt-40 lg:px-16 xl:px-24">
        <div className="lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-500 lg:pt-4">
            {projet.client}
          </p>

          <div className="mt-8 lg:mt-0">
            <h1 className="max-w-3xl font-display text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.08] tracking-tight text-papier">
              WITHINGS – ScanWatch 2 Light et Nova
            </h1>
            <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-papier/60 md:text-base">
              Création de toute la gamme de montres ScanWatch 2, ScanWatch Light
              et ScanWatch Nova. Réalisation de vidéos 360° pour le shop
              interactif en ligne. Production de packshots pour la grande
              distribution et le catalogue produits en digeo.
            </p>
          </div>
        </div>

        {/* Métadonnées */}
        <dl className="mt-16 grid gap-10 border-t border-mine pt-10 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-trait">
              Rôle
            </dt>
            <dd className="mt-3 font-display text-lg font-light text-papier">
              Graphiste 3D indépendant
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-trait">
              Livrables
            </dt>
            <dd className="mt-3 font-display text-lg font-light text-papier">
              Visuels &amp; packshots
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-trait">
              Année
            </dt>
            <dd className="mt-3 font-display text-lg font-light text-papier">
              2024 – 2025
            </dd>
          </div>
        </dl>
      </header>

      {/* Placeholder 1 — grand visuel maître horizontal */}
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-16 xl:px-24">
        <Reveal>
          <VisuelWithings
            name="01-hero"
            label="Visuel maître — gamme ScanWatch 2"
            ratio="21/9"
            teinte="#14161a"
          />
        </Reveal>
      </div>

      {/* ================================================================== */}
      {/*  Corps — chapitres au rythme varié                                 */}
      {/* ================================================================== */}
      <div className="mx-auto w-full max-w-6xl space-y-24 px-6 py-24 lg:space-y-32 lg:px-16 lg:py-32 xl:px-24">
        {/* ---------------------------------------------------------------- */}
        {/*  Chapitre 1 — Éléments 3D · mise en page asymétrique             */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-mine pt-16">
          <Reveal>
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
                Chapitre 01 — Éléments 3D
              </p>
              <p className="mt-6 text-base font-light leading-relaxed text-papier/70">
                Modélisation des boîtiers 37 mm, 38 mm, 42 mm et 43 mm de la
                gamme ScanWatch 2. Déclinaison des cadrans, soleillage et
                sablage. Modélisation des bracelets cuir, métal, tissu et
                silicone pour chaque taille de boîtier.
              </p>
            </div>
          </Reveal>

          {/* 5 montres — une seule ligne élégante sur desktop */}
          <Reveal className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4 lg:mt-16" cascade>
            <VisuelWithings name="02-face" label="37mm" ratio="4/3" teinte="#1b1e23" />
            <VisuelWithings name="02b-face-38" label="38mm" ratio="4/3" teinte="#20242a" />
            <VisuelWithings name="02c-face-42" label="42mm" ratio="4/3" teinte="#1b1e23" />
            <VisuelWithings name="02d-face-43" label="43mm" ratio="4/3" teinte="#20242a" />
            <VisuelWithings name="03-3quart" label="3/4" ratio="4/3" teinte="#1b1e23" />
          </Reveal>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Chapitre 2 — Matières et teintes · focus macro                  */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-mine pt-16">
          <Reveal>
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
                Chapitre 02 — Matières et teintes
              </p>
              <p className="mt-6 text-base font-light leading-relaxed text-papier/70">
                La plupart des éléments industriels sont créés à partir de
                valeurs de gris. Les autres éléments, tels que les bracelets en
                tissu ou en cuir, nécessitent des textures spécifiques.
              </p>
            </div>
          </Reveal>

          {/* Placeholder 3 — grille asymétrique de gros plans */}
          <Reveal className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2" cascade>
            <VisuelWithings
              name="05-boucle"
              label="Boucle déployante"
              ratio="1/1"
              teinte="#1b1e23"
              className="lg:col-span-2 lg:row-span-2 lg:aspect-auto"
            />
            <VisuelWithings name="06-couture" label="Couture cuir" ratio="1/1" teinte="#252930" />
            <VisuelWithings name="07-tissage" label="Tissage" ratio="1/1" teinte="#20242a" />
            <VisuelWithings name="08-sablage" label="Sablage métal" ratio="1/1" teinte="#252930" />
            <VisuelWithings name="09-silicone" label="Silicone" ratio="1/1" teinte="#1b1e23" />
          </Reveal>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Chapitre 3 — Lumière et reflets · mise en scène studio          */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-mine pt-16">
          {/* Placeholder 4 — profil + reflets spéculaires, texte en dessous */}
          <Reveal>
            <VisuelWithings
              name="10-studio"
              label="Mise en scène studio — reflets spéculaires sur verre et biseaux"
              ratio="16/9"
              teinte="#0e1013"
            />
          </Reveal>

          <Reveal className="mt-10 lg:grid lg:grid-cols-[8rem_1fr] lg:gap-8" delai={100}>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500 lg:pt-2">
              Chapitre 03
            </p>
            <div className="mt-6 max-w-2xl lg:mt-0">
              <h2 className="font-display text-xl font-light leading-tight tracking-tight text-papier">
                Lumière et reflets
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-papier/70">
                Faire ressortir les lignes, souligner les formes et former un
                ensemble cohérent pour que les éléments soient mis en valeur.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Chapitre 4 — Touche finale & éclaté · clôture                   */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-mine pt-16">
          <Reveal>
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-500">
                Chapitre 04 — La touche finale
              </p>
              <p className="mt-6 text-base font-light leading-relaxed text-papier/70">
                Une image n&apos;est terminée que lorsqu&apos;elle a été
                composée. Chaque calque a ses spécificités : l&apos;accentuation
                du contraste, l&apos;ajustement des reflets, pour sublimer le
                sujet.
              </p>
            </div>
          </Reveal>

          {/* Placeholder 5 — vue éclatée large + déclinaisons cadrans */}
          <Reveal className="mt-10 grid gap-4 lg:grid-cols-[1.6fr_1fr]" cascade>
            <VisuelWithings
              name="11-eclate"
              label="Vue éclatée — exploded view"
              ratio="4/3"
              teinte="#0e1013"
            />
            <div className="grid grid-rows-2 gap-4">
              <VisuelWithings
                name="12-cadran-vert"
                label="Cadran vert"
                ratio="16/9"
                teinte="#1b1e23"
              />
              <VisuelWithings
                name="13-cadran-noir"
                label="Cadran noir"
                ratio="16/9"
                teinte="#14161a"
              />
            </div>
          </Reveal>
        </section>

        {/* Navigation inter-projets */}
        <ProjectNavigation previous={precedent} next={suivant} />
      </div>

      {/* CTA signature partagé */}
      <CtaSignature />
    </div>
  );
}
