"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getNodeAnchorId,
  getNodeCardId,
  getNodeExitId,
  type WorkflowNode,
} from "@/content/workflowData";
import StepVisual from "./StepVisual";

interface WorkflowCardProps {
  node: WorkflowNode;
  /** Le front du flux a physiquement touché l'ancre de cette fiche */
  lit: boolean;
  /** Fiche la plus avancée sous tension */
  isHead: boolean;
  /** Le scroll remonte : extinction immédiate */
  receding: boolean;
  /** Mode mobile : rendu natif, statique */
  plain?: boolean;
  /** Mode cranté : le retour en arrière est une animation délibérée, pas un scrub */
  stepped?: boolean;
  /** Mise en page compacte réservée au storytelling mobile. */
  mobile?: boolean;
}

const PERIMETER_S = 0.6;

function TypedQuote({
  quote,
  visible,
  start,
  onComplete,
}: {
  quote: NonNullable<WorkflowNode["quote"]>;
  visible: boolean;
  start: boolean;
  onComplete?: () => void;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible || !start) {
      setCount(0);
      return;
    }

    let timer: number | undefined;
    const startTimer = window.setTimeout(() => {
      let next = 0;
      timer = window.setInterval(() => {
        next += 1;
        setCount(next);
        if (next >= quote.text.length) {
          window.clearInterval(timer);
          onComplete?.();
        }
      }, 11);
    }, 120);

    return () => {
      window.clearTimeout(startTimer);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [quote.text, visible, start]);

  const complete = count >= quote.text.length;
  return (
    <div className="mt-[clamp(0.5rem,1.5svh,1rem)] min-h-[3.6rem] font-body text-[clamp(0.68rem,1.05svh,0.72rem)] italic leading-relaxed text-zinc-500">
      <span>«&nbsp;{quote.text.slice(0, count)}{complete ? " »" : ""}</span>
      {!complete && visible && start && (
        <motion.span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[0.9em] w-px align-[-0.1em] bg-[#FF7F50]"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
        />
      )}
      <motion.span
        className="block not-italic"
        initial={false}
        animate={{ opacity: complete ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        — {quote.author}
      </motion.span>
    </div>
  );
}

function WorkflowCard({
  node,
  lit,
  isHead,
  receding,
  plain = false,
  stepped = false,
  mobile = false,
}: WorkflowCardProps) {
  const isTerminal = node.kind === "terminal";
  const isFirstStep = node.step === "01";
  
  // Pour la carte terminale, on s'assure qu'elle ne s'active que si 'lit' est explicitement vrai
  const visible = plain || lit;
  // À la remontée, le titre quitte la scène dans une dispersion douce plutôt
  // que de rejouer l'entrée à l'envers.
  const titleLeaving = !visible && receding;

  const frameRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [titleComplete, setTitleComplete] = useState(false);
  const [quoteComplete, setQuoteComplete] = useState(false);

  useEffect(() => {
    if (!visible) {
      setTitleComplete(false);
      setQuoteComplete(false);
    }
  }, [visible]);

  useEffect(() => {
    if (plain) return;
    const el = frameRef.current;
    if (!el) return;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, [plain]);

  const instant = receding && !stepped;
  const shell = instant
    ? { duration: 0.05, ease: "linear" as const }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };
  const edge = instant
    ? { duration: 0.05, ease: "linear" as const }
    : { duration: PERIMETER_S, ease: [0.4, 0, 0.2, 1] as const };
  const inner = instant
    ? { duration: 0.05, delay: 0, ease: "linear" as const }
    : { duration: 0.4, delay: PERIMETER_S * 0.78, ease: [0.22, 1, 0.36, 1] as const };
  const titleTransition = instant
    ? { duration: 0.05, ease: "linear" as const }
    : { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const };
  const detailTransition = instant
    ? { duration: 0.05, delay: 0, ease: "linear" as const }
    : {
        duration: 0.7,
        delay: 0,
        ease: [0.22, 1, 0.36, 1] as const,
      };
  const dotTiming = instant ? { duration: 0.05 } : { duration: 0.22 };

  /* Pastilles d'ancrage du flux */
  const dot = (id: string, position: string, bright: boolean, shown = visible) => (
    <div
      id={id}
      aria-hidden
      className={`pointer-events-none absolute z-30 h-2.5 w-2.5 ${position}`}
    >
      <motion.span
        className="block h-full w-full rounded-full bg-[#FF7F50]"
        initial={false}
        animate={{
          opacity: shown ? 1 : 0,
          scale: shown ? 1 : 0.4,
          boxShadow: bright
            ? "0 0 16px 4px rgba(255,127,80,0.85)"
            : "0 0 8px 2px rgba(255,127,80,0.5)",
        }}
        transition={dotTiming}
      />
    </div>
  );

  const titleBlock = (
      <motion.div
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={titleTransition}
        className="mt-[clamp(0.5rem,1.5svh,1rem)] max-w-4xl"
      >
        {!isTerminal && (
          <span className="mb-[clamp(0.75rem,2svh,1.35rem)] block font-mono text-[clamp(9px,0.9vw,12px)] uppercase tracking-[0.3em] text-[#FF7F50]">
            {node.kicker ?? `Étape ${node.step}`}
          </span>
        )}
        <h2
          className={`font-display font-light leading-[0.94] text-white ${
            isTerminal
              ? "text-[clamp(1.4rem,3.4svh,2.6rem)]"
              : "max-w-[12ch] text-[clamp(3.1rem,7.2svh,6.1rem)] tracking-[-0.065em]"
          }`}
        >
          {node.title.split(" ").map((word, index, words) => (
            <span key={`${word}-${index}`} className="mr-[0.18em] inline-block overflow-hidden align-top last:mr-0">
              <motion.span
                className="block"
                initial={false}
                animate={{
                  y: visible ? "0%" : titleLeaving ? `${-10 - index * 5}px` : "112%",
                  x: titleLeaving ? `${(index % 2 === 0 ? -1 : 1) * (10 + index * 4)}px` : "0px",
                  rotate: titleLeaving ? (index % 2 === 0 ? -1.2 : 1.2) : 0,
                  opacity: visible ? 1 : 0,
                  filter: visible ? "blur(0px)" : titleLeaving ? "blur(13px)" : "blur(10px)",
                  letterSpacing: titleLeaving ? "0.07em" : "0em",
                }}
                transition={{
                  duration: instant ? 0.05 : titleLeaving ? 0.58 : 0.74,
                  delay: instant ? 0 : titleLeaving ? index * 0.07 : index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onAnimationComplete={
                  index === words.length - 1 && visible
                    ? () => setTitleComplete(true)
                    : undefined
                }
              >
                {index === 0 ? (
                  <><span className="font-semibold">{word.charAt(0)}</span><span className="font-extralight">{word.slice(1)}</span></>
                ) : (
                  <span className="font-extralight">{word}</span>
                )}
              </motion.span>
            </span>
          ))}
        </h2>
        {isTerminal && (
          <>
            <span className="font-mono text-[clamp(9px,0.9vw,12px)] uppercase tracking-[0.28em] text-[#FF7F50]">
              {node.kicker ?? `Étape ${node.step}`}
            </span>
          </>
        )}
      </motion.div>
  );

  const quoteBlock = node.quote && (
    <TypedQuote
      quote={node.quote}
      visible={visible}
      start={titleComplete}
      onComplete={() => setQuoteComplete(true)}
    />
  );

  const detailBlock = (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: quoteComplete || !node.quote ? 1 : 0, y: quoteComplete || !node.quote ? 0 : 18 }}
        transition={detailTransition}
      >
        <div className="my-[clamp(0.7rem,2.2svh,1.5rem)] h-px w-16 bg-white/[0.18]" />

        <p className="max-w-md text-[clamp(0.8rem,1.35svh,0.95rem)] leading-relaxed text-zinc-400">
          {node.description}
        </p>

        {node.href && isTerminal && (
          <Link
            href={node.href}
            className={
              isTerminal
                ? "mt-[clamp(0.9rem,2.9svh,2rem)] inline-block self-start bg-[#FF7F50] px-[clamp(1.1rem,2.6svh,1.75rem)] py-[clamp(0.6rem,1.5svh,0.875rem)] font-display text-[clamp(0.8rem,1.4svh,0.875rem)] font-semibold tracking-wide text-black transition-colors hover:bg-[#E67E22]"
                : "mt-[clamp(0.9rem,2.9svh,2rem)] inline-flex items-center gap-2 self-start font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF7F50] transition-colors hover:text-[#E67E22]"
            }
            style={isTerminal ? { touchAction: "manipulation" } : undefined}
          >
            {node.hrefLabel ?? "Voir"}
            {!isTerminal && <span aria-hidden>—→</span>}
          </Link>
        )}
      </motion.div>
    </>
  );

  const editorial = (
    <div className={`flex flex-col justify-center px-[clamp(1.25rem,3.6svh,2.5rem)] py-[clamp(1.35rem,4.4svh,3rem)] ${isTerminal ? "items-center text-center" : ""}`}>
      {titleBlock}
      {quoteBlock}
      {detailBlock}
    </div>
  );

  const body = isTerminal ? (
    <div className="px-[clamp(1.25rem,3.6svh,3.5rem)] py-[clamp(1.5rem,4.4svh,4rem)] text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-500">
        Fin de parcours
      </p>
      <div className="mx-auto mt-[clamp(0.9rem,2.9svh,2rem)] max-w-2xl">{editorial}</div>
    </div>
  ) : (
    <div className={`grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-x-14 md:gap-y-5 ${mobile ? "gap-4" : ""}`}>
      <div className="px-[clamp(1.25rem,3.6svh,2.5rem)] pt-[clamp(1.35rem,4.4svh,3rem)] md:col-span-2">
        {titleBlock}
      </div>
      <div className="px-[clamp(1.25rem,3.6svh,2.5rem)] md:col-span-2">
        {quoteBlock}
      </div>
      <motion.div
        className={`relative px-[clamp(1.25rem,3.6svh,2.5rem)] ${mobile ? "min-h-[clamp(12rem,30svh,18rem)]" : "min-h-[clamp(18rem,42svh,32rem)] md:min-h-[clamp(20rem,48svh,38rem)]"}`}
        initial={false}
        animate={{
          opacity: quoteComplete || !node.quote ? 1 : 0,
          y: quoteComplete || !node.quote ? 0 : 18,
          scale: quoteComplete || !node.quote ? 1 : 1.035,
          clipPath: quoteComplete || !node.quote ? "inset(0 0 0% 0)" : "inset(5% 5% 5% 5%)",
        }}
        transition={detailTransition}
      >
        <StepVisual node={node} active={visible} />
      </motion.div>
      <div className="flex flex-col justify-center px-[clamp(1.25rem,3.6svh,2.5rem)] pb-[clamp(1.35rem,4.4svh,3rem)]">
        {detailBlock}
      </div>
    </div>
  );

  if (plain) {
    return (
      <article
        id={getNodeCardId(node.id)}
        className="relative h-auto overflow-visible"
        style={{
          background: "transparent",
        }}
      >
        {body}
      </article>
    );
  }

  return (
    <div className="relative h-auto">
      {/* Ancre supérieure : déclenche l'allumage au contact exact du flux */}
      {dot(
        getNodeAnchorId(node.id),
        "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
        isFirstStep || isHead
      )}
      {/* Le flux réapparaît ici avant de poursuivre vers l'étape suivante. */}
      {!isTerminal &&
        dot(
          getNodeExitId(node.id),
          "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2",
          false
        )}

      <motion.article
        ref={frameRef}
        id={getNodeCardId(node.id)}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: 1,
          boxShadow: "none",
        }}
        transition={
          instant
            ? shell
            : receding
              ? { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.01 }
        }
        style={{ background: "#000", pointerEvents: visible ? "auto" : "none" }}
        className="relative h-auto overflow-visible"
      >
        <div className="relative z-10">
          {body}
        </div>
      </motion.article>
    </div>
  );
}
/**
 * Le parent (SkillFlow / SkillFlowMobile) se re-rend à chaque frame de scroll.
 * Sans mémoïsation, les 7 fiches et leurs sous-arbres framer-motion étaient
 * reconstruits 60 fois par seconde pour rien : seuls `lit`, `isHead` et
 * `receding` changent réellement, et rarement.
 */
export default memo(WorkflowCard);
