import type { CatalogProduct } from "@/features/catalog/catalog-view-types";

/** Defensive SEO exclusion only; never authorizes publication, purchase or access.
 * Future FastAPI Catalog owns the authoritative public projection.
 */
export function isIndexableProduct(product: CatalogProduct): boolean {
  return !product.demonstration && !product.slug.startsWith("demo-") && product.approval === "approved" &&
    product.publication === "published" && Boolean(product.publishedAt) &&
    Boolean(product.content.ru?.title && product.content.ru?.description);
}
