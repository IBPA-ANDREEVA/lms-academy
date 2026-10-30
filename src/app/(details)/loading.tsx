import { PageContainer } from "@/features/public-shell";
import styles from "@/features/course-detail/route-fallback.module.css";

export default function DetailLoading() {
  return <main id="main-content" className={styles.main}><PageContainer size="content"><p role="status">Загружаем страницу обучения…</p></PageContainer></main>;
}
