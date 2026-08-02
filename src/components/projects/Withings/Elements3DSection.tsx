'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ *
 * Séquence éclatée interactive (image sequence pilotée au scroll)
 * ------------------------------------------------------------------ *
 * 30 frames = 4 états clés reliés par 3 transitions de 10 frames :
 *   État 1 (assemblé)  → molette 1 → frames 01-10 → État 2
 *   État 2             → molette 2 → frames 11-20 → État 3
 *   État 3             → molette 3 → frames 21-30 → État 4 (éclaté)
 *
 * Déposez les 30 visuels ici (même cadrage que l'ancienne 11-eclate) :
 *   /public/images/projets/withings/eclate/eclate-01.jpg … eclate-30.jpg
 * Tant qu'ils sont absents (ou si prefers-reduced-motion), le composant
 * retombe automatiquement sur l'image statique 11-eclate.jpg, sans rien
 * casser ni capturer le scroll.
 * ------------------------------------------------------------------ */

const FRAME_COUNT = 30;
const STATE_COUNT = 4; // assemblé, ouverture 1, ouverture 2, éclaté
const TRANSITION_S = 0.26; // 260 ms : réactif, dans la fourchette 200-300 ms
const SNAP_COOLDOWN_MS = 90; // absorbe les rafales de la molette / du trackpad
const WHEEL_MIN_DELTA = 6;
const SWIPE_MIN_DELTA = 28;
const ENGAGE_BAND = 0.24; // le centre de la scène doit être à < 24 % du centre de l'écran

const FRAME_BASE = '/images/projets/withings/eclate/';
const POSTER = '/images/projets/withings/11-eclate.jpg';
const framePath = (i: number) =>
  `${FRAME_BASE}eclate-${String(i + 1).padStart(2, '0')}.jpg`;

// --- Génération de frames provisoires (cercle qui se déplace) ---
const generateProvisionalFrames = (): HTMLImageElement[] => {
  const frames: HTMLImageElement[] = [];
  const w = 960;
  const h = 540;
  const radius = 60;

  for (let i = 0; i < FRAME_COUNT; i++) {
    const progress = i / (FRAME_COUNT - 1); // 0…1
    const x = 100 + progress * (w - 200); // cercle se déplace de gauche à droite
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Grille légère
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    for (let j = 0; j <= w; j += 60) {
      ctx.beginPath();
      ctx.moveTo(j, 0);
      ctx.lineTo(j, h);
      ctx.stroke();
    }
    for (let j = 0; j <= h; j += 60) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(w, j);
      ctx.stroke();
    }

    // Cercle central
    ctx.fillStyle = '#FF7F50';
    ctx.beginPath();
    ctx.arc(x, h / 2, radius, 0, Math.PI * 2);
    ctx.fill();

    // Cadre de référence (outline rectangle)
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Texte état
    const stateIdx = Math.min(3, Math.floor(progress * STATE_COUNT));
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(STATE_LABELS[stateIdx], w / 2, 40);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#999999';
    ctx.fillText(`Frame ${i + 1}/${FRAME_COUNT}`, w / 2, 65);

    // Convertir en image
    const img = new Image();
    img.src = canvas.toDataURL('image/jpeg', 0.85);
    img.decoding = 'async';
    frames.push(img);
  }

  return frames;
};

const STATE_LABELS = ['Assemblé', 'Ouverture 1', 'Ouverture 2', 'Éclaté'];

// Progression continue 0…(STATE_COUNT-1) → index de frame 0…(FRAME_COUNT-1)
const frameForProgress = (p: number) => {
  const clamped = Math.min(Math.max(p, 0), STATE_COUNT - 1);
  return Math.round((clamped / (STATE_COUNT - 1)) * (FRAME_COUNT - 1));
};

interface Declinaison {
  id: number;
  taille: string;
  legende: string;
  image: string;
}

const DECLINAISONS: Declinaison[] = [
  { id: 1, taille: '37 mm', legende: 'ScanWatch Light', image: '/images/projets/withings/02b-face-38.jpg' },
  { id: 2, taille: '38 mm', legende: 'ScanWatch 2', image: '/images/projets/withings/02c-face-42.jpg' },
  { id: 3, taille: '42 mm', legende: 'ScanWatch Nova', image: '/images/projets/withings/02d-face-43.jpg' },
  { id: 4, taille: '43 mm', legende: 'Édition Acier', image: '/images/projets/withings/03-3quart.jpg' },
];

export default function Elements3DSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const explodedRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<(HTMLDivElement | null)[]>([]);
  const focusRef = useRef<HTMLDivElement>(null);

  // --- Séquence interactive ---
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef<{ value: number }>({ value: 0 });
  const stateNumRef = useRef(0);
  const lockRef = useRef(false);
  const lastSnapRef = useRef(0);
  const lastDrawnRef = useRef(-1);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchConsumedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [activeState, setActiveState] = useState(0);

  /* ---------- Animations d'entrée (inchangées) ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(explodedRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: explodedRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(gridRef.current, {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current[0],
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
      gsap.from(focusRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: focusRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ---------- Préchargement des 30 frames + garde-fous ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      // setState différé (hors corps synchrone de l'effet) : pas d'animation,
      // on garde l'image statique et on ne précharge rien.
      const id = requestAnimationFrame(() => setFallback(true));
      return () => cancelAnimationFrame(id);
    }

    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loaded = 0;
    let failed = 0;

    const settle = () => {
      if (cancelled) return;
      if (loaded + failed < FRAME_COUNT) return;
      // Si > 20% des frames manquent : générer des frames provisoires
      if (failed > FRAME_COUNT * 0.2) {
        const provisionalFrames = generateProvisionalFrames();
        framesRef.current = provisionalFrames;
        setReady(true);
        return;
      }
      framesRef.current = imgs;
      setReady(true);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        loaded += 1;
        imgs[i] = img;
        settle();
      };
      img.onerror = () => {
        failed += 1;
        settle();
      };
      img.src = framePath(i);
    }

    return () => {
      cancelled = true;
      imgs.forEach((im) => {
        if (im) {
          im.onload = null;
          im.onerror = null;
        }
      });
    };
  }, []);

  // --- Nettoyage au démontage : débloquer le scroll ---
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  /* ---------- Rendu canvas + capture molette/tactile ---------- */
  useEffect(() => {
    if (!ready || fallback) return;
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Dessin d'une frame (cover-fit, espace device pixels) ---
    const draw = (index: number) => {
      const imgs = framesRef.current;
      const img = imgs[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number;
      let dh: number;
      let dx: number;
      let dy: number;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) / 2;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnRef.current = index;
    };

    const drawProgress = (p: number) => {
      const i = frameForProgress(p);
      if (i !== lastDrawnRef.current) draw(i);
    };

    // --- Dimensionnement responsive (DPR plafonné à 2) ---
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      lastDrawnRef.current = -1;
      drawProgress(progressRef.current.value);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    // --- Scène suffisamment centrée pour capturer le scroll ? ---
    const centeredEnough = () => {
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const center = rect.top + rect.height / 2;
      return Math.abs(center - vh / 2) < vh * ENGAGE_BAND;
    };

    // --- Helper : bloquer/débloquer le scroll du body ---
    const updateScrollLock = (state: number) => {
      if (state === 0 || state === STATE_COUNT - 1) {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      } else {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }
    };

    // --- Transition fluide vers un état ---
    const goToState = (target: number) => {
      const t = Math.min(Math.max(target, 0), STATE_COUNT - 1);
      tweenRef.current?.kill();
      lockRef.current = true;
      updateScrollLock(t); // bloquer immédiatement
      setActiveState(t);
      tweenRef.current = gsap.to(progressRef.current, {
        value: t,
        duration: TRANSITION_S,
        ease: 'power2.inOut',
        onUpdate: () => drawProgress(progressRef.current.value),
        onComplete: () => {
          stateNumRef.current = t;
          lockRef.current = false;
          updateScrollLock(t); // confirmer blocage/déblocage
        },
      });
    };

    const trySnap = (dir: number) => {
      const next = stateNumRef.current + dir;
      if (next < 0 || next > STATE_COUNT - 1) return false; // borne → relâche
      if (lockRef.current) return true; // animation en cours → on avale l'impulsion
      const now = performance.now();
      if (now - lastSnapRef.current < SNAP_COOLDOWN_MS) return true;
      lastSnapRef.current = now;
      goToState(next);
      return true;
    };

    // --- Molette / trackpad ---
    const onWheel = (e: WheelEvent) => {
      if (!centeredEnough()) return; // scène pas au centre → scroll natif
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (!dir || Math.abs(e.deltaY) < WHEEL_MIN_DELTA) return;
      const next = stateNumRef.current + dir;
      if (next < 0 || next > STATE_COUNT - 1) return; // borne atteinte → on laisse défiler
      e.preventDefault(); // capture : la page ne bouge pas
      trySnap(dir);
    };

    // --- Tactile (une impulsion = un swipe) ---
    const onTouchStart = (e: TouchEvent) => {
      if (!centeredEnough()) {
        touchStartYRef.current = null;
        return;
      }
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
      touchConsumedRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const start = touchStartYRef.current;
      if (start == null) return;
      const dy = start - (e.touches[0]?.clientY ?? start);
      const dir = dy > 0 ? 1 : -1;
      const next = stateNumRef.current + dir;
      if (next < 0 || next > STATE_COUNT - 1) return; // borne → scroll natif
      e.preventDefault(); // capture le swipe dans la plage utile
      if (touchConsumedRef.current) return;
      if (Math.abs(dy) < SWIPE_MIN_DELTA) return;
      touchConsumedRef.current = true;
      trySnap(dir);
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
      touchConsumedRef.current = false;
    };

    // --- Clavier (accessibilité, quand la scène est au centre) ---
    const onKeyDown = (e: KeyboardEvent) => {
      if (!centeredEnough()) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (stateNumRef.current < STATE_COUNT - 1) {
          e.preventDefault();
          trySnap(1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (stateNumRef.current > 0) {
          e.preventDefault();
          trySnap(-1);
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      ro.disconnect();
      tweenRef.current?.kill();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [ready, fallback]);

  const interactive = ready && !fallback;

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-slate-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Bloc texte asymétrique, aligné à gauche, sur 2 colonnes décalées */}
        <div
          ref={textRef}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-16 mb-16 lg:mb-20"
        >
          <div className="lg:pt-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
              Une gamme entière,
              <br />
              modélisée pièce par pièce
            </h2>
          </div>
          <div className="lg:pt-16 space-y-4 max-w-lg">
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Modélisation des boîtiers 37 mm, 38 mm, 42 mm et 43 mm de la gamme
              ScanWatch 2, avec déclinaisons de cadrans, soleillage et sablage.
            </p>
            <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed">
              Modélisation des bracelets cuir, métal, tissu et silicone pour
              chaque taille de boîtier, afin de couvrir l&apos;intégralité des
              références du catalogue.
            </p>
          </div>
        </div>

        {/* Grande vue éclatée — séquence interactive pilotée au scroll */}
        <div ref={explodedRef} className="mb-6 lg:mb-8">
          <div
            ref={stageRef}
            role="img"
            aria-label="Vue éclatée animée de la ScanWatch : boîtier, capteurs, mécanisme et bracelet"
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-lg bg-slate-800 select-none"
          >
            {interactive && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
              />
            )}

            {/* Poster statique : chargement en cours, frames absentes ou reduced-motion */}
            {!interactive && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={POSTER}
                alt="Vue éclatée de la ScanWatch, boîtier, capteurs et bracelet"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {/* Habillage : progression (3 segments), libellé d'état, indice de scroll */}
            {interactive && (
              <>
                <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
                  {[0, 1, 2].map((seg) => (
                    <span
                      key={seg}
                      className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                        activeState > seg ? 'bg-white' : 'bg-white/25'
                      }`}
                    />
                  ))}
                </div>
                <div className="pointer-events-none absolute right-4 top-4 text-[11px] font-light uppercase tracking-widest text-white/70">
                  {STATE_LABELS[activeState]}
                </div>
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-500 ${
                    activeState === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="rounded-full bg-black/50 px-4 py-1.5 text-[11px] font-light text-white/80 backdrop-blur-sm">
                    Faites défiler pour ouvrir la montre
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Grille de 4 déclinaisons de modèles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 lg:mb-20">
          {DECLINAISONS.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => { gridRef.current[idx] = el; }}
              className="group flex flex-col"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-slate-800 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={`Déclinaison ${item.taille}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-sm md:text-base font-light text-white">
                {item.taille}
              </p>
              <p className="text-xs text-slate-400 font-light uppercase tracking-wide mt-0.5">
                {item.legende}
              </p>
            </div>
          ))}
        </div>

        {/* Focus grand format sur un cadran (ex. cadran vert soleillé) */}
        <div
          ref={focusRef}
          className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-slate-800 group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/projets/withings/12-cadran-vert.jpg"
            alt="Focus sur le cadran vert soleillé"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <h3 className="text-xl md:text-2xl font-light text-white">
              Cadran vert soleillé
            </h3>
            <p className="text-sm text-slate-300 font-light mt-2 max-w-md">
              Effet soleillé obtenu par un travail précis des micro-rainures et
              du soleillage pour capter la lumière selon l&apos;angle de vue.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
