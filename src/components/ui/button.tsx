import Link from "next/link";
import { Children, isValidElement, type ComponentProps, type ReactNode } from "react";
import styles from "./button.module.css";

type Appearance = {
  appearance?: "neoBrutalist" | "cut" | "minimal";
  cutVariant?: "line" | "soft";
  intent?: "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
  fullWidth?: boolean;
  className?: string;
};

function appearanceClasses({
  appearance = "minimal",
  cutVariant = "line",
  intent = "primary",
  size = "md",
  inverse,
  fullWidth,
  className,
}: Appearance) {
  return [
    styles.button,
    styles[appearance],
    appearance === "cut" && styles[cutVariant === "soft" ? "cutSoft" : "cutLine"],
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
  const parts = Children.toArray(children).map(child => {
    if (isValidElement<{ "aria-hidden"?: boolean | "true" }>(child) && child.props["aria-hidden"]) return { text: null, arrow: child };
    if (typeof child !== "string") return { text: child };
    const match = child.match(/^([\s\S]*?)([→↗←↘↙↓↑])\s*$/);
    return match ? { text: match[1].trimEnd(), arrow: match[2] } : { text: child };
  });
  return <><span className={styles.cutText}>{parts.map(part => part.text)}</span><span aria-hidden="true" className={styles.arrow}>{parts.find(part => part.arrow)?.arrow ?? "→"}</span></>;
}

/** One semantic label shared by both reference-based Cut treatments. */
function CutSurface({ children }: { children: ReactNode }) {
  return <span className={styles.label}><CutContent>{children}</CutContent></span>;
}

export type ButtonProps = ComponentProps<"button"> &
  Appearance & { loading?: boolean };

export function Button({
  appearance,
  cutVariant,
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
        cutVariant,
        intent,
        size,
        inverse,
        fullWidth,
        className,
      })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {appearance === "cut" ? <CutSurface>{children}</CutSurface> : <span className={styles.label}>{children}</span>}
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
  cutVariant,
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
        cutVariant,
        intent,
        size,
        inverse,
        fullWidth,
        className,
      })}
    >
      {appearance === "cut" ? <CutSurface>{children}</CutSurface> : <span className={styles.label}>{children}</span>}
    </Link>
  );
}
