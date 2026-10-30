"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage, TextField } from "@/components/ui/form-controls";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function ForgotForm({ onViewChange }: { onViewChange: (view: AuthView) => void }) {
  const [notice, setNotice] = useState(false);
  return (
    <form className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); setNotice(true); }}>
      <p className={styles.instruction}>Укажите email. Мы отправим ссылку для восстановления пароля.</p>
      <TextField label="Электронная почта" type="email" name="email" autoComplete="email" placeholder="example@email.com" data-auth-first />
      <Button type="submit" appearance="cut" intent="secondary" fullWidth className={styles.primaryAction}>ОТПРАВИТЬ ССЫЛКУ <span aria-hidden="true">→</span></Button>
      {notice && <FormMessage>Отправка ссылки пока недоступна. Это демонстрация интерфейса.</FormMessage>}
      <div className={styles.switchView}><button type="button" onClick={() => onViewChange("login")}>← Вернуться ко входу</button></div>
    </form>
  );
}
