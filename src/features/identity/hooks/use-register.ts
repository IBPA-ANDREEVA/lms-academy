import { useState } from "react";

import { registerStudent } from "../api";
import { ApiError } from "@/lib/api/client";

export function useRegister() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function register(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  ): Promise<void> {
    if (pending) return;

    setPending(true);
    setError("");
    setSuccess(false);

    try {
      await registerStudent({
        first_name,
        last_name,
        email,
        password,
      });

      setSuccess(true);

    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 400:
          case 422:
            setError("Проверьте правильность введённых данных");
            break;

          case 409:
            setError("Не удалось зарегистрировать этот адрес электронной почты");
            break;

          case 429:
            setError("Слишком много попыток. Попробуйте позже");
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            setError("Ошибка сервера. Попробуйте позже");
            break;

          default:
            setError("Не удалось выполнить регистрацию");
        }
      } else {
        setError("Не удалось подключиться к серверу. Проверьте соединение");
      }
    } finally {
      setPending(false);
    }
  }

  return {
    register,
    pending,
    error,
    success,
  };
}
