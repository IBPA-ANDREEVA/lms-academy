import Image from "next/image";
import heroPhotograph from "../../../../../public/ibpa/lдля клиентов 77 6.jpg";
import { PageContainer } from "@/features/public-shell";
import { HeroHeading } from "./components/hero-heading";
import { HeroCta } from "./components/hero-cta";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section data-home-hero className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.photograph}>
        <Image
          src={heroPhotograph}
          alt="Четыре женщины в чёрных костюмах с инструментами для работы в сфере красоты"
          fill
          preload
          sizes="(max-width: 800px) 100vw, 72vw"
          className={styles.image}
        />
      </div>
      <div className={styles.lightField} aria-hidden="true" />
      <div className={styles.plumTriangle} aria-hidden="true" />
      <div className={styles.boundaryLine} aria-hidden="true" />
      <PageContainer size="wide" className={styles.content}>
        <p className={styles.supporting}>
          ПРОФЕССИОНАЛЬНОЕ<br />
          БЬЮТИ-ОБУЧЕНИЕ<br />
          НА РУССКОМ И АНГЛИЙСКОМ
        </p>
        <HeroHeading />
        <HeroCta />
      </PageContainer>
    </section>
  );
}
