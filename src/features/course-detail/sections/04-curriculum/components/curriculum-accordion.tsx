import type { DetailModule } from "../../../detail-data";
import styles from "./curriculum-accordion.module.css";

export function CurriculumAccordion({ modules }: { modules?: DetailModule[] }) {
  const items = modules ?? [];
  return (
    <div className={styles.list}>
      {items.map((module, index) => (
        <details key={`${module.title}-${index}`} className={styles.module}>
          <summary><span className={styles.index}>{String(index + 1).padStart(2, "0")}</span><span>{module.title}</span><span className={styles.mark} aria-hidden="true">＋</span></summary>
          <div className={styles.lessons}>

            <ol>{module.lessons.map((lesson, lessonIndex) => (
              <li key={`${lesson.title}-${lessonIndex}`}><span>{lesson.title}</span>{lesson.duration && <small>{lesson.duration}</small>}</li>
            ))}</ol>
          </div>
        </details>
      ))}
    </div>
  );
}
