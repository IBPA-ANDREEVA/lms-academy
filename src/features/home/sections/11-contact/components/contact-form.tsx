"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import styles from "../contact-section.module.css";

type Field = "name" | "email" | "subject" | "message";
type Values = Record<Field, string>;
type Touched = Record<Field, boolean>;

const initialValues: Values = { name: "", email: "", subject: "", message: "" };
const initialTouched: Touched = { name: false, email: false, subject: false, message: false };

function validate(field: Field, value: string) {
  const text = value.trim();
  if (!text) return "Заполните это поле";
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return "Введите корректный email";
  if (field === "name" && text.length < 2) return "Укажите имя полностью";
  if (field === "message" && text.length < 10) return "Напишите вопрос подробнее";
  return undefined;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Touched>(initialTouched);
  const error = (field: Field) => touched[field] ? validate(field, values[field]) : undefined;
  const change = (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((current) => ({ ...current, [field]: event.target.value }));
  const blur = (field: Field) => () => setTouched((current) => ({ ...current, [field]: true }));
  const preventSubmission = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <form className={styles.form} onSubmit={preventSubmission} noValidate aria-labelledby="contact-form-title">
      <div className={styles.formHeader}><h3 id="contact-form-title">ВАШЕ СООБЩЕНИЕ</h3><span>Поля с * обязательны</span></div>
      <div className={styles.formGrid}>
        <TextField label="Ваше имя *" name="name" autoComplete="name" placeholder="Как к вам обращаться" value={values.name} onChange={change("name")} onBlur={blur("name")} error={error("name")} maxLength={100} />
        <TextField label="Email *" name="email" type="email" autoComplete="email" inputMode="email" placeholder="name@example.com" value={values.email} onChange={change("email")} onBlur={blur("email")} error={error("email")} maxLength={254} />
        <div className={styles.full}><TextField label="Тема обращения *" name="subject" placeholder="О чём ваш вопрос?" value={values.subject} onChange={change("subject")} onBlur={blur("subject")} error={error("subject")} maxLength={120} /></div>
        <div className={styles.full}>
          <label className={styles.messageLabel} htmlFor="contact-message">Сообщение *</label>
          <textarea id="contact-message" name="message" className={`${styles.textarea} resize-none`} placeholder="Напишите ваш вопрос..." value={values.message} onChange={change("message")} onBlur={blur("message")} aria-invalid={!!error("message")} aria-describedby={error("message") ? "contact-message-error" : undefined} maxLength={2000} />
          <div className={styles.messageFeedback}>{error("message") && <p id="contact-message-error" role="alert">{error("message")}</p>}</div>
        </div>
      </div>
      <div className={styles.formFooter}>
        <p id="contact-availability">Отправка будет доступна после подключения формы. Введённые данные остаются только на этой странице.</p>
        <Button appearance="neoBrutalist" size="lg" disabled aria-describedby="contact-availability" className={styles.submit}>ОТПРАВИТЬ СООБЩЕНИЕ <span aria-hidden="true">→</span></Button>
      </div>
    </form>
  );
}
