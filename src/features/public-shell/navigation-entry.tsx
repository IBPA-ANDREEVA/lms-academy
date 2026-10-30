import Link from "next/link";
import type { NavigationEntry as Entry } from "./navigation";
import styles from "./navigation-entry.module.css";

/** Shared by the header and footer; no dummy hrefs. */
export function NavigationEntry({ entry, current, onNavigate, showPreviewLabel = true }: {
  entry: Entry;
  current?: boolean;
  onNavigate?: () => void;
  showPreviewLabel?: boolean;
}) {
  const content = <>{entry.label}{showPreviewLabel && entry.preview && <small className={styles.note}>{entry.href ? "Превью" : "Скоро"}</small>}</>;
  return entry.href
    ? <Link href={entry.href} aria-current={current ? "page" : undefined} onClick={onNavigate}>{content}</Link>
    : <span className={styles.unavailable} role="link" aria-disabled="true">{content}</span>;
}
