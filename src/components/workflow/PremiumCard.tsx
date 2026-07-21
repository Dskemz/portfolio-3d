"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { WorkflowNode } from "@/content/workflow-map";

interface PremiumCardProps {
  node: WorkflowNode;
  isMain: boolean;
  isActive?: boolean;
}

export default function PremiumCard({ node, isMain, isActive }: PremiumCardProps) {
  const mediaUrl = node.media.blueprint;

  return (
    <motion.article
      className={`group relative flex flex-col overflow-hidden bg-zinc-900 border border-zinc-800 ${
        isMain ? "h-80 lg:h-96" : "h-64 lg:h-72"
      }`}
      style={{
        boxShadow: isActive
          ? "0 25px 60px rgba(255, 127, 80, 0.35), 0 0 40px rgba(255, 127, 80, 0.25), inset 0 1px 0 rgba(255, 127, 80, 0.15)"
          : "0 12px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      }}
      animate={{
        y: isActive ? -16 : 0,
        borderColor: isActive ? "rgba(255, 127, 80, 0.6)" : "rgba(39, 39, 42, 1)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Image statique 2D */}
      {mediaUrl ? (
        <Image
          src={mediaUrl}
          alt={node.title}
          fill
          className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
          priority={isMain}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
      )}

      {/* Overlay gradient pour la lisibilité */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 group-hover:via-black/50"
      />

      {/* Contenu texte */}
      <motion.div
        className="relative z-10 flex flex-1 flex-col justify-between p-6 lg:p-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h3 className="font-display text-xl lg:text-2xl font-light leading-tight text-papier">
            {node.title}
          </h3>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-papier/70">
            {node.subtitle}
          </p>
          <motion.span
            className="inline-block font-mono text-[10px] uppercase tracking-widest text-[#FF7F50] font-semibold"
            animate={{
              opacity: isActive ? 1 : 0.6,
              textShadow: isActive 
                ? "0 0 10px rgba(255, 127, 80, 0.8)" 
                : "none",
            }}
            transition={{ duration: 0.3 }}
          >
            {node.techIndicator}
          </motion.span>
        </div>
      </motion.div>

      {/* Ligne accent haut pour les cartes principales */}
      {isMain && (
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF7F50] to-transparent"
          animate={{ opacity: isActive ? 1 : 0.15 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.article>
  );
}
