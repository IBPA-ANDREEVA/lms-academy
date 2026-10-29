import { PageContainer } from "@/features/public-shell";
import { MiniCourseExplorer } from "./components/mini-course-explorer";
import styles from "./mini-courses-section.module.css";

export function MiniCoursesSection() {
  return <section id="mini-courses" className={styles.section} aria-labelledby="mini-courses-title">
    <PageContainer size="wide" className={styles.content}>
      <div className={styles.intro}>
      <p className={styles.kicker}>МИНИ-КУРСЫ</p>
      <h2 id="mini-courses-title" className={styles.heading}><span>МАЛЕНЬКИЙ ФОРМАТ.</span>{" "}<span>БОЛЬШОЙ ФОКУС.</span></h2>
      <p className={styles.description}>Короткие записанные уроки для конкретных навыков. Учитесь в своём темпе.</p>
      </div>
      <div className={styles.facts}><strong>ТОЛЬКО ЗАПИСЬ · БЕЗ КУРАТОРА</strong><span>Сертификат после завершения всех уроков</span></div>
      <MiniCourseExplorer />
      <p className={styles.catalogNote}>Сейчас показаны макеты карточек. Каталог мини-курсов появится после публикации программ.</p>
    </PageContainer>
  </section>;
}
