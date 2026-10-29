"use client";

import { useId, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useSnapCarousel } from "./use-snap-carousel";
import styles from "./offer-carousel.module.css";

export function OfferCarousel({ items, label }: { items: { id: string; content: ReactNode }[]; label: string }) {
  const { trackRef, activeIndex, goTo, syncIndex, canScroll } = useSnapCarousel(items.length);
  const trackId = useId();
  return (
    <div className={styles.carousel} aria-label={label} role="region" aria-roledescription="карусель">
      {canScroll && <div className={styles.controls}>
        <span className={styles.counter} aria-live="polite">{activeIndex + 1} / {items.length}</span>
        <Button intent="secondary" size="sm" aria-controls={trackId} aria-label={`Назад: ${label}`} disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>←</Button>
        <Button size="sm" aria-controls={trackId} aria-label={`Далее: ${label}`} disabled={activeIndex === items.length - 1} onClick={() => goTo(activeIndex + 1)}>→</Button>
      </div>}
      <div ref={trackRef} id={trackId} className={styles.track} onScroll={syncIndex} data-offer-carousel>
        {items.map((item, index) => <div className={styles.item} key={item.id} data-active={activeIndex === index} role="group" aria-label={`${index + 1} из ${items.length}`}>{item.content}</div>)}
      </div>
      {canScroll && <div className={styles.pagination} aria-label={`Страницы: ${label}`}>
        {items.map((item, index) => <button key={item.id} type="button" aria-label={`${label}: карточка ${index + 1}`} aria-current={activeIndex === index ? "true" : undefined} onClick={() => goTo(index)}><span /></button>)}
      </div>}
    </div>
  );
}
