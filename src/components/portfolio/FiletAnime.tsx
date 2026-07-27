"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  // Enregistrée une seule fois : départ franc, longue décélération.
  if (!CustomEase.get("filet")) {
    CustomEase.create("filet", "0.16, 0.9, 0.3, 1");
  }
}

interface FiletAnimeProps {
  /** Position verticale du trait, en em, relative au titre (défaut : 0.7em). */
  top?: string;
}

/**
 * Filet lumineux animé au scroll — deux traits superposés (net orange + halo
 * flouté) partant de la fin du mot et s'étirant jusqu'au bord de l'écran.
 *
 * L'animation joue sur `scaleX` (origine à gauche) : aucun reflow, mouvement
 * fluide. Déclenchement au scroll via ScrollTrigger. Sous
 * `prefers-reduced-motion`, le trait est simplement présent, sans étirement.
 *
 * À placer dans un parent `relative inline-block` posé sur le mot final, comme
 * sur /contact.
 */
export function FiletAnime({ top = "0.7em" }: FiletAnimeProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hote = ref.current;
    if (!hote) return;

    const traits = Array.from(
      hote.querySelectorAll<HTMLElement>("[data-filet]")
    );
    const mm = gsap.matchMedia();

    // Mouvement autorisé : le trait s'étire de la typo vers le bord.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(traits, { transformOrigin: "left center", scaleX: 0 });

      gsap.to(traits, {
        scaleX: 1,
        duration: 1.4,
        delay: 0.35,
        // Départ franc puis relâchement long : dynamique sans être brusque.
        ease: "filet",
        scrollTrigger: {
          trigger: hote,
          start: "top 85%",
          once: true,
        },
      });
    });

    // Mouvement réduit : trait présent d'emblée, sans animation.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(traits, { scaleX: 1, clearProps: "transform" });
    });

    return () => mm.revert();
  }, []);

  return (
    <span ref={ref} aria-hidden="true">
      <span
        data-filet
        style={{ top }}
        className="absolute left-full ml-5 h-[3px] w-screen -translate-y-1/2 bg-orange-500/25 blur-[3px]"
      />
      <span
        data-filet
        style={{ top }}
        className="absolute left-full ml-5 h-px w-screen -translate-y-1/2 bg-orange-500"
      />
    </span>
  );
}
