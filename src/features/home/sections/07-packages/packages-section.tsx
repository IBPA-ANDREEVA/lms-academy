import { PageContainer } from "@/features/public-shell";
import { PackageExplorer } from "./components/package-explorer";
import styles from "./packages-section.module.css";

export function PackagesSection() {
  return <section id="packages" className={styles.section} aria-labelledby="packages-title">
    <PageContainer size="wide" className={styles.content}>
      <div className={styles.intro}>
      <p className={styles.kicker}>ПАКЕТЫ КУРСОВ</p>
      <h2 id="packages-title" className={styles.heading}><span>ГОТОВЫЕ ПУТИ</span>{" "}<span>РАЗВИТИЯ</span></h2>
      <p className={styles.description}>Несколько направлений в одном пакете. Посмотрите будущие форматы и попробуйте собрать свой вариант.</p>
      <p className={styles.release}>ПРЕДПРОСМОТР · ПАКЕТЫ ПОКА НЕДОСТУПНЫ</p>
      </div>
      <PackageExplorer />
    </PageContainer>
  </section>;
}
