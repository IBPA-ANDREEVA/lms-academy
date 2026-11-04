import type { MetadataRoute } from "next";
import { fetchPublishedCatalog } from "@/features/catalog/catalog-source";
import { isIndexableProduct } from "@/lib/seo/product-indexability";
import { siteOrigin, testPreview } from "@/lib/site-environment";
import { staticPublicPages } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  if (!origin || testPreview) return [];
  const catalog = await fetchPublishedCatalog();
  return [
    ...staticPublicPages.map(page => ({ url: `${origin}${page.path}` })),
    ...catalog.products.filter(isIndexableProduct).map(product => ({
      url: `${origin}/${product.kind === "course" ? "courses" : "mini-courses"}/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ];
}
