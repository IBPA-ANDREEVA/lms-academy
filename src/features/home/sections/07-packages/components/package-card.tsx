import { Button } from "@/components/ui/button";
import { OfferMediaPlaceholder } from "../../../learning-offers/offer-media-placeholder";
import type { PackageSize } from "../package-preview-data";
import styles from "../packages-section.module.css";

export function PackageCard({ size, onExplore }: { size: PackageSize; onExplore: () => void }) {
  return <article className={styles.card}>
    <OfferMediaPlaceholder label="ЗДЕСЬ БУДЕТ ФОТО ПАКЕТА" />
    <div className={styles.cardContent}>
      <p className={styles.tag}>ПРИМЕР ФОРМАТА · {size} {size === 6 ? "НАПРАВЛЕНИЙ" : "НАПРАВЛЕНИЯ"}</p>
      <h3>Пакет из {size}<br />направлений</h3>
      <ul><li>Состав курсов будет утверждён</li><li>Модуль «Старт в США» включён</li></ul>
      <div className={styles.cardFooter}><span>Цена не опубликована</span><Button appearance="neoBrutalist" intent="secondary" size="sm" aria-label={`Посмотреть пример пакета из ${size} направлений`} onClick={onExplore}>→</Button></div>
    </div>
  </article>;
}
