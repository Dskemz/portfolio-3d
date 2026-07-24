/**
 * FluxCompetences — les quatre domaines traversés par le fil orange.
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
 * Émission : un `feGaussianBlur` sur une copie du tracé, plus le trait plein
 * par-dessus. Le filtre est appliqué à un chemin unique et statique, il n'est
 * rastérisé qu'une fois.
 */

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
            <filter
              id="emission-flux"
              x="-5%"
              y="-15%"
              width="110%"
              height="130%"
            >
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          <path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={5}
            opacity={0.55}
            strokeLinecap="round"
            filter="url(#emission-flux)"
          />
          <path
            d={TRACE}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </svg>

        {DOMAINES.map((domaine, index) => (
          <article
            key={domaine.titre}
            className="absolute z-10 flex flex-col justify-center border border-mine bg-black"
            style={{
              left: CADRES[index].gauche,
              top: CADRES[index].haut,
              width: LARGEUR_CADRE,
              height: HAUTEUR_CADRE,
              padding: PADDING_CADRE,
            }}
          >
            <ContenuCadre domaine={domaine} />
          </article>
        ))}

        {/* Nœuds au-dessus des cadres, sinon la bordure les recouvre */}
        <svg
          viewBox="0 0 1440 520"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        >
          {NOEUDS.map((noeud) => (
            <circle
              key={`${noeud.cx}-${noeud.cy}`}
              cx={noeud.cx}
              cy={noeud.cy}
              r={4}
              fill={ACCENT}
            />
          ))}
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
