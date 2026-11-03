"use client";
import { useRef, type ReactNode } from "react";
import { useDisclosureMotion } from "@/components/ui/use-disclosure-motion";
import styles from "../founder-section.module.css";
export function FounderStory({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDetailsElement>(null);
  useDisclosureMotion(root);
  return <details ref={root} className={styles.story}><summary>Профессиональный путь <span aria-hidden="true">+</span></summary><div className={styles.storyText}>{children}</div></details>;
}
