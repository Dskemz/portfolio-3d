"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";
import { PROJETS } from "@/content/projets";

/**
 * SommaireProjets — navigation « galerie d'art numérique » entre les projets.
 * ─────────────────────────────────────────────────────────────────────────
 * Remplace l'ancien CarrouselProjets (aperçus flous, molette captée) par une
 * mise en page split-screen inspirée des studios type Monogrid :
 *
 *   ┌───────────────────────────┬───────────────────────────────┐
 *   │  /01  ScanWatch 2 ────────│                               │
 *   │  /02  Salle de Bain       │        VISUEL GRAND FORMAT     │
 *   │  /03  Floofies            │        (crossfade au survol)   │
 *   │  …                        │                               │
 *   │  /11  Horlogerie          │   Catégorie · Client · Année  │
 *   └───────────────────────────┴───────────────────────────────┘
 *
 *   • À GAUCHE  : sommaire typographique numéroté /01 → /11. Le projet actif
 *     passe à l'orange de la DA, un trait fin se déploie, le numéro s'éclaire.
 *   • À DROITE  : le visuel du projet sélectionné + ses métadonnées, qui se
 *     mettent à jour en fondu (Framer Motion), sans rechargement.
 *
 * Interaction :
 *   • Desktop → SURVOL d'un titre = mise à jour immédiate du visuel.
 *   • Tactile → le TAP sélectionne (aucune dépendance au survol).
 *   • Le CLIC sur un titre (ou sur le visuel) ouvre la page projet /portfolio/[slug].
 *
 * Responsive :
 *   • ≥ lg  : split-screen deux colonnes, visuel collant (sticky).
 *   • < lg  : empilé — visuel en haut, sommaire dessous. Le tap pilote tout.
 *
 * Accessibilité :
 *   • Les titres sont des <button> focusables : focus clavier = sélection.
 *   • prefers-reduced-motion respecté (fondus neutralisés).
 *
 * INTÉGRATION DE VOS PROJETS :
 *   La liste vient de `src/content/projets.ts` (tableau PROJETS, déjà vos 11
 *   projets). Pour ajouter / retirer / réordonner, éditez ce fichier : le
 *   sommaire et les numéros /01…/NN se recalculent automatiquement.
 *   Chaque entrée utilise : titre, client, categorie, annee, resume,
 *   couverture (image hero) et slug (lien vers la page détail).
 */

/* Accent de la direction artistique — orange corail (cf. globals.css). */
const ACCENT = "#FF7F50";

/* Dégradé métal utilisé en repli quand un projet n'a pas d'image `couverture`. */
const REPLI_METAL =
  "linear-gradient(150deg, #1a1a1a 0%, #121212 45%, #0d0d0d 72%, #161616 100%)";

export default function SommaireProjets() {
  const reduit = useReducedMotion();

  /* Index du projet affiché à droite. Piloté par le survol (desktop) ou le
     tap (tactile). Démarre sur le premier projet. */
  const [actif, setActif] = useState(0);

  const projet = PROJETS[actif];

  /* Durée du fondu — nulle si l'utilisateur a demandé moins d'animation. */
  const duree = reduit ? 0 : 0.5;

  /* ── Colonne gauche calée sur la hauteur du visuel ────────────────────
     Le sommaire ne doit PAS s'étirer sur la hauteur de tous les projets :
     on mesure la hauteur du cadre visuel (droite) et on l'impose à la zone
     de défilement (gauche). Seuls ~3-4 titres restent visibles, le reste
     défile à la molette DANS la zone (overflow interne).

     La contrainte n'est active qu'à partir de `lg` : en dessous, le visuel
     est empilé au-dessus de la liste, il n'y a pas de vis-à-vis à aligner. */
  const cadreRef = useRef<HTMLAnchorElement | null>(null); // le cadre du visuel
  const zoneRef = useRef<HTMLDivElement | null>(null); // la zone scrollable gauche
  const [hauteur, setHauteur] = useState<number | null>(null);

  /* La contrainte de hauteur ne vaut qu'en desktop (≥ lg = 64rem). En
     dessous, le visuel est empilé au-dessus de la liste : aucune hauteur
     n'est imposée, la liste s'affiche entière. */
  const [estDesktop, setEstDesktop] = useState(false);

  /* Indices de fondu : y a-t-il du contenu masqué en haut / en bas ? */
  const [masqueHaut, setMasqueHaut] = useState(false);
  const [masqueBas, setMasqueBas] = useState(false);

  /* Suit le point de rupture lg via matchMedia (réévalué au resize). */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const sync = () => setEstDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Mesure de la hauteur du visuel, réévaluée à chaque redimensionnement.
     Le sommaire modifie la hauteur de la page APRÈS le montage (mesure +
     chargement des images) : on demande alors à ScrollTrigger de recalculer
     ses positions, sinon les animations au scroll situées PLUS BAS dans la
     page (ex. le filet du CTA « discutons-en ») gardent des coordonnées
     périmées et se déclenchent au mauvais moment — voire jamais. */
  useEffect(() => {
    const cadre = cadreRef.current;
    if (!cadre) return;

    let raf = 0;
    const mesurer = () => {
      setHauteur(cadre.offsetHeight);
      // Recalcule après le reflow, une fois la nouvelle hauteur appliquée.
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    mesurer();

    const ro = new ResizeObserver(mesurer);
    ro.observe(cadre);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  /* Recalcule les fondus (haut/bas) selon la position de scroll de la zone. */
  const majFondus = () => {
    const z = zoneRef.current;
    if (!z) return;
    const enHaut = z.scrollTop <= 1;
    const enBas = z.scrollTop + z.clientHeight >= z.scrollHeight - 1;
    setMasqueHaut(!enHaut);
    setMasqueBas(!enBas && z.scrollHeight > z.clientHeight);
  };

  /* Réévalue les fondus quand la hauteur ou le mode change (donc quand la
     zone devient — ou cesse d'être — contrainte et scrollable). */
  useEffect(() => {
    majFondus();
  }, [hauteur, estDesktop]);

  /* Quand le projet actif change (clavier notamment), on l'amène dans la
     zone visible s'il en sortait. */
  useEffect(() => {
    const z = zoneRef.current;
    if (!z) return;
    const item = z.querySelector<HTMLElement>(`[data-index="${actif}"]`);
    if (item) {
      item.scrollIntoView({
        block: "nearest",
        behavior: reduit ? "auto" : "smooth",
      });
    }
  }, [actif, reduit]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16 xl:gap-24">
      {/* ══════════════════════════════════════════════════════════════════
          VISUEL GRAND FORMAT (à DROITE en desktop, EN HAUT en mobile)
          ────────────────────────────────────────────────────────────────
          `order-first lg:order-last` : le visuel passe au-dessus du sommaire
          sur mobile, à droite sur grand écran. Le bloc est `sticky` en desktop
          pour rester en vue pendant qu'on parcourt la liste.
      ══════════════════════════════════════════════════════════════════ */}
      <div className="order-first lg:order-last">
        <div className="lg:sticky lg:top-28">
          {/* Cadre du visuel — ratio large, coins vifs (DA « plan technique »). */}
          <Link
            ref={cadreRef}
            href={`/portfolio/${projet.slug}`}
            className="group relative block aspect-video w-full overflow-hidden border border-graphite-700"
            aria-label={`Voir le projet ${projet.titre}`}
          >
            {/* Crossfade : chaque projet est un calque empilé ; seul l'actif est
                opaque. AnimatePresence gère l'entrée / sortie en fondu. */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={projet.slug}
                initial={{ opacity: 0, scale: reduit ? 1 : 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duree, ease: [0.22, 0.61, 0.36, 1] }}
                className="absolute inset-0"
              >
                {projet.couverture ? (
                  <Image
                    src={projet.couverture}
                    alt={projet.titre}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
                    priority={actif === 0}
                  />
                ) : (
                  /* Repli élégant si aucune image n'est fournie. */
                  <div
                    className="h-full w-full"
                    style={{ background: REPLI_METAL }}
                  />
                )}

                {/* Voile bas pour asseoir la lisibilité de l'éventuel overlay. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Halo orange discret au survol du cadre. */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                boxShadow: `inset 0 0 0 1px ${ACCENT}66, 0 0 40px -12px ${ACCENT}55`,
              }}
            />

            {/* Pastille « Voir le projet » révélée au survol. */}
            <span className="absolute bottom-4 right-4 flex items-center gap-2 border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm transition-colors duration-300 group-hover:border-[color:var(--accent)] group-hover:text-white"
              style={{ ["--accent" as string]: ACCENT }}
            >
              Voir le projet
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </Link>

          {/* ── Métadonnées, actualisées en fondu avec le visuel ─────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={projet.slug}
              initial={{ opacity: 0, y: reduit ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduit ? 0 : -8 }}
              transition={{ duration: duree * 0.8, ease: [0.22, 0.61, 0.36, 1] }}
              className="mt-6"
            >
              {/* Ligne catégorie · client · année, en mono, ton « fiche ». */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-trait">
                <span style={{ color: ACCENT }}>{projet.categorie}</span>
                <span aria-hidden="true" className="text-graphite-600">/</span>
                <span>{projet.client}</span>
                <span aria-hidden="true" className="text-graphite-600">/</span>
                <span>{projet.annee}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SOMMAIRE NUMÉROTÉ (à GAUCHE en desktop, DESSOUS en mobile)
          ────────────────────────────────────────────────────────────────
          En desktop, la zone est calée sur la HAUTEUR DU VISUEL : seuls
          ~3-4 titres sont visibles, le reste défile À LA MOLETTE dans la
          zone (overflow interne, sans allonger la page). Deux fondus
          (haut / bas) signalent qu'il reste des projets masqués.
      ══════════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Sommaire des projets"
        className="relative order-last lg:order-first"
      >
        {/* Fondu HAUT — visible seulement s'il reste des projets au-dessus.
            `pointer-events-none` pour ne pas bloquer le survol des titres. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-12 bg-gradient-to-b from-black to-transparent transition-opacity duration-300 lg:block"
          style={{ opacity: masqueHaut ? 1 : 0 }}
        />

        {/* Zone de défilement interne. En desktop, elle prend la hauteur
            mesurée du visuel → seuls ~3-4 titres visibles, molette pour la
            suite. En mobile, aucune hauteur imposée → liste entière empilée
            sous le visuel. */}
        <div
          ref={zoneRef}
          onScroll={majFondus}
          className="sommaire-scroll overflow-y-auto overscroll-contain lg:pr-1"
          style={{
            maxHeight:
              estDesktop && hauteur != null ? `${hauteur}px` : undefined,
          }}
        >
          <ul className="flex flex-col">
            {PROJETS.map((p, i) => {
              const estActif = i === actif;

              return (
                <li
                  key={p.slug}
                  data-index={i}
                  className="border-t border-graphite-700 last:border-b"
                >
                  <Link
                    href={`/portfolio/${p.slug}`}
                    /* Survol (desktop) et focus clavier = sélection.
                       Sur tactile, le premier tap déclenche onFocus/onMouseEnter
                       avant la navigation, ce qui met à jour le visuel. */
                    onMouseEnter={() => setActif(i)}
                    onFocus={() => setActif(i)}
                    className="group relative flex items-baseline py-5 outline-none md:py-6"
                  >
                    {/* Trait actif — filet orange qui se déploie à gauche. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                      style={{
                        background: ACCENT,
                        transform: estActif ? "scaleY(1)" : undefined,
                      }}
                    />

                    {/* Titre du projet — fin, bascule à l'orange quand actif.
                        Le retrait gauche (pl-4/6) dégage le filet orange. */}
                    <span
                      className="pl-4 font-display text-lg font-light leading-snug tracking-tight transition-colors duration-300 md:pl-6 md:text-2xl lg:text-[1.7rem]"
                      style={{ color: estActif ? ACCENT : undefined }}
                    >
                      <span
                        className={
                          estActif
                            ? ""
                            : "text-papier/85 group-hover:text-papier group-focus-visible:text-papier"
                        }
                      >
                        {p.titre}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Fondu BAS — visible tant qu'il reste des projets en dessous. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-12 bg-gradient-to-t from-black to-transparent transition-opacity duration-300 lg:block"
          style={{ opacity: masqueBas ? 1 : 0 }}
        />
      </nav>
    </div>
  );
}
