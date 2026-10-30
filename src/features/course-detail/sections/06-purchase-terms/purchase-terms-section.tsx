import Link from "next/link";
import { PageContainer } from "@/features/public-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import type { DetailProduct } from "../../detail-data";
import { PurchasePanel } from "../../components/purchase-panel";
import { SectionLabel } from "../../components/section-label";
import { TermsList } from "./components/terms-list";
import styles from "./purchase-terms-section.module.css";

export function PurchaseTermsSection({ product }: { product: DetailProduct }) {
  return (
    <section id="enroll" className={styles.section} aria-labelledby="terms-title">
      <PageContainer size="content">
        <div className={styles.grid}>
          <div className={styles.intro}>
            <SectionLabel>УСЛОВИЯ ОБУЧЕНИЯ</SectionLabel>
            <SectionHeading id="terms-title" display>Перед<br /><span>выбором</span></SectionHeading>
            <p>Условия покупки будут окончательными только после публикации продукта и правовых документов.</p>
          </div>
          <TermsList product={product} />
        </div>
        <div className={styles.finish}>
          <div><p className={styles.finishLabel}>ЕЩЁ РАЗ ОБ УСЛОВИЯХ</p><p>Сначала проверьте программу, цену, срок доступа и правила возврата.</p><Link href={product.kind === "mini-course" ? "/courses" : "/mini-courses"}>{product.kind === "mini-course" ? "Посмотреть курсы с куратором →" : "Посмотреть мини-курсы в записи →"}</Link></div>
          <PurchasePanel product={product} compact />
        </div>
      </PageContainer>
    </section>
  );
}
