import styles from "./home-section-seam.module.css";

/** A single shape crosses two section surfaces; neither section clips it. */
export function HomeSectionSeam({ variant }: { variant: "hero" | "portraits" | "learning" | "contact" }) {
  return <div className={`${styles.seam} ${styles[variant]}`} aria-hidden="true" data-home-seam={variant}><div /></div>;
}
