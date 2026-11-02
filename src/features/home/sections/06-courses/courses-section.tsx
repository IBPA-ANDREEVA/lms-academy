import { PageContainer } from "@/features/public-shell";
import { CourseShowcase } from "./components/course-showcase";
import styles from "./courses-section.module.css";

export function CoursesSection() {
  return (
    <section id="catalog-status" className={styles.section} aria-label="Основные курсы">
      <PageContainer size="wide" className={styles.container}>

        <CourseShowcase />
      </PageContainer>
    </section>
  );
}
