"use client";

/**
 * FluxCompetences — les quatre domaines traversés par le fil orange.
 *
 * Le fil est INVISIBLE au repos et SE DESSINE une seule fois quand la section
 * des quatre cadres entre dans le viewport (`whileInView` + `pathLength`).
 * La mise en page, la géométrie du tracé et les cadres sont inchangés : seule
 * l'apparition du trait est animée.
 *
 * PLEINE LARGEUR. Le bloc sort de son conteneur (`left-1/2 w-screen
 * -translate-x-1/2`) pour que le fil parte réellement du bord gauche de
 * l'écran et ressorte au bord droit. Enfermé dans le `max-w-6xl` de la
 * section, il s'arrêtait au milieu de nulle part.
 *
 * Le tracé est ORTHOGONAL : segments horizontaux et verticaux uniquement,
 * rayon de 8 unités sur chaque coude. Il entre et ressort TOUJOURS sur l'axe
 * médian des cadres, donc le segment caché à l'intérieur est une droite.
 *
 * ⚠️ Tailles en `clamp(..vw..)` et NON en rem : le repère SVG se met à
 * l'échelle avec la largeur de l'écran, la typographie doit suivre la même
 * loi. Avec des tailles fixes, le texte débordait des cadres en dessous de
 * 1280 px — les cadres ont une hauteur imposée par la géométrie du tracé.
 *
 * Émission : TROIS traits concentriques (halo large + halo moyen + trait net),
 * tous animés par le même `pathLength 0→1`. Aucun filtre SVG, aucune empreinte
 * visible avant le passage du front — le glow se révèle en même temps que le
 * trait (même technique que la home, zéro rastérisation par image, zéro
 * flicker).
 *
 * Cadres : tous invisibles au repos. Ils apparaissent D'ABORD en séquence
 * (fondu + glissée, alternance haut/bas) ; UNE FOIS en place, le flux part et
 * serpente à travers eux. Au passage du courant, le contour s'illumine (les
 * deux côtés en même temps) puis S'ÉTEINT dès que le flux le quitte — aucune
 * lueur résiduelle.
 */

import { motion, useReducedMotion, type MotionProps } from "framer-motion";

const ACCENT = "#FF7F50";

interface Domaine {
  titre: string;
  description: string;
}

const DOMAINES: readonly Domaine[] = [
  {
    titre: "Visite\nvirtuelle",
    description: "Parcourue dans le navigateur, sans installation ni plugin.",
  },
  {
    titre: "Modélisation\n3D",
    description: "Haute fidélité, pensée pour rester légère sur le web.",
  },
  {
    titre: "Temps réel\nweb",
    description: "Babylon.js et WebGL, intégrés sur mesure à votre site.",
  },
  {
    titre: "Direction\nartistique",
    description: "Matières, éclairage, cadrage. La lumière décide.",
  },
] as const;

/**
 * Repère commun au tracé et aux cadres : 1440 × 520.
 * Axes médians des cadres : 240, 560, 880, 1200.
 * Couloirs horizontaux : 25 en haut, 490 en bas — hors de tous les cadres.
 */
const TRACE =
  "M 0 490 H 232 Q 240 490 240 482 V 33 Q 240 25 248 25 " +
  "H 552 Q 560 25 560 33 V 482 Q 560 490 568 490 " +
  "H 872 Q 880 490 880 482 V 33 Q 880 25 888 25 " +
  "H 1192 Q 1200 25 1200 33 V 482 Q 1200 490 1208 490 H 1440";

/** Position des cadres, en pourcentages du MÊME repère. */
const CADRES = [
  { gauche: "6.25%", haut: "26.92%" },
  { gauche: "28.47%", haut: "11.54%" },
  { gauche: "50.69%", haut: "26.92%" },
  { gauche: "72.92%", haut: "11.54%" },
] as const;

const LARGEUR_CADRE = "20.83%";
const HAUTEUR_CADRE = "57.69%";

/** Perçages des bordures, toujours sur l'axe médian. */
const NOEUDS = [
  { cx: 240, cy: 440 },
  { cx: 240, cy: 140 },
  { cx: 560, cy: 60 },
  { cx: 560, cy: 360 },
  { cx: 880, cy: 440 },
  { cx: 880, cy: 140 },
  { cx: 1200, cy: 60 },
  { cx: 1200, cy: 360 },
] as const;

/**
 * Chorégraphie en DEUX temps, déclenchée à l'entrée de la section dans le
 * viewport (`whileInView`, une seule fois).
 *
 * 1. ENTREE — les 4 cadres, invisibles au repos, apparaissent en séquence
 *    (fondu + glissée, alternance haut/bas). Terminé vers 1 s.
 * 2. FLUX — une fois les cadres en place (`FLUX_DELAI`), le trait se dessine
 *    de gauche à droite (2.6 s) et serpente à travers les cadres. Le front
 *    atteint le centre de chaque cadre à ~0.35 / 0.95 / 1.58 / 2.19 s après le
 *    départ du flux.
 *
 * ILLUM — au passage du front, le cadre s'allume puis S'ÉTEINT dès que le flux
 * le quitte (pic bref calé sur le centre, aucune lueur résiduelle).
 */
const FLUX_DELAI = 0.9;
const ENTREE_DELAIS = [0.0, 0.15, 0.3, 0.45] as const;
const ENTREE_DIR = [30, -30, 30, -30] as const; // +y = arrive du bas, -y = du haut
// FLUX_DELAI + centre du cadre − demi-pulse (0.3) → pic calé sur le passage.
const ILLUM_DELAIS = [0.95, 1.55, 2.18, 2.79] as const;

/* Tailles indexées sur la largeur d'écran, comme le repère SVG. */
const PADDING_CADRE = "clamp(1rem, 1.7vw, 2.125rem)";
const TAILLE_TITRE = "clamp(1.0625rem, 2.1vw, 2rem)";
const TAILLE_TEXTE = "clamp(0.6875rem, 0.95vw, 0.9375rem)";
const ECART_TITRE_TEXTE = "clamp(0.75rem, 1.15vw, 1.5rem)";

function ContenuCadre({ domaine }: { domaine: Domaine }) {
  return (
    <>
      <h2
        className="whitespace-pre-line font-display font-light leading-[1.12] tracking-tight text-papier"
        style={{ fontSize: TAILLE_TITRE }}
      >
        {domaine.titre}
      </h2>

      <p
        className="font-light leading-[1.6] text-papier/60"
        style={{ fontSize: TAILLE_TEXTE, marginTop: ECART_TITRE_TEXTE }}
      >
        {domaine.description}
      </p>
    </>
  );
}

export default function FluxCompetences() {
  const reduceMotion = useReducedMotion();

  // Le tracé (net + halos) se dessine par pathLength UNIQUEMENT, APRÈS l'entrée
  // des cadres (`FLUX_DELAI`). Le stroke est masqué (dashoffset plein) tant que
  // le front ne l'a pas atteint : aucune empreinte, aucun halo n'est visible
  // avant le passage. Les trois épaisseurs partagent la même animation → elles
  // se révèlent ensemble, en parfaite synchro (technique concentrique de la
  // home, zéro filtre SVG, zéro flicker).
  const traitAnime = reduceMotion
    ? { initial: false as const }
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, amount: 0.55 as const },
        transition: {
          duration: 2.6,
          ease: [0.4, 0, 0.2, 1] as const,
          delay: FLUX_DELAI,
        },
      };

  // Entrée d'un cadre : invisible → glisse à sa place. Direction et délai
  // passés par le cadre (alternance haut/bas, calé avant le passage du flux).
  const entreeCadre = (index: number): MotionProps =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: ENTREE_DIR[index] },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.55 as const },
          transition: {
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1] as const,
            delay: ENTREE_DELAIS[index],
          },
        };

  // Illumination d'un cadre : contour éteint → pic orange bref AU PASSAGE du
  // flux → ÉTEINT dès que le flux le quitte. Un seul voile qui monte puis
  // retombe à zéro (les deux côtés s'allument en même temps, pas de tour
  // complet, aucune lueur résiduelle).
  const illumCadre = (index: number): MotionProps =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0 },
          whileInView: { opacity: [0, 1, 0] },
          viewport: { once: true, amount: 0.55 as const },
          transition: {
            duration: 0.6,
            delay: ILLUM_DELAIS[index],
            times: [0, 0.5, 1] as const,
            ease: "easeInOut" as const,
          },
        };

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/*  Ordinateur — pleine largeur, le fil traverse l'écran             */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="relative left-1/2 hidden w-screen -translate-x-1/2 lg:block"
        style={{ aspectRatio: "1440 / 520" }}
      >
        <svg
          viewBox="0 0 1440 520"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full"
        >
          {/* Halo large — révélé par le front, jamais avant */}
          <motion.path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={9}
            opacity={0.1}
            strokeLinecap="round"
            {...traitAnime}
          />
          {/* Halo moyen */}
          <motion.path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={5}
            opacity={0.18}
            strokeLinecap="round"
            {...traitAnime}
          />
          {/* Trait net */}
          <motion.path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeLinecap="round"
            {...traitAnime}
          />
        </svg>

        {DOMAINES.map((domaine, index) => (
          <motion.article
            key={domaine.titre}
            className="absolute z-10 flex flex-col justify-center border border-mine bg-black"
            style={{
              left: CADRES[index].gauche,
              top: CADRES[index].haut,
              width: LARGEUR_CADRE,
              height: HAUTEUR_CADRE,
              padding: PADDING_CADRE,
            }}
            {...entreeCadre(index)}
          >
            {/* Voile d'illumination : s'allume au passage du flux puis
                s'éteint dès qu'il le quitte. Les deux côtés brillent en même
                temps, aucune lueur résiduelle. */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border"
              style={{
                borderColor: ACCENT,
                boxShadow: `0 0 22px 2px ${ACCENT}66, inset 0 0 26px ${ACCENT}22`,
              }}
              {...illumCadre(index)}
            />
            <ContenuCadre domaine={domaine} />
          </motion.article>
        ))}

        {/* Nœuds au-dessus des cadres, sinon la bordure les recouvre */}
        <svg
          viewBox="0 0 1440 520"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        >
          {NOEUDS.map((noeud, i) => {
            // Nœud i → cadre floor(i/2) : il s'allume quand le flux traverse
            // ce cadre (perçage de la bordure au passage du courant).
            const cadre = Math.floor(i / 2);
            return (
              <motion.circle
                key={`${noeud.cx}-${noeud.cy}`}
                cx={noeud.cx}
                cy={noeud.cy}
                r={4}
                fill={ACCENT}
                initial={reduceMotion ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{
                  duration: 0.35,
                  delay: reduceMotion ? 0 : ILLUM_DELAIS[cadre] + 0.15,
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Mobile et tablette — rail vertical, cadres empilés               */}
      {/* ---------------------------------------------------------------- */}
      {/*
        Le rail ne flotte plus dans le vide : il ARRIVE du bord gauche de
        l'écran par un coude en haut, descend le long des cadres, puis REPART
        vers le bord droit par un coude en bas. Même principe que sur
        ordinateur — le fil traverse la page, il ne naît pas ici.

        Les coudes sont des boîtes dont on ne peint que deux bordures : la
        bordure haute + droite dessine « j'arrive de la gauche puis je
        descends », la bordure gauche + basse dessine « je descends puis je
        pars à droite ». Le rayon vit sur le coin correspondant. Zéro SVG,
        zéro JavaScript, et ça suit la hauteur réelle de la pile de cadres.

        `-left-6` / `-right-6` compensent exactement le `px-6` de la section :
        les deux extrémités atteignent donc le bord de l'écran.
      */}
      <div className="relative overflow-x-clip lg:hidden">
        {/* Émission */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-6 bottom-[6px] top-0 w-[calc(1.5rem+7px)] rounded-tr-[6px] border-r-[3px] border-t-[3px] border-orange-500/25 blur-[3px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 bottom-0 left-[7px] h-[6px] rounded-bl-[6px] border-b-[3px] border-l-[3px] border-orange-500/25 blur-[3px]"
        />

        {/* Trait plein */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-6 bottom-[6px] top-0 w-[calc(1.5rem+7px)] rounded-tr-[6px] border-r border-t border-orange-500/60"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 bottom-0 left-[7px] h-[6px] rounded-bl-[6px] border-b border-l border-orange-500/60"
        />

        <div className="flex flex-col gap-10 py-10 pl-12">
          {DOMAINES.map((domaine, index) => (
            <motion.article
              key={domaine.titre}
              className="relative flex flex-col border border-mine bg-black px-7 py-9"
              {...(reduceMotion
                ? { initial: false as const }
                : {
                    initial: { opacity: 0, y: ENTREE_DIR[index] },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.4 as const },
                    transition: {
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1] as const,
                      delay: (index % 2) * 0.08,
                    },
                  })}
            >
              <span
                aria-hidden="true"
                className="absolute -left-12 top-1/2 h-px w-12 bg-orange-500/60"
              />
              <span
                aria-hidden="true"
                className="absolute -left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-orange-500"
              />

              <h2 className="whitespace-pre-line font-display text-2xl font-light leading-[1.12] tracking-tight text-papier">
                {domaine.titre}
              </h2>

              <p className="mt-4 text-sm font-light leading-relaxed text-papier/60">
                {domaine.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  );
}
