import type { DetailProduct } from "../../../detail-data";
import styles from "./course-outcomes.module.css";

export function CourseOutcomes({ product }: { product: DetailProduct }) {
  return (
    <div className={styles.list}>
      <div><span>СОДЕРЖАНИЕ</span><p>{product.description ?? "Подробное описание программы и требований к участнику ожидает утверждения."}</p></div>
      {product.outcomes?.length ? <div><span>РЕЗУЛЬТАТЫ</span><ul>{product.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div> : null}
      <div><span>ФОРМАТ</span><p>{product.kind === "mini-course"
        ? "Уроки в записи. Куратор и проверка домашних работ не предусмотрены."
        : "Записанные уроки и практика с куратором. Сроки и объём поддержки уточняются для конкретного курса."}</p></div>
    </div>
  );
}
