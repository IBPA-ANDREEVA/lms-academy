"use client";
import { useRef } from "react";
import { useDisclosureMotion } from "@/components/ui/use-disclosure-motion";
import styles from "./faq-section.module.css";
export function FaqItem({ id, question, answer, initiallyOpen = false }: { id: string; question: string; answer: string; initiallyOpen?: boolean }) {
  const root = useRef<HTMLDetailsElement>(null);
  useDisclosureMotion(root);
  return <details ref={root} className={styles.item} open={initiallyOpen}>
    <summary aria-controls={`faq-answer-${id}`}>{question}<span className={styles.symbol} aria-hidden="true" /></summary>
    <div className={styles.answer} id={`faq-answer-${id}`}><p>{answer}</p></div>
  </details>;
}
