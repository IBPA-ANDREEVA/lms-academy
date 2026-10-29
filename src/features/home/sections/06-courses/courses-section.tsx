import { PageContainer } from "@/features/public-shell";
import { CourseShowcase } from "./components/course-showcase";
import styles from "./courses-section.module.css";

export function CoursesSection() {
  return (
    <section id="catalog-status" className={styles.section} aria-labelledby="courses-title">
      <PageContainer size="wide" className={styles.container}>
        <div className={styles.intro}>
          <p className={styles.kicker}>ОСНОВНЫЕ КУРСЫ</p>
          <h2 id="courses-title" className={styles.heading}><span>ВЫБЕРИТЕ СВОЁ</span><span>НАПРАВЛЕНИЕ</span></h2>
          <p className={styles.description}>Курсы появятся здесь после публикации. Пока можно посмотреть, как будет работать выбор направления.</p>
        </div>
        <CourseShowcase />
      </PageContainer>
    </section>
  );
}
