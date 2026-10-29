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
          alt="Iuliia Andreeva среди инструментов для работы в сфере красоты"
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
        <p className={styles.biography}>
          Iuliia Andreeva объединяет опыт бьюти-практики, преподавания и
          предпринимательства. Её работа направлена на развитие
          профессионального сообщества.
        </p>
        <FounderMilestones />
      </PageContainer>
    </section>
  );
}
