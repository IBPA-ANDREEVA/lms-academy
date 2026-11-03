"use client";

import { useOfferSelectionMotion } from "../../../learning-offers/use-offer-selection-motion";
import { useRef, useState } from "react";
import { useSnapCarousel } from "../../../learning-offers/use-snap-carousel";
import { Button } from "@/components/ui/button";
import { CategoryNavigation, CourseCard } from "@/features/catalog";
import { placeholderCourses, placeholderDirections } from "../placeholder-courses";
import styles from "../courses-section.module.css";

export function CourseShowcase() {
  const [selectedId, setSelectedId] = useState<string>();
  const visibleCourses = selectedId ? placeholderCourses.filter((item) => item.directionId === selectedId) : placeholderCourses;

  const { activeIndex, trackRef, goTo, syncIndex, reset, canScroll } = useSnapCarousel(visibleCourses.length);

  useOfferSelectionMotion(trackRef, selectedId);
  const stageRef = useRef<HTMLDivElement>(null);

  function selectDirection(id?: string) {
    setSelectedId(id);
    reset();
  }

  return (
    <div className={styles.showcase}>

      <CategoryNavigation items={placeholderDirections} resetHref="#catalog-status" selectedId={selectedId} label="Пример выбора направления" onSelect={selectDirection} />
      <div ref={stageRef} className={styles.featuredStage}>
      <div className={styles.track} ref={trackRef} onScroll={syncIndex} data-offer-carousel aria-label="Примеры карточек курсов">
        {visibleCourses.map(({ id, course }) => <div className={styles.cardFrame} key={id}>
          <div data-featured-card className={styles.featuredCard}>
          <CourseCard course={course} variant="brutalist" demonstration />
          </div>
        </div>)}
      </div>
      </div>
      {canScroll && <div className={styles.carouselControls} aria-label="Навигация по карточкам">
        <Button appearance="neoBrutalist" intent="secondary" size="sm" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Предыдущая карточка">←</Button>
        <div className={styles.dots} aria-label="Страницы карточек">
          {visibleCourses.map((item, index) => <button type="button" key={item.id} aria-label={`Карточка ${index + 1} из ${visibleCourses.length}`} aria-current={activeIndex === index ? "true" : undefined} onClick={() => goTo(index)} />)}
        </div>
        <Button appearance="neoBrutalist" intent="secondary" size="sm" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === visibleCourses.length - 1} aria-label="Следующая карточка">→</Button>
      </div>}

    </div>
  );
}
