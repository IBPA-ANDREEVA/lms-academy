import Image from "next/image";
import aboutPortrait from "../../../../../public/ibpa/lдля клиентов 77 37 копія.jpg";
import { PageContainer } from "@/features/public-shell";
import { AcademyBenefits } from "./components/academy-benefits";
import styles from "./about-section.module.css";

export function AboutSection() {
  return (
    <section data-flow-section className={styles.section} aria-labelledby="about-title" id="about">
      <div data-motion-photo className={styles.photograph}>
        <Image
          src={aboutPortrait}
          alt="Женщина в светло-голубом жакете"
          fill
          sizes="(max-width: 600px) 100vw, 60vw"
          className={styles.image}
        />
      </div>
      <div className={styles.lightField} aria-hidden="true" />
      <PageContainer reveal="editorial" size="wide" className={styles.content}>
        <p className={styles.kicker}>ОБ АКАДЕМИИ</p>
        <h2 data-motion-item id="about-title" className={styles.heading}>
          <span>ВСЁ ДЛЯ КАРЬЕРЫ</span>
          <span>В БЬЮТИ —</span><span>В ОДНОМ МЕСТЕ</span>
        </h2>
        <p data-motion-item className={styles.description}>
          LMS Academy — онлайн-академия для бьюти-мастеров на русском и английском языках. Здесь можно освоить новое направление с нуля, повысить квалификацию и подготовиться к работе в США.
        </p>
        <AcademyBenefits />
        <p className={styles.footnote}>Сертификат подтверждает прохождение курса и не заменяет лицензию штата.</p>
      </PageContainer>
    </section>
  );
}
