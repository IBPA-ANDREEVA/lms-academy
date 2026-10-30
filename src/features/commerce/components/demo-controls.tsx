"use client";

import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form-controls";
import { useCart } from "../cart-provider";
import type { DemoScenario } from "../demo-cart";
import styles from "../commerce.module.css";

export function DemoControls({ compact = false }: { compact?: boolean }) {
  const cart = useCart();
  if (!cart.demoEnabled || cart.loading || cart.error) return null;
  return <div className={styles.demo}>
    <p className={styles.caption}>Демо · оплата недоступна</p>
    <div className={styles.demoActions}>
      {!cart.items.some(item => item.id === "demo-course") && <Button intent="secondary" size="sm" onClick={() => cart.addDemo("demo-course")}>Добавить тестовый курс</Button>}
      {!compact && !cart.items.some(item => item.id === "demo-mini") && <Button intent="secondary" size="sm" onClick={() => cart.addDemo("demo-mini")}>Добавить тестовый мини-курс</Button>}
      {cart.items.length > 0 && <Button intent="secondary" size="sm" onClick={cart.clear}>Очистить тестовую корзину</Button>}
    </div>
    {!compact && cart.items.length > 0 && <details className={styles.scenarios}><summary>Тестовые состояния интерфейса</summary>
      <SelectField label="Состояние демонстрации" value={cart.scenario} onChange={event => cart.setScenario(event.target.value as DemoScenario)}>
        <option value="ready">Обычный просмотр</option><option value="recalculating">Пересчёт стоимости</option>
        <option value="unavailable">Продукт недоступен</option><option value="price-changed">Цена изменилась</option><option value="error">Ошибка загрузки</option>
      </SelectField>
      {cart.scenario !== "ready" && <Button intent="secondary" onClick={() => cart.setScenario("ready")}>Сбросить тестовое состояние</Button>}
    </details>}
  </div>;
}
