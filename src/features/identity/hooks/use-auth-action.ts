"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";

export function authError(error: unknown) {
  if (!(error instanceof ApiError) || error.status === 0)
    return "Не удалось получить ответ. Проверьте соединение и повторите попытку.";
  if (error.code === "authentication_required")
    return "Сеанс завершён. Войдите заново, чтобы продолжить.";
  if (error.code === "session_not_found")
    return "Сеанс не найден. Обновите список и повторите попытку.";
  if (error.status === 401)
    return "Не удалось войти. Проверьте почту и пароль или восстановите доступ.";
  if (error.status === 429)
    return "Слишком много попыток. Подождите минуту и повторите запрос.";
  if (error.status === 403) return "Обновите страницу и повторите попытку.";
  if (error.status === 409)
    return "Не удалось зарегистрировать этот адрес. Попробуйте войти или восстановить пароль.";
  if (
    error.code === "invalid_recovery_link" ||
    error.code === "invalid_verification_link"
  )
    return "Ссылка недействительна или устарела. Запросите новую.";
  if (error.status === 400 || error.status === 422)
    return "Проверьте введённые данные и повторите попытку.";
  return "Не удалось выполнить запрос. Попробуйте позже.";
}

/** Shared only by Identity forms. Guards double submits and late unmounted updates. */
export function useAuthAction() {
  const active = useRef(true);
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  async function run(action: () => Promise<unknown>, onSuccess?: () => void) {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    setSuccess(false);
    try {
      await action();
      if (active.current) {
        setSuccess(true);
        onSuccess?.();
      }
    } catch (failure) {
      if (active.current) setError(authError(failure));
    } finally {
      busy.current = false;
      if (active.current) setPending(false);
    }
  }
  return { pending, error, success, run };
}
