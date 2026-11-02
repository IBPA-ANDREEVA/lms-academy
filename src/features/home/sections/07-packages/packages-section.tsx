import { PageContainer } from "@/features/public-shell";
import { PackageExplorer } from "./components/package-explorer";
import styles from "./packages-section.module.css";

export function PackagesSection() {
  return <section id="packages" className={styles.section} aria-label="Пакеты">
    <PageContainer size="wide" className={styles.content}>
      <div className={styles.intro}>
      <p className={styles.release}>ПРЕДПРОСМОТР · ПАКЕТЫ ПОКА НЕДОСТУПНЫ</p>
      </div>
      <PackageExplorer />
    </PageContainer>
  </section>;
}
