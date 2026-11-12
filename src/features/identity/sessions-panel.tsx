"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-controls";
import { ApiError } from "@/lib/api/client";
import { getSessions, revokeSession, type Sessions } from "./api";
import { authError, useAuthAction } from "./hooks/use-auth-action";
import { useIdentity } from "./identity-provider";
import styles from "./auth-modal.module.css";

function localTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SessionsPanel() {
  const titleId = useId();
  const [data, setData] = useState<Sessions>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<string>();
  const request = useRef<AbortController | null>(null);
  const action = useAuthAction();
  const { refresh } = useIdentity();
  const load = useCallback(
    (after?: string) => {
      request.current?.abort();
      const controller = new AbortController();
      request.current = controller;
      return getSessions(after, controller.signal)
        .then((result) => {
          if (!controller.signal.aborted)
            setData((previous) => ({
              ...result,
              sessions:
                after && previous
                  ? [...previous.sessions, ...result.sessions]
                  : result.sessions,
            }));
        })
        .catch((failure) => {
          if (!controller.signal.aborted) {
            setError(authError(failure));
            if (failure instanceof ApiError && failure.status === 401)
              void refresh().catch(() => {});
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    },
    [refresh],
  );
  useEffect(() => {
    void load();
    return () => request.current?.abort();
  }, [load]);
  return (
    <section
      className={styles.sessions}
      aria-labelledby={titleId}
      aria-busy={loading}
    >
      <h3 id={titleId}>Активные сеансы</h3>
      <p className={styles.caption}>
        Время указано в вашем часовом поясе. Завершите незнакомый сеанс, чтобы
        закрыть доступ с него.
      </p>
      {loading && <p role="status">Загружаем сеансы…</p>}
      {error && (
        <>
          <FormMessage tone="error">{error}</FormMessage>
          <Button
            onClick={() => {
              setLoading(true);
              setError("");
              void load();
            }}
          >
            Повторить
          </Button>
        </>
      )}
      {data?.sessions.length === 0 && !loading && (
        <p>Активных сеансов нет. Войдите заново.</p>
      )}
      <ul className={styles.sessionList}>
        {data?.sessions.map((session) => (
          <li key={session.id}>
            <strong>
              {session.is_current ? "Текущий сеанс" : "Другой сеанс"}
            </strong>
            <dl>
              <div>
                <dt>Вход</dt>
                <dd>
                  <time dateTime={session.created_at}>
                    {localTime(session.created_at)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Последнее действие</dt>
                <dd>
                  <time dateTime={session.last_interaction_at}>
                    {localTime(session.last_interaction_at)}
                  </time>
                </dd>
              </div>
            </dl>
            {confirmation === session.id ? (
              <div className={styles.form}>
                <p>
                  {session.is_current
                    ? "Вы выйдете из аккаунта в этом браузере."
                    : "Для продолжения работы в этом сеансе понадобится войти заново."}
                </p>
                <div className={styles.sessionActions}>
                  <Button
                    intent="secondary"
                    disabled={action.pending}
                    onClick={() => setConfirmation(undefined)}
                  >
                    Отмена
                  </Button>
                  <Button
                    loading={action.pending}
                    onClick={() =>
                      void action.run(
                        async () => {
                          await revokeSession(session.id);
                          if (session.is_current) await refresh();
                          else await load();
                        },
                        () => setConfirmation(undefined),
                      )
                    }
                  >
                    Завершить сеанс
                  </Button>
                </div>
              </div>
            ) : (
              <button
                className={styles.textAction}
                disabled={action.pending}
                onClick={() => setConfirmation(session.id)}
              >
                Завершить{session.is_current ? " текущий" : ""} сеанс
              </button>
            )}
          </li>
        ))}
      </ul>
      {action.error && <FormMessage tone="error">{action.error}</FormMessage>}
      {action.success && (
        <FormMessage tone="success">Сеанс завершён.</FormMessage>
      )}
      {data?.next_cursor && (
        <Button
          loading={loading}
          disabled={action.pending}
          onClick={() => {
            setLoading(true);
            setError("");
            void load(data.next_cursor ?? undefined);
          }}
        >
          Показать ещё
        </Button>
      )}
    </section>
  );
}
