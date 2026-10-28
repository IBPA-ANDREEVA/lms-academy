// Node-only persistence. No production domain modules or browser imports.
import {
  readFile,
  readdir,
  realpath,
  lstat,
  mkdir,
  open,
  rename,
  unlink,
  rmdir,
} from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import type { Command, LoadedPage, PageSpec, Section } from "./model";
import { ensure, validateCommand, validateSection } from "./validation";

export const plansRoot = path.join(
  process.cwd(),
  "docs/design/section-planning/pages",
);
const digest = (raw: string) => createHash("sha256").update(raw).digest("hex");
async function filename(root: string, id: string) {
  ensure(/^[a-z0-9-]+$/.test(id), "Неизвестная страница.", 404);
  const allowed = (await readdir(root)).filter((x) =>
    /^[a-z0-9-]+\.json$/.test(x),
  );
  ensure(allowed.includes(`${id}.json`), "Неизвестная страница.", 404);
  const file = path.join(root, `${id}.json`);
  ensure(
    !(await lstat(file)).isSymbolicLink() &&
      path.dirname(await realpath(file)) === (await realpath(root)),
    "Ссылки файлов запрещены.",
  );
  return file;
}
export async function readPage(
  id: string,
  root = plansRoot,
): Promise<LoadedPage> {
  const raw = await readFile(await filename(root, id), "utf8");
  const page = JSON.parse(raw) as PageSpec;
  ensure(
    page.schemaVersion === 1 &&
      page.id === id &&
      Number.isSafeInteger(page.revision),
    "Файл спецификации повреждён.",
    500,
  );
  page.sections.forEach(validateSection);
  page.deletedSections.forEach(validateSection);
  return { page, digest: digest(raw) };
}
export async function readPages(root = plansRoot) {
  const names = (await readdir(root))
    .filter((x) => /^[a-z0-9-]+\.json$/.test(x))
    .sort();
  return Promise.all(names.map((name) => readPage(name.slice(0, -5), root)));
}
function content(section: Section) {
  const { reviewed: _reviewed, position: _position, ...rest } = section;
  void _reviewed;
  void _position;
  return JSON.stringify(rest);
}
export async function savePage(
  input: unknown,
  root = plansRoot,
): Promise<LoadedPage> {
  validateCommand(input);
  const command: Command = input;
  const file = await filename(root, command.id);
  const lock = `${file}.lock`;
  try {
    await mkdir(lock);
  } catch {
    ensure(
      false,
      "Файл занят. Повторите сохранение. После аварийной остановки см. README о lock.",
      409,
    );
  }
  const temp = `${file}.${randomUUID()}.tmp`;
  try {
    const current = await readPage(command.id, root);
    ensure(
      current.digest === command.digest,
      "Конфликт: файл изменён в другой вкладке или редакторе. Скачайте черновик, затем загрузите актуальную версию.",
      409,
    );
    const old = current.page;
    const known = new Map(
      [...old.sections, ...old.deletedSections].map((s) => [s.id, s]),
    );
    const nextIds = new Set(command.sections.map((s) => s.id));
    const removed = old.sections.filter((s) => !nextIds.has(s.id));
    for (const section of command.sections) {
      const prior = known.get(section.id);
      ensure(
        prior ? prior.required === section.required : !section.required,
        "Признак исходного требования нельзя изменить через редактор.",
      );
      if (prior?.required && section.inclusion !== prior.inclusion)
        ensure(
          command.acknowledged.includes(section.id),
          "Подтвердите изменение включения обязательной секции.",
        );
    }
    for (const section of removed)
      ensure(
        command.acknowledged.includes(section.id),
        "Подтвердите удаление секции.",
      );
    const sections = command.sections.map((s, i) => ({
      ...s,
      position: i + 1,
      reviewed:
        known.has(s.id) && content(known.get(s.id)!) === content(s)
          ? s.reviewed
          : false,
    }));
    const changed =
      JSON.stringify(old.sections) !== JSON.stringify(sections) ||
      old.notes !== command.notes;
    if (command.action === "approve") {
      ensure(!changed, "Сначала сохраните изменения и проверьте секции.");
      ensure(
        sections.length > 0 && sections.every((s) => s.reviewed),
        "Проверьте все секции, включая исключённые, перед утверждением.",
      );
    }
    if (!changed && command.action === "save") return current;
    const status =
      command.action === "approve"
        ? "approved"
        : command.action === "request-changes"
          ? "changes-requested"
          : command.action === "review" || old.status === "approved"
            ? "in-review"
            : old.status;
    const revision = old.revision + 1;
    const date = new Date().toISOString();
    const next: PageSpec = {
      ...old,
      sections,
      notes: command.notes,
      revision,
      status,
      deletedSections: [
        ...old.deletedSections.filter((s) => !nextIds.has(s.id)),
        ...removed,
      ],
      approval:
        command.action === "approve"
          ? { reviewer: command.reviewer.trim(), date, revision }
          : null,
      history: [
        ...old.history,
        {
          revision,
          date,
          action: command.action,
          reviewer: command.reviewer.trim(),
          previousApproval: old.approval,
          status,
        },
      ],
    };
    ensure(
      next.deletedSections.length <= 500 && next.history.length <= 10000,
      "Лимит истории достигнут. Архивируйте файл через Git перед продолжением.",
    );
    const raw = JSON.stringify(next, null, 2) + "\n";
    const handle = await open(temp, "wx");
    try {
      await handle.writeFile(raw, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    // Same-directory rename replaces the whole document (including approval/history).
    await rename(temp, file);
    return { page: next, digest: digest(raw) };
  } finally {
    await unlink(temp).catch(() => {});
    await rmdir(lock);
  }
}
