import { PageContainer } from "@/features/public-shell";
import { UsaModulePreview } from "./components/usa-module-preview";
import { UsaModuleCta } from "./components/usa-module-cta";
import styles from "./start-usa-section.module.css";

export function StartUsaSection() {
  return <section id="start-usa" className={styles.section} aria-labelledby="start-usa-title">
    <PageContainer size="wide" className={styles.layout}>
      <div className={styles.intro}>
        <p className={styles.kicker}>СПЕЦИАЛЬНЫЙ МОДУЛЬ</p>
        <h2 id="start-usa-title" className={styles.heading}><span>СТАРТ</span>{" "}<span>В США</span></h2>
        <p className={styles.description}>Что нужно знать бьюти-мастеру о работе в США: от безопасности до развития клиентской базы.</p>
        <p className={styles.format}>ОДИН МОДУЛЬ · БЕЗ КУРАТОРА</p>
        <p className={styles.release}>Предпросмотр. Дата выхода пока не определена.</p>
        <UsaModuleCta />
      </div>
      <UsaModulePreview />
    </PageContainer>
  </section>;
}
