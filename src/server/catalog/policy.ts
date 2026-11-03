import type { CatalogProduct, CatalogQuery } from "./contracts";

/** Apply at the server boundary, even when a future source returns extra rows. */
export function isPublicProduct(product: CatalogProduct): boolean {
  return !product.demonstration && !product.slug.startsWith("demo-") && product.approval === "approved" &&
    product.publication === "published" && Boolean(product.publishedAt) &&
    Boolean(product.content.ru?.title && product.content.ru?.description);
}
export function isPurchasable(product: CatalogProduct): boolean {
  return isPublicProduct(product) && product.sale === "open" && product.priceApproval === "approved" &&
    product.price?.currency === "USD" && Number.isSafeInteger(product.price.amountMinor) && product.price.amountMinor > 0;
}
export function selectPublished(products: CatalogProduct[], query: CatalogQuery = {}) {
  return products.filter(product => isPublicProduct(product) &&
    (!query.kind || product.kind === query.kind) &&
    (!query.category || product.category.id === query.category) &&
    (!query.language || product.languages.includes(query.language)));
}
