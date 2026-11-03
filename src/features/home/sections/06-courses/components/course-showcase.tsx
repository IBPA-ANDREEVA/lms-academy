"use client";

import { useOfferSelectionMotion } from "../../../learning-offers/use-offer-selection-motion";
import { useRef, useState } from "react";
import { useSnapCarousel } from "../../../learning-offers/use-snap-carousel";
import { Button } from "@/components/ui/button";
import { CategoryNavigation, CourseCard } from "@/features/catalog";
import { directions } from "@/features/catalog/catalog-data";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { toCatalogItem } from "@/features/catalog/catalog-presentation";
import { CatalogState } from "@/features/catalog/components/catalog-state";
import styles from "../courses-section.module.css";

export function CourseShowcase() {
  const [selectedId, setSelectedId] = useState<string>();
  const catalog = useCatalog();
  const placeholderCourses = catalog.products.filter(p => p.kind === "course" && p.publication === "published" && p.approval === "approved").map(toCatalogItem);
  const placeholderDirections = directions.map(d => ({ ...d, href: "#catalog-status" }));
  const visibleCourses = selectedId ? placeholderCourses.filter((item) => item.directionId === selectedId) : placeholderCourses;

  const { activeIndex, trackRef, goTo, syncIndex, reset, canScroll } = useSnapCarousel(visibleCourses.length);

  const showProducts = catalog.status === "success" && visibleCourses.length > 0;
  const selectionKey = `${selectedId ?? "all"}:${catalog.status}:${visibleCourses.map(p => p.id).join(",")}`;
  useOfferSelectionMotion(trackRef, selectionKey);
  const stageRef = useRef<HTMLDivElement>(null);
  useFeaturedCourseScroll(stageRef, selectionKey);

  function selectDirection(id?: string) {
    setSelectedId(id);
    reset();
  }

  return (
    <div className={styles.showcase}>

      <CategoryNavigation items={placeholderDirections} resetHref="#catalog-status" selectedId={selectedId} label="Направления курсов" onSelect={selectDirection} />
      <div ref={stageRef} className={styles.featuredStage}>
      <div className={styles.track} ref={trackRef} onScroll={syncIndex} data-offer-carousel aria-label="Карточки курсов">
        {!showProducts ? <CatalogState status={catalog.status} filtered={Boolean(selectedId)} onReset={() => selectDirection(undefined)} /> : visibleCourses.map(({ id, course }) => <div className={styles.cardFrame} key={id}>
          <div data-featured-card className={styles.featuredCard}>
          <CourseCard course={course} variant="brutalist" demonstration={catalog.enabled} />
          </div>
        </div>)}
      </div>
      </div>
      {showProducts && canScroll && <div className={styles.carouselControls} aria-label="Навигация по карточкам">
        <Button appearance="neoBrutalist" intent="secondary" size="sm" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Предыдущая карточка">←</Button>
        <div className={styles.dots} aria-label="Страницы карточек">
          {visibleCourses.map((item, index) => <button type="button" key={item.id} aria-label={`Карточка ${index + 1} из ${visibleCourses.length}`} aria-current={activeIndex === index ? "true" : undefined} onClick={() => goTo(index)} />)}
        </div>
        <Button appearance="neoBrutalist" intent="secondary" size="sm" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === visibleCourses.length - 1} aria-label="Следующая карточка">→</Button>
      </div>}

    </div>
  );
}
