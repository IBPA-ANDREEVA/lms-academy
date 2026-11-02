import styles from "../hero-section.module.css";

export function HeroHeading() {
  return (
    <h1 id="hero-title" className={styles.headline}>
      <span className={styles.firstLine}>ОБУЧЕНИЕ.</span>
      <span className={styles.secondLine}>ПРАКТИКА.</span>
      <span className={styles.thirdLine}>КАРЬЕРА В БЬЮТИ.</span>
    </h1>
  );
}
