import { PageContainer } from "@/features/public-shell";
import { PackageExplorer } from "./components/package-explorer";
import styles from "./packages-section.module.css";

export function PackagesSection() {
  return <section id="packages" className={styles.section} aria-label="Пакеты">
    <PageContainer reveal="cards" size="wide" className={styles.content}>
      <div className={styles.intro}>
        <p className={styles.kicker}>ФОРМАТ ОБУЧЕНИЯ</p>
        <h2 className={styles.heading}>СОБЕРИТЕ<span>СВОЙ ПАКЕТ.</span></h2>
        <p className={styles.description}>Несколько направлений в одной программе.</p>
      </div>
      <PackageExplorer />
    </PageContainer>
  </section>;
}
