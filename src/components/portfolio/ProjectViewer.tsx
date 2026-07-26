'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProjectViewerProps {
  src: string;
  alt: string;
  ratio?: '16/9' | '4/3' | '1/1' | '9/16';
  isIframe?: boolean;
}

const ratioMap = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '9/16': 'aspect-[9/16]',
};

export function ProjectViewer({ src, alt, ratio = '16/9', isIframe = false }: ProjectViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      className={`overflow-hidden rounded-lg bg-graphite-900 ${ratioMap[ratio]} relative`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
    >
      {/* Halo au chargement */}
      <div className="absolute inset-0 z-10 bg-gradient-radial from-[#ed8936]/10 via-transparent to-transparent opacity-0 animate-pulse" />

      {isIframe ? (
        // Iframe viewer (Visite3D, Babylon.js, etc.)
        <iframe
          src={src}
          title={alt}
          className="h-full w-full border-none bg-graphite-950"
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        // Image statique
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-cover"
          priority={false}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {/* Bordure avec émission */}
      {isLoaded && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border border-[#ed8936]/20 rounded-lg" />
          <div className="absolute inset-0 border border-[#ed8936]/10 rounded-lg blur-[2px]" />
        </div>
      )}
    </motion.div>
  );
}
