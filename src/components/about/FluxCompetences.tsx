"use client";

/**
 * FluxCompetences — les quatre domaines, reliés par un fil orange qui SE DESSINE
 * au scroll et fait le TOUR de chaque cadre.
 *
 * Concept (demande de D, juillet 2026) :
 *  - le fil part du bord GAUCHE de l'écran et ressort au bord DROIT ;
 *  - il ne saute jamais un cadre : arrivé à un cadre, il se DÉDOUBLE en deux
 *    branches symétriques qui épousent le contour (gauche + droite EN MÊME
 *    TEMPS), se rejoignent de l'autre côté, puis le fil continue sa route ;
 *  - tout se trace progressivement quand la section entre dans le viewport
 *    (`whileInView` + `pathLength`), rappel de la home et du portfolio ;
 *  - les cadres eux-mêmes font partie de l'animation (apparition au scroll).
 *
 * PLEINE LARGEUR : le bloc sort de son conteneur (`left-1/2 w-screen
 * -translate-x-1/2`) pour toucher les deux bords de l'écran.
 *
 * Repère commun tracé + cadres : 1440 × 520.
 *  - Couloir horizontal du fil : y = 210 (centre vertical des cadres).
 *  - Axes médians des cadres : x = 240, 560, 880, 1200.
 *  - Chaque cadre : 300 de large, 300 de haut. Bords G/D à ±150 de l'axe.
 */

import { motion, useReducedMotion } from "framer-motion";

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

/* Géométrie du repère 1440 × 520. */
const AXES = [240, 560, 880, 1200] as const;
const COULOIR = 210; // y du fil horizontal (centre des cadres)
const DEMI_L = 150; // demi-largeur du cadre
const DEMI_H = 150; // demi-hauteur du cadre
const HAUT = COULOIR - DEMI_H; // bord haut du cadre (60)
const BAS = COULOIR + DEMI_H; // bord bas du cadre (360)
const R = 14; // rayon des arrondis

/* Cadres en pourcentages du même repère (300×300 dans 1440×520). */
const LARGEUR_CADRE = `${(300 / 1440) * 100}%`; // 20.83%
const HAUTEUR_CADRE = `${(300 / 520) * 100}%`; // 57.69%
const CADRES = AXES.map((ax) => ({
  gauche: `${((ax - DEMI_L) / 1440) * 100}%`,
  haut: `${(HAUT / 520) * 100}%`,
}));

/**
 * SEGMENTS DROITS du fil, entre les cadres, sur le couloir y=210.
 * Premier : bord gauche écran → bord gauche du 1er cadre.
 * Intermédiaires : bord droit cadre N → bord gauche cadre N+1.
 * Dernier : bord droit du 4e cadre → bord droit écran.
 */
const SEGMENTS: string[] = [];
SEGMENTS.push(`M 0 ${COULOIR} H ${AXES[0] - DEMI_L}`);
for (let i = 0; i < AXES.length - 1; i++) {
  SEGMENTS.push(`M ${AXES[i] + DEMI_L} ${COULOIR} H ${AXES[i + 1] - DEMI_L}`);
}
SEGMENTS.push(`M ${AXES[AXES.length - 1] + DEMI_L} ${COULOIR} H 1440`);

/**
 * CONTOUR d'un cadre : deux branches symétriques de l'entrée (bord gauche, sur
 * le couloir) à la sortie (bord droit, sur le couloir). Branche HAUTE par le
 * dessus, branche BASSE par le dessous. Elles se tracent EN MÊME TEMPS →
 * « le fil fait le tour par la droite et par la gauche à la fois ».
 */
function contourCadre(ax: number) {
  const gx = ax - DEMI_L;
  const dx = ax + DEMI_L;
  const entree = `${gx} ${COULOIR}`;
  const sortie = `${dx} ${COULOIR}`;

  const haute =
    `M ${entree} ` +
    `V ${HAUT + R} Q ${gx} ${HAUT} ${gx + R} ${HAUT} ` +
    `H ${dx - R} Q ${dx} ${HAUT} ${dx} ${HAUT + R} ` +
    `L ${sortie}`;

  const basse =
    `M ${entree} ` +
    `V ${BAS - R} Q ${gx} ${BAS} ${gx + R} ${BAS} ` +
    `H ${dx - R} Q ${dx} ${BAS} ${dx} ${BAS - R} ` +
    `L ${sortie}`;

  return { haute, basse };
}

const CONTOURS = AXES.map(contourCadre);

/** Durée d'un tronçon (s). Le suivant démarre quand le précédent finit. */
const PAS = 0.5;

/* Nœuds aux points d'entrée / sortie de chaque cadre. */
const NOEUDS = AXES.flatMap((ax) => [
  { cx: ax - DEMI_L, cy: COULOIR },
  { cx: ax + DEMI_L, cy: COULOIR },
]);

/* Tailles indexées sur la largeur d'écran. */
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

  const traceProps = (delai: number, duree = PAS) =>
    reduceMotion
      ? { initial: false as const, animate: { pathLength: 1, opacity: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: 0.35 as const },
          transition: {
            pathLength: { duration: duree, ease: [0.4, 0, 0.2, 1] as const, delay: delai },
            opacity: { duration: 0.15, delay: delai },
          },
        };

  const cadreProps = (index: number) => {
    const delai = index * 2 * PAS + PAS * 0.5;
    return reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.35 as const },
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const, delay: delai },
        };
  };

  const noeudProps = (delai: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, scale: 1 } }
      : {
          initial: { opacity: 0, scale: 0 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, amount: 0.35 as const },
          transition: { duration: 0.3, ease: "easeOut" as const, delay: delai },
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
          <defs>
            <filter id="emission-flux" x="-5%" y="-40%" width="110%" height="180%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <g strokeLinecap="round" fill="none">
            {/* Émission : tout le parcours, apparition en opacité seulement */}
            <motion.path
              d={[...SEGMENTS, ...CONTOURS.flatMap((c) => [c.haute, c.basse])].join(" ")}
              stroke={ACCENT}
              strokeWidth={5}
              filter="url(#emission-flux)"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4 }}
            />

            {/* Tracé net, tronçon par tronçon (gauche → droite) */}
            {SEGMENTS.map((d, i) => {
              const delai = i * 2 * PAS;
              return (
                <motion.path
                  key={`seg-${i}`}
                  d={d}
                  stroke={ACCENT}
                  strokeWidth={2.5}
                  {...traceProps(delai)}
                />
              );
            })}

            {CONTOURS.map((c, i) => {
              const delai = (i * 2 + 1) * PAS;
              return (
                <g key={`contour-${i}`}>
                  <motion.path
                    d={c.haute}
                    stroke={ACCENT}
                    strokeWidth={2.5}
                    {...traceProps(delai)}
                  />
                  <motion.path
                    d={c.basse}
                    stroke={ACCENT}
                    strokeWidth={2.5}
                    {...traceProps(delai)}
                  />
                </g>
              );
            })}
          </g>
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
            {...cadreProps(index)}
          >
            <ContenuCadre domaine={domaine} />
          </motion.article>
        ))}

        {/* Nœuds au-dessus des cadres */}
        <svg
          viewBox="0 0 1440 520"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        >
          {NOEUDS.map((noeud, i) => {
            const cadreIndex = Math.floor(i / 2);
            const estEntree = i % 2 === 0;
            const delai = estEntree
              ? cadreIndex * 2 * PAS + PAS * 0.9
              : (cadreIndex * 2 + 1) * PAS + PAS * 0.9;
            return (
              <motion.circle
                key={`${noeud.cx}-${noeud.cy}`}
                cx={noeud.cx}
                cy={noeud.cy}
                r={4}
                fill={ACCENT}
                {...noeudProps(delai)}
              />
            );
          })}
        </svg>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Mobile et tablette — rail vertical, cadres empilés               */}
      {/* ---------------------------------------------------------------- */}
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
          {DOMAINES.map((domaine) => (
            <article
              key={domaine.titre}
              className="relative flex flex-col border border-mine bg-black px-7 py-9"
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
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
