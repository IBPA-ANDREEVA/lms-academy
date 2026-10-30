"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "./preview-player.module.css";

export function PreviewPlayer({ src, captions }: { src?: string; captions?: string }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (!src) {
    return <div className={styles.unavailable} role="status"><span aria-hidden="true">▷</span><strong>Публичное видео пока недоступно</strong><p>Превью появится после утверждения материала.</p></div>;
  }

  if (failed) {
    return <div className={styles.unavailable} role="alert"><strong>Не удалось загрузить превью</strong><p>Проверьте соединение и попробуйте ещё раз.</p><Button appearance="cut" intent="secondary" onClick={() => { setFailed(false); setAttempt((value) => value + 1); }}>Повторить загрузку →</Button></div>;
  }

  return (
    <video key={attempt} className={styles.video} controls preload="none" onError={() => setFailed(true)}>
      <source src={src} />
      {captions && <track kind="captions" src={captions} srcLang="ru" label="Русские субтитры" default />}
      Ваш браузер не поддерживает воспроизведение видео.
    </video>
  );
}
