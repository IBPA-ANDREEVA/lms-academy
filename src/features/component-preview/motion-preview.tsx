"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { SplashLoader } from "@/features/public-shell/splash-loader";
import { SectionReveal } from "@/features/public-shell/section-reveal";
import styles from "./motion-preview.module.css";

/** Explicitly manual demonstration; production loaders follow real boundaries. */
export function MotionPreview() {
  const [pending, setPending] = useState(false);
  const [replay, setReplay] = useState(0);
  return <div className={styles.preview}>
    <p>Демонстрация анимации. Начните и завершите ожидание вручную; данные не загружаются.</p>
    <div className={styles.controls}>
      <Button size="sm" onClick={() => setPending(value => !value)}>{pending ? "Завершить ожидание" : "Показать ожидание"}</Button>
      <Button size="sm" intent="secondary" onClick={() => setReplay(value => value + 1)}>Повторить появление</Button>
    </div>
    <div className={styles.sample}>
      <SplashLoader active={pending} inline />
      <SectionReveal key={replay}>
        <h3 data-motion-heading>Пример содержимого</h3>
        <p data-motion-item>Текст остаётся доступным при отключённой анимации.</p>
      </SectionReveal>
    </div>
    <p>Переход Wipe проверяется между <ButtonLink href="/courses" appearance="minimal">каталогом</ButtonLink> и страницами курсов. Выход из этой страницы примеров происходит без перехода.</p>
  </div>;
}
