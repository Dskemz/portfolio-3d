"use client";

import { useEffect, useRef, useState } from "react";

const stages = [
  ["M3D STUDIO", "Créateur de solutions 3D virtuelles et interactives. Nous transformons la manière dont les marques présentent leurs produits et services."],
  ["NOS SOLUTIONS", "Trois produits pour construire, présenter et déployer des expériences 3D universelles."],
  ["N3D MOTEUR", "Infrastructure graphique universelle : visualiseur 3D, studio, générateur et système de variantes. Configurable et prête pour la production."],
  ["N3D STUDIO", "Photo 4K, vidéo 3D, export en temps réel et vues éclatées. Un studio virtuel construit sur mesure pour vos besoins, de la transformation de produits bruts jusqu’aux contenus premium."],
  ["NOTRE VISION", "M3D Studio est un studio de création spécialisé dans les expériences interactives 3D. Fondé sur l’expertise en modélisation 3D haute-fidélité et rendu Babylon.js, nous concevons des expériences interactives clé en main pour le retail, les musées, l’industrie et tout autre domaine souhaitant repousser les limites de l’interaction."],
  ["BABYLON.JS", "Nous avons choisi Babylon.js pour concevoir des expériences 3D performantes et accessibles directement depuis votre navigateur."],
  ["EXPERTISE GLTF / GLB", "Forts de dix années d’expertise dans les formats glTF et GLB, nous créons des expériences 3D précises et adaptées à chaque projet."],
  ["PROJET SUR MESURE", "Une expérience 3D pensée autour de vos produits, de vos usages et de vos objectifs, du concept jusqu’à la mise en ligne."],
] as const;
const geometry = [
  [360, 520, 0, 0], [780, 260, 260, -160], [420, 620, -180, 80],
  [900, 300, 80, -20], [520, 520, 250, 120], [760, 380, -260, 40],
  [440, 600, 140, -40], [980, 500, 0, 0],
] as const;

const highlightTermsByTitle: Record<string, string[]> = {
  "M3D STUDIO": ["solutions 3D virtuelles et interactives", "produits et services"],
  "NOS SOLUTIONS": ["construire", "présenter", "déployer", "expériences 3D universelles"],
  "N3D MOTEUR": ["visualiseur 3D", "studio", "générateur", "variantes", "production"],
  "N3D STUDIO": ["Photo 4K", "vidéo 3D", "temps réel", "vues éclatées", "contenus premium"],
  "NOTRE VISION": ["expériences interactives 3D", "Babylon.js", "retail", "musées", "industrie", "tout autre domaine"],
  "BABYLON.JS": ["Babylon.js", "expériences 3D performantes", "navigateur"],
  "EXPERTISE GLTF / GLB": ["glTF", "GLB", "expériences 3D", "sur mesure"],
  "PROJET SUR MESURE": ["produits", "usages", "objectifs", "mise en ligne"],
};

const highlightTerms = (text: string, title: string) => {
  const terms = highlightTermsByTitle[title] ?? [];
  if (!terms.length) return text;
  const pattern = new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")).join("|")})`, "gi");
  const exactPattern = new RegExp(`^(?:${terms.map(term => term.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")).join("|")})$`, "i");
  return text.split(pattern).map((part, index) => exactPattern.test(part)
    ? <span key={`${part}-${index}`} className="text-[#ff6a3d]">{part}</span>
    : part);
};

function Motif({ step, revision }: { step: number; revision: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const previous = useRef(step);
  const animation = useRef<number>(0);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const width = window.innerWidth, height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = width * ratio; canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const from = 4.25 + previous.current * .12, to = 4.25 + step * .12;
    const noiseFrom = 4.25 + previous.current * 1.1 + Math.max(0, revision - 1) * 2.7;
    const noiseTo = 4.25 + step * 1.1 + revision * 2.7;
    const start = performance.now();
    const fromFrame = geometry[previous.current];
    const toFrame = geometry[step];
    cancelAnimationFrame(animation.current);
    const draw = (now: number) => {
      const p = Math.min(1, (now - start) / 760);
      const eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const phase = from + (to - from) * eased;
      const noisePhase = noiseFrom + (noiseTo - noiseFrom) * eased;
      const cx = width * .5, cy = height * .5;
      const currentFrame = fromFrame.map((value, index) => value + (toFrame[index] - value) * eased) as [number, number, number, number];
      const compactScale = height < 760 ? height / 1200 : 1;
      const rowSpacing = Math.min(8.2, height * .24 / 52);
      const lineFieldHalfHeight = 52 * rowSpacing;
      const frameFitScale = Math.min(
        1,
        width * .78 / Math.max(currentFrame[0], 1),
        lineFieldHalfHeight * 2 / Math.max(currentFrame[1], 1),
      );
      const layoutScale = Math.min(1, width / 1100, compactScale, frameFitScale);
      const frameScale = layoutScale * (2 / 3);
      const scaledFrame = currentFrame.map(value => value * frameScale) as [number, number, number, number];
      const responsiveFrame: [number, number, number, number] = [
        scaledFrame[0],
        scaledFrame[1],
        Math.max(-width / 2 + scaledFrame[0] / 2, Math.min(width / 2 - scaledFrame[0] / 2, scaledFrame[2])),
        Math.max(-lineFieldHalfHeight + scaledFrame[1] / 2, Math.min(lineFieldHalfHeight - scaledFrame[1] / 2, scaledFrame[3])),
      ];
      const responsiveLineWidth = Math.max(1.6, 2.8 * layoutScale);
      const responsiveBlur = Math.max(1.25, 2.5 * layoutScale);
      context.clearRect(0, 0, width, height);
      const drawLines = (strokeStyle = "rgba(218,228,231,.88)", lineWidth = responsiveLineWidth) => {
        context.lineCap = "round"; context.lineJoin = "round";
        context.strokeStyle = strokeStyle; context.lineWidth = lineWidth;
        const [frameWidth, frameHeight, frameX, frameY] = responsiveFrame;
        const frameLeft = cx + frameX - frameWidth / 2;
        const frameRight = cx + frameX + frameWidth / 2;
        const frameTop = cy + frameY - frameHeight / 2;
        const frameBottom = cy + frameY + frameHeight / 2;
        for (let row = -52; row <= 52; row += 2) {
          const base = cy + row * rowSpacing;
          context.beginPath();
          for (let x = -50; x <= width + 50; x += .5) {
            const nx = (x - cx) / width;
            const localNx = (x - (cx + frameX)) / Math.max(frameWidth, 1);
            // LOCKED BASE NOISE: full inside the frame, fades continuously to the screen edges.
            const fadeOutside = (value: number, start: number, end: number, min: number, max: number) => {
              if (value >= start && value <= end) return 1;
              const distance = value < start ? start - value : value - end;
              const available = value < start ? start - min : max - end;
              const amount = Math.max(0, Math.min(1, 1 - distance / Math.max(available, 1)));
              return amount * amount * (3 - 2 * amount);
            };
            const selectionFade = fadeOutside(x, frameLeft, frameRight, 0, width)
              * fadeOutside(base, frameTop, frameBottom, 0, height);
            const broadWave = Math.sin(nx * 3.6 + phase + row * .018) * 24;
            const secondaryWave = Math.sin(nx * 6.2 - phase * .32 + row * .035) * 15;
            const warpedX = localNx * 1.7
              + Math.sin(localNx * 1.15 + row * .055 + noisePhase) * .72
              + Math.sin(localNx * .55 - row * .035 - noisePhase * .6) * .28;
            const localNoise = (
              Math.sin(warpedX + row * .045 + noisePhase * .35) * .7
              + Math.sin(warpedX * 1.9 - row * .025 - noisePhase * .2) * .3
            ) * 56 * selectionFade;
            const secondaryWarp = localNx * 2.35
              + Math.sin(localNx * .72 - row * .08 + noisePhase * 1.4) * .45;
            const secondaryNoise = (
              Math.sin(secondaryWarp + row * .13 + noisePhase * .7) * .65
              + Math.cos(secondaryWarp * 1.6 - row * .06 - noisePhase * .4) * .35
            ) * 36 * selectionFade;
            const lineY = base - broadWave - secondaryWave - localNoise - secondaryNoise + row * row * .006;
            if (x === -50) context.moveTo(x, lineY); else context.lineTo(x, lineY);
          }
          context.stroke();
        }
      };
      context.filter = `blur(${responsiveBlur}px)`;
      drawLines();
      context.filter = "none";
      if (p < 1) animation.current = requestAnimationFrame(draw); else previous.current = step;
    };
    animation.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animation.current);
  }, [step]);
  return <canvas ref={ref} className="absolute inset-0 h-screen w-screen" />;
}

export default function AboutExperience() {
  const [step, setStep] = useState(0); const [revision, setRevision] = useState(0); const [released, setReleased] = useState(false); const busy = useRef(false);
  useEffect(() => {
    document.documentElement.style.overflow = released ? "" : "hidden"; document.body.style.overflow = released ? "" : "hidden";
    if (!released) window.scrollTo(0, 0);
    const onWheel = (event: WheelEvent) => {
      if (released) {
        if (event.deltaY >= 0) return;
        event.preventDefault();
        if (busy.current) return;
        busy.current = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
        const started = performance.now();
        const waitForTop = (now: number) => {
          if (window.scrollY <= 2 || now - started > 1800) {
            setReleased(false);
            setRevision(value => value + 1);
            setStep(stages.length - 1);
            busy.current = false;
            return;
          }
          window.requestAnimationFrame(waitForTop);
        };
        window.requestAnimationFrame(waitForTop);
        return;
      }
      event.preventDefault(); if (busy.current) return; busy.current = true;
      const next = step + (event.deltaY > 0 ? 1 : -1);
      if (next >= stages.length) { setReleased(true); window.setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100); } else { setRevision(value => value + 1); setStep(Math.max(0, next)); }
      window.setTimeout(() => { busy.current = false; }, 820);
    };
    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => { touchStartY = event.touches[0]?.clientY ?? 0; };
    const onTouchEnd = (event: TouchEvent) => {
      const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
      const deltaY = touchEndY - touchStartY;
      if (Math.abs(deltaY) < 40) return;
      if (released) {
        if (deltaY <= 0 || busy.current) return;
        event.preventDefault(); busy.current = true; window.scrollTo({ top: 0, behavior: "smooth" });
        window.setTimeout(() => { setReleased(false); setRevision(value => value + 1); setStep(stages.length - 1); busy.current = false; }, 820);
        return;
      }
      event.preventDefault(); if (busy.current) return; busy.current = true;
      const next = step + (deltaY < 0 ? 1 : -1);
      if (next >= stages.length) { setReleased(true); window.setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100); } else { setRevision(value => value + 1); setStep(Math.max(0, next)); }
      window.setTimeout(() => { busy.current = false; }, 820);
    };
    const onTouchMove = (event: TouchEvent) => { if (!released) event.preventDefault(); };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => { window.removeEventListener("wheel", onWheel); window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); window.removeEventListener("touchmove", onTouchMove); document.documentElement.style.overflow = ""; document.body.style.overflow = ""; };
  }, [released, step]);
  const [stageTitle, stageText] = stages[step];
  return <main className="min-h-screen bg-[#090c11] text-white"><div className="relative flex h-screen flex-col overflow-hidden px-5 py-6 sm:px-10 lg:px-16">
    <header className="relative z-30 flex justify-between font-mono text-[10px] uppercase tracking-[.2em] text-white/50"><span>M3D STUDIO</span></header>
    <div className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex lg:right-10" aria-label="Progression des étapes">
      <div className="absolute top-2 bottom-2 w-px bg-white/15" />
      {stages.map((_, index) => <span key={index} className={`relative z-10 h-1.5 w-1.5 rounded-full transition-all duration-500 ${index === step ? "scale-150 bg-[#ff6a3d] shadow-[0_0_10px_rgba(255,106,61,.8)]" : "bg-white/35"}`} />)}
    </div>
    <div className="absolute inset-0 z-10 flex items-center justify-center"><div className="pointer-events-none absolute inset-0"><Motif step={step} revision={revision} /></div>
      <div className="about-v7-info absolute left-1/2 top-1/2 z-20 h-[360px] w-[92vw] -translate-x-1/2 -translate-y-1/2 px-8 py-8 sm:h-[300px] sm:w-[min(86vw,960px)]"><div className="grid h-full grid-cols-1 gap-6 font-mono sm:grid-cols-2 sm:gap-0"><div className="flex items-center justify-center border-r-0 pr-0 text-center sm:border-r sm:border-white/50 sm:pr-8"><h1 className={`font-display max-w-full font-semibold uppercase leading-none ${stageTitle.length > 8 ? "text-[clamp(1.4rem,6vw,3.2rem)]" : "text-[clamp(1.7rem,8vw,4rem)]"} max-[760px]:text-[clamp(1.5rem,6vw,3rem)]`}>{stageTitle}</h1></div><div className="flex items-center justify-center pl-0 text-center sm:pl-8"><p className={`max-w-xl text-white ${stageText.length > 180 ? "text-xs leading-5 sm:text-sm sm:leading-6" : "text-sm leading-6 sm:text-base"} max-[760px]:text-xs max-[760px]:leading-5`}>{highlightTerms(stageText, stageTitle)}</p></div></div></div>
    </div>
  </div></main>;
}
