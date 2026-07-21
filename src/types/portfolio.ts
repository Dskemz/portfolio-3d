/**
 * Portfolio & Scroll Management Types
 */

export interface Project {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  viewerUrl: string;
  category?: string;
  featured?: boolean;
  createdAt?: Date;
  location?: string;
}

export interface ScrollState {
  isScrolling: boolean;
  isManipulating: boolean;
  pointerEventsEnabled: boolean;
}

export interface IframeScrollConfig {
  debounceMs?: number;
  threshold?: number;
  enableAutoToggle?: boolean;
}
