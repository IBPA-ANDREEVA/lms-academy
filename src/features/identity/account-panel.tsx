"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-controls";
import { logout } from "./api";
import { useAuthAction } from "./hooks/use-auth-action";
import { useIdentity } from "./identity-provider";
import { SessionsPanel } from "./sessions-panel";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function AccountPanel({
  onViewChange,
}: {
  onViewChange: (view: AuthView) => void;
}) {
  const { user, loading, unavailable, refresh } = useIdentity();
  const action = useAuthAction();
  const identity = useRef<HTMLParagraphElement>(null);
  useEffect(() => { identity.current?.focus({ preventScroll: true }); }, [user?.id]);
  if (loading) return <p role="status">Проверяем вход…</p>;
  if (!user)
    return (
      <div className={styles.form}>
        <FormMessage>
          {unavailable
            ? "Не удалось проверить вход. Повторите попытку."
            : "Сеанс завершён. Войдите заново, чтобы продолжить."}
        </FormMessage>
        <Button data-auth-first onClick={() => onViewChange("login")}>
          Вернуться ко входу
        </Button>
      </div>
    );
  return (
    <div className={styles.form}>
      <p ref={identity} className={styles.accountEmail} tabIndex={-1} data-auth-first>{user.email}</p>
      <FormMessage tone={user.email_verified_at ? "success" : "info"}>
        {user.email_verified_at
          ? "Электронная почта подтверждена."
          : "Подтвердите почту для доступа к приобретённым курсам."}
      </FormMessage>
      {!user.email_verified_at && (
        <button
          className={styles.textAction}
          onClick={() => onViewChange("verify")}
        >
          Подтвердить почту
        </button>
      )}
      <SessionsPanel />
      <Button
        intent="secondary"
        fullWidth
        loading={action.pending}
        onClick={() =>
          void action.run(
            async () => {
              await logout();
              await refresh();
            },
            () => onViewChange("login"),
          )
        }
      >
        Выйти из аккаунта
      </Button>
      {action.error && <FormMessage tone="error">{action.error}</FormMessage>}
    </div>
  );
}
