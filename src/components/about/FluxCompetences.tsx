/**
 * FluxCompetences — les quatre domaines traversés par le fil orange.
 *
 * Le tracé est ORTHOGONAL : uniquement des segments horizontaux et verticaux,
 * jamais de diagonale, avec un rayon de 6 unités sur chaque coude. Il démarre
 * hors cadre à gauche et sort hors cadre à droite : le flux ne commence pas ici
 * et ne s'arrête pas ici, il rappelle celui de la page d'accueil.
 *
 * Motif régulier : le fil entre par le BAS d'un cadre et ressort par le HAUT,
 * puis redescend dans le suivant par le HAUT et ressort par le BAS. Les cadres
 * sont en quinconce pour que chaque changement de niveau se justifie.
 *
 * Les cadres portent un fond OPAQUE identique à celui de la page : c'est ce qui
 * fait disparaître le fil derrière eux et le fait ressortir ailleurs. Sans ce
 * fond, le tracé traverserait bêtement le texte.
 *
 * Géométrie figée dans un viewBox normalisé (820 × 320) et cadres positionnés
 * en pourcentages du MÊME repère : les deux couches restent alignées à toutes
 * les largeurs, sans mesure DOM ni JavaScript.
 */

const ACCENT = "#FF7F50";

interface Domaine {
  numero: string;
  titre: string;
  description: string;
}

const DOMAINES: readonly Domaine[] = [
  {
    numero: "01",
    titre: "Visite\nvirtuelle",
    description:
      "Des espaces que l'on parcourt dans le navigateur, sans installation ni plugin.",
  },
  {
    numero: "02",
    titre: "Modélisation\n3D",
    description:
      "Des modèles haute fidélité, pensés pour rester légers sur le web.",
  },
  {
    numero: "03",
    titre: "Temps réel\nweb",
    description:
      "Babylon.js, WebGL, intégration sur mesure. La technique disparaît.",
  },
  {
    numero: "04",
    titre: "Direction\nartistique",
    description:
      "Recherche de matières, d'éclairage et de cadrage. La lumière décide.",
  },
] as const;

/** Position des quatre cadres dans le repère du viewBox, en pourcentages. */
const CADRES = [
  { gauche: "3.66%", haut: "25%" },
  { gauche: "27.07%", haut: "15.63%" },
  { gauche: "50.49%", haut: "25%" },
  { gauche: "73.90%", haut: "15.63%" },
] as const;

const LARGEUR_CADRE = "21.46%";
const HAUTEUR_CADRE = "59.38%";

/** Le tracé, écrit une seule fois et réutilisé pour le halo et le trait plein. */
const TRACE =
  "M -30 310 H 39 Q 45 310 45 304 V 191 Q 45 185 51 185 H 124 Q 130 185 130 179 " +
  "V 36 Q 130 30 136 30 H 234 Q 240 30 240 36 V 149 Q 240 155 246 155 " +
  "H 319 Q 325 155 325 161 V 304 Q 325 310 331 310 H 424 Q 430 310 430 304 " +
  "V 191 Q 430 185 436 185 H 509 Q 515 185 515 179 V 36 Q 515 30 521 30 " +
  "H 614 Q 620 30 620 36 V 149 Q 620 155 626 155 H 699 Q 705 155 705 161 " +
  "V 304 Q 705 310 711 310 H 790";

/** Points de perçage des bordures — bas puis haut, en alternance. */
const NOEUDS = [
  { cx: 45, cy: 280 },
  { cx: 130, cy: 90 },
  { cx: 240, cy: 60 },
  { cx: 325, cy: 250 },
  { cx: 430, cy: 280 },
  { cx: 515, cy: 90 },
  { cx: 620, cy: 60 },
  { cx: 705, cy: 250 },
] as const;

function ContenuCadre({ domaine }: { domaine: Domaine }) {
  return (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-trait">
        /{domaine.numero}
      </p>

      <h2 className="mt-5 whitespace-pre-line font-display text-xl font-light leading-[1.2] tracking-tight text-papier lg:text-2xl">
        {domaine.titre}
      </h2>

      <p className="mt-4 text-xs font-light leading-relaxed text-papier/60 lg:text-sm">
        {domaine.description}
      </p>
    </>
  );
}

export default function FluxCompetences() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/*  Ordinateur — flux horizontal, cadres en quinconce                */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="relative hidden w-full lg:block"
        style={{ aspectRatio: "820 / 320" }}
      >
        <svg
          viewBox="-30 10 820 320"
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full overflow-visible"
        >
          {/* Halo : élargit le trait sans filtre SVG, donc sans coût au scroll */}
          <path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={7}
            opacity={0.13}
            strokeLinecap="round"
          />
          <path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </svg>

        {DOMAINES.map((domaine, index) => (
          <article
            key={domaine.numero}
            className="absolute z-10 flex flex-col border border-mine bg-black px-6 py-6"
            style={{
              left: CADRES[index].gauche,
              top: CADRES[index].haut,
              width: LARGEUR_CADRE,
              height: HAUTEUR_CADRE,
            }}
          >
            <ContenuCadre domaine={domaine} />
          </article>
        ))}

        {/* Nœuds au-dessus des cadres : ils doivent rester visibles sur la bordure */}
        <svg
          viewBox="-30 10 820 320"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
        >
          {NOEUDS.map((noeud) => (
            <circle
              key={`${noeud.cx}-${noeud.cy}`}
              cx={noeud.cx}
              cy={noeud.cy}
              r={2.8}
              fill={ACCENT}
            />
          ))}
        </svg>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Mobile et tablette — rail vertical à gauche, cadres empilés      */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative lg:hidden">
        {/* Rail : s'arrête au dernier cadre, il ne pend pas dans le vide */}
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-0 bottom-24 w-px bg-orange-500/45"
        />

        <div className="flex flex-col gap-8 pl-10">
          {DOMAINES.map((domaine) => (
            <article
              key={domaine.numero}
              className="relative flex flex-col border border-mine bg-black px-6 py-6"
            >
              {/* Dérivation courte du rail vers le cadre + nœud sur la bordure */}
              <span
                aria-hidden="true"
                className="absolute -left-10 top-9 h-px w-10 bg-orange-500/45"
              />
              <span
                aria-hidden="true"
                className="absolute -left-[3px] top-[33px] h-1.5 w-1.5 rounded-full bg-orange-500"
              />

              <ContenuCadre domaine={domaine} />
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
