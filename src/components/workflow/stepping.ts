/**
 * Réglages et courbe de la navigation crantée (« QTE »), partagés entre le
 * parcours desktop (SkillFlow) et le parcours smartphone (SkillFlowMobile).
 *
 * Un seul endroit à toucher pour régler la vitesse ou la sensibilité.
 */

/** Durée de l'avancée d'une fiche à la suivante, en ms. C'est LE réglage de vitesse. */
export const STEP_MS = 1000;

/** Petit silence après l'animation avant d'accepter un nouveau cran (anti-rafale trackpad). */
export const STEP_COOLDOWN_MS = 140;

/** Molette : en dessous de ce delta, l'événement est ignoré (micro-inertie trackpad). */
export const WHEEL_MIN_DELTA = 2;

/** Seuil minimal de swipe (px) pour déclencher un cran. */
export const SWIPE_MIN_DELTA = 24;

/**
 * Hauteur (en fraction de viewport) à laquelle l'ancre de la 1re fiche déclenche
 * la visite guidée. Au-dessus : défilement libre, on peut empiler ce qu'on veut
 * dans l'accueil.
 */
export const INTRO_GRAB_VH = 0.95;

/** Ligne de front du flux dans le viewport. */
export const LINE_VH = 0.62;

/**
 * Courbe du cran, en coordonnées cubic-bézier [x1, y1, x2, y2] — même convention
 * que le CSS. Départ franc, freinage long : monte y1 et rapproche x1 de 0 pour
 * partir plus vite, tire x2 vers 0 pour freiner plus longtemps.
 */
export const STEP_BEZIER: [number, number, number, number] = [0.3, 0.72, 0.24, 1];

/** Solveur cubic-bézier (Newton-Raphson, repli par dichotomie). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;

  const calc = (t: number, a: number, b: number) =>
    ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t: number, a: number, b: number) =>
    3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = slope(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      t -= (calc(t, x1, x2) - x) / d;
    }

    if (t < 0 || t > 1) {
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 24; i++) {
        const v = calc(t, x1, x2);
        if (Math.abs(v - x) < 1e-5) break;
        if (v > x) hi = t;
        else lo = t;
        t = (lo + hi) / 2;
      }
    }

    return calc(t, y1, y2);
  };
}

export const STEP_EASE = cubicBezier(...STEP_BEZIER);

/**
 * Anime `window.scrollY` jusqu'à `target` avec la courbe de cran.
 * `behavior: "auto"` est indispensable : sans lui, le `scroll-behavior: smooth`
 * de globals.css superposerait son propre lissage à la courbe.
 *
 * Renvoie une fonction d'annulation.
 */
export function animateScrollTo(
  target: number,
  onDone: () => void
): () => void {
  const start = window.scrollY;
  const delta = target - start;
  const t0 = performance.now();
  let raf = 0;

  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / STEP_MS);
    window.scrollTo({ top: start + delta * STEP_EASE(p), behavior: "auto" });
    if (p < 1) {
      raf = requestAnimationFrame(tick);
      return;
    }
    raf = 0;
    onDone();
  };

  raf = requestAnimationFrame(tick);
  return () => {
    if (raf) cancelAnimationFrame(raf);
  };
}
