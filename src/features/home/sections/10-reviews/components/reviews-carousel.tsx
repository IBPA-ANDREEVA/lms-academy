"use client";

import { useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSnapCarousel } from "@/features/home/learning-offers/use-snap-carousel";
import styles from "../reviews-section.module.css";

const placeholders = [1, 2, 3, 4];

export function ReviewsCarousel() {
  const { trackRef, activeIndex, goTo, syncIndex } = useSnapCarousel(placeholders.length);
  const trackId = useId();
  const drag = useRef<{ x: number; left: number } | null>(null);

  return (
    <div className={styles.carousel} role="region" aria-roledescription="карусель" aria-label="Макеты будущих отзывов учеников">
      <div className={styles.carouselHeader}>
        <p>ОТЗЫВЫ И РЕКОМЕНДАЦИИ</p>
        <div className={styles.arrows}>
          <Button size="sm" intent="secondary" aria-label="Предыдущий макет отзыва" aria-controls={trackId} disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>←</Button>
          <Button size="sm" aria-label="Следующий макет отзыва" aria-controls={trackId} disabled={activeIndex === placeholders.length - 1} onClick={() => goTo(activeIndex + 1)}>→</Button>
        </div>
      </div>
      <div id={trackId} ref={trackRef} className={styles.track} onScroll={syncIndex} tabIndex={0} aria-label="Отзывы и рекомендации: прокрутка по горизонтали"
        onPointerDown={event => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.style.scrollSnapType = "none";
        }}
        onPointerMove={event => { if (drag.current) event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x); }}
        onPointerUp={event => { drag.current = null; event.currentTarget.style.scrollSnapType = ""; if(event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={event => { drag.current = null; event.currentTarget.style.scrollSnapType = ""; }}
        onLostPointerCapture={event => { drag.current = null; event.currentTarget.style.scrollSnapType = ""; }}
        onKeyDown={event => { if(event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); goTo(Math.max(0,Math.min(placeholders.length - 1,activeIndex + (event.key === "ArrowRight" ? 1 : -1)))); } }}
      >
        {placeholders.map((number) => (
          <article className={styles.card} key={number} role="group" aria-label={`Макет отзыва ${number} из ${placeholders.length}`}>
            <span className={styles.quote} aria-hidden="true">“</span>
            <div className={styles.textPlaceholder} aria-hidden="true" />
          </article>
        ))}
      </div>
      <div className={styles.pagination} aria-label="Страницы макетов отзывов">
        {placeholders.map((number, index) => <button type="button" key={number} aria-label={`Показать макет отзыва ${number}`} aria-current={activeIndex === index ? "true" : undefined} onClick={() => goTo(index)}><span /></button>)}
      </div>
    </div>
  );
}
