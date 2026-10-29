import { ButtonLink } from "@/components/ui/button";
import styles from "../hero-section.module.css";

export function HeroCta() {
  return (
    <ButtonLink
      href="#catalog-status"
      appearance="neoBrutalist"
      size="lg"
      className={styles.cta}
      aria-label="Выбрать курс"
    >
      <span className={styles.ctaCopy}>
        <span>ВЫБРАТЬ</span>
        <span>КУРС</span>
      </span>
      <span className={styles.ctaArrow} aria-hidden="true">→</span>
    </ButtonLink>
  );
}
