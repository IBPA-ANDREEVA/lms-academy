"use client";

import { useRef } from "react";
import { useCart } from "../cart-provider";
import { formatDemoAmount } from "../demo-cart";
import styles from "../commerce.module.css";

export function CartItems({ compact = false, removable = true }: { compact?: boolean; removable?: boolean }) {
  const cart = useCart();
  const root = useRef<HTMLUListElement>(null);
  return <ul ref={root} className={`${styles.items} ${compact ? styles.compact : ""}`} aria-label="Выбранные продукты">
    {cart.items.map((item, index) => <li key={item.id} className={styles.item}>
      <div className={styles.placeholder} aria-label="Изображение курса: заглушка" role="img"><span aria-hidden="true" /></div>
      <div className={styles.itemInfo}>
        <p className={styles.eyebrow}>{item.kind} · демо</p>
        <h3>{item.title}</h3>
        {!compact && item.kind === "Мини-курс" && <p className={styles.caption}>Только записи</p>}
        {index === 0 && cart.scenario === "unavailable" && <p className={styles.problem}>Недоступен · тестовое состояние</p>}
        {index === 0 && cart.scenario === "price-changed" && <p className={styles.problem}>Цена требует проверки · тестовое состояние</p>}
      </div>
      <strong className={styles.price}>{formatDemoAmount(item.amount)}</strong>
      {removable && <button type="button" className={styles.remove} aria-label={`Удалить: ${item.title}`} onClick={() => {
        const buttons = root.current?.querySelectorAll<HTMLButtonElement>("button");
        const next = buttons?.[index + 1] || buttons?.[index - 1];
        // Preserve keyboard location after removing the focused control.
        next?.focus();
        if (!next) root.current?.closest<HTMLElement>("[data-cart-surface]")?.focus();
        cart.remove(item.id);
      }}><span aria-hidden="true">×</span></button>}
    </li>)}
  </ul>;
}
