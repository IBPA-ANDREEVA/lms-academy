"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/features/public-shell";
import styles from "@/features/course-detail/route-fallback.module.css";

export default function DetailError({ retry }: { error: Error; retry: () => void }) {
  return <main id="main-content" className={styles.main}><PageContainer size="content"><h1>Не удалось загрузить страницу</h1><p role="alert">Попробуйте ещё раз или вернитесь в каталог.</p><div className={styles.actions}><Button appearance="cut" intent="secondary" onClick={retry}>Повторить →</Button><ButtonLink href="/courses" appearance="cut" intent="secondary">К курсам →</ButtonLink><ButtonLink href="/mini-courses" appearance="cut" intent="secondary">К мини-курсам →</ButtonLink></div></PageContainer></main>;
}
