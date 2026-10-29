"use client";

import { Button } from "@/components/ui/button";
import styles from "../start-usa-section.module.css";

export function UsaModuleCta() {
  return <Button appearance="neoBrutalist" className={styles.cta} onClick={() => {
    const topics = document.getElementById("usa-topics");
    topics?.focus({ preventScroll: true });
    topics?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }}>УЗНАТЬ О МОДУЛЕ <span aria-hidden="true">→</span></Button>;
}
