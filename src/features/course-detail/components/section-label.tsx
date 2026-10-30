import styles from "./section-label.module.css";
import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className={styles.label}>{children}</p>;
}
