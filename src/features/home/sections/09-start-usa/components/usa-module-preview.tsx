import { OfferMediaPlaceholder } from "../../../learning-offers/offer-media-placeholder";
import styles from "../start-usa-section.module.css";

const topics = ["Санитария", "Безопасность", "Продвижение", "Клиентская база"];

export function UsaModulePreview() {
  return <div id="usa-topics" className={styles.module} tabIndex={-1} aria-label="Темы модуля Старт в США">
    <div className={styles.moduleHeader}><strong>4 ТЕМЫ · ОДИН МОДУЛЬ</strong><span>USA / ПРЕВЬЮ</span></div>
    <div className={styles.media}><OfferMediaPlaceholder label="ЗДЕСЬ БУДЕТ ФОТО / ПРЕВЬЮ МОДУЛЯ" /></div>
    <ul className={styles.topics}>{topics.map((topic, index) => <li key={topic}><span>0{index + 1} / 04</span><h3>{topic}</h3></li>)}</ul>
    <p className={styles.moduleFooter}><span>КОМПОНЕНТ БУДУЩИХ ПАКЕТОВ</span><strong>СТАРТ В США</strong></p>
  </div>;
}
