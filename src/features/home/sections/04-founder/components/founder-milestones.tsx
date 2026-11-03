import styles from "../founder-section.module.css";

const milestones = [
  ["Бьюти-профессионал", "Лэшмейкер с 2019 года, победительница чемпионатов."],
  ["Преподаватель", "Более 100 учеников по всему миру, школы-студии в Москве, Турции и Калифорнии."],
  ["Предприниматель", "12 лет в фармацевтическом бизнесе, основательница «Lashes Room Юлии Андреевой», более 500 мастеров получили лицензии в США с её помощью."],
  ["Создатель сообщества", "Президент IBPA, организатор ежегодного Beauty Business Forum, член редакции журнала Beauty Professional."],
] as const;

export function FounderMilestones() {
  return (
    <ol className={styles.milestones} aria-label="Профессиональный путь">
      {milestones.map((milestone, index) => (
        <li data-motion-item key={milestone[0]}>
          <span className={styles.number} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div><strong>{milestone[0]}</strong><p>{milestone[1]}</p></div>
        </li>
      ))}
    </ol>
  );
}
