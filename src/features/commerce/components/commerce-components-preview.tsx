"use client";

import { useCart } from "../cart-provider";
import { CartFeedback } from "./cart-feedback";
import { CartItems } from "./cart-items";
import { DemoControls } from "./demo-controls";
import { OrderSummary } from "./order-summary";

export function CommerceComponentsPreview() {
  const cart = useCart();
  return <div data-cart-surface tabIndex={-1}>
    <CartFeedback />
    {cart.items.length > 0 ? <><CartItems /><OrderSummary /></> : <p>Добавьте демонстрационный продукт, чтобы проверить строки и сумму. Предпросмотр корзины доступен в шапке.</p>}
    <DemoControls />
  </div>;
}
