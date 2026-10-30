"use client";

import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { useCart } from "../cart-provider";
import { CartFeedback } from "../components/cart-feedback";
import { CartItems } from "../components/cart-items";
import { DemoControls } from "../components/demo-controls";
import { OrderSummary } from "../components/order-summary";
import styles from "../commerce.module.css";

export function CartSection() {
  const cart = useCart();
  const blocked = cart.loading || cart.error || cart.scenario !== "ready";
  return <section className={styles.cartSection} data-cart-surface tabIndex={-1} aria-label="Содержимое корзины">
    <CartFeedback />
    {!cart.loading && !cart.error && (cart.items.length ? <>
      <CartItems />
      <OrderSummary />
      <div className={styles.actions}>
        {blocked ? <Button appearance="cut" disabled>Перейти к оплате</Button> : <ButtonLink appearance="cut" href="/checkout">Перейти к оплате <span aria-hidden="true">→</span></ButtonLink>}
        <Link href="/courses">Продолжить выбор</Link>
      </div>
      <p className={styles.caption}>Соглашения перед оплатой — на следующем шаге.</p>
    </> : <div className={styles.empty}>
      <h2>Пока здесь пусто</h2><p>Выберите обучение, к которому хотите вернуться.</p>
      <div className={styles.actions}><ButtonLink appearance="cut" href="/courses">Выбрать курс <span aria-hidden="true">→</span></ButtonLink><Link href="/mini-courses">Смотреть мини-курсы</Link></div>
    </div>)}
    <DemoControls />
  </section>;
}
