import Image from "next/image";
import photo from "../../../../../public/ibpa/catalog-newspaper-reference.png";
import { PageContainer } from "@/features/public-shell";
import { ButtonLink } from "@/components/ui/button";
import styles from "./introduction-section.module.css";

export function IntroductionSection() {
  return <section className={styles.hero} aria-labelledby="catalog-title">
    <PageContainer size="wide" className={styles.content}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>КАТАЛОГ ОБУЧЕНИЯ</p>
        <h1 id="catalog-title">ВЫБЕРИ<br /><span>СВОЙ КУРС.</span></h1>
        <p className={styles.summary}>Практика с куратором или короткие уроки в записи. Найди свой формат обучения.</p>
        <ButtonLink href="#catalog-filters" appearance="cut" intent="primary">Смотреть курсы →</ButtonLink>
      </div>
    </PageContainer>
    <div className={styles.photo}><Image src={photo} alt="Две женщины читают газеты на бирюзовом фоне" fill priority sizes="(max-width: 760px) 100vw, 52vw" /></div>
  </section>;
}
