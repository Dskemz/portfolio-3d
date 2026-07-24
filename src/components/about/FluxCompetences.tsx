/**
 * FluxCompetences — les quatre domaines traversés par le fil orange.
 *
 * Le tracé est ORTHOGONAL : uniquement des segments horizontaux et verticaux,
 * jamais de diagonale, avec un rayon de 6 unités sur chaque coude. Il part du
 * bord GAUCHE du repère et ressort au bord DROIT : le fil traverse la page, il
 * ne commence ni ne s'arrête ici. C'est le rappel du fil de la page d'accueil.
 *
 * Il entre et ressort TOUJOURS au milieu des cadres : l'entrée et la sortie
 * sont alignées sur l'axe vertical du cadre, donc le segment caché à
 * l'intérieur est une droite. Aucun décrochage parasite, le motif se lit comme
 * un signal carré régulier.
 *
 * Les cadres portent un fond OPAQUE identique à celui de la page : c'est ce qui
 * fait disparaître le fil derrière eux et le fait ressortir de l'autre côté.
 * Sans ce fond, le tracé traverserait le texte.
 *
 * Émission : TROIS passes du même tracé, de la plus large et la plus diffuse à
 * la plus fine et la plus dense. Aucun filtre SVG — un `feGaussianBlur` se
 * rastérise à chaque image au défilement, ce que trois traits ne font pas.
 *
 * Géométrie figée dans un viewBox normalisé (820 × 330) et cadres positionnés
 * en pourcentages du MÊME repère : les deux couches restent alignées à toutes
 * les largeurs, sans mesure DOM ni JavaScript.
 */

const ACCENT = "#FF7F50";

interface Domaine {
  titre: string;
  description: string;
}

const DOMAINES: readonly Domaine[] = [
  {
    titre: "Visite\nvirtuelle",
    description:
      "Des espaces que l'on parcourt dans le navigateur, sans installation ni plugin.",
  },
  {
    titre: "Modélisation\n3D",
    description:
      "Des modèles haute fidélité, pensés pour rester légers sur le web.",
  },
  {
    titre: "Temps réel\nweb",
    description:
      "Babylon.js, WebGL, intégration sur mesure. La technique disparaît.",
  },
  {
    titre: "Direction\nartistique",
    description:
      "Recherche de matières, d'éclairage et de cadrage. La lumière décide.",
  },
] as const;

/** Position des quatre cadres dans le repère du viewBox, en pourcentages. */
const CADRES = [
  { gauche: "3.66%", haut: "24.24%" },
  { gauche: "27.07%", haut: "15.15%" },
  { gauche: "50.49%", haut: "24.24%" },
  { gauche: "73.90%", haut: "15.15%" },
] as const;

const LARGEUR_CADRE = "21.46%";
const HAUTEUR_CADRE = "60.61%";

/**
 * Le tracé, écrit une seule fois et réutilisé par les trois passes.
 * Axes verticaux : 88, 280, 472, 664 — exactement le milieu de chaque cadre.
 * Couloirs horizontaux : 25 en haut, 315 en bas, hors de tous les cadres.
 */
const TRACE =
  "M -30 315 H 82 Q 88 315 88 309 V 31 Q 88 25 94 25 " +
  "H 274 Q 280 25 280 31 V 309 Q 280 315 286 315 " +
  "H 466 Q 472 315 472 309 V 31 Q 472 25 478 25 " +
  "H 658 Q 664 25 664 31 V 309 Q 664 315 670 315 H 790";

/** Points de perçage des bordures — toujours sur l'axe médian du cadre. */
const NOEUDS = [
  { cx: 88, cy: 285 },
  { cx: 88, cy: 85 },
  { cx: 280, cy: 55 },
  { cx: 280, cy: 255 },
  { cx: 472, cy: 285 },
  { cx: 472, cy: 85 },
  { cx: 664, cy: 55 },
  { cx: 664, cy: 255 },
] as const;

function ContenuCadre({ domaine }: { domaine: Domaine }) {
  return (
    <>
      <h2 className="whitespace-pre-line font-display text-2xl font-light leading-[1.15] tracking-tight text-papier xl:text-3xl">
        {domaine.titre}
      </h2>

      <p className="mt-6 text-sm font-light leading-relaxed text-papier/60">
        {domaine.description}
      </p>
    </>
  );
}

export default function FluxCompetences() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/*  Ordinateur — le fil traverse la page de bord à bord              */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="relative hidden w-full lg:block"
        style={{ aspectRatio: "820 / 330" }}
      >
        <svg
          viewBox="-30 5 820 330"
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full overflow-visible"
        >
          <path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={9}
            opacity={0.09}
            strokeLinecap="round"
          />
          <path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={4.5}
            opacity={0.22}
            strokeLinecap="round"
          />
          <path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>

        {DOMAINES.map((domaine, index) => (
          <article
            key={domaine.titre}
            className="absolute z-10 flex flex-col justify-center border border-mine bg-black px-8 py-10"
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
          viewBox="-30 5 820 330"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
        >
          {NOEUDS.map((noeud) => (
            <circle
              key={`${noeud.cx}-${noeud.cy}`}
              cx={noeud.cx}
              cy={noeud.cy}
              r={3}
              fill={ACCENT}
            />
          ))}
        </svg>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Mobile et tablette — rail vertical à gauche, cadres empilés      */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative lg:hidden">
        {/* Rail traversant : il déborde en haut et en bas comme sur ordinateur */}
        <span
          aria-hidden="true"
          className="absolute -top-16 bottom-[-4rem] left-[7px] w-px bg-orange-500/40"
        />
        <span
          aria-hidden="true"
          className="absolute -top-16 bottom-[-4rem] left-[5px] w-[5px] bg-orange-500/10"
        />

        <div className="flex flex-col gap-10 pl-12">
          {DOMAINES.map((domaine) => (
            <article
              key={domaine.titre}
              className="relative flex flex-col border border-mine bg-black px-8 py-10"
            >
              {/* Dérivation vers le milieu du cadre + nœud sur la bordure */}
              <span
                aria-hidden="true"
                className="absolute -left-12 top-1/2 h-px w-12 bg-orange-500/40"
              />
              <span
                aria-hidden="true"
                className="absolute -left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-orange-500"
              />

              <ContenuCadre domaine={domaine} />
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
