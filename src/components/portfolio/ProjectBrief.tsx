'use client';

import { motion } from 'framer-motion';

interface ProjectBriefProps {
  defi: string;
  solution: string;
  resultats?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function ProjectBrief({ defi, solution, resultats }: ProjectBriefProps) {
  return (
    <motion.section
      className="grid gap-16 border-t border-mine pt-16 lg:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Le Défi */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <h2 className="font-mono text-xs tracking-[0.32em] text-[#ed8936]">LE DÉFI</h2>
        <div className="space-y-4 font-body text-papier leading-relaxed prose-invert prose-p:m-0">
          <p>{defi}</p>
        </div>
      </motion.div>

      {/* La Solution */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <h2 className="font-mono text-xs tracking-[0.32em] text-[#ed8936]">LA SOLUTION</h2>
        <div className="space-y-4 font-body text-papier leading-relaxed prose-invert prose-p:m-0">
          <p>{solution}</p>
        </div>
      </motion.div>

      {/* Résultats (optionnel) */}
      {resultats && (
        <motion.div
          className="col-span-full space-y-4 border-t border-graphite-800 pt-8"
          variants={itemVariants}
        >
          <h2 className="font-mono text-xs tracking-[0.32em] text-[#ed8936]">RÉSULTATS</h2>
          <div className="space-y-4 font-body text-papier leading-relaxed prose-invert prose-p:m-0">
            <p>{resultats}</p>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
