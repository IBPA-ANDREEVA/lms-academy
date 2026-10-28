import type { ComponentProps } from "react";
import styles from "./page-container.module.css";

export type PageContainerProps = ComponentProps<"div"> & {
  size?: "wide" | "content" | "reading" | "fullBleed";
};

export function PageContainer({
  size = "wide",
  className = "",
  ...props
}: PageContainerProps) {
  return (
    <div
      {...props}
      className={`${styles.container} ${styles[size]} ${className}`}
    />
  );
}
