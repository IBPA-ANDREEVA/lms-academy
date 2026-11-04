"use client";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import styles from "./component-preview-page.module.css";

export function CutButtonPreview() {
  const [presses, setPresses] = useState(0);
  const recordPress = () => setPresses(value => value + 1);
  return <div className={styles.cutReview} aria-label="Double Cut + Panel: состояния">
    <h3>Double Cut + Panel</h3>
    <p className={styles.note}>Демонстрация состояний общей кнопки. На интерактивных примерах проверьте наведение, нажатие и Tab.</p>
    <div className={styles.cutStates}>
      <div><p>Белая поверхность · тёмная панель</p><Button onClick={recordPress} appearance="cut">Подробнее →</Button></div>
      <div><p>Панель раскрыта · сливовый цвет</p><Button onClick={recordPress} appearance="cut" data-cut-state="hover">Подробнее →</Button></div>
      <div><p>Нажатие · 650 мс</p><Button onClick={recordPress} appearance="cut" data-cut-state="pressed">Подробнее →</Button></div>
      <div><p>Фокус клавиатуры</p><Button onClick={recordPress} appearance="cut" data-cut-state="focus">Подробнее →</Button></div>
      <div><p>Недоступно</p><Button onClick={recordPress} appearance="cut" disabled>Подробнее →</Button></div>
      <div data-cut-reduced-motion><p>Без движения</p><Button onClick={recordPress} appearance="cut" data-cut-state="hover">Подробнее →</Button></div>
    </div>
    <div className={styles.row} aria-label="Double Cut + Panel: варианты">
      <Button onClick={recordPress} appearance="cut" data-cut-variant="primary">Основная →</Button>
      <Button onClick={recordPress} appearance="cut" intent="secondary" data-cut-variant="secondary">Дополнительная <span aria-hidden="true">↗</span></Button>
      <ButtonLink appearance="cut" href="#form-controls" data-cut-variant="link">К форме →</ButtonLink>
      <Button onClick={recordPress} appearance="cut" loading data-cut-variant="loading">Загрузка →</Button>
    </div>
    <p role="status" className={styles.note}>Нажатий в демонстрации: {presses}. Данные не отправляются.</p>
    <div className={styles.inverse}><Button onClick={recordPress} appearance="cut" inverse data-cut-variant="inverse">На сливовом фоне →</Button></div>
  </div>;
}
