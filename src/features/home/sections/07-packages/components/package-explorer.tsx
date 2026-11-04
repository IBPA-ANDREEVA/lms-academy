"use client";

import { useOfferSelectionMotion } from "../../../learning-offers/use-offer-selection-motion";
import { useRef, useState } from "react";
import { OfferCarousel } from "../../../learning-offers/offer-carousel";
import { packageSizes, type PackageSize } from "../package-preview-data";
import { PackageCard } from "./package-card";
import { PackageBuilder } from "./package-builder";
import styles from "../packages-section.module.css";

export function PackageExplorer() {
  const [builderSize, setBuilderSize] = useState<PackageSize | null>(null);
  const root = useRef<HTMLDivElement>(null);
  useOfferSelectionMotion(root, "packages", false);
  return <div ref={root} className={styles.explorer}>
    <OfferCarousel label="Пакеты" items={packageSizes.map((size) => ({ id: String(size), content: <PackageCard size={size} onExplore={() => setBuilderSize(size)} /> }))} />
    {builderSize !== null && <PackageBuilder initialSize={builderSize} onClose={() => setBuilderSize(null)} />}
  </div>;
}
