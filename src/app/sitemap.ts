import type { MetadataRoute } from "next";
import { PROJETS } from "@/content/projets";

const SITE_URL = "https://graphite3d.fr";

/**
 * Plan du site.
 *
 * /portfolio est de nouveau liée depuis la navigation : elle réintègre le
 * plan, avec sa grille complète et une entrée par projet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const maj = new Date();

  const projets: MetadataRoute.Sitemap = PROJETS.map((projet) => ({
    url: `${SITE_URL}/portfolio/${projet.slug}`,
    lastModified: maj,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    { url: SITE_URL, lastModified: maj, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/visite-virtuelle`,
      lastModified: maj,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: maj,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/portfolio/tous`,
      lastModified: maj,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: maj,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: maj,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...projets,
  ];
}
