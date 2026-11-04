"use client";

import { useOfferSelectionMotion } from "../../../learning-offers/use-offer-selection-motion";
import { useRef } from "react";
import { CourseCard } from "@/features/catalog";
import { ButtonLink } from "@/components/ui/button";
import { OfferCarousel } from "../../../learning-offers/offer-carousel";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { toCatalogItem } from "@/features/catalog/catalog-presentation";
import { CatalogState } from "@/features/catalog/components/catalog-state";
import styles from "../mini-courses-section.module.css";



export function MiniCourseExplorer() {
  const catalog = useCatalog();
  const visible = catalog.products.filter(p => p.kind === "mini-course" && p.publication === "published" && p.approval === "approved").slice(0, 3).map(toCatalogItem);
  const root = useRef<HTMLDivElement>(null);
  useOfferSelectionMotion(root, `${catalog.status}:${visible.map(item => item.id).join(",")}`, true);
  return <div ref={root} className={styles.explorer}>
    <div className={styles.toolbar}>
      <p className={styles.facts}>ТОЛЬКО ЗАПИСЬ · БЕЗ КУРАТОРА</p>
      <div className={styles.seeAll}><ButtonLink href="/mini-courses" appearance="cut">Все мини-курсы →</ButtonLink></div>
    </div>
    {catalog.status === "unavailable" || catalog.status === "loading" || !visible.length ? <CatalogState status={catalog.status} mini /> : <OfferCarousel mobileGrid label="Мини-курсы" items={visible.map((item) => {
      const course = item.course;
      return { id: item.id, content: <div className={styles.card}><CourseCard course={course} variant="compact" demonstration={catalog.enabled} /></div> };
    })} />}
  </div>;
}
