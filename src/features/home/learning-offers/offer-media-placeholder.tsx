import styles from "./offer-media-placeholder.module.css";

export function OfferMediaPlaceholder({ label }: { label: string }) {
  return <div className={styles.media} role="img" aria-label={label}><span className={styles.icon} aria-hidden="true" /><span>{label}</span></div>;
}
