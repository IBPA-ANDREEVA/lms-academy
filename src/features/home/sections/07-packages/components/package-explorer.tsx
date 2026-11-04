"use client";

import { useOfferSelectionMotion } from "../../../learning-offers/use-offer-selection-motion";
import { useRef } from "react";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { CatalogState } from "@/features/catalog/components/catalog-state";
import { useCart } from "@/features/commerce/cart-provider";
import { OfferCarousel } from "../../../learning-offers/offer-carousel";
import { PackageCard } from "./package-card";
import styles from "../packages-section.module.css";

export function PackageExplorer() {
  const catalog = useCatalog();
  const cart = useCart();
  const root = useRef<HTMLDivElement>(null);
  const visible = catalog.packages.slice(0, 3);
  useOfferSelectionMotion(root, `${catalog.status}:${visible.map(item => item.id).join(",")}`, false);
  const status = !catalog.enabled ? "empty" : catalog.status;
  return <div ref={root} className={styles.explorer}>
    {status !== "success" || !visible.length ? <CatalogState status={status} productType="package" /> :
      <OfferCarousel label="Пакеты" items={visible.map(item => ({ id: item.id, content:
        <PackageCard item={item} inCart={cart.items.some(selected => selected.id === item.id)} disabled={cart.loading || cart.error}
          onAdd={() => cart.addDemo(item.id)} />,
      }))} />}
  </div>;
}
