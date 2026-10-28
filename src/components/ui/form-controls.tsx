"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "./button";
import styles from "./form-controls.module.css";

type Feedback = {
  label: string;
  hint?: string;
  error?: string;
  success?: string;
};
export type TextFieldProps = Omit<ComponentProps<"input">, "type"> &
  Feedback & {
    type?: "text" | "email" | "tel" | "url" | "number" | "password";
  };

function FieldFeedback({
  id,
  hint,
  error,
  success,
}: { id: string } & Omit<Feedback, "label">) {
  return (
    <div className={styles.feedback}>
      {hint && <p id={`${id}-hint`}>{hint}</p>}
      {error ? (
        <p id={`${id}-message`} className={styles.error} role="alert">
          {error}
        </p>
      ) : success ? (
        <p id={`${id}-message`} className={styles.success} role="status">
          {success}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(
  id: string,
  hint?: string,
  message?: string,
  provided?: string,
) {
  return (
    [provided, hint && `${id}-hint`, message && `${id}-message`]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

export function TextField({
  label,
  hint,
  error,
  success,
  id: suppliedId,
  className = "",
  type = "text",
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        type={type}
        className={`${styles.input} ${className}`}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy(
          id,
          hint,
          error || success,
          props["aria-describedby"],
        )}
      />
      <FieldFeedback id={id} hint={hint} error={error} success={success} />
    </div>
  );
}

export function PasswordField({
  label,
  hint,
  error,
  success,
  id: suppliedId,
  className = "",
  ...props
}: Omit<TextFieldProps, "type">) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.password}>
        <input
          {...props}
          id={id}
          type={visible ? "text" : "password"}
          className={`${styles.input} ${className}`}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy(
            id,
            hint,
            error || success,
            props["aria-describedby"],
          )}
        />
        <Button
          size="sm"
          intent="secondary"
          disabled={props.disabled}
          onClick={() => setVisible(!visible)}
          aria-controls={id}
          aria-pressed={visible}
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        >
          {visible ? "Скрыть" : "Показать"}
        </Button>
      </div>
      <FieldFeedback id={id} hint={hint} error={error} success={success} />
    </div>
  );
}

export type CheckboxProps = Omit<ComponentProps<"input">, "type"> &
  Omit<Feedback, "label"> & { label: ReactNode };

export function Checkbox({
  label,
  hint,
  error,
  success,
  id: suppliedId,
  className = "",
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return (
    <div className={styles.field}>
      <div className={styles.checkboxRow}>
        <input
          {...props}
          id={id}
          type="checkbox"
          className={`${styles.checkbox} ${className}`}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy(
            id,
            hint,
            error || success,
            props["aria-describedby"],
          )}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      <FieldFeedback id={id} hint={hint} error={error} success={success} />
    </div>
  );
}

export type SelectFieldProps = ComponentProps<"select"> & Feedback;

export function SelectField({
  label,
  hint,
  error,
  success,
  id: suppliedId,
  className = "",
  children,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select
        {...props}
        id={id}
        className={`${styles.input} ${className}`}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy(
          id,
          hint,
          error || success,
          props["aria-describedby"],
        )}
      >
        {children}
      </select>
      <FieldFeedback id={id} hint={hint} error={error} success={success} />
    </div>
  );
}

export function FormMessage({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "error" | "success";
}) {
  return (
    <p
      className={`${styles.message} ${styles[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
