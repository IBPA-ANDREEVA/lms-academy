import styles from "../founder-section.module.css";

const milestones = [
  "Бьюти-профессионал",
  "Преподаватель и судья",
  "Предприниматель",
  "Создатель сообщества",
] as const;

export function FounderMilestones() {
  return (
    <ol className={styles.milestones} aria-label="Профессиональный путь">
      {milestones.map((milestone, index) => (
        <li key={milestone}>
          <span className={styles.number} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{milestone}</span>
        </li>
      ))}
    </ol>
  );
}
