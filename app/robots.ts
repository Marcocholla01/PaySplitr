import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admim/*", "/distributor/*", "/api/*"],
    },
    sitemap: "https://paysplitr.com/sitemap.xml",
  };
}
