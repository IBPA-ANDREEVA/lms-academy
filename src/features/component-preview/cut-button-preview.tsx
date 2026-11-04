"use client";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import styles from "./component-preview-page.module.css";

export function CutButtonPreview() {
  const [presses, setPresses] = useState(0);
  const recordPress = () => setPresses(value => value + 1);
  return <div className={styles.cutReview} aria-label="Cut: два варианта">
    <h3>Cut · Линия и мягкий акцент</h3>
    <p className={styles.note}>Общие кнопки по двум выбранным референсам. Проверьте наведение, нажатие и фокус с клавиатуры.</p>
    {(["line", "soft"] as const).map(variant => <section key={variant} data-cut-preview={variant} aria-label={variant === "line" ? "Линейный минимализм" : "Тихий акцент"}>
      <h4>{variant === "line" ? "Линейный минимализм" : "Тихий акцент"}</h4>
      <div className={styles.cutStates}>
        <div><p>По умолчанию</p><Button onClick={recordPress} appearance="cut" cutVariant={variant} data-cut-example="default">К ЗАДАНИЮ →</Button></div>
        <div><p>Наведение</p><Button onClick={recordPress} appearance="cut" cutVariant={variant} data-cut-state="hover">К ЗАДАНИЮ →</Button></div>
        <div><p>Фокус</p><Button onClick={recordPress} appearance="cut" cutVariant={variant} data-cut-state="focus">К ЗАДАНИЮ →</Button></div>
        <div><p>Недоступно</p><Button appearance="cut" cutVariant={variant} disabled>К ЗАДАНИЮ →</Button></div>
        <div><p>Загрузка</p><Button appearance="cut" cutVariant={variant} loading>К ЗАДАНИЮ →</Button></div>
        <div data-cut-reduced-motion><p>Без движения</p><Button onClick={recordPress} appearance="cut" cutVariant={variant} data-cut-state="hover">К ЗАДАНИЮ →</Button></div>
      </div>
      <div className={styles.cutInverse}>
        <Button onClick={recordPress} appearance="cut" cutVariant={variant} inverse data-cut-example="inverse">К ЗАДАНИЮ →</Button>
        <Button onClick={recordPress} appearance="cut" cutVariant={variant} inverse data-cut-state="hover">К ЗАДАНИЮ →</Button>
        <Button appearance="cut" cutVariant={variant} inverse disabled>Недоступно →</Button>
      </div>
    </section>)}
    <div className={styles.row}><ButtonLink appearance="cut" href="#form-controls" data-cut-example="link">К форме →</ButtonLink><Button appearance="cut" intent="destructive" onClick={recordPress}>Демонстрация действия →</Button></div>
    <p role="status" className={styles.note}>Нажатий в демонстрации: {presses}. Данные не отправляются.</p>
  </div>;
}
