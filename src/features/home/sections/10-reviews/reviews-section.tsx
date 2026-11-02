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


          </div>
          <ReviewsCarousel />
        </div>
      </PageContainer>
    </section>
  );
}
