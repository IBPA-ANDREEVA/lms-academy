"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage, PasswordField, TextField } from "@/components/ui/form-controls";
import { SocialActions } from "./social-actions";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function LoginForm({ onViewChange }: { onViewChange: (view: AuthView) => void }) {
  const [notice, setNotice] = useState(false);
  return (
    <form className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); setNotice(true); }}>
      <TextField label="Электронная почта" type="email" name="email" autoComplete="email" placeholder="example@email.com" data-auth-first />
      <PasswordField label="Пароль" name="password" autoComplete="current-password" placeholder="Введите пароль" />
      <button type="button" className={styles.forgotLink} onClick={() => onViewChange("forgot")}>Забыли пароль?</button>
      <Button type="submit" appearance="cut" intent="secondary" fullWidth className={styles.primaryAction}>ВОЙТИ <span aria-hidden="true">→</span></Button>
      {notice && <FormMessage>Вход пока недоступен. Это демонстрация интерфейса.</FormMessage>}
      <SocialActions />
      <div className={styles.switchView}>Ещё нет аккаунта? <button type="button" onClick={() => onViewChange("register")}>Зарегистрироваться ↗</button></div>
    </form>
  );
}
