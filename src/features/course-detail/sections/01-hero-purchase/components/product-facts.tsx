import type { DetailProduct } from "../../../detail-data";
import styles from "./product-facts.module.css";

export function ProductFacts({ product }: { product: DetailProduct }) {
  const facts = [
    { label: "Формат", value: product.kind === "mini-course" ? "Уроки в записи · без куратора" : "Курс с куратором" },
    { label: "Направление", value: product.direction ?? "Уточняется" },
    { label: "Уровень", value: product.level ?? "Уточняется" },
    { label: "Язык", value: product.language ?? "Уточняется" },
    { label: "Объём", value: product.lessonCount ? `${product.lessonCount} уроков` : "Количество уроков уточняется" },
    { label: "Длительность", value: product.duration ?? "Уточняется" },
  ];

  return (
    <dl className={styles.facts}>
      {facts.map(({ label, value }) => (
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  );
}
