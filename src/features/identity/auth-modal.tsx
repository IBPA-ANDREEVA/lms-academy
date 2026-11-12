"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { Button } from "@/components/ui/button";
import { AuthContent } from "./auth-content";
import { useIdentity } from "./identity-provider";
import styles from "./auth-modal.module.css";

gsap.registerPlugin(useGSAP);

export type AuthView = "login" | "register" | "forgot" | "verify" | "account";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const viewTitles: Record<AuthView, string> = {
  login: "Вход",
  account: "Мой аккаунт",
  verify: "Подтверждение почты",
  register: "Регистрация",
  forgot: "Восстановление пароля",
};

export function AuthModal({ open, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selectedView, setView] = useState<AuthView>("login");
  const { user } = useIdentity();
  const view = selectedView === "login" && user ? "account" : selectedView;
  const [sessionKey, setSessionKey] = useState(0);
  const titleId = useId();
  const closing = useRef(false);
  const { contextSafe } = useGSAP(() => {
    const element = dialog.current;
    if (!open || !element) return;
    closing.current = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      gsap.killTweensOf(element);
      element.style.removeProperty("opacity");
      if (closing.current) element.close();
    };
    if (!preference.matches) gsap.fromTo(element, { opacity: .65 }, { opacity: 1, duration: .22, ease: "power2.out", clearProps: "opacity" });
    preference.addEventListener("change", settle);
    return () => { preference.removeEventListener("change", settle); gsap.killTweensOf(element); element.style.removeProperty("opacity"); };
  }, { scope: dialog, dependencies: [open], revertOnUpdate: true });
  function closeAnimated() { contextSafe(() => {
    const element = dialog.current;
    if (!element || closing.current) return;
    closing.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { element.close(); return; }
    gsap.to(element, { opacity: 0, duration: .12, overwrite: true, onComplete: () => element.close() });
  })(); }

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
    if (open) {
      element.querySelector<HTMLElement>('[data-auth-view]:not([hidden]) [data-auth-first]')?.focus({ preventScroll: true });
    }
  }, [open, view, user?.id]);

  useScrollLock(open);

  function changeView(next: AuthView) {
    setView(next);
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className={styles.dialog}
      data-view={view}
      onCancel={event => { event.preventDefault(); closeAnimated(); }}
      onClose={() => {
        setView("login");
        setSessionKey((key) => key + 1);
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeAnimated();
      }}
    >
      <div className={styles.frame}>
        <div className={styles.heading}>
          <span className={styles.brand}><strong>LMS</strong> ACADEMY</span>
          <Button intent="secondary" className={styles.close} aria-label="Закрыть окно" onClick={closeAnimated}>
            <span aria-hidden="true" className={styles.closeIcon} />
          </Button>
        </div>
        <h2 id={titleId} className={styles.title}>{viewTitles[view]}</h2>
        {open && <AuthContent key={sessionKey} view={view} onViewChange={changeView} />}
      </div>
    </dialog>
  );
}
