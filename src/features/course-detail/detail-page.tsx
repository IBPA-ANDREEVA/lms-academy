import type { DetailProduct } from "./detail-data";
import { DetailSeam } from "./components/detail-seam";
import { HeroPurchaseSection } from "./sections/01-hero-purchase/hero-purchase-section";
import { VideoPreviewSection } from "./sections/02-video-preview/video-preview-section";
import { AboutCourseSection } from "./sections/03-about-course/about-course-section";
import { CurriculumSection } from "./sections/04-curriculum/curriculum-section";
import { TrainerSection } from "./sections/05-trainer/trainer-section";
import { PurchaseTermsSection } from "./sections/06-purchase-terms/purchase-terms-section";
import styles from "./detail-page.module.css";

export function DetailPage({ product }: { product: DetailProduct }) {
  return (
    <main id="main-content" tabIndex={-1} className={styles.page} data-kind={product.kind}>
      <HeroPurchaseSection product={product} />
      <DetailSeam variant="preview" />
      <VideoPreviewSection product={product} />
      <AboutCourseSection product={product} />
      <CurriculumSection product={product} />
      <DetailSeam variant="trainer" />
      <TrainerSection product={product} />
      <PurchaseTermsSection product={product} />
    </main>
  );
}
