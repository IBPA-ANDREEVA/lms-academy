import { randomBytes, timingSafeEqual } from "node:crypto";
import { ensure, RegistryError } from "./validation";
import {
  imageBytes,
  mutate,
  readComponents,
  readSources,
  recoverDocs,
} from "./store";
const token = randomBytes(32).toString("hex");
export const enabled = () =>
  process.env.NODE_ENV === "development" &&
  process.env.COMPONENTS_WORKSPACE === "1";
export { localHeaders } from "./access";
import { localHeaders } from "./access";
export function guard(request: Request, write = false) {
  ensure(enabled(), "Not found", 404);
  const host = localHeaders(request.headers);
  const url = new URL(request.url);
  ensure(
    ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) &&
      url.protocol === "http:",
    "Только локальный доступ.",
    403,
  );
  if (write) {
    ensure(
      request.headers.get("origin") === `http://${host}`,
      "Неверный источник запроса.",
      403,
    );
    const sent = request.headers.get("x-registry-token") || "";
    ensure(
      /^[a-f0-9]{64}$/.test(sent) &&
        timingSafeEqual(Buffer.from(sent), Buffer.from(token)),
      "Сессия устарела: скачайте черновик и перезагрузите реестр.",
      403,
    );
    ensure(
      request.headers.get("content-type")?.split(";")[0] === "application/json",
      "Требуется JSON.",
      415,
    );
  }
}
const response = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
async function boundedJSON(request: Request) {
  const reader = request.body?.getReader();
  ensure(reader, "Пустой запрос.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      ensure(size <= 12_000_000, "Запрос слишком большой.", 413);
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new RegistryError("Неверный JSON.");
  }
}
export async function handle(request: Request) {
  try {
    guard(request, request.method === "POST");
    if (request.method === "POST")
      return response(await mutate(await boundedJSON(request)));
    const params = new URL(request.url).searchParams;
    if (params.has("image")) {
      const result = await imageBytes(
        params.get("component") || "",
        params.get("image") || "",
      );
      return new Response(new Uint8Array(result.bytes), {
        headers: {
          "Content-Type": result.type,
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy": "default-src 'none'; sandbox",
        },
      });
    }
    await recoverDocs();
    return response({
      components: await readComponents(),
      ...(await readSources()),
      token,
    });
  } catch (e) {
    if (e instanceof RegistryError)
      return response({ error: e.message }, e.status);
    console.error("Component registry failure", e);
    return response(
      {
        error:
          "Ошибка файловой системы. Сохранение могло завершиться частично: скачайте черновик, затем перечитайте реестр. Документация восстановится из JSON. Проверьте терминал.",
      },
      500,
    );
  }
}
