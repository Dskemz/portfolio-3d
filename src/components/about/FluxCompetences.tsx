"use client";

/**
 * FluxCompetences — les quatre domaines traversés par le fil orange.
 *
 * Le fil est INVISIBLE au repos et SE DESSINE une seule fois quand la section
 * entre dans le viewport (`whileInView` + `pathLength`). Les cadres apparaissent
 * D'ABORD en séquence (fondu + glissée, alternance haut/bas), PUIS le flux part
 * et serpente à travers eux ; au passage du courant chaque cadre s'illumine
 * puis S'ÉTEINT. Émission = 3 traits concentriques animés par le même
 * `pathLength` (zéro filtre SVG, zéro flicker). Tracé ORTHOGONAL (coudes r=8),
 * entrée/sortie sur l'axe médian → le segment interne, masqué par le fond opaque
 * des cadres, donne l'illusion du courant qui traverse.
 *
 * DESKTOP : repère fixe 1440×520, cadres positionnés en %. MOBILE : les cadres
 * sont empilés à hauteur variable, donc le fil est MESURÉ (offsetTop/Height,
 * insensibles aux transforms d'entrée) et serpente verticalement d'un cadre à
 * l'autre — même esprit que sur ordinateur, plus aucun trait parasite sur le
 * bord gauche.
 */

import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import RailMobile from "@/components/flux/RailMobile";

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

const FLUX_DELAI = 0.9;
const ENTREE_DELAIS = [0.0, 0.15, 0.3, 0.45] as const;
const ENTREE_DIR = [30, -30, 30, -30] as const; // +y = arrive du bas, -y = du haut
const ILLUM_DELAIS = [0.95, 1.55, 2.18, 2.79] as const;

const DUREE_TRACE = 2.6;

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

  const traitAnime = reduceMotion
    ? { initial: false as const }
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, amount: 0.55 as const },
        transition: {
          duration: DUREE_TRACE,
          ease: [0.4, 0, 0.2, 1] as const,
          delay: FLUX_DELAI,
        },
      };

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
          <motion.path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={9}
            opacity={0.1}
            strokeLinecap="round"
            {...traitAnime}
          />
          <motion.path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={5}
            opacity={0.18}
            strokeLinecap="round"
            {...traitAnime}
          />
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

        <svg
          viewBox="0 0 1440 520"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        >
          {NOEUDS.map((noeud, i) => {
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

      {/* Mobile et tablette — fil mesuré partagé (serpente + sort au bord) */}
      <RailMobile items={DOMAINES} accent={ACCENT} heading="h2" />
    </>
  );
}
