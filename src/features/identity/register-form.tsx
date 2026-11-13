"use client";

import { useState, type FormEvent } from "react";

import styles from "./auth-modal.module.css";

import {
  TextField,
  PasswordField,
  FormMessage,
} from "@/components/ui/form-controls";

import { Button } from "@/components/ui/button";
import { SocialActions } from "./social-actions";
import { emailError, nameError, passwordError } from "./form-validation";
import { useRegister } from "./hooks/use-register";

import type { AuthView } from "./auth-modal";

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "confirmation";

type FieldErrors = Partial<Record<FieldName, string>>;

export function RegisterForm({
  onViewChange,
}: {
  onViewChange: (view: AuthView) => void;
}) {
  const { register, pending, error, success } = useRegister();

  const [emailSuccess, setEmailSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearFieldError(field: FieldName) {
    setFieldErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    const data = new FormData(event.currentTarget);

    const first_name = String(data.get("first-name") ?? "").trim();
    const last_name = String(data.get("last-name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("new-password") ?? "");
    const confirmation = String(data.get("confirm-password") ?? "");

    const errors: FieldErrors = {};

    errors.firstName = nameError(first_name, "имя");
    errors.lastName = nameError(last_name, "фамилию");
    errors.email = emailError(email);
    errors.password = passwordError(password);

    // Password confirmation
    if (!confirmation) {
      errors.confirmation = "Подтвердите пароль";
    } else if (password !== confirmation) {
      errors.confirmation = "Пароли не совпадают";
    }

    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      const names: Record<FieldName, string> = {
        firstName: "first-name",
        lastName: "last-name",
        email: "email",
        password: "new-password",
        confirmation: "confirm-password",
      };
      const first = (Object.keys(errors) as FieldName[]).find(
        (key) => errors[key],
      )!;
      event.currentTarget
        .querySelector<HTMLInputElement>(`[name="${names[first]}"]`)
        ?.focus();
      return;
    }

    void register(first_name, last_name, email, password);
  }

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={handleSubmit}
      aria-busy={pending}
    >
      <div className={styles.nameFields}>
        <TextField
          disabled={pending}
          label="Имя"
          name="first-name"
          autoComplete="given-name"
          placeholder="Ваше имя"
          data-auth-first
          error={fieldErrors.firstName}
          onChange={() => clearFieldError("firstName")}
          required
        />

        <TextField
          disabled={pending}
          label="Фамилия"
          name="last-name"
          autoComplete="family-name"
          placeholder="Ваша фамилия"
          error={fieldErrors.lastName}
          onChange={() => clearFieldError("lastName")}
          required
        />
      </div>

      <TextField
        disabled={pending}
        label="Электронная почта"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="example@email.com"
        error={fieldErrors.email}
        success={emailSuccess ? "Формат адреса проверен" : undefined}
        onChange={() => {
          clearFieldError("email");
          setEmailSuccess(false);
        }}
        onBlur={(event) =>
          setEmailSuccess(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.currentTarget.value.trim()),
          )
        }
        required
      />

      <PasswordField
        disabled={pending}
        label="Пароль"
        name="new-password"
        autoComplete="new-password"
        placeholder="Введите пароль"
        error={fieldErrors.password}
        onChange={() => clearFieldError("password")}
        required
      />

      <PasswordField
        disabled={pending}
        label="Подтвердите пароль"
        name="confirm-password"
        autoComplete="new-password"
        placeholder="Повторите пароль"
        error={fieldErrors.confirmation}
        onChange={() => clearFieldError("confirmation")}
        required
      />

      <Button
        type="submit"
        appearance="cut"
        loading={pending}
        intent="secondary"
        fullWidth
        className={styles.primaryAction}
      >
        {pending ? "СОЗДАНИЕ..." : "СОЗДАТЬ АККАУНТ"}
      </Button>

      {error && <FormMessage tone="error">{error}</FormMessage>}

      {success && (
        <FormMessage tone="success">
          Аккаунт создан. В тестовой версии письма не отправляются —
          подтверждение почты пока недоступно.
        </FormMessage>
      )}

      <SocialActions />

      <div className={styles.switchView}>
        Уже есть аккаунт?{" "}
        <button
          type="button"
          disabled={pending}
          onClick={() => onViewChange("login")}
        >
          Войти ↗
        </button>
      </div>
    </form>
  );
}
