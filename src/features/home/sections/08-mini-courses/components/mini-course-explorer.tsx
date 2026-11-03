"use client";

import { useOfferSelectionMotion } from "../../../learning-offers/use-offer-selection-motion";
import { useRef, useState } from "react";
import { CategoryNavigation, CourseCard, type CourseCardProps } from "@/features/catalog";
import { OfferCarousel } from "../../../learning-offers/offer-carousel";
import styles from "../mini-courses-section.module.css";

const examples = [
  { id: "lashes", label: "Ресницы" },
  { id: "brows", label: "Брови" },
  { id: "makeup", label: "Макияж" },
];

export function MiniCourseExplorer() {
  const [selected, setSelected] = useState<string>();
  const visible = examples.filter((item) => !selected || item.id === selected);
  const root = useRef<HTMLDivElement>(null);
  useOfferSelectionMotion(root, selected, true);
  return <div ref={root} className={styles.explorer}>
    <CategoryNavigation items={examples.map((item) => ({ ...item, href: "#mini-courses" }))} resetHref="#mini-courses" resetLabel="Все мини-курсы" label="Направления мини-курсов" selectedId={selected} onSelect={setSelected} />
    <OfferCarousel mobileGrid key={selected || "all"} label="Мини-курсы" items={visible.map((item) => {
      const course: CourseCardProps["course"] = { href: `/mini-courses/mini-${item.id}`, kind: "mini-course", title: item.label, direction: item.label };
      return { id: item.id, content: <div className={styles.card}><CourseCard course={course} variant="compact" demonstration /></div> };
    })} />
  </div>;
}
