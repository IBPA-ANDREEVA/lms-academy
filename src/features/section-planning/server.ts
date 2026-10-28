import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { readPages, savePage } from "./store";
import { ensure, PlanningError } from "./validation";

const csrfToken = randomBytes(32).toString("hex");
export function enabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.SECTIONS_WORKSPACE === "1"
  );
}
function localURL(value: string) {
  const url = new URL(value);
  return (
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
    url.protocol === "http:" &&
    !url.username &&
    !url.password
  );
}
export function guard(request: Request, write = false) {
  ensure(enabled(), "Not found", 404);
  const url = new URL(request.url);
  const host = request.headers.get("host");
  // Next normalizes request.url to localhost even when Host is 127.0.0.1.
  ensure(
    host &&
      localURL(`http://${host}`) &&
      localURL(url.href) &&
      new URL(`http://${host}`).port === url.port,
    "Только локальный доступ.",
    403,
  );
  const forwardedHost = request.headers.get("x-forwarded-host");
  ensure(
    (!forwardedHost || forwardedHost === host) &&
      !request.headers.has("forwarded"),
    "Прокси-доступ запрещён.",
    403,
  );
  if (write) {
    ensure(
      request.headers.get("origin") === `http://${host}`,
      "Неверный источник запроса.",
      403,
    );
    const token = request.headers.get("x-planning-token") || "";
    ensure(
      token.length === csrfToken.length &&
        timingSafeEqual(Buffer.from(token), Buffer.from(csrfToken)),
      "Сессия редактора устарела. Обновите страницу, сохранив черновик.",
      403,
    );
    ensure(
      request.headers.get("content-type")?.split(";")[0] === "application/json",
      "Требуется JSON.",
      415,
    );
  }
}
async function questions() {
  const result: Record<string, string> = {};
  for (const file of [
    "docs/product/open-questions.md",
    "docs/architecture/public-open-questions.md",
    "docs/design/OPEN-DECISIONS.md",
  ]) {
    const text = await readFile(path.join(process.cwd(), file), "utf8");
    for (const line of text.split("\n")) {
      const match = line.match(/^(?:\| |### )?((?:OQ|PA|OD)-\d{2,3})\b/);
      if (match) result[match[1]] = line.replace(/^\| |^### /, "").trim();
    }
  }
  return result;
}
function response(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
async function boundedJSON(request: Request) {
  const reader = request.body?.getReader();
  ensure(reader, "Пустой запрос.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      ensure(total <= 512_000, "Запрос слишком большой.", 413);
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new PlanningError("Некорректный JSON.");
  }
}
export async function handleGet(request: Request) {
  try {
    guard(request);
    return response({
      pages: await readPages(),
      token: csrfToken,
      questions: await questions(),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function handlePost(request: Request) {
  try {
    guard(request, true);
    return response(await savePage(await boundedJSON(request)));
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  if (error instanceof PlanningError)
    return response({ error: error.message }, error.status);
  console.error("Section planning filesystem operation failed", error);
  return response(
    {
      error:
        "Не удалось прочесть или сохранить файл. Черновик сохранён на экране. Проверьте терминал и права файлов; повторите после устранения ошибки.",
    },
    500,
  );
}
