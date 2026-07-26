"use client";

/**
 * FluxServices — les trois atouts de l'offre, traversés par le fil électrique.
 * Même structure d'animation que /about (FluxCompetences) : au repos tout est
 * invisible ; à l'entrée dans le viewport les cadres apparaissent EN SÉQUENCE
 * (fondu + glissée, alternance haut/bas), PUIS le flux se dessine de gauche à
 * droite et serpente à travers eux. Au passage du courant, chaque cadre
 * s'illumine puis S'ÉTEINT dès que le flux le quitte. Accent #ed8936.
 *
 * Le tracé est ORTHOGONAL (coudes r=8) et entre/sort sur l'axe médian des
 * cadres ; le fond OPAQUE des cadres masque le segment interne → illusion du
 * courant qui traverse. Repère commun tracé + cadres : 1440 × 520, aucun JS de
 * mesure. Émission = 3 traits concentriques animés par le même `pathLength`
 * (zéro filtre SVG, zéro flicker).
 */

import { motion, useReducedMotion, type MotionProps } from "framer-motion";

const ACCENT = "#ed8936";

interface Service {
  titre: string;
  description: string;
}

const SERVICES: readonly Service[] = [
  {
    titre: "Écosystème tout-en-un",
    description:
      "Viewer haute performance et éditeur propriétaire intégré : vous maîtrisez votre contenu sans dépendre d'outils externes.",
  },
  {
    titre: "Contrôle total",
    description:
      "Intégration adaptée à votre charte graphique, hébergement sécurisé et support continu.",
  },
  {
    titre: "Déploiement simple",
    description:
      "Solution prête à vendre avec tous les outils nécessaires pour démarrer immédiatement.",
  },
] as const;

/**
 * Repère commun : 1440 × 520. Axes médians des cadres : 288, 720, 1152.
 * Couloirs horizontaux : 25 en haut, 490 en bas (hors de tous les cadres).
 * Le fil : entre en bas-gauche → monte dans le cadre 0 → couloir haut → descend
 * dans le cadre 1 → couloir bas → monte dans le cadre 2 → sort en haut-droite.
 */
const TRACE =
  "M 0 490 H 280 Q 288 490 288 482 V 33 Q 288 25 296 25 " +
  "H 712 Q 720 25 720 33 V 482 Q 720 490 728 490 " +
  "H 1144 Q 1152 490 1152 482 V 33 Q 1152 25 1160 25 H 1440";

/** Position des cadres, en pourcentages du MÊME repère. */
const CADRES = [
  { gauche: "9.583%", haut: "26.92%" },
  { gauche: "39.583%", haut: "11.54%" },
  { gauche: "69.583%", haut: "26.92%" },
] as const;

const LARGEUR_CADRE = "20.83%";
const HAUTEUR_CADRE = "57.69%";

/** Perçages des bordures, toujours sur l'axe médian (entrée + sortie). */
const NOEUDS = [
  { cx: 288, cy: 440 },
  { cx: 288, cy: 140 },
  { cx: 720, cy: 60 },
  { cx: 720, cy: 360 },
  { cx: 1152, cy: 440 },
  { cx: 1152, cy: 140 },
] as const;

// Chorégraphie en deux temps (voir /about). Le tracé dure 2.6 s ; le front
// atteint le centre des cadres à ~0.45 / 1.26 / 2.09 s après le départ du flux.
const FLUX_DELAI = 0.9;
const ENTREE_DELAIS = [0.0, 0.15, 0.3] as const;
const ENTREE_DIR = [30, -30, 30] as const; // +y = arrive du bas, -y = du haut
const ILLUM_DELAIS = [1.05, 1.86, 2.69] as const; // FLUX_DELAI + centre − 0.3

const PADDING_CADRE = "clamp(0.9rem, 1.5vw, 1.75rem)";
const TAILLE_TITRE = "clamp(1rem, 1.6vw, 1.5rem)";
const TAILLE_TEXTE = "clamp(0.6875rem, 0.85vw, 0.9rem)";
const ECART_TITRE_TEXTE = "clamp(0.6rem, 1vw, 1.1rem)";

function ContenuCadre({ service }: { service: Service }) {
  return (
    <>
      <h3
        className="font-display font-light leading-[1.14] tracking-tight text-papier"
        style={{ fontSize: TAILLE_TITRE }}
      >
        {service.titre}
      </h3>
      <p
        className="font-light leading-[1.55] text-papier/60"
        style={{ fontSize: TAILLE_TEXTE, marginTop: ECART_TITRE_TEXTE }}
      >
        {service.description}
      </p>
    </>
  );
}

export default function FluxServices() {
  const reduceMotion = useReducedMotion();

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
      {/* ================= DESKTOP — pleine largeur, fil traversant ========= */}
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

        {SERVICES.map((service, index) => (
          <motion.article
            key={service.titre}
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
            <ContenuCadre service={service} />
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

      {/* ================= MOBILE / TABLETTE — rail vertical ================ */}
      <div className="relative overflow-x-clip lg:hidden">
        {/* Émission (coudes) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-6 bottom-[6px] top-0 w-[calc(1.5rem+7px)] rounded-tr-[6px] border-r-[3px] border-t-[3px] blur-[3px]"
          style={{ borderColor: `${ACCENT}40` }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 bottom-0 left-[7px] h-[6px] rounded-bl-[6px] border-b-[3px] border-l-[3px] blur-[3px]"
          style={{ borderColor: `${ACCENT}40` }}
        />
        {/* Trait plein */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-6 bottom-[6px] top-0 w-[calc(1.5rem+7px)] rounded-tr-[6px] border-r border-t"
          style={{ borderColor: `${ACCENT}99` }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 bottom-0 left-[7px] h-[6px] rounded-bl-[6px] border-b border-l"
          style={{ borderColor: `${ACCENT}99` }}
        />

        <div className="flex flex-col gap-10 py-10 pl-12">
          {SERVICES.map((service, index) => (
            <motion.article
              key={service.titre}
              className="relative flex flex-col border border-mine bg-black px-7 py-8"
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
                className="absolute -left-12 top-1/2 h-px w-12"
                style={{ backgroundColor: `${ACCENT}99` }}
              />
              <span
                aria-hidden="true"
                className="absolute -left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              <h3 className="font-display text-xl font-light leading-[1.14] tracking-tight text-papier">
                {service.titre}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-papier/60">
                {service.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  );
}
