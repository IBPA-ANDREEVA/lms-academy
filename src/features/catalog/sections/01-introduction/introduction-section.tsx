import { PageContainer } from "@/features/public-shell";
import styles from "./introduction-section.module.css";

/** Compact catalog entry; format and filter controls follow immediately. */
export function IntroductionSection() {
  return <section className={styles.introduction} aria-labelledby="catalog-title">
    <PageContainer size="wide">
      <h1 id="catalog-title">Каталог обучения</h1>
    </PageContainer>
  </section>;
}
