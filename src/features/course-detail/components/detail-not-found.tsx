import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/features/public-shell";
import type { DetailKind } from "../detail-data";
import styles from "../route-fallback.module.css";

export function DetailNotFound({ kind }: { kind: DetailKind }) {
  const mini = kind === "mini-course";
  return (
    <main id="main-content" tabIndex={-1} className={styles.main}>
      <PageContainer size="content">
        <h1>{mini ? "Страница мини-курса не найдена" : "Страница курса не найдена"}</h1>
        <p>Проверьте адрес или вернитесь к доступным направлениям обучения.</p>
        <ButtonLink href={mini ? "/mini-courses" : "/courses"} appearance="cut" intent="secondary">
          {mini ? "К мини-курсам →" : "К каталогу курсов →"}
        </ButtonLink>
      </PageContainer>
    </main>
  );
}
