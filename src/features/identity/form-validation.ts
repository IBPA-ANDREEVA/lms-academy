import { identityConstraints } from "@/lib/api/generated/identity-constraints";

export function emailError(value: string) {
  if (!value) return "Введите электронную почту";
  if (
    Array.from(value).length > identityConstraints.RegisterRequest.email.max ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  )
    return "Проверьте адрес электронной почты";
}
export function passwordError(
  value: string,
  mode: "register" | "login" | "reset" = "register",
) {
  const rules =
    mode === "login"
      ? identityConstraints.LoginRequest.password
      : mode === "reset"
        ? identityConstraints.ResetPasswordRequest.password
        : identityConstraints.RegisterRequest.password;
  const length = Array.from(value).length;
  if (!length) return "Введите пароль";
  if (length < rules.min)
    return `Пароль должен содержать минимум ${rules.min} символов`;
  if (length > rules.max)
    return `Пароль не может превышать ${rules.max} символов`;
}
export function nameError(value: string, label: string) {
  const rules = identityConstraints.RegisterRequest.first_name;
  if (!value) return `Введите ${label}`;
  const length = Array.from(value).length;
  if (length < rules.min || length > rules.max)
    return `От ${rules.min} до ${rules.max} символов`;
}
export function focusInvalid(
  form: HTMLFormElement,
  errors: Record<string, string | undefined>,
) {
  const first = Object.keys(errors).find((key) => errors[key]);
  if (!first) return false;
  form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
  return true;
}
