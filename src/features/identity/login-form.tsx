"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  FormMessage,
  PasswordField,
  TextField,
} from "@/components/ui/form-controls";
import { SocialActions } from "./social-actions";
import { login } from "./api";
import { useIdentity } from "./identity-provider";
import { useAuthAction } from "./hooks/use-auth-action";
import { emailError, focusInvalid, passwordError } from "./form-validation";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function LoginForm({
  onViewChange,
}: {
  onViewChange: (view: AuthView) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const action = useAuthAction();
  const { refresh } = useIdentity();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const next = {
      email: emailError(email),
      password: passwordError(password, "login"),
    };
    setErrors(next);
    if (focusInvalid(form, next)) return;
    void action.run(
      async () => {
        await login({ email, password });
        await refresh();
      },
      () => {
        form.reset();
        onViewChange("account");
      },
    );
  }
  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={submit}
      aria-busy={action.pending}
    >
      <TextField
        disabled={action.pending}
        label="Электронная почта"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="example@email.com"
        data-auth-first
        required
        error={errors.email}
        onChange={() =>
          setErrors((previous) => ({ ...previous, email: undefined }))
        }
      />
      <PasswordField
        disabled={action.pending}
        label="Пароль"
        name="password"
        autoComplete="current-password"
        placeholder="Введите пароль"
        required
        error={errors.password}
        onChange={() =>
          setErrors((previous) => ({ ...previous, password: undefined }))
        }
      />
      <button
        type="button"
        disabled={action.pending}
        className={styles.forgotLink}
        onClick={() => onViewChange("forgot")}
      >
        Забыли пароль?
      </button>
      <Button
        type="submit"
        appearance="cut"
        intent="secondary"
        fullWidth
        loading={action.pending}
        className={styles.primaryAction}
      >
        ВОЙТИ
      </Button>
      {action.error && <FormMessage tone="error">{action.error}</FormMessage>}
      <SocialActions />
      <div className={styles.switchView}>
        Ещё нет аккаунта?{" "}
        <button
          type="button"
          disabled={action.pending}
          onClick={() => onViewChange("register")}
        >
          Зарегистрироваться ↗
        </button>
      </div>
      <div className={styles.switchView}>
        <button
          type="button"
          disabled={action.pending}
          onClick={() => onViewChange("verify")}
        >
          Подтвердить электронную почту
        </button>
      </div>
    </form>
  );
}
