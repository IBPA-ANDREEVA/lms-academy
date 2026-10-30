import { Button, ButtonLink } from "@/components/ui/button";
import type { DetailProduct } from "../detail-data";
import styles from "./purchase-panel.module.css";

const statusText = {
  unavailable: "Запись и стоимость пока не опубликованы.",
  loading: "Проверяем актуальные условия предложения…",
  error: "Не удалось проверить стоимость и доступность. Попробуйте позже.",
  owned: "Доступ к этому обучению уже оформлен.",
  available: "Проверьте стоимость и условия перед добавлением.",
} as const;

export function PurchasePanel({ product, compact = false }: { product: DetailProduct; compact?: boolean }) {
  const action = product.offerState === "available" && product.purchaseAction
    ? product.purchaseAction
    : product.offerState === "owned" && product.learningHref
      ? <ButtonLink href={product.learningHref} appearance="cut" intent="secondary">Перейти к обучению →</ButtonLink>
      : <Button appearance="cut" intent="secondary" disabled loading={product.offerState === "loading"}>
          {product.offerState === "owned" ? "Уже приобретено" : "В корзину →"}
        </Button>;

  return (
    <aside className={`${styles.panel} ${compact ? styles.compact : ""}`} aria-label="Информация о покупке">
      <p className={styles.kicker}>{product.kind === "mini-course" ? "МИНИ-КУРС В ЗАПИСИ" : "КУРС С КУРАТОРОМ"}</p>
      <p className={styles.price}>{product.priceLabel ?? "Стоимость уточняется"}</p>
      <p className={styles.status} role={product.offerState === "error" ? "alert" : "status"}>{statusText[product.offerState]}</p>
      <div className={styles.action}>{action}</div>
      {!compact && <p className={styles.note}>Покупка станет доступна после утверждения продукта и подключения корзины.</p>}
    </aside>
  );
}
