import { PageContainer } from "@/features/public-shell";
import { LearningPreviewDemo } from "./components/learning-preview-demo";
import styles from "./learning-preview-section.module.css";

export function LearningPreviewSection() {
  return (
    <section data-flow-section id="learning-preview" className={styles.section} aria-labelledby="learning-preview-title">
      <PageContainer size="wide" className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.kicker}>КАК ПРОХОДИТ ОБУЧЕНИЕ</p>
          <h2 id="learning-preview-title" className={styles.heading}>
            <span>ПОПРОБУЙ</span><span>САМ.</span>
          </h2>
          <p className={styles.description}>
            Посмотрите пример урока, добавьте фото работы и узнайте, как выглядит обратная связь куратора.
          </p>
          <p className={styles.note}>ИНТЕРАКТИВНЫЙ ПРИМЕР ОБУЧЕНИЯ</p>
        </div>
        <LearningPreviewDemo />
      </PageContainer>
    </section>
  );
}
