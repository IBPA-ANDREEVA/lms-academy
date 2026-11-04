import { PageContainer } from "@/features/public-shell";
import { MiniCourseExplorer } from "./components/mini-course-explorer";
import styles from "./mini-courses-section.module.css";

export function MiniCoursesSection() {
  return <section id="mini-courses" className={styles.section} aria-label="Мини-курсы">
    <PageContainer reveal="compact" size="wide" className={styles.content}>
      <MiniCourseExplorer />

    </PageContainer>
  </section>;
}
