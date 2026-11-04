import type { PreviewPackage } from "@/features/catalog/preview/preview-data";
import { formatDemoAmount } from "@/features/commerce/demo-cart";
import styles from "../packages-section.module.css";

export function PackageCard({ item, inCart, disabled, onAdd }: {
  item: PreviewPackage; inCart: boolean; disabled: boolean; onAdd: () => void;
}) {
  return <article className={styles.card} data-package-card data-in-cart={inCart}>
    <div className={styles.packageCover} aria-hidden="true"><span>{String(item.size).padStart(2, "0")}</span><span>{item.size === 6 ? "НАПРАВЛЕНИЙ" : "НАПРАВЛЕНИЯ"}<br />В ОДНОМ ПАКЕТЕ</span></div>
    <div className={styles.cardContent}>
      <p className={styles.tag}>ДЕМОНСТРАЦИОННЫЙ ПАКЕТ</p>
      <h3><button type="button" className={styles.cardAction} onClick={() => { if (!inCart) onAdd(); }} disabled={disabled} aria-disabled={inCart || undefined}
        aria-label={inCart ? `${item.title}: уже в демо-корзине` : `Добавить в демо-корзину: ${item.title}`}>
        {item.title}
      </button></h3>
      <p className={styles.cardDescription}>Вымышленный набор для проверки интерфейса. Состав и стоимость — тестовые данные.</p>
      <div className={styles.cardFooter}><span>{formatDemoAmount(item.amountMinor)}</span><span className={styles.cardStatus}>{inCart ? "В демо-корзине ✓" : "В демо-корзину ↗"}</span></div>
    </div>
  </article>;
}
