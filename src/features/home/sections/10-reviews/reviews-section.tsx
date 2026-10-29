import { PageContainer } from "@/features/public-shell";
import { ReviewsCarousel } from "./components/reviews-carousel";
import styles from "./reviews-section.module.css";

export function ReviewsSection() {
  return (
    <section data-flow-section id="reviews" className={styles.section} aria-labelledby="reviews-title">
      <PageContainer size="wide" className={styles.content}>
        <div className={styles.top}>
          <div className={styles.intro}>
            <p className={styles.kicker}>ОТЗЫВЫ И РЕКОМЕНДАЦИИ</p>
            <h2 id="reviews-title" className={styles.heading}>
              <span>ОПЫТ,</span><span>КОТОРЫМ</span><span>ДЕЛЯТСЯ</span>
            </h2>
            <p className={styles.description}>Здесь появятся отзывы учеников и профессиональные рекомендации после проверки и публикации.</p>
            <p className={styles.phase}>ПРЕДПРОСМОТР РАЗДЕЛА · ЭТАП 3</p>
          </div>
          <ReviewsCarousel />
        </div>
        <div className={styles.recommendations}>
          <div>
            <h3>РЕКОМЕНДАЦИИ СПЕЦИАЛИСТОВ</h3>
            <p>Место для проверенных рекомендаций после согласования материалов.</p>
          </div>
          <div className={styles.recommendationPlaceholder} aria-label="Макет будущей рекомендации специалиста">ЗДЕСЬ БУДЕТ ПОДТВЕРЖДЁННАЯ<br />РЕКОМЕНДАЦИЯ СПЕЦИАЛИСТА</div>
        </div>
      </PageContainer>
    </section>
  );
}
