import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/planos",
          "/blog",
          "/blog/*",
          "/brand/*",
          "/product/*",
          "/opengraph-image",
        ],
        disallow: [
          "/api/",
          "/checkout",
          "/checkout/*",
          "/login",
          "/cadastro",
          "/recuperar-senha",
          "/dashboard",
          "/dashboard/*",
          "/painel",
          "/painel/*",
          "/admin",
          "/admin/*",
          "/app",
          "/app/*",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/planos",
          "/blog",
          "/blog/*",
          "/brand/*",
          "/product/*",
          "/opengraph-image",
        ],
        disallow: [
          "/api/",
          "/checkout",
          "/checkout/*",
          "/login",
          "/cadastro",
          "/recuperar-senha",
          "/dashboard",
          "/dashboard/*",
          "/painel",
          "/painel/*",
          "/admin",
          "/admin/*",
          "/app",
          "/app/*",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
