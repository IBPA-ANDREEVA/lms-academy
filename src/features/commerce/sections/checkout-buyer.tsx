"use client";

import { useRef, useState } from "react";
import { TextField } from "@/components/ui/form-controls";
import { AuthModal } from "@/features/identity";
import styles from "../commerce.module.css";

export function CheckoutBuyer() {
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const login = useRef<HTMLButtonElement>(null);
  const error = touched && (!email.trim() ? "Укажите email." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Проверьте адрес: например, name@example.com." : undefined);
  return <>
    <section className={styles.formSection} aria-labelledby="buyer-heading">
      <div className={styles.sectionHeading}><h2 id="buyer-heading">Контактные данные</h2>
        <button ref={login} type="button" className={styles.textButton} onClick={() => setAuthOpen(true)}>Уже есть аккаунт? Войти</button></div>
      <form noValidate onSubmit={event => { event.preventDefault(); setTouched(true); }}>
        <TextField label="Email" type="email" autoComplete="email" name="email" required value={email} onChange={event => setEmail(event.target.value)} onBlur={() => setTouched(true)} error={error || undefined} hint="Для подтверждения покупки и получения доступа. В демонстрации данные никуда не отправляются." />
      </form>
      <p className={styles.caption}>Можно продолжить как гость — вход необязателен.</p>
    </section>
    <section className={styles.formSection} aria-labelledby="buyer-details-heading">
      <h2 id="buyer-details-heading">Данные покупателя</h2>
      <p className={styles.caption}>Дополнительные поля будут доступны, когда будут определены требования к покупке. Сейчас имя, адрес и телефон не требуются.</p>
    </section>
    <AuthModal open={authOpen} onClose={() => { setAuthOpen(false); login.current?.focus(); }} />
  </>;
}
