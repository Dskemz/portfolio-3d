"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  /** Décalage vertical initial, en px. */
  decalage?: number;
  /** Retard avant l'animation, en ms. */
  delai?: number;
  /** Anime chaque enfant direct l'un après l'autre. */
  cascade?: boolean;
  className?: string;
}

/**
 * Apparition au scroll, fondu et légère montée.
 *
 * API identique à la version précédente : les composants appelants n'ont
 * pas à changer.
 *
 * L'accessibilité passe par `gsap.matchMedia()` plutôt que par une lecture
 * ponctuelle de matchMedia. GSAP réévalue la condition si l'utilisateur
 * modifie son réglage système en cours de session, et défait proprement
 * les animations devenues hors contexte.
 */
export function Reveal({
  children,
  decalage = 24,
  delai = 0,
  cascade = false,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mm = gsap.matchMedia();

    // Mouvement autorisé : fondu + montée.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cibles = cascade
        ? (Array.from(element.children) as HTMLElement[])
        : [element];

      gsap.set(cibles, { opacity: 0, y: decalage });

      gsap.to(cibles, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: delai / 1000,
        ease: "power2.out",
        stagger: cascade ? 0.09 : 0,
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true,
        },
      });
    });

    // Mouvement réduit : le contenu est simplement visible, sans transition.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const cibles = cascade
        ? (Array.from(element.children) as HTMLElement[])
        : [element];
      gsap.set(cibles, { opacity: 1, y: 0, clearProps: "transform" });
    });

    return () => mm.revert();
  }, [decalage, delai, cascade]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  /** Amplitude du décalage. 0.05 = discret, 0.2 = marqué. */
  intensite?: number;
  className?: string;
}

/**
 * Parallaxe liée au scroll.
 *
 * `scrub` confie la position de l'animation à ScrollTrigger : plus de
 * listener de scroll ni de rAF à gérer à la main, et le calcul reste
 * synchronisé avec le rafraîchissement de l'écran.
 *
 * Désactivée sous 768 px : sur un écran étroit l'effet se voit à peine et
 * le coût de calcul au scroll ne se justifie pas.
 */
export function Parallax({
  children,
  intensite = 0.08,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
      () => {
        const amplitude = element.offsetHeight * intensite;

        gsap.fromTo(
          element,
          { y: amplitude },
          {
            y: -amplitude,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }
    );

    return () => mm.revert();
  }, [intensite]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
