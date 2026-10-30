import { PageContainer } from "@/features/public-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import type { DetailProduct } from "../../detail-data";
import { SectionLabel } from "../../components/section-label";
import { CurriculumAccordion } from "./components/curriculum-accordion";
import styles from "./curriculum-section.module.css";

export function CurriculumSection({ product }: { product: DetailProduct }) {
  return (
    <section id="curriculum" className={styles.section} aria-labelledby="curriculum-title">
      <PageContainer size="content" className={styles.grid}>
        <div className={styles.copy}>
          <SectionLabel>ПРОГРАММА</SectionLabel>
          <SectionHeading id="curriculum-title" display>Путь<br /><span>по темам</span></SectionHeading>
          <p>Публичная программа покажет порядок модулей и уроков. Записи и платные материалы открываются только после покупки.</p>
        </div>
        <CurriculumAccordion modules={product.modules} />
      </PageContainer>
    </section>
  );
}
