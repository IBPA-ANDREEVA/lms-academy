import { testPreview } from "@/lib/site-environment";
import { PageContainer } from "@/features/public-shell";
import { UsaModulePreview } from "./components/usa-module-preview";
import { UsaModuleCta } from "./components/usa-module-cta";
import styles from "./start-usa-section.module.css";

export function StartUsaSection() {
  return <section id="start-usa" className={styles.section} aria-label="Старт в США">
    <PageContainer reveal="compact" size="wide" className={styles.layout}>
      {testPreview ? <><div className={styles.intro}>
        <p className={styles.format}>ОДИН МОДУЛЬ · БЕЗ КУРАТОРА</p>

        <UsaModuleCta />
      </div>
      <UsaModulePreview /></> : <p>Содержание и условия модуля будут доступны после утверждения и публикации.</p>}
    </PageContainer>
  </section>;
}
