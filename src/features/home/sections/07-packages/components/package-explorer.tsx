"use client";

import { useState } from "react";
import { CategoryNavigation } from "@/features/catalog";
import { Button } from "@/components/ui/button";
import { OfferCarousel } from "../../../learning-offers/offer-carousel";
import { packageSizes, type PackageSize } from "../package-preview-data";
import { PackageCard } from "./package-card";
import { PackageBuilder } from "./package-builder";
import styles from "../packages-section.module.css";

export function PackageExplorer() {
  const [filter, setFilter] = useState<string>();
  const [builderSize, setBuilderSize] = useState<PackageSize | null>(null);
  const sizes = packageSizes.filter((size) => !filter || String(size) === filter);
  return <div className={styles.explorer}>
    <CategoryNavigation items={packageSizes.map((size) => ({ id: String(size), label: `${size} ${size === 6 ? "направлений" : "направления"}`, href: "#packages" }))} resetHref="#packages" resetLabel="Все пакеты" label="Размер пакета" selectedId={filter} onSelect={setFilter} />
    <OfferCarousel key={filter || "all"} label="Пакеты" items={sizes.map((size) => ({ id: String(size), content: <PackageCard size={size} onExplore={() => setBuilderSize(size)} /> }))} />
    <div className={styles.builderCallout}>
      <span className={styles.plus} aria-hidden="true">+</span>
      <div><p>СОЗДАЙТЕ СВОЙ ПАКЕТ</p><h3>Нужна своя комбинация курсов?</h3><span>Попробуйте выбор направлений в деморежиме.</span></div>
      <Button appearance="neoBrutalist" onClick={() => setBuilderSize(2)}>СОБРАТЬ СВОЙ ПАКЕТ <span aria-hidden="true">→</span></Button>
    </div>
    {builderSize !== null && <PackageBuilder initialSize={builderSize} onClose={() => setBuilderSize(null)} />}
  </div>;
}
