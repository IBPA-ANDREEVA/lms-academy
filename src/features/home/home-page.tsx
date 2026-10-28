import { PageContainer } from "@/features/public-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./home-page.module.css";

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.main}>
      <PageContainer size="content">
        <SectionHeading as="h1" description="Каталог курсов пока недоступен.">
          Обучение в сфере красоты
        </SectionHeading>
      </PageContainer>
    </main>
  );
}
