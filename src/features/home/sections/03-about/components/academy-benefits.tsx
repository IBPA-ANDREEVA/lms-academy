import styles from "../about-section.module.css";

const benefits = [
  { title: "Все направления.", detail: "Наращивание и ламинирование ресниц, брови, маникюр и педикюр, косметология, перманентный макияж." },
  { title: "Повышение квалификации.", detail: "Курсы для практикующих мастеров, которые хотят освоить новые техники и выйти на новый уровень." },
  { title: "На двух языках.", detail: "Все курсы на русском и английском языках или с субтитрами." },
  { title: "Старт в США.", detail: "Отдельные уроки для новичков: санитария и безопасность, продвижение, поиск клиентов и работа с клиентской базой." },
  { title: "Помощь с лицензией в США.", detail: "Опытным специалистам помогаем получить бьюти-лицензию штата в партнёрстве с Andreeva Consulting." },
  { title: "Сертификат и IBPA.", detail: "По окончании курса выдаётся сертификат. Выпускникам — скидка на членство в International Beauty Professionals Association (IBPA), членам ассоциации — скидка на курсы." },
];

export function AcademyBenefits() {
  return (
    <ul className={styles.benefits} aria-label="Об академии">
      {benefits.map((benefit) => (
        <li data-motion-item key={benefit.title}>
          <strong>{benefit.title}</strong>
          <span>{benefit.detail}</span>
        </li>
      ))}
    </ul>
  );
}
