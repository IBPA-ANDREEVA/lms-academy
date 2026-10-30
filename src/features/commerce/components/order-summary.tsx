"use client";

import { useCart } from "../cart-provider";
import { formatDemoAmount } from "../demo-cart";
import { CartItems } from "./cart-items";
import styles from "../commerce.module.css";

export function OrderSummary({ showItems = false }: { showItems?: boolean }) {
  const cart = useCart();
  const pending = cart.loading || cart.scenario === "recalculating";
  return <section className={styles.summary} aria-label="Сумма заказа" aria-busy={pending}>
    <h2>{showItems ? "Ваш заказ" : "Сумма заказа"}</h2>
    {showItems && <CartItems compact removable={false} />}
    <dl className={styles.totals}>
      <div><dt>Стоимость примера</dt><dd>{pending ? "Пересчёт…" : formatDemoAmount(cart.total)}</dd></div>
      <div><dt>Сборы и налоги</dt><dd>Не рассчитаны</dd></div>
      <div className={styles.total}><dt>Демо-итог</dt><dd>{pending ? "Пересчёт…" : formatDemoAmount(cart.total)}</dd></div>
    </dl>
    <p className={styles.caption}>Итог к оплате пока не рассчитан.</p>
  </section>;
}
