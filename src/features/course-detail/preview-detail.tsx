"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/commerce/cart-provider";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { CatalogState } from "@/features/catalog/components/catalog-state";
import { toDetailProduct } from "@/features/catalog/catalog-presentation";
import type { ProductKind } from "@/server/catalog/contracts";
import { DetailPage } from "./detail-page";
import { DetailNotFound } from "./components/detail-not-found";

export function PreviewDetail({ kind, slug }: { kind: ProductKind; slug: string }) {
  const catalog = useCatalog();
  const cart = useCart();
  if (catalog.status === "loading" || catalog.status === "unavailable") return <main id="main-content"><CatalogState status={catalog.status} /></main>;
  const record = catalog.products.find(p => p.kind === kind && p.slug === slug && p.publication === "published" && p.approval === "approved");
  if (!catalog.enabled || !record) return <DetailNotFound kind={kind} />;
  const product = toDetailProduct(record);
  const inCart = cart.items.some(item => item.id === record.id);
  if (record.sale === "open" && record.price && record.priceApproval === "approved") {
    product.offerState = "available";
    product.purchaseAction = <Button appearance="cut" disabled={inCart || cart.loading} onClick={() => cart.addDemo(record.id)}>{inCart ? "В демо-корзине" : "В демо-корзину →"}</Button>;
  }
  return <DetailPage product={product} />;
}
