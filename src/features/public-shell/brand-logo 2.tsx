import { useId } from "react";
import { brandLogoArtwork as art } from "./brand-logo-artwork";
import styles from "./brand-logo.module.css";

export type BrandLogoProps = {
  /** `mark` draws only the cut BBA monogram for narrow slots. */
  variant?: "lockup" | "mark";
  className?: string;
};

/**
 * Concept 01 «Срез» (docs/design/brand/logo-concepts). Decorative only: the
 * owning link supplies the accessible name. The left half and the first line
 * follow `currentColor`; the plum half, rule and ACADEMY follow
 * `--brand-logo-accent` so dark surfaces can switch to the plum border tone.
 */
export function BrandLogo({ variant = "lockup", className = "" }: BrandLogoProps) {
  const id = useId();
  const width = variant === "mark" ? art.markWidth : art.width;
  return (
    <svg
      className={`${styles.logo} ${className}`}
      viewBox={`0 0 ${width} ${art.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`${id}l`}><polygon points={art.leftClip} /></clipPath>
        <clipPath id={`${id}r`}><polygon points={art.rightClip} /></clipPath>
      </defs>
      <path d={art.mark} fill="currentColor" clipPath={`url(#${id}l)`} />
      <path d={art.mark} className={styles.accent} clipPath={`url(#${id}r)`} />
      {variant === "lockup" && <>
        <rect className={styles.accent} {...art.rule} />
        <path d={art.line1} fill="currentColor" />
        <path d={art.line2} className={styles.accent} />
      </>}
    </svg>
  );
}
