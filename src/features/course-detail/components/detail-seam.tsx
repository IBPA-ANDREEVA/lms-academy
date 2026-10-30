import styles from "./detail-seam.module.css";

/** A shared shape is owned by the page composition, so adjacent sections do not clip it. */
export function DetailSeam({ variant }: { variant: "preview" | "trainer" }) {
  return <div className={`${styles.seam} ${styles[variant]}`} aria-hidden="true"><span /></div>;
}
