import type { DetailProduct } from "../../../detail-data";
import styles from "./terms-list.module.css";

export function TermsList({ product }: { product: DetailProduct }) {
  const terms = [
    { label: "ДОСТУП", heading: "Просмотр уроков", content: product.accessTerms ?? "Срок и начало доступа уточняются для этого продукта." },
    { label: "ПОДДЕРЖКА", heading: product.kind === "mini-course" ? "Самостоятельный формат" : "Работа с куратором", content: product.kind === "mini-course" ? "Куратора и проверки домашних работ нет." : product.supportTerms ?? "Период и условия поддержки будут указаны после утверждения курса." },
    { label: "СЕРТИФИКАТ", heading: "После выполнения условий", content: product.certificateTerms ?? (product.kind === "mini-course" ? "Возможность выдачи зависит от просмотра всех уроков по утверждённому правилу завершения." : "Условия выдачи будут опубликованы вместе с обязательными заданиями.") },
    { label: "ВОЗВРАТ", heading: "Правила возврата", content: product.refundTerms ?? "Утверждённая политика возврата пока не опубликована." },
  ];
  return <div className={styles.list}>{terms.map(({ label, heading, content }) => (
    <div key={label}><span>{label}</span><h3>{heading}</h3><p>{content}</p></div>
  ))}</div>;
}
