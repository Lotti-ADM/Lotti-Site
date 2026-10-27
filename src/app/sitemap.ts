import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categories } from "@/content/blog/categories";
import { getAllPosts, getPostsByCategory } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // Blog e silos só entram com conteúdo: página vazia sai como noindex e não
  // deve ser oferecida ao Google.
  const blog: MetadataRoute.Sitemap =
    posts.length === 0
      ? []
      : [
          {
            url: `${siteConfig.url}/blog`,
            lastModified: new Date(posts[0].updatedAt ?? posts[0].publishedAt),
            changeFrequency: "weekly",
            priority: 0.8,
          },
          ...categories
            .filter((c) => getPostsByCategory(c.id).length > 0)
            .map((c) => ({
              url: `${siteConfig.url}/blog/${c.id}`,
              changeFrequency: "weekly" as const,
              priority: 0.6,
            })),
          ...posts.map((post) => ({
            url: `${siteConfig.url}${post.url}`,
            lastModified: new Date(post.updatedAt ?? post.publishedAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          })),
        ];

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/planos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blog,
  ];
}
