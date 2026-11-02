import { PageContainer } from "@/features/public-shell";
import { UsaModulePreview } from "./components/usa-module-preview";
import { UsaModuleCta } from "./components/usa-module-cta";
import styles from "./start-usa-section.module.css";

export function StartUsaSection() {
  return <section id="start-usa" className={styles.section} aria-label="Старт в США">
    <PageContainer size="wide" className={styles.layout}>
      <div className={styles.intro}>
        <p className={styles.format}>ОДИН МОДУЛЬ · БЕЗ КУРАТОРА</p>
        <p className={styles.release}>Предпросмотр. Дата выхода пока не определена.</p>
        <UsaModuleCta />
      </div>
      <UsaModulePreview />
    </PageContainer>
  </section>;
}
