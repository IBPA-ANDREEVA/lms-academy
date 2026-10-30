"use client";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-controls";
import { useCart } from "../cart-provider";

/** Shared failure/pending language for preview, cart and checkout. */
export function CartFeedback() {
  const cart = useCart();
  if (cart.loading) return <FormMessage>Загружаем корзину…</FormMessage>;
  if (cart.error || cart.scenario === "error") return <div>
    <FormMessage tone="error">Не удалось загрузить корзину. Повторите попытку или очистите тестовые данные.</FormMessage>
    <Button intent="secondary" onClick={cart.retry}>Попробовать снова</Button>
    {cart.demoEnabled && <Button intent="secondary" onClick={cart.clear}>Очистить тестовую корзину</Button>}
  </div>;
  return <>
    {cart.storageWarning && <FormMessage tone="error">Не удалось сохранить тестовую корзину в браузере. При обновлении страницы изменения могут потеряться.</FormMessage>}
    {cart.scenario === "recalculating" && <FormMessage>Демонстрация: пересчитываем стоимость…</FormMessage>}
    {cart.scenario === "unavailable" && <FormMessage tone="error">Демонстрация: продукт больше недоступен. Удалите его из корзины или сбросьте тестовое состояние.</FormMessage>}
    {cart.scenario === "price-changed" && <div>
      <FormMessage>Демонстрация: цена изменилась. Итог требует повторной проверки; оплата недоступна.</FormMessage>
      <Button intent="secondary" onClick={() => cart.setScenario("ready")}>Завершить проверку примера</Button>
    </div>}
  </>;
}
