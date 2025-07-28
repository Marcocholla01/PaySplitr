import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://paysplitr.com",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      images: ["https://example.com/image.jpg"],
      videos: [
        {
          title: "example",
          thumbnail_loc: "https://example.com/image.jpg",
          description: "this is the description",
        },
      ],
    },
    {
      url: "https://paysplitr.com/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://paysplitr.com/dashboard",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://paysplitr.com/blog",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    // Add more pages or dynamically fetch from DB/CMS
  ];
}
