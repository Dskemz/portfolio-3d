import type { MetadataRoute } from "next";

const SITE_URL = "https://graphite3d.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mentions-legales", "/confidentialite"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
