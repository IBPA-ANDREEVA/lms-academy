import type { ComponentProps } from "react";
import type { RevealTreatment } from "./motion-tokens";
import { SectionReveal } from "./section-reveal";
import styles from "./page-container.module.css";

export type PageContainerProps = ComponentProps<"div"> & {
  size?: "wide" | "content" | "reading" | "fullBleed";
  reveal?: boolean | RevealTreatment;
};
export function PageContainer({ size = "wide", className = "", reveal = false, ...props }: PageContainerProps) {
  const classes = `${styles.container} ${styles[size]} ${className}`;
  return reveal ? <SectionReveal {...props} treatment={typeof reveal === "string" ? reveal : "editorial"} className={classes} /> : <div {...props} className={classes} />;
}
