import { PageContainer } from "@/features/public-shell";
import { MiniCourseExplorer } from "./components/mini-course-explorer";
import styles from "./mini-courses-section.module.css";

export function MiniCoursesSection() {
  return <section id="mini-courses" className={styles.section} aria-label="Мини-курсы">
    <PageContainer size="wide" className={styles.content}>
      <div className={styles.facts}><strong>ТОЛЬКО ЗАПИСЬ · БЕЗ КУРАТОРА</strong><span>Сертификат после завершения всех уроков</span></div>
      <MiniCourseExplorer />

    </PageContainer>
  </section>;
}
