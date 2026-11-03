import type { MetadataRoute } from "next";
import { fetchPublishedCatalog } from "@/server/catalog";
import { selectPublished } from "@/server/catalog/policy";
import { siteOrigin, testPreview } from "@/lib/site-environment";
import { staticPublicPages } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  if (!origin || testPreview) return [];
  const catalog = await fetchPublishedCatalog();
  return [
    ...staticPublicPages.map(page => ({ url: `${origin}${page.path}` })),
    ...selectPublished(catalog.products).map(product => ({
      url: `${origin}/${product.kind === "course" ? "courses" : "mini-courses"}/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ];
}
