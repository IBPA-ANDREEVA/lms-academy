"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { useSnapCarousel } from "@/features/home/learning-offers/use-snap-carousel";
import styles from "../reviews-section.module.css";

const placeholders = [1, 2, 3];

export function ReviewsCarousel() {
  const { trackRef, activeIndex, goTo, syncIndex } = useSnapCarousel();
  const trackId = useId();

  return (
    <div className={styles.carousel} role="region" aria-roledescription="карусель" aria-label="Макеты будущих отзывов учеников">
      <div className={styles.carouselHeader}>
        <p>МНЕНИЯ УЧЕНИКОВ · ПРЕДПРОСМОТР</p>
        <div className={styles.arrows}>
          <Button size="sm" intent="secondary" aria-label="Предыдущий макет отзыва" aria-controls={trackId} disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>←</Button>
          <Button size="sm" aria-label="Следующий макет отзыва" aria-controls={trackId} disabled={activeIndex === placeholders.length - 1} onClick={() => goTo(activeIndex + 1)}>→</Button>
        </div>
      </div>
      <div id={trackId} ref={trackRef} className={styles.track} onScroll={syncIndex}>
        {placeholders.map((number) => (
          <article className={styles.card} key={number} role="group" aria-label={`Макет отзыва ${number} из ${placeholders.length}`}>
            <span className={styles.quote} aria-hidden="true">“</span>
            <div className={styles.textPlaceholder}>ЗДЕСЬ БУДЕТ ТЕКСТ<br />ПОДТВЕРЖДЁННОГО ОТЗЫВА</div>
            <div className={styles.identity}>
              <span className={styles.photoPlaceholder}>ФОТО</span>
              <div><strong>ИМЯ УЧЕНИКА</strong><span>Название курса после публикации</span><small>Данные появятся после проверки</small></div>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.pagination} aria-label="Страницы макетов отзывов">
        {placeholders.map((number, index) => <button type="button" key={number} aria-label={`Показать макет отзыва ${number}`} aria-current={activeIndex === index ? "true" : undefined} onClick={() => goTo(index)}><span /></button>)}
      </div>
    </div>
  );
}
