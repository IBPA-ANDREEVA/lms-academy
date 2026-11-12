"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage, PasswordField } from "@/components/ui/form-controls";
import { resetPassword } from "./api";
import { useAuthAction } from "./hooks/use-auth-action";
import { useIdentity } from "./identity-provider";
import { focusInvalid, passwordError } from "./form-validation";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function ResetForm({
  token,
  onViewChange,
}: {
  token: string;
  onViewChange: (view: AuthView) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const action = useAuthAction();
  const { refresh } = useIdentity();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    const next = {
      password: passwordError(password, "reset"),
      confirmation:
        confirmation === password && confirmation
          ? undefined
          : "Пароли не совпадают",
    };
    setErrors(next);
    if (focusInvalid(form, next)) return;
    void action.run(
      () => resetPassword({ token, password }),
      () => {
        form.reset();
        void refresh().catch(() => {});
      },
    );
  }
  return (
    <div className={styles.form}>
      {action.success ? (
        <FormMessage tone="success">
          Пароль изменён. Все предыдущие сеансы завершены. Войдите с новым
          паролем.
        </FormMessage>
      ) : token ? (
        <form
          className={styles.form}
          noValidate
          onSubmit={submit}
          aria-busy={action.pending}
        >
          <p className={styles.instruction}>
            Задайте новый пароль. После сохранения потребуется войти заново на
            всех устройствах.
          </p>
          <PasswordField
            disabled={action.pending}
            label="Новый пароль"
            name="password"
            autoComplete="new-password"
            error={errors.password}
            onChange={() =>
              setErrors((previous) => ({ ...previous, password: undefined }))
            }
            required
            data-auth-first
          />
          <PasswordField
            disabled={action.pending}
            label="Подтвердите пароль"
            name="confirmation"
            autoComplete="new-password"
            error={errors.confirmation}
            onChange={() =>
              setErrors((previous) => ({
                ...previous,
                confirmation: undefined,
              }))
            }
            required
          />
          <Button
            type="submit"
            appearance="cut"
            fullWidth
            loading={action.pending}
          >
            СОХРАНИТЬ ПАРОЛЬ
          </Button>
          {action.error && (
            <FormMessage tone="error">{action.error}</FormMessage>
          )}
        </form>
      ) : (
        <FormMessage>
          Для смены пароля нужна действующая ссылка. Запросите восстановление
          доступа.
        </FormMessage>
      )}
      {!action.success && (
        <div className={styles.switchView}>
          <button
            type="button"
            disabled={action.pending}
            onClick={() => onViewChange("forgot")}
          >
            Запросить новую ссылку
          </button>
        </div>
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
    </div>
  );
}
