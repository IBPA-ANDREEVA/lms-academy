import type { DetailModule } from "../../../detail-data";
import styles from "./curriculum-accordion.module.css";

const previewModules: DetailModule[] = Array.from({ length: 3 }, () => ({
  title: "Пример раздела программы",
  lessons: [{ title: "Название и длительность урока появятся после утверждения" }],
}));

export function CurriculumAccordion({ modules }: { modules?: DetailModule[] }) {
  const demonstration = !modules?.length;
  const items = demonstration ? previewModules : modules;
  return (
    <div className={styles.list}>
      {items.map((module, index) => (
        <details key={`${module.title}-${index}`} className={styles.module}>
          <summary><span className={styles.index}>{String(index + 1).padStart(2, "0")}</span><span>{module.title}</span><span className={styles.mark} aria-hidden="true">＋</span></summary>
          <div className={styles.lessons}>
            {demonstration && <p className={styles.demo}>Демонстрация структуры · не опубликованная программа</p>}
            <ol>{module.lessons.map((lesson, lessonIndex) => (
              <li key={`${lesson.title}-${lessonIndex}`}><span>{lesson.title}</span>{lesson.duration && <small>{lesson.duration}</small>}</li>
            ))}</ol>
          </div>
        </details>
      ))}
    </div>
  );
}
