/**
 * Portfolio Data Generator
 *
 * Utilitaires pour gérer les données de projets
 */

import { Project } from '@/types/portfolio';

/**
 * Simuler chargement depuis base de données
 */
export async function fetchProjects(): Promise<Project[]> {
  // À remplacer par requête réelle DB/API
  return [];
}

/**
 * Obtenir un projet par ID
 */
export async function fetchProjectById(id: string): Promise<Project | null> {
  const projects = await fetchProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * Mapper projets bruts vers type Project
 */
export function mapToProject(data: any): Project {
  return {
    id: data.id || crypto.randomUUID(),
    title: data.title || 'Sans titre',
    description: data.description,
    thumbnail: data.thumbnail || '/images/placeholder.jpg',
    viewerUrl: data.viewerUrl || `/viewer/${data.id}`,
    category: data.category,
    featured: data.featured || false,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    location: data.location
  };
}

/**
 * Trier projets
 */
export function sortProjects(
  projects: Project[],
  by: 'featured' | 'date' | 'title' = 'featured'
): Project[] {
  const sorted = [...projects];

  switch (by) {
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });

    case 'date':
      return sorted.sort(
        (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      );

    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return sorted;
  }
}

/**
 * Filtrer projets par catégorie
 */
export function filterByCategory(projects: Project[], category: string): Project[] {
  return projects.filter((p) => p.category === category);
}

/**
 * Compter projets par catégorie
 */
export function countByCategory(projects: Project[]): Record<string, number> {
  return projects.reduce(
    (acc, project) => {
      const category = project.category || 'Autre';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}
