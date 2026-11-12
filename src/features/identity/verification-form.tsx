"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage, TextField } from "@/components/ui/form-controls";
import { resendVerification, verifyEmail } from "./api";
import { useAuthAction } from "./hooks/use-auth-action";
import { useIdentity } from "./identity-provider";
import { emailError, focusInvalid } from "./form-validation";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function VerificationForm({
  token = "",
  onViewChange,
}: {
  token?: string;
  onViewChange: (view: AuthView) => void;
}) {
  const action = useAuthAction();
  const resend = useAuthAction();
  const { user, refresh } = useIdentity();
  const [error, setError] = useState<string>();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(
      new FormData(event.currentTarget).get("email") ?? "",
    ).trim();
    const invalid = emailError(email);
    setError(invalid);
    if (focusInvalid(event.currentTarget, { email: invalid })) return;
    void resend.run(() => resendVerification(email));
  }
  return (
    <div className={styles.form}>
      {token && !action.success && (
        <>
          <p className={styles.instruction}>
            Подтвердите почту, чтобы пользоваться приобретёнными курсами. Ссылка
            действует 48 часов.
          </p>
          <Button
            appearance="cut"
            fullWidth
            disabled={resend.pending}
            loading={action.pending}
            data-auth-first
            onClick={() =>
              void action.run(
                () => verifyEmail(token),
                () => {
                  void refresh().catch(() => {});
                },
              )
            }
          >
            ПОДТВЕРДИТЬ ПОЧТУ
          </Button>
        </>
      )}
      {action.error && <FormMessage tone="error">{action.error}</FormMessage>}
      {action.success ? (
        <FormMessage tone="success">
          Электронная почта подтверждена. Теперь можно войти в аккаунт.
        </FormMessage>
      ) : (
        <form
          className={styles.form}
          noValidate
          onSubmit={submit}
          aria-busy={resend.pending}
        >
          <p className={styles.instruction}>
            {token
              ? "Нужна новая ссылка?"
              : "Нет действующей ссылки? Укажите почту аккаунта."}{" "}
            В тестовой версии письма пока не отправляются.
          </p>
          <TextField
            disabled={action.pending || resend.pending}
            label="Электронная почта"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={user?.email}
            error={error}
            onChange={() => setError(undefined)}
            required
            data-auth-first={!token || undefined}
          />
          <Button
            type="submit"
            appearance="cut"
            fullWidth
            disabled={action.pending}
            loading={resend.pending}
          >
            ЗАПРОСИТЬ НОВУЮ ССЫЛКУ
          </Button>
          {resend.error && (
            <FormMessage tone="error">{resend.error}</FormMessage>
          )}
          {resend.success && (
            <FormMessage tone="success">
              Запрос принят. В тестовой версии письма не отправляются.
            </FormMessage>
          )}
        </form>
      )}
      <div className={styles.switchView}>
        <button
          type="button"
          disabled={action.pending || resend.pending}
          onClick={() => onViewChange("login")}
        >
          ← Вернуться ко входу
        </button>
      </div>
    </div>
  );
}
