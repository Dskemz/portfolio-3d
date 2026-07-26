'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Projet {
  slug: string;
  nom: string;
  client: string;
  couverture: string;
}

interface ProjectNavigationProps {
  current: Projet;
  previous: Projet;
  next: Projet;
}

const linkVariants = {
  hidden: { opacity: 0, x: 0 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export function ProjectNavigation({ previous, next }: ProjectNavigationProps) {
  return (
    <motion.section
      className="grid gap-8 border-t border-mine pt-16 md:grid-cols-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
    >
      {/* Projet précédent */}
      <motion.div variants={linkVariants}>
        <Link href={`/portfolio/${previous.slug}`}>
          <div className="group cursor-pointer space-y-4">
            {/* Image */}
            <div className="relative overflow-hidden rounded-lg bg-graphite-900 aspect-video">
              <Image
                src={previous.couverture}
                alt={previous.nom}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              {/* Flèche précédent */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>

            {/* Texte */}
            <div className="space-y-2">
              <p className="font-mono text-xs tracking-[0.24em] text-trait group-hover:text-[#ed8936] transition-colors">
                PROJET PRÉCÉDENT
              </p>
              <h3 className="font-display text-lg group-hover:text-[#ed8936] transition-colors">
                {previous.nom}
              </h3>
              <p className="text-sm text-trait">{previous.client}</p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Projet suivant */}
      <motion.div variants={linkVariants}>
        <Link href={`/portfolio/${next.slug}`}>
          <div className="group cursor-pointer space-y-4 md:text-right">
            {/* Image */}
            <div className="relative overflow-hidden rounded-lg bg-graphite-900 aspect-video">
              <Image
                src={next.couverture}
                alt={next.nom}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              {/* Flèche suivant */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Texte */}
            <div className="space-y-2">
              <p className="font-mono text-xs tracking-[0.24em] text-trait group-hover:text-[#ed8936] transition-colors">
                PROJET SUIVANT
              </p>
              <h3 className="font-display text-lg group-hover:text-[#ed8936] transition-colors">
                {next.nom}
              </h3>
              <p className="text-sm text-trait">{next.client}</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.section>
  );
}
