import { PageContainer } from "@/features/public-shell";
import { CourseCard } from "../../course-card";
import { CatalogState } from "../../components/catalog-state";
import type { CatalogItem } from "../../catalog-data";
import type { CatalogResult } from "@/features/catalog/catalog-view-types";
import styles from "../03-courses/courses-section.module.css";

type Props = {
  items: CatalogItem[];
  active: boolean;
  filtered: boolean;
  onReset: () => void;
  demonstration: boolean;
  status?: CatalogResult["status"] | "loading";
};

export function CoursesSection({ items, active, filtered, onReset, demonstration, status = "success" }: Props) {
  const Heading = active ? "h1" : "h2";
  return <section className={styles.section} aria-labelledby="course-results-title">
    <PageContainer reveal="cards" size="wide">
      <div className={styles.heading}><Heading id="course-results-title">Курсы</Heading></div>
      {status === "unavailable" || status === "loading" || !items.length
        ? <CatalogState status={status} mini={false} filtered={filtered} onReset={onReset} />
        : <>
          <p className={styles.resultCount} role="status">Программ: {items.length}</p>
          <div className={styles.grid}>{items.map(item => <CourseCard key={item.id} course={item.course} variant="brutalist" demonstration={demonstration} />)}</div>
        </>}
    </PageContainer>
  </section>;
}
