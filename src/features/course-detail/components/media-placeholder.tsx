import styles from "./media-placeholder.module.css";

export function MediaPlaceholder({ label, portrait = false }: { label: string; portrait?: boolean }) {
  return (
    <div className={`${styles.frame} ${portrait ? styles.portrait : ""}`} role="img" aria-label={label}>
      <span className={styles.mark} aria-hidden="true">◇</span>
      <span>{label}</span>
    </div>
  );
}
