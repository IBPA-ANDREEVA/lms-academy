import "server-only";
import { cache } from "react";
import type { CatalogQuery, CatalogResult, ProductKind, ProductResult } from "./catalog-view-types";

/** Existing disconnected frontend read boundary retained during ADR-0003 migration.
 * No HTTP client, database, publication authority or backend implementation exists here.
 * Replace with generated FastAPI integration in a separate task; never use fixtures as fallback.
 */
export const fetchPublishedCatalog = cache(async (_query: CatalogQuery = {}): Promise<CatalogResult> => {
  // Stable readiness diagnostic: no request/DB exists yet. Future I/O failures use request correlation.
  const diagnosticId = "catalog-adapter-not-connected";
  console.error(JSON.stringify({ event: "catalog.read.unavailable", diagnosticId,
    reason: "adapter_not_connected", kind: _query.kind ?? "all", operation: "fetchPublishedCatalog", outcome: "unavailable" }));
  return { status: "unavailable", products: [], diagnosticId };
});

export async function fetchPublishedProduct(kind: ProductKind, slug: string): Promise<ProductResult> {
  // Reserved preview namespace must never reach a production source.
  if (slug.startsWith("demo-") || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { status: "missing" };
  const result = await fetchPublishedCatalog({ kind });
  if (result.status === "unavailable") return result;
  const product = result.products.find(item => item.slug === slug);
  return product ? { status: "success", product } : { status: "missing" };
}
