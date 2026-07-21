'use client';

import { useRef, useState, useEffect } from 'react';
import { IframeScrollHandler } from '@/components/IframeScrollHandler';
import { ScrollState } from '@/types/portfolio';

interface ViewerContainerProps {
  iframeUrl: string;
  projectTitle: string;
  onStateChange?: (state: ScrollState) => void;
}

export function ViewerContainer({
  iframeUrl,
  projectTitle,
  onStateChange
}: ViewerContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScrollState>({
    isScrolling: false,
    isManipulating: false,
    pointerEventsEnabled: false
  });

  const handleStateChange = (newState: ScrollState) => {
    setState(newState);
    onStateChange?.(newState);
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Status Indicator (debug) */}
      <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-60 text-white px-3 py-2 rounded text-xs">
        <p>Scroll: {state.isScrolling ? '✓' : '✗'}</p>
        <p>3D: {state.isManipulating ? '✓' : '✗'}</p>
      </div>

      {/* Scroll Handler Container */}
      <IframeScrollHandler
        onStateChange={handleStateChange}
        debounceMs={300}
      >
        {/* Viewer Iframe */}
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          title={projectTitle}
          className="w-full h-screen border-none"
          style={{
            pointerEvents: state.pointerEventsEnabled ? 'auto' : 'none',
            transition: 'pointer-events 0.1s ease'
          }}
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-presentation"
        />
      </IframeScrollHandler>
    </div>
  );
}
