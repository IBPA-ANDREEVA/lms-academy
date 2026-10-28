import { ensure } from "./validation";
export function localHeaders(headers: Headers) {
  const host = headers.get("host") || "";
  ensure(
    /^(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(host),
    "Только локальный доступ.",
    403,
  );
  ensure(
    !headers.has("forwarded") &&
      (!headers.has("x-forwarded-host") ||
        headers.get("x-forwarded-host") === host),
    "Прокси-доступ запрещён.",
    403,
  );
  return host;
}
