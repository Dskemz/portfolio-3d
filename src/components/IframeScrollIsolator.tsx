'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface IframeScrollIsolatorProps {
  src: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  allow?: string;
  allowFullScreen?: boolean;
}

/**
 * Conteneur d'iframe qui GÈLE le défilement de la page tant que le pointeur
 * se trouve au-dessus du viewer, et le rétablit dès qu'il en sort.
 *
 * Pourquoi ce fonctionnement plutôt qu'un preventDefault() sur `wheel` :
 * l'iframe est en cross-origin, donc les événements molette qui se produisent
 * À L'INTÉRIEUR ne remontent JAMAIS au document parent. Impossible de les
 * annuler. La seule prise que la page parent conserve, c'est son propre
 * défilement — on le verrouille donc à l'entrée du pointeur.
 *
 * Verrou : `overflow: hidden` sur <html> et <body>, avec compensation de la
 * largeur de la barre de défilement pour éviter un saut de mise en page.
 *
 * Le verrou est désactivé sur les appareils tactiles : bloquer le défilement
 * sans souris à faire sortir du cadre piégerait l'utilisateur dans la page.
 */
export default function IframeScrollIsolator({
  src,
  title,
  className = '',
  style = {},
  allow = '',
  allowFullScreen = false,
}: IframeScrollIsolatorProps) {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const verrouilleRef = useRef(false);
  const [pointeurFin, setPointeurFin] = useState(false);

  // Souris véritable uniquement — jamais sur tactile.
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const maj = () => setPointeurFin(mq.matches);
    maj();
    mq.addEventListener('change', maj);
    return () => mq.removeEventListener('change', maj);
  }, []);

  const verrouiller = useCallback(() => {
    if (verrouilleRef.current) return;
    verrouilleRef.current = true;

    const { documentElement: html, body } = document;
    const compensation = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (compensation > 0) body.style.paddingRight = `${compensation}px`;
  }, []);

  const deverrouiller = useCallback(() => {
    if (!verrouilleRef.current) return;
    verrouilleRef.current = false;

    const { documentElement: html, body } = document;
    html.style.overflow = '';
    body.style.overflow = '';
    body.style.paddingRight = '';
  }, []);

  // Filets de sécurité : le pointeur peut quitter le cadre sans déclencher
  // `mouseleave` (sortie de fenêtre, changement d'onglet, démontage).
  useEffect(() => {
    if (!pointeurFin) return;

    const surSortieFenetre = (e: MouseEvent) => {
      if (!e.relatedTarget) deverrouiller();
    };
    const surVisibilite = () => {
      if (document.hidden) deverrouiller();
    };

    document.addEventListener('mouseout', surSortieFenetre);
    document.addEventListener('visibilitychange', surVisibilite);
    window.addEventListener('blur', deverrouiller);

    return () => {
      document.removeEventListener('mouseout', surSortieFenetre);
      document.removeEventListener('visibilitychange', surVisibilite);
      window.removeEventListener('blur', deverrouiller);
      deverrouiller();
    };
  }, [pointeurFin, deverrouiller]);

  return (
    <div
      ref={conteneurRef}
      className={className}
      onMouseEnter={pointeurFin ? verrouiller : undefined}
      onMouseLeave={pointeurFin ? deverrouiller : undefined}
      style={{ position: 'relative', ...style }}
    >
      <iframe
        src={src}
        title={title}
        allow={allow}
        allowFullScreen={allowFullScreen}
        className="border-none"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
}
