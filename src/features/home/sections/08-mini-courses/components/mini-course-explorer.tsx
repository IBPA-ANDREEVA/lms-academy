"use client";

import { useOfferSelectionMotion } from "../../../learning-offers/use-offer-selection-motion";
import { useRef, useState } from "react";
import { CategoryNavigation, CourseCard } from "@/features/catalog";
import { OfferCarousel } from "../../../learning-offers/offer-carousel";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { toCatalogItem } from "@/features/catalog/catalog-presentation";
import { CatalogState } from "@/features/catalog/components/catalog-state";
import { directions } from "@/features/catalog/catalog-data";
import styles from "../mini-courses-section.module.css";



export function MiniCourseExplorer() {
  const [selected, setSelected] = useState<string>();
  const catalog = useCatalog();
  const examples = directions;
  const visible = catalog.products.filter(p => p.kind === "mini-course" && p.publication === "published" && p.approval === "approved" && (!selected || p.category.id === selected)).map(toCatalogItem);
  const root = useRef<HTMLDivElement>(null);
  useOfferSelectionMotion(root, `${selected ?? "all"}:${catalog.status}:${visible.length}`, true);
  return <div ref={root} className={styles.explorer}>
    <CategoryNavigation items={examples.map((item) => ({ ...item, href: "#mini-courses" }))} resetHref="#mini-courses" resetLabel="Все мини-курсы" label="Направления мини-курсов" selectedId={selected} onSelect={setSelected} />
    {catalog.status === "unavailable" || catalog.status === "loading" || !visible.length ? <CatalogState status={catalog.status} mini filtered={Boolean(selected)} onReset={() => setSelected(undefined)} /> : <OfferCarousel mobileGrid key={selected || "all"} label="Мини-курсы" items={visible.map((item) => {
      const course = item.course;
      return { id: item.id, content: <div className={styles.card}><CourseCard course={course} variant="compact" demonstration={catalog.enabled} /></div> };
    })} />}
  </div>;
}
