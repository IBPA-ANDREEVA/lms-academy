import type { MetadataRoute } from "next";
import { siteOrigin, testPreview } from "@/lib/site-environment";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  if (testPreview || !origin) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    // Crawl public noindex utilities so crawlers can observe their directives.
    // Private namespaces still require authentication when implemented.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/account/", "/trainer/"] },
    sitemap: `${origin}/sitemap.xml`,
  };
}
