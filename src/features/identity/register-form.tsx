"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage, PasswordField, TextField } from "@/components/ui/form-controls";
import { SocialActions } from "./social-actions";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function RegisterForm({ onViewChange }: { onViewChange: (view: AuthView) => void }) {
  const [notice, setNotice] = useState(false);
  return (
    <form className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); setNotice(true); }}>
      <div className={styles.nameFields}>
        <TextField label="Имя" name="given-name" autoComplete="given-name" placeholder="Ваше имя" data-auth-first />
        <TextField label="Фамилия" name="family-name" autoComplete="family-name" placeholder="Ваша фамилия" />
      </div>
      <TextField label="Электронная почта" type="email" name="email" autoComplete="email" placeholder="example@email.com" />
      <PasswordField label="Пароль" name="new-password" autoComplete="new-password" placeholder="Введите пароль" />
      <PasswordField label="Подтвердите пароль" name="confirm-password" autoComplete="new-password" placeholder="Повторите пароль" />
      <TextField label="Дата рождения" type="text" name="birthdate" inputMode="numeric" autoComplete="bday" placeholder="ДД.ММ.ГГГГ" />
      <Button type="submit" appearance="cut" intent="secondary" fullWidth className={styles.primaryAction}>СОЗДАТЬ АККАУНТ <span aria-hidden="true">→</span></Button>
      {notice && <FormMessage>Регистрация пока недоступна. Это демонстрация интерфейса.</FormMessage>}
      <SocialActions />
      <div className={styles.switchView}>Уже есть аккаунт? <button type="button" onClick={() => onViewChange("login")}>Войти ↗</button></div>
    </form>
  );
}
