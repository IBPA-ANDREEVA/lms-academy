import {
  categories,
  detailFields,
  priorities,
  referenceFields,
  type Definition,
  type Reference,
} from "./model";
export class RegistryError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function ensure(
  value: unknown,
  message: string,
  status = 400,
): asserts value {
  if (!value) throw new RegistryError(message, status);
}
export function object(value: unknown): Record<string, unknown> {
  ensure(
    value && typeof value === "object" && !Array.isArray(value),
    "Ожидается объект.",
  );
  return value as Record<string, unknown>;
}
export function keys(
  value: Record<string, unknown>,
  allowed: readonly string[],
) {
  ensure(
    Object.keys(value).every((k) => allowed.includes(k)),
    "Неизвестное поле запроса.",
  );
}
export function text(value: unknown, max = 12000): string {
  ensure(
    typeof value === "string" && value.length <= max && !value.includes("\0"),
    `Текст должен быть не длиннее ${max} символов.`,
  );
  return value;
}
export function id(value: unknown): string {
  const s = text(value, 100);
  ensure(
    /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(s),
    "ID: строчные латинские буквы, цифры и дефисы.",
  );
  return s;
}
export function definition(value: unknown): Definition {
  const o = object(value);
  keys(o, [...detailFields, "category", "priority", "usages", "dependencies"]);
  for (const key of detailFields) text(o[key]);
  ensure(text(o.name).trim(), "Укажите название.");
  ensure(
    categories.includes(o.category as never) &&
      priorities.includes(o.priority as never),
    "Неверная категория или приоритет.",
  );
  ensure(
    !o.implementationPath ||
      /^src\/(?:features|components)\/[a-zA-Z0-9/_-]+\.tsx$/.test(
        text(o.implementationPath),
      ),
    "Путь: src/features/…/*.tsx или src/components/…/*.tsx.",
  );
  ensure(
    Array.isArray(o.dependencies) && o.dependencies.length <= 100,
    "Некорректные зависимости.",
  );
  o.dependencies.forEach(id);
  ensure(
    new Set(o.dependencies).size === o.dependencies.length,
    "Повтор зависимости.",
  );
  ensure(
    Array.isArray(o.usages) && o.usages.length <= 500,
    "Некорректные связи.",
  );
  const seen = new Set<string>();
  for (const item of o.usages) {
    const u = object(item);
    keys(u, ["pageId", "sectionId", "reason", "sourceRevision"]);
    id(u.pageId);
    ensure(/^[a-z0-9-]+$/.test(text(u.sectionId, 180)), "Неверный ID секции.");
    ensure(text(u.reason, 2000).trim(), "Обоснуйте связь с секцией.");
    ensure(
      Number.isSafeInteger(u.sourceRevision) && Number(u.sourceRevision) > 0,
      "Неверная ревизия источника.",
    );
    const key = `${u.pageId}/${u.sectionId}`;
    ensure(!seen.has(key), "Повтор связи.");
    seen.add(key);
  }
  return o as Definition;
}
export function referenceEdit(
  value: unknown,
): Pick<Reference, (typeof referenceFields)[number]> {
  const o = object(value);
  keys(o, referenceFields);
  for (const k of referenceFields) text(o[k]);
  if (o.sourceUrl) {
    let url: URL;
    try {
      url = new URL(text(o.sourceUrl));
    } catch {
      throw new RegistryError("Неверный URL источника.");
    }
    ensure(
      ["http:", "https:"].includes(url.protocol) &&
        !url.username &&
        !url.password,
      "Источник должен быть HTTP(S) URL без пароля.",
    );
  }
  ensure(text(o.title).trim(), "Укажите название референса.");
  return o as Pick<Reference, (typeof referenceFields)[number]>;
}
export function validateImage(filename: string, bytes: Buffer) {
  ensure(
    bytes.length > 24 && bytes.length <= 8 * 1024 * 1024,
    "Изображение: максимум 8 MiB.",
    413,
  );
  const extension = filename.toLowerCase().split(".").pop();
  const png =
    bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    bytes.subarray(12, 16).toString() === "IHDR" &&
    bytes.subarray(-8, -4).toString() === "IEND";
  const jpeg =
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255 &&
    bytes[bytes.length - 2] === 255 &&
    bytes[bytes.length - 1] === 217;
  const webp =
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP" &&
    bytes.readUInt32LE(4) + 8 === bytes.length &&
    ["VP8 ", "VP8L", "VP8X"].includes(bytes.toString("ascii", 12, 16));
  ensure(
    (extension === "png" && png) ||
      (["jpg", "jpeg"].includes(extension || "") && jpeg) ||
      (extension === "webp" && webp),
    "Расширение и сигнатура должны соответствовать PNG, JPEG или WebP.",
  );
  if (png)
    ensure(
      bytes.readUInt32BE(16) <= 16000 &&
        bytes.readUInt32BE(20) <= 16000 &&
        bytes.readUInt32BE(16) > 0 &&
        bytes.readUInt32BE(20) > 0,
      "Недопустимые размеры PNG.",
    );
  return extension === "jpeg" ? "jpg" : extension!;
}
