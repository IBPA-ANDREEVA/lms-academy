"use client";

import { useState } from "react";
import { CategoryNavigation, CourseCard, type CourseCardProps } from "@/features/catalog";
import { OfferCarousel } from "../../../learning-offers/offer-carousel";
import placeholderImage from "../../06-courses/course-photo-placeholder.png";
import styles from "../mini-courses-section.module.css";

const examples = [
  { id: "lashes", label: "Ресницы" },
  { id: "brows", label: "Брови" },
  { id: "lamination", label: "Ламинирование" },
];

export function MiniCourseExplorer() {
  const [selected, setSelected] = useState<string>();
  const visible = examples.filter((item) => !selected || item.id === selected);
  return <div className={styles.explorer}>
    <CategoryNavigation items={examples.map((item) => ({ ...item, href: "#mini-courses" }))} resetHref="#mini-courses" resetLabel="Все мини-курсы" label="Направления мини-курсов" selectedId={selected} onSelect={setSelected} />
    <OfferCarousel key={selected || "all"} label="Мини-курсы" items={visible.map((item) => {
      const course: CourseCardProps["course"] = { kind: "mini-course", title: "Здесь будет название мини-курса", direction: item.label, image: { src: placeholderImage, alt: "Здесь будет фото курса" } };
      return { id: item.id, content: <div className={styles.card}><p className={styles.cardLabel}>ЗАПИСЬ · МАКЕТ КАРТОЧКИ</p><CourseCard course={course} status="unavailable" /></div> };
    })} />
  </div>;
}
