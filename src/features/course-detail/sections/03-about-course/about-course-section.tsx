import { PageContainer } from "@/features/public-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import type { DetailProduct } from "../../detail-data";
import { SectionLabel } from "../../components/section-label";
import { CourseOutcomes } from "./components/course-outcomes";
import styles from "./about-course-section.module.css";

export function AboutCourseSection({ product }: { product: DetailProduct }) {
  return (
    <section id="about-course" className={styles.section} aria-labelledby="about-course-title">
      <PageContainer size="content" className={styles.grid}>
        <div className={styles.heading}>
          <SectionLabel>О ПРОГРАММЕ</SectionLabel>
          <SectionHeading id="about-course-title" display>{product.kind === "mini-course" ? <>Короче.<br /><span>По делу.</span></> : <>Знания.<br /><span>Практика.</span></>}</SectionHeading>
          <p>Содержание и результаты будут точными только после утверждения учебной программы.</p>
        </div>
        <CourseOutcomes product={product} />
      </PageContainer>
    </section>
  );
}
