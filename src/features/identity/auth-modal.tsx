"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ForgotForm } from "./forgot-form";
import styles from "./auth-modal.module.css";

export type AuthView = "login" | "register" | "forgot";

type Props = {
  open: boolean;
  onClose: () => void;
};

const viewTitles: Record<AuthView, string> = {
  login: "Войти в LMS Academy",
  register: "Создать аккаунт LMS Academy",
  forgot: "Восстановить пароль LMS Academy",
};

export function AuthModal({ open, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<AuthView>("login");
  const [sessionKey, setSessionKey] = useState(0);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
    if (open) {
      requestAnimationFrame(() => {
        element.querySelector<HTMLInputElement>('[data-auth-view]:not([hidden]) [data-auth-first]')?.focus();
      });
    }
  }, [open]);

  function changeView(next: AuthView) {
    setView(next);
    requestAnimationFrame(() => {
      dialog.current?.querySelector<HTMLInputElement>(`[data-auth-view="${next}"] [data-auth-first]`)?.focus();
    });
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className={styles.dialog}
      data-view={view}
      onClose={() => {
        setView("login");
        setSessionKey((key) => key + 1);
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className={styles.frame}>
        <div className={styles.heading}>
          <span className={styles.brand}><strong>LMS</strong> ACADEMY</span>
          <h2 id={titleId} className={styles.visuallyHidden}>{viewTitles[view]}</h2>
          <Button intent="secondary" className={styles.close} aria-label="Закрыть окно" onClick={() => dialog.current?.close()}>
            <span aria-hidden="true" className={styles.closeIcon} />
          </Button>
        </div>
        <div key={sessionKey}>
          <div data-auth-view="login" hidden={view !== "login"}><LoginForm onViewChange={changeView} /></div>
          <div data-auth-view="register" hidden={view !== "register"}><RegisterForm onViewChange={changeView} /></div>
          <div data-auth-view="forgot" hidden={view !== "forgot"}><ForgotForm onViewChange={changeView} /></div>
        </div>
      </div>
    </dialog>
  );
}
