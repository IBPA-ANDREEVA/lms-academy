import styles from "../about-section.module.css";

const benefits = [
  { title: "УРОКИ В ЗАПИСИ", detail: "Материалы курса доступны для изучения" },
  { title: "ПРАКТИЧЕСКИЕ ЗАДАНИЯ", detail: "В курсах с практикой" },
  { title: "ОБРАТНАЯ СВЯЗЬ", detail: "В курсах с поддержкой куратора" },
] as const;

export function AcademyBenefits() {
  return (
    <ul className={styles.benefits} aria-label="Формат обучения">
      {benefits.map((benefit) => (
        <li key={benefit.title}>
          <strong>{benefit.title}</strong>
          <span>{benefit.detail}</span>
        </li>
      ))}
    </ul>
  );
}
