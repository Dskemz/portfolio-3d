'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { ScrollState } from '@/types/portfolio';

interface IframeScrollHandlerProps {
  children: React.ReactNode;
  debounceMs?: number;
  onStateChange?: (state: ScrollState) => void;
}

export function IframeScrollHandler({
  children,
  debounceMs = 300,
  onStateChange
}: IframeScrollHandlerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<ScrollState>({
    isScrolling: false,
    isManipulating: false,
    pointerEventsEnabled: false
  });

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Activer manipulation 3D (désactiver scroll)
   */
  const enablePointerEvents = useCallback(() => {
    setState((prev) => {
      if (!prev.isManipulating) {
        onStateChange?.({ ...prev, isManipulating: true, pointerEventsEnabled: true });
        return { ...prev, isManipulating: true, pointerEventsEnabled: true };
      }
      return prev;
    });
  }, [onStateChange]);

  /**
   * Désactiver manipulation 3D (activer scroll)
   */
  const disablePointerEvents = useCallback(() => {
    setState((prev) => {
      if (prev.isManipulating) {
        onStateChange?.({ ...prev, isManipulating: false, pointerEventsEnabled: false });
        return { ...prev, isManipulating: false, pointerEventsEnabled: false };
      }
      return prev;
    });
  }, [onStateChange]);

  /**
   * Handler wheel (scroll souris)
   */
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (state.pointerEventsEnabled) {
        return;
      }

      // Indiquer que l'utilisateur scrolle
      setState((prev) => {
        if (!prev.isScrolling) {
          onStateChange?.({ ...prev, isScrolling: true });
        }
        return { ...prev, isScrolling: true };
      });

      // Démarrer debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setState((prev) => {
        onStateChange?.({ ...prev, isScrolling: false });
        return { ...prev, isScrolling: false };
      });
    }, debounceMs);
  },
  [state.pointerEventsEnabled, debounceMs, onStateChange]
);

  /**
   * Handler touch start (début d'interaction tactile)
   */
  const handleTouchStart = useCallback(() => {
    enablePointerEvents();
  }, [enablePointerEvents]);

  /**
   * Handler touch end (fin d'interaction tactile)
   */
  const handleTouchEnd = useCallback(() => {
    disablePointerEvents();
  }, [disablePointerEvents]);

  /**
   * Handler pointer down (debut manipulation souris)
   */
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (e.button === 0 || e.button === 2) {
        // Left or right click
        enablePointerEvents();
      }
    },
    [enablePointerEvents]
  );

  /**
   * Handler pointer up (fin manipulation souris)
   */
  const handlePointerUp = useCallback(() => {
    disablePointerEvents();
  }, [disablePointerEvents]);

  /**
   * Setup listeners sur iframe
   */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // Listeners iframe
      iframeDoc.addEventListener('pointerdown', handlePointerDown);
      iframeDoc.addEventListener('pointerup', handlePointerUp);
      iframeDoc.addEventListener('touchstart', handleTouchStart, { passive: true });
      iframeDoc.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        iframeDoc.removeEventListener('pointerdown', handlePointerDown);
        iframeDoc.removeEventListener('pointerup', handlePointerUp);
        iframeDoc.removeEventListener('touchstart', handleTouchStart);
        iframeDoc.removeEventListener('touchend', handleTouchEnd);
      };
    } catch (error) {
      console.warn('[IframeScrollHandler] Cross-origin iframe, using fallback');
      return;
    }
  }, [handlePointerDown, handlePointerUp, handleTouchStart, handleTouchEnd]);

  /**
   * Setup listeners sur container
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  /**
   * Appliquer styles dynamiques
   */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (state.pointerEventsEnabled) {
      iframe.style.pointerEvents = 'auto';
    } else {
      iframe.style.pointerEvents = 'none';
    }
  }, [state.pointerEventsEnabled]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {children}
    </div>
  );
}

/**
 * Hook pour accéder au state du scroll handler
 */
export function useIframeScrollState(ref: React.RefObject<HTMLDivElement>) {
  const [state, setState] = useState<ScrollState>({
    isScrolling: false,
    isManipulating: false,
    pointerEventsEnabled: false
  });

  return state;
}
