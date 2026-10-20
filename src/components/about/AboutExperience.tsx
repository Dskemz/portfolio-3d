"use client";

import { useEffect, useRef, useState } from "react";

const stages = [
  ["M3D STUDIO", "Créateur de solutions 3D universelles. Nous transformons la manière dont les marques présentent leurs produits et services à travers le moteur graphique N3D et l’écosystème PRISM."],
  ["NOS SOLUTIONS", "Trois produits pour construire, présenter et déployer des expériences 3D universelles."],
  ["PRISM", "Écosystème visite 3D automatisée. Du plan 2D au viewer interactif avec gestion centralisée et branding client."],
  ["N3D MOTEUR", "Infrastructure graphique universelle : viewer, studio, générateur, système de variantes. Config-driven et production-ready."],
  ["N3D STUDIO", "Photo 4K, vidéo, export RTT, exploded views. Transformation de produits bruts en contenus premium."],
  ["NOTRE VISION", "M3D Studio est un studio de création spécialisé dans les solutions 3D universelles. Fondé sur l’expertise en modélisation 3D haute-fidélité et rendu Babylon.js, nous concevons des expériences interactives clef-en-main pour le retail, l’immobilier, les musées, et l’industrie."],
  ["COMMENCER", "Consultez nos études de cas ou contactez-nous pour explorer comment PRISM, N3D Studio ou N3D Générateur peuvent transformer votre approche."],
  ["ONE PROJECT", "Prêt à déployer une solution N3D pour votre cas d’usage ?"],
] as const;
const geometry = [
  [360, 520, 0, 0], [780, 260, 260, -160], [420, 620, -180, 80],
  [900, 300, 80, -20], [520, 520, 250, 120], [760, 380, -260, 40],
  [440, 600, 140, -40], [980, 500, 0, 0],
] as const;

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
      const layoutScale = Math.min(1, width / 1100, height / 850);
      const responsiveFrame = currentFrame.map(value => value * layoutScale) as [number, number, number, number];
      context.clearRect(0, 0, width, height);
      const drawLines = (strokeStyle = "rgba(218,228,231,.88)", lineWidth = 2.25) => {
        context.lineCap = "round"; context.lineJoin = "round";
        context.strokeStyle = strokeStyle; context.lineWidth = lineWidth;
        const [frameWidth, frameHeight, frameX, frameY] = responsiveFrame;
        const frameLeft = cx + frameX - frameWidth / 2;
        const frameRight = cx + frameX + frameWidth / 2;
        const frameTop = cy + frameY - frameHeight / 2;
        const frameBottom = cy + frameY + frameHeight / 2;
        for (let row = -52; row <= 52; row += 2) {
          const base = cy + row * 8.2;
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
      context.filter = "blur(5px)";
      drawLines();
      context.filter = "none";
      const [boxWidth, boxHeight, boxX, boxY] = responsiveFrame;
      context.save();
      context.beginPath();
      context.rect(cx + boxX - boxWidth / 2, cy + boxY - boxHeight / 2, boxWidth, boxHeight);
      context.clip();
      drawLines("rgba(255,104,48,.98)", 2.25);
      context.restore();
      context.save();
      context.filter = "blur(170px)";
      context.strokeStyle = "rgba(255,88,38,.24)";
      context.lineWidth = 80;
      context.strokeRect(cx + boxX - boxWidth / 2, cy + boxY - boxHeight / 2, boxWidth, boxHeight);
      context.filter = "blur(360px)";
      context.strokeStyle = "rgba(255,88,38,.1)";
      context.lineWidth = 130;
      context.strokeRect(cx + boxX - boxWidth / 2, cy + boxY - boxHeight / 2, boxWidth, boxHeight);
      context.restore();
      context.strokeStyle = "rgba(255,255,255,.55)";
      context.lineWidth = 1;
      context.strokeRect(cx + boxX - boxWidth / 2, cy + boxY - boxHeight / 2, boxWidth, boxHeight);
      const left = cx + boxX - boxWidth / 2;
      const top = cy + boxY - boxHeight / 2;
      const right = left + boxWidth;
      const bottom = top + boxHeight;
      const handle = 8;
      context.strokeStyle = "rgba(255,255,255,.9)";
      context.lineWidth = 1.5;
      context.strokeRect(left - handle / 2, top - handle / 2, handle, handle);
      context.strokeRect(right - handle / 2, top - handle / 2, handle, handle);
      context.strokeRect(left - handle / 2, bottom - handle / 2, handle, handle);
      context.strokeRect(right - handle / 2, bottom - handle / 2, handle, handle);
      const crossSize = 24;
      context.beginPath();
      context.moveTo(cx + boxX - crossSize / 2, cy + boxY);
      context.lineTo(cx + boxX + crossSize / 2, cy + boxY);
      context.moveTo(cx + boxX, cy + boxY - crossSize / 2);
      context.lineTo(cx + boxX, cy + boxY + crossSize / 2);
      context.stroke();
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
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => { window.removeEventListener("wheel", onWheel); document.documentElement.style.overflow = ""; document.body.style.overflow = ""; };
  }, [released, step]);
  const [stageTitle, stageText] = stages[step];
  return <main className="min-h-screen bg-[#090c11] text-white"><div className="relative flex h-screen flex-col overflow-hidden px-5 py-6 sm:px-10 lg:px-16">
    <header className="relative z-30 flex justify-between font-mono text-[10px] uppercase tracking-[.2em] text-white/50"><span>M3D STUDIO</span></header>
    <div className="absolute inset-0 z-10 flex items-center justify-center"><div className="pointer-events-none absolute inset-0"><Motif step={step} revision={revision} /></div>
      <div className="absolute left-1/2 top-[72%] z-20 w-[92vw] -translate-x-1/2 pt-4 max-[760px]:top-[68%] sm:top-[77%] sm:w-[min(88vw,980px)] lg:top-[80%]"><div className="grid grid-cols-1 gap-4 font-mono sm:grid-cols-[1.1fr_1fr] sm:gap-0"><div className="border-r-0 pr-0 sm:border-r sm:border-white/50 sm:pr-5"><h1 className="font-display text-[clamp(1.7rem,8vw,4rem)] font-semibold uppercase leading-none max-[760px]:text-[clamp(1.5rem,6vw,3rem)]">{stageTitle}</h1></div><div className="pl-0 sm:pl-5"><p className="max-w-xl text-sm leading-6 text-[#ff6a3d] sm:text-base max-[760px]:text-xs max-[760px]:leading-5">{released ? "Footer accessible" : stageText}</p></div></div></div>
    </div>
  </div></main>;
}
