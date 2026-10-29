import styles from "../hero-section.module.css";

export function HeroHeading() {
  return (
    <h1 id="hero-title" className={styles.headline}>
      <span className={styles.firstLine}>УЧИСЬ.</span>
      <span className={styles.secondLine}>СОЗДАВАЙ.</span>
    </h1>
  );
}
