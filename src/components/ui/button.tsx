import Link from "next/link";
import { Children, type ComponentProps, type ReactNode } from "react";
import styles from "./button.module.css";

type Appearance = {
  appearance?: "neoBrutalist" | "cut" | "minimal";
  intent?: "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
  fullWidth?: boolean;
  className?: string;
};

function appearanceClasses({
  appearance = "minimal",
  intent = "primary",
  size = "md",
  inverse,
  fullWidth,
  className,
}: Appearance) {
  return [
    styles.button,
    styles[appearance],
    styles[intent],
    styles[size],
    inverse && styles.inverse,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Give text-supplied terminal arrows the same independent layer as explicit arrow spans. */
function CutContent({ children }: { children: ReactNode }) {
  return Children.map(children, child => {
    if (typeof child !== "string") return child;
    const match = child.match(/^([\s\S]*?)([→↗←↘↙])\s*$/);
    return match ? <>{match[1]}<span aria-hidden="true" className={styles.arrow}>{match[2]}</span></> : child;
  });
}

export type ButtonProps = ComponentProps<"button"> &
  Appearance & { loading?: boolean };

export function Button({
  appearance,
  intent,
  size,
  inverse,
  fullWidth,
  className,
  loading = false,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={appearanceClasses({
        appearance,
        intent,
        size,
        inverse,
        fullWidth,
        className,
      })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      <span className={styles.label}>{appearance === "cut" ? <CutContent>{children}</CutContent> : children}</span>
      {appearance === "cut" && <span className={styles.cutDepth} aria-hidden="true" />}
      {loading && (
        <span className={styles.pending} aria-hidden="true">
          …
        </span>
      )}
    </button>
  );
}

export type ButtonLinkProps = ComponentProps<typeof Link> & Appearance;

export function ButtonLink({
  appearance,
  intent,
  size,
  inverse,
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={appearanceClasses({
        appearance,
        intent,
        size,
        inverse,
        fullWidth,
        className,
      })}
    >
      <span className={styles.label}>{appearance === "cut" ? <CutContent>{children}</CutContent> : children}</span>
      {appearance === "cut" && <span className={styles.cutDepth} aria-hidden="true" />}
    </Link>
  );
}
