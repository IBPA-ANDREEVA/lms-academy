import { testPreview } from "@/lib/site-environment";
import { PageContainer } from "@/features/public-shell";
import { PackageExplorer } from "./components/package-explorer";
import styles from "./packages-section.module.css";

export function PackagesSection() {
  return <section id="packages" className={styles.section} aria-label="Пакеты">
    <PageContainer reveal="cards" size="wide" className={styles.content}>
      {testPreview ? <PackageExplorer /> : <p>Пакеты пока недоступны. Опубликованные программы можно посмотреть в каталоге курсов.</p>}
    </PageContainer>
  </section>;
}
