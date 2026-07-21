"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function WorkflowMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // On utilise un offset très agressif pour que l'animation parte dès le pixel 0
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // On crée un flux qui commence à 0 et finit à 1 sans zone morte
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-[#0a0a0a]">
      {/* SVG en absolute pour suivre le scroll de la page */}
      <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
        {/* Le câble gris (fond) */}
        <line 
          x1="50%" y1="0" 
          x2="50%" y2="100%" 
          stroke="#1a1a1a" 
          strokeWidth="4" 
        />
        
        {/* Le flux lumineux qui part instantanément */}
        <motion.line
          x1="50%" y1="0" 
          x2="50%" y2="100%" 
          stroke="#FF7F50" 
          strokeWidth="4"
          style={{ 
            pathLength: pathLength,
            filter: "drop-shadow(0 0 10px #FF7F50)"
          }}
          strokeLinecap="round"
        />
        
        {/* La tête du flux qui marque le départ */}
        <motion.circle
          cx="50%"
          cy="0"
          r="6"
          fill="#FF7F50"
          style={{ 
            // On fait descendre le point en même temps que le tracé
            y: useTransform(scrollYProgress, [0, 1], ["0vh", "300vh"]),
            filter: "drop-shadow(0 0 15px #FF7F50)"
          }}
        />
      </svg>
    </div>
  );
}