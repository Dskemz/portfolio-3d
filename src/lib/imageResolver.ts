/**
 * Résout l'URL d'une image sans extension.
 * L'API essaie automatiquement: .jpg → .png → .webp → .svg
 */
export function getImageUrl(basePath: string): string {
  // Nettoie le chemin s'il a déjà une extension
  const cleanPath = basePath.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '');
  return `/api/images/${cleanPath.replace(/^\//, '')}`;
}
