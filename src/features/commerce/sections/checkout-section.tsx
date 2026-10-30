"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { useCart } from "../cart-provider";
import { CartFeedback } from "../components/cart-feedback";
import { DemoControls } from "../components/demo-controls";
import { OrderSummary } from "../components/order-summary";
import { CheckoutBuyer } from "./checkout-buyer";
import { CheckoutAgreements } from "./checkout-agreements";
import { CheckoutPayment } from "./checkout-payment";
import styles from "../commerce.module.css";

export function CheckoutSection() {
  const cart = useCart();
  return <div data-cart-surface tabIndex={-1} aria-label="Оформление заказа">
    <CartFeedback />
    {!cart.loading && !cart.error && (cart.items.length ? <div className={styles.checkoutGrid}>
      <div className={styles.checkoutForm}>
        <CheckoutBuyer /><CheckoutAgreements /><CheckoutPayment />
      </div>
      <aside className={styles.checkoutSummary}><OrderSummary showItems /><Link className={styles.back} href="/cart">Изменить корзину</Link></aside>
    </div> : <div className={styles.empty}><h2>Нет продуктов для оформления</h2><p>Вернитесь в корзину, чтобы выбрать обучение.</p><ButtonLink appearance="cut" href="/cart">Вернуться в корзину</ButtonLink></div>)}
    <DemoControls />
  </div>;
}
