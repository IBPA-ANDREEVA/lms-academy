import { suppliedLogo as art } from "./supplied-logo-artwork";
import styles from "./brand-logo.module.css";

export type BrandLogoProps = { variant?: "lockup" | "mark"; className?: string };
/** Supplied identity traced to paths. The owning link provides the accessible name. */
export function BrandLogo({ variant = "lockup", className = "" }: BrandLogoProps) {
  return <svg className={`${styles.logo} ${className}`} viewBox={(variant === "mark" ? art.markBounds : art.bounds).join(" ")} aria-hidden="true" focusable="false">
    <g fill="#680a34">{art.paths.plum.map((path, i) => <path key={i} {...path} />)}</g>
    <g fill="#bfbebf">{art.paths.silver.map((path, i) => <path key={i} {...path} />)}</g>
    {variant === "lockup" && <g fill="currentColor">{art.paths.wordmark.map((path, i) => <path key={i} {...path} />)}</g>}
  </svg>;
}
