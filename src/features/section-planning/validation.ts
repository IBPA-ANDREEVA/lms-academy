import { phases, type Command, type Section } from "./model";

export class PlanningError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function ensure(
  condition: unknown,
  message: string,
  status = 400,
): asserts condition {
  if (!condition) throw new PlanningError(message, status);
}
function object(value: unknown): asserts value is Record<string, unknown> {
  ensure(
    value !== null && typeof value === "object" && !Array.isArray(value),
    "Ожидается объект.",
  );
}
function keys(value: Record<string, unknown>, expected: string[]) {
  ensure(
    Object.keys(value).length === expected.length &&
      expected.every((k) => Object.hasOwn(value, k)),
    "Неизвестные или пропущенные поля.",
  );
}
function string(value: unknown, max = 12000): asserts value is string {
  ensure(
    typeof value === "string" &&
      value.length <= max &&
      !value.includes("\u0000"),
    "Недопустимый текст или превышен лимит длины.",
  );
}
export function validateSection(value: unknown): asserts value is Section {
  object(value);
  keys(value, [
    "id",
    "name",
    "position",
    "purpose",
    "content",
    "primaryAction",
    "interactions",
    "dependencies",
    "sources",
    "phase",
    "inclusion",
    "required",
    "reviewed",
    "desktop",
    "mobile",
    "states",
    "notes",
  ]);
  for (const key of [
    "id",
    "name",
    "purpose",
    "content",
    "primaryAction",
    "interactions",
    "dependencies",
    "desktop",
    "mobile",
    "states",
    "notes",
  ])
    string(value[key]);
  ensure(
    /^[a-z0-9][a-z0-9-]{1,120}$/.test(value.id as string),
    "Недопустимый ID секции.",
  );
  ensure(
    (value.name as string).trim().length > 0 &&
      (value.name as string).length <= 200,
    "Введите название секции (до 200 символов).",
  );
  ensure(
    (value.purpose as string).trim().length > 0,
    "Укажите назначение каждой секции.",
  );
  ensure(
    Number.isSafeInteger(value.position) && Number(value.position) > 0,
    "Недопустимая позиция.",
  );
  ensure(
    phases.includes(value.phase as (typeof phases)[number]),
    "Неизвестная фаза.",
  );
  ensure(
    ["included", "conditional", "excluded"].includes(value.inclusion as string),
    "Неизвестный статус включения.",
  );
  ensure(
    typeof value.required === "boolean" && typeof value.reviewed === "boolean",
    "Некорректный статус секции.",
  );
  ensure(
    Array.isArray(value.sources) && value.sources.length <= 30,
    "Слишком много источников.",
  );
  for (const source of value.sources) {
    string(source, 300);
    ensure(
      /^docs\/[a-zA-Z0-9/_.-]+\.md(?:#[a-zA-Z0-9_-]+)?$/.test(source) &&
        !source.includes(".."),
      "Источник должен быть ссылкой docs/...md без перехода к родителю.",
    );
  }
}
export function validateCommand(value: unknown): asserts value is Command {
  object(value);
  keys(value, [
    "id",
    "digest",
    "action",
    "reviewer",
    "notes",
    "sections",
    "acknowledged",
  ]);
  string(value.id, 100);
  string(value.digest, 64);
  string(value.reviewer, 120);
  string(value.notes);
  ensure(/^[a-z0-9-]+$/.test(value.id), "Недопустимый ID страницы.");
  ensure(/^[a-f0-9]{64}$/.test(value.digest), "Некорректная версия файла.");
  ensure(
    ["save", "review", "approve", "request-changes"].includes(
      value.action as string,
    ),
    "Неизвестная операция.",
  );
  ensure(
    Array.isArray(value.sections) && value.sections.length <= 80,
    "Не более 80 секций на страницу.",
  );
  const ids = new Set();
  for (const item of value.sections) {
    validateSection(item);
    ensure(
      !ids.has(item.id) && item.id.startsWith(`${value.id}--`),
      "Повторяющийся ID или секция другой страницы.",
    );
    ids.add(item.id);
  }
  ensure(
    Array.isArray(value.acknowledged) && value.acknowledged.length <= 100,
    "Некорректные подтверждения.",
  );
  for (const id of value.acknowledged) string(id, 150);
  if (value.action !== "save")
    ensure(value.reviewer.trim(), "Укажите имя проверяющего.");
  if (value.action === "request-changes")
    ensure(
      value.notes.trim(),
      "Опишите запрошенные изменения в заметках страницы.",
    );
}
