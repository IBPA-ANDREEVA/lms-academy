import Image from "next/image";
import founderPortrait from "../../../../../public/ibpa/lдля клиентов 77 3 копія.jpg";
import { PageContainer } from "@/features/public-shell";
import { FounderMilestones } from "./components/founder-milestones";
import styles from "./founder-section.module.css";

export function FounderSection() {
  return (
    <section
      id="founder"
      className={styles.section}
      aria-labelledby="founder-title"
    >
      <div className={styles.photograph}>
        <Image
          src={founderPortrait}
          alt="Юлия Андреева среди инструментов для работы в сфере красоты"
          fill
          sizes="(max-width: 600px) 100vw, 54vw"
          className={styles.image}
        />
      </div>
      <div className={styles.plumWedge} aria-hidden="true" />
      <div className={styles.edgeLine} aria-hidden="true" />
      <PageContainer size="wide" className={styles.content}>
        <p className={styles.kicker}>ОСНОВАТЕЛЬ</p>
        <h2 id="founder-title" className={styles.heading}>
          <span>ОПЫТ,</span>
          <span>КОТОРЫЙ СОЗДАЁТ</span>
          <span>ВОЗМОЖНОСТИ</span>
        </h2>
        <div className={styles.biography}>
          <p><strong>Юлия Андреева</strong> — основательница LMS Academy и президент International Beauty Professionals Association (IBPA).</p>
          <details><summary>Профессиональный путь</summary>
          <p>До бьюти-индустрии 12 лет работала в фармацевтическом бизнесе и дошла до руководителя региона «Москва». Оттуда — системный подход к обучению и внимание к стандартам качества.</p>
          <p>В 2019 году начала работать лэшмейкером и стала победительницей чемпионатов по наращиванию ресниц. В 2021 году открыла в Москве школу-студию наращивания ресниц «Lashes Room Юлии Андреевой», и в первый же год её оборот составил 6 млн рублей. В 2022 году открыла школу-студию в Турции, в 2024 году — в Роклине, Калифорния.</p>
          <p>За свою карьеру обучила более 100 учеников по всему миру. В США помогла более чем 500 мастерам получить бьюти-лицензию. Создала профессиональное сообщество IBPA и с 2024 года организует ежегодный Beauty Business Forum для бьюти-мастеров.</p>
          </details>
        </div>
        <FounderMilestones />
      </PageContainer>
    </section>
  );
}
