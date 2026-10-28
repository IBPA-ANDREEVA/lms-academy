import type { ReactNode } from "react";
import styles from "./section-heading.module.css";

export type SectionHeadingProps = {
  children: ReactNode;
  id?: string;
  as?: "h1" | "h2" | "h3";
  display?: boolean;
  description?: ReactNode;
  className?: string;
};

export function SectionHeading({
  children,
  id,
  as: Heading = "h2",
  display = false,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`${styles.group} ${className}`}>
      <Heading id={id} className={display ? styles.display : styles.heading}>
        {children}
      </Heading>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}
