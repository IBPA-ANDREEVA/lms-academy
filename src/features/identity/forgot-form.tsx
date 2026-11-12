"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage, TextField } from "@/components/ui/form-controls";
import { forgotPassword } from "./api";
import { useAuthAction } from "./hooks/use-auth-action";
import { emailError, focusInvalid } from "./form-validation";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function ForgotForm({
  onViewChange,
}: {
  onViewChange: (view: AuthView) => void;
}) {
  const [error, setError] = useState<string>();
  const action = useAuthAction();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(
      new FormData(event.currentTarget).get("email") ?? "",
    ).trim();
    const invalid = emailError(email);
    setError(invalid);
    if (focusInvalid(event.currentTarget, { email: invalid })) return;
    void action.run(() => forgotPassword({ email }));
  }
  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={submit}
      aria-busy={action.pending}
    >
      <p className={styles.instruction}>
        Укажите почту своего аккаунта. В тестовой версии письма для
        восстановления пока не отправляются.
      </p>
      <TextField
        disabled={action.pending}
        label="Электронная почта"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="example@email.com"
        data-auth-first
        required
        error={error}
        onChange={() => setError(undefined)}
      />
      <Button
        type="submit"
        appearance="cut"
        intent="secondary"
        fullWidth
        loading={action.pending}
        className={styles.primaryAction}
      >
        ЗАПРОСИТЬ ВОССТАНОВЛЕНИЕ
      </Button>
      {action.error && <FormMessage tone="error">{action.error}</FormMessage>}
      {action.success && (
        <FormMessage tone="success">
          Запрос принят. В тестовой версии письма не отправляются.
        </FormMessage>
      )}
      <div className={styles.switchView}>
        <button
          type="button"
          disabled={action.pending}
          onClick={() => onViewChange("login")}
        >
          ← Вернуться ко входу
        </button>
      </div>
    </form>
  );
}
