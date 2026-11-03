import { PageContainer } from "@/features/public-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import type { DetailProduct } from "../../detail-data";
import { SectionLabel } from "../../components/section-label";
import { PreviewPlayer } from "./components/preview-player";
import styles from "./video-preview-section.module.css";

export function VideoPreviewSection({ product }: { product: DetailProduct }) {
  return (
    <section id="preview" className={styles.section} aria-labelledby="preview-title">
      <PageContainer reveal size="content" className={styles.grid}>
        <div className={styles.copy}>
          <SectionLabel>ПУБЛИЧНОЕ ПРЕВЬЮ</SectionLabel>
          <SectionHeading id="preview-title" display>Посмотрите<br /><span>формат</span></SectionHeading>
          <p>Фрагмент занятия поможет оценить подачу до покупки. Публичное видео пока недоступно.</p>
        </div>
        <div className={styles.media}><PreviewPlayer src={product.previewUrl} captions={product.previewCaptionsUrl} /></div>
      </PageContainer>
    </section>
  );
}
