import { createHash, randomUUID } from "node:crypto";
import {
  readFile,
  readdir,
  mkdir,
  lstat,
  open,
  rename,
  unlink,
  rmdir,
} from "node:fs/promises";
import path from "node:path";
import {
  type ComponentRecord,
  type Loaded,
  type SourceSection,
  type Reference,
  referenceFields,
} from "./model";
import {
  ensure,
  id,
  object,
  keys,
  text,
  definition,
  referenceEdit,
  validateImage,
} from "./validation";

export const designRoot = path.join(process.cwd(), "docs/design");
const hash = (raw: string) => createHash("sha256").update(raw).digest("hex");
const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
async function safe(root: string, relative: string) {
  ensure(
    !path.isAbsolute(relative) &&
      !relative.split(/[\\/]/).some((x) => x === ".." || x === "."),
    "Небезопасный путь.",
  );
  let current = path.resolve(root);
  const absoluteRoot = path.parse(current).root;
  const segments = current.slice(absoluteRoot.length).split(path.sep);
  current = absoluteRoot;
  for (const part of [...segments, ...relative.split("/")]) {
    current = path.join(current, part);
    try {
      ensure(
        !(await lstat(current)).isSymbolicLink(),
        "Символические ссылки запрещены.",
      );
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    }
  }
  return current;
}
async function atomic(root: string, relative: string, data: string | Buffer) {
  const target = await safe(root, relative);
  // Avoid rewriting identical projections and causing needless dev-server reloads.
  try {
    const existing = await readFile(target);
    if (existing.equals(Buffer.isBuffer(data) ? data : Buffer.from(data)))
      return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.${randomUUID()}.tmp`;
  const f = await open(temp, "wx");
  try {
    await f.writeFile(data);
    await f.sync();
  } finally {
    await f.close();
  }
  try {
    await rename(temp, target);
  } finally {
    await unlink(temp).catch(() => {});
  }
}
async function locked<T>(root: string, fn: () => Promise<T>) {
  const base = await safe(root, "components");
  await mkdir(base, { recursive: true });
  const lock = await safe(root, "components/.registry-lock");
  try {
    await mkdir(lock);
  } catch {
    ensure(
      false,
      "Реестр занят. Повторите позже; после сбоя см. README о блокировке.",
      409,
    );
  }
  try {
    return await fn();
  } finally {
    await rmdir(lock);
  }
}
export async function readComponents(root = designRoot): Promise<Loaded[]> {
  const dir = await safe(root, "components/registry");
  await mkdir(dir, { recursive: true });
  const files = (await readdir(dir))
    .filter((x) => /^[a-z0-9-]+\.json$/.test(x))
    .sort();
  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(
        await safe(root, `components/registry/${file}`),
        "utf8",
      );
      const record = JSON.parse(raw) as ComponentRecord;
      ensure(
        record.schemaVersion === 1 && `${record.id}.json` === file,
        "Повреждён реестр.",
        500,
      );
      return { record, digest: hash(raw) };
    }),
  );
}
export async function readSources(root = designRoot) {
  const dir = await safe(root, "section-planning/pages");
  const pages = [];
  const sources: SourceSection[] = [];
  for (const file of (await readdir(dir))
    .filter((x) => /^[a-z0-9-]+\.json$/.test(x))
    .sort()) {
    const p = JSON.parse(
      await readFile(
        await safe(root, `section-planning/pages/${file}`),
        "utf8",
      ),
    );
    pages.push({
      id: p.id,
      name: p.name,
      status: p.status,
      revision: p.revision,
    });
    for (const s of p.sections)
      sources.push({
        pageId: p.id,
        pageName: p.name,
        sectionId: s.id,
        name: s.name,
        phase: s.phase,
        inclusion: s.inclusion,
        revision: p.revision,
        approved:
          p.status === "approved" &&
          p.approval?.revision === p.revision &&
          s.reviewed === true &&
          s.inclusion !== "excluded",
        content: s.content,
        purpose: s.purpose,
        states: s.states,
        desktop: s.desktop,
        mobile: s.mobile,
        interactions: s.interactions,
        dependencies: s.dependencies,
        issues: p.issues,
      });
  }
  return { pages, sources };
}
const md = (s: string) =>
  s
    .replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!)
    .replace(/([\\`*_{}\[\]|])/g, "\\$1");
const approvalText = (a: ComponentRecord["definitionApproval"]) =>
  a ? `${md(a.reviewer)} · ${a.timestamp} · revision ${a.revision}` : "None";
export async function generateDocs(root = designRoot) {
  const records = (await readComponents(root)).map((x) => x.record);
  const { sources, pages } = await readSources(root);
  const active = records.filter((x) => !x.archived);
  let index =
    "# Component registry\n\nGenerated from registry/*.json; edit through /dev/components. These are proposed definitions, not production components. See [README](README.md).\n\n| Component | Owner | Priority | Definition | Visual | Uses |\n|---|---|---|---|---|---|\n";
  let references =
    "## Component references (generated)\n\nCanonical explanations live in component registry JSON; adjacent Markdown is generated. Assets are private design evidence, never licensed production assets by implication.\n\n";
  for (const c of records) {
    const d = c.definition;
    if (!c.archived)
      index += `| [${md(d.name)}](specs/${c.id}.md) | ${md(d.ownership)} | ${d.priority} | ${c.definitionStatus} | ${c.visualStatus === "design-approved" ? "design-approved" : "MISSING REFERENCE (approved visual)"} | ${d.usages.length} |\n`;
    let spec = `# ${md(d.name)}\n\nGenerated; canonical: [${c.id}.json](../registry/${c.id}.json). Stable ID: ${c.id}. Revision: ${c.revision}. ${c.archived ? "ARCHIVED — excluded from implementation plans." : "Active proposal."}\n\nDefinition: ${c.definitionStatus}. Approval: ${approvalText(c.definitionApproval)}.\n\nVisual: ${c.visualStatus}. Approval: ${approvalText(c.visualApproval)}. ${c.visualStatus !== "design-approved" ? "MISSING REFERENCE — no approved component visual reference." : ""}\n\nImplementation: ${c.implementationStatus}; definition/visual approval does not approve React implementation.\n\nCategory: ${d.category}. Priority: ${d.priority}.\n`;
    for (const [key, value] of Object.entries(d))
      if (
        typeof value === "string" &&
        !["name", "category", "priority"].includes(key)
      )
        spec += `\n## ${key}\n\n${md(value) || "Unspecified — human review required."}\n`;
    spec += "\n## Exact source relationships\n\n";
    for (const u of d.usages) {
      const s = sources.find(
        (s) => s.pageId === u.pageId && s.sectionId === u.sectionId,
      );
      spec += `- [${u.pageId} / ${u.sectionId}](../../section-planning/pages/${u.pageId}.json): ${md(u.reason)}. Evidence revision ${u.sourceRevision}; current ${s?.revision ?? "missing"}; ${s?.phase ?? "unknown"} / ${s?.inclusion ?? "missing"}. ${!s?.approved || s.revision !== u.sourceRevision ? "STALE SOURCE — review required." : "Approved structure only."}\n`;
    }
    spec += `\n## Dependencies\n\n${d.dependencies.map((dep) => `- [${dep}](${dep}.md)`).join("\n") || "None proposed."}\n\n## Visual references\n\n`;
    for (const r of c.references) {
      spec += `- [${md(r.title)}](../../references/components/${c.id}/${r.id}.md)${c.primaryReferenceId === r.id ? " — primary" : ""}; ${r.status}.\n`;
      references += `- [${c.id} / ${md(r.title)}](components/${c.id}/${r.id}.md) — ${r.status}${c.archived ? "; archived component" : ""}.\n`;
      let note = `# ${r.id} — ${md(r.title)}\n\nGenerated from [component record](../../../components/registry/${c.id}.json).\n\nTarget: ${c.id}. Status: ${r.status}. Approval: ${approvalText(r.approval)}.\n\nAsset: [${path.basename(r.imagePath)}](${path.basename(r.imagePath)}). Original filename: ${md(r.originalFilename)}. Uploaded: ${r.uploadedAt}.\n\nSource: ${md(r.sourceUrl) || "Not supplied"}. Rights: design reference only; no production license inferred.\n\n`;
      for (const k of referenceFields.filter(
        (x) => !["title", "sourceUrl"].includes(x),
      ))
        note += `## ${k}\n\n${md(r[k]) || "Unspecified — review required."}\n\n`;
      note +=
        "IMPLEMENTED IN: not yet implemented. QA: no implementation approval implied.\n";
      await atomic(root, `references/components/${c.id}/${r.id}.md`, note);
    }
    spec +=
      "\n## Implementation workflow\n\nRead approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.\n";
    await atomic(root, `components/specs/${c.id}.md`, spec);
  }
  index += `\n## Archived\n\n${
    records
      .filter((c) => c.archived)
      .map((c) => `- [${md(c.definition.name)}](specs/${c.id}.md)`)
      .join("\n") || "None."
  }\n\n## Recommended design sequence\n\nMVP first; then actual reuse count within each priority. This is a recommendation, not approval.\n\n`;
  for (const c of [...active].sort(
    (a, b) =>
      a.definition.priority.localeCompare(b.definition.priority) ||
      b.definition.usages.length - a.definition.usages.length ||
      a.id.localeCompare(b.id),
  ))
    index += `- ${c.definition.priority}: [${md(c.definition.name)}](specs/${c.id}.md) — ${c.definition.usages.length} source relationships.\n`;
  await atomic(root, "components/INDEX.md", index);
  let coverage =
    "# Approved-section coverage\n\nGenerated against current local page JSON. A linked draft is a candidate, not an approved definition. Conditional and later-phase sections remain conditional/later-phase.\n\n";
  for (const p of pages)
    coverage += `- ${p.id}: ${p.status}, revision ${p.revision}.\n`;
  coverage +=
    "\n| Approved source section | Phase / inclusion | Candidate definitions | Approved definitions |\n|---|---|---|---|\n";
  for (const s of sources.filter((s) => s.approved)) {
    const matches = active.filter((c) =>
      c.definition.usages.some(
        (u) => u.pageId === s.pageId && u.sectionId === s.sectionId,
      ),
    );
    coverage += `| ${s.pageId} / ${s.sectionId} | ${s.phase} / ${s.inclusion} | ${matches.map((c) => `[${c.id}](specs/${c.id}.md)`).join(", ") || "MISSING"} | ${
      matches
        .filter((c) => c.definitionStatus === "approved")
        .map((c) => c.id)
        .join(", ") || "NONE"
    } |\n`;
  }
  await atomic(root, "components/COVERAGE.md", coverage);
  const refIndex = await safe(root, "references/INDEX.md");
  const old = await readFile(refIndex, "utf8");
  const start = "<!-- COMPONENT-REGISTRY:START -->";
  const end = "<!-- COMPONENT-REGISTRY:END -->";
  const block = `${start}\n${references}\n${end}`;
  await atomic(
    root,
    "references/INDEX.md",
    old.includes(start)
      ? old.slice(0, old.indexOf(start)) +
          block +
          old.slice(old.indexOf(end) + end.length)
      : old.trimEnd() + "\n\n" + block + "\n",
  );
}
export async function syncDocs(root = designRoot) {
  return locked(root, async () => {
    await generateDocs(root);
    await unlink(await safe(root, "components/.sync-pending")).catch(
      (error) => {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      },
    );
  });
}
export async function mutate(
  input: unknown,
  root = designRoot,
): Promise<Loaded> {
  const cmd = object(input);
  keys(cmd, [
    "action",
    "id",
    "digest",
    "definition",
    "reviewer",
    "acknowledge",
    "referenceId",
    "reference",
    "filename",
    "base64",
    "order",
    "primaryReferenceId",
  ]);
  const componentId = id(cmd.id);
  const action = text(cmd.action, 40);
  ensure(
    [
      "create",
      "save",
      "review",
      "approve",
      "request-changes",
      "archive",
      "restore",
      "upload",
      "edit-reference",
      "remove-reference",
      "reorder-references",
      "primary-reference",
    ].includes(action),
    "Неизвестное действие.",
  );
  const reviewer = text(cmd.reviewer, 160).trim();
  ensure(reviewer, "Укажите имя проверяющего / автора изменения.");
  return locked(root, async () => {
    const all = await readComponents(root);
    const prior = all.find((x) => x.record.id === componentId);
    ensure(
      action === "create" ? !prior : !!prior,
      action === "create"
        ? "ID уже существует, включая архив."
        : "Компонент не найден.",
      409,
    );
    if (prior)
      ensure(
        cmd.digest === prior.digest,
        "Конфликт ревизий. Скачайте черновик и загрузите актуальный реестр.",
        409,
      );
    const before = prior?.record;
    const c: ComponentRecord = before
      ? structuredClone(before)
      : {
          schemaVersion: 1,
          id: componentId,
          revision: 0,
          definition: definition(cmd.definition),
          definitionStatus: "draft",
          definitionApproval: null,
          visualStatus: "no-reference",
          visualApproval: null,
          implementationStatus: "not-started",
          primaryReferenceId: null,
          references: [],
          archived: false,
          history: [],
        };
    ensure(
      !c.archived || action === "restore",
      "Сначала восстановите компонент.",
    );
    const date = new Date().toISOString();
    if (action === "create" || action === "save") {
      const next = definition(cmd.definition);
      const { sources } = await readSources(root);
      for (const u of next.usages) {
        const existing = before?.definition.usages.find(
          (x) =>
            x.pageId === u.pageId &&
            x.sectionId === u.sectionId &&
            x.sourceRevision === u.sourceRevision,
        );
        ensure(
          existing ||
            sources.some(
              (s) =>
                s.approved &&
                s.pageId === u.pageId &&
                s.sectionId === u.sectionId &&
                s.revision === u.sourceRevision,
            ),
          "Новая связь должна ссылаться на текущую утверждённую секцию.",
        );
      }
      const removed =
        before?.definition.usages.filter(
          (u) =>
            !next.usages.some(
              (n) => n.pageId === u.pageId && n.sectionId === u.sectionId,
            ),
        ) || [];
      ensure(
        !removed.length || cmd.acknowledge === true,
        "Подтвердите удаление связей: обязательства секций сохраняются.",
      );
      for (const dep of next.dependencies)
        ensure(
          dep !== c.id &&
            all.some((x) => x.record.id === dep && !x.record.archived),
          "Зависимость должна быть активным другим компонентом.",
        );
      const graph = new Map(
        all.map((x) => [x.record.id, x.record.definition.dependencies]),
      );
      graph.set(c.id, next.dependencies);
      const visited = new Set<string>();
      function visit(node: string, stack: Set<string>) {
        ensure(!stack.has(node), "Цикл зависимостей.");
        if (visited.has(node)) return;
        for (const dep of graph.get(node) || [])
          visit(dep, new Set([...stack, node]));
        visited.add(node);
      }
      visit(c.id, new Set());
      if (JSON.stringify(next) !== JSON.stringify(c.definition)) {
        c.definition = next;
        if (c.definitionStatus === "approved") {
          c.definitionStatus = "in-review";
          c.definitionApproval = null;
        }
      }
    }
    if (action === "approve") {
      ensure(
        c.definition.name.trim() &&
          c.definition.purpose.trim() &&
          c.definition.ownership.trim(),
        "Для утверждения нужны название, назначение и владелец.",
      );
      const { sources } = await readSources(root);
      ensure(
        c.definition.usages.every((u) =>
          sources.some(
            (s) =>
              s.approved &&
              s.pageId === u.pageId &&
              s.sectionId === u.sectionId &&
              s.revision === u.sourceRevision,
          ),
        ),
        "Источник изменился: перепроверьте связи до утверждения.",
      );
      c.definitionStatus = "approved";
      c.definitionApproval = {
        reviewer,
        timestamp: date,
        revision: c.revision + 1,
      };
    }
    if (["review", "request-changes"].includes(action)) {
      c.definitionStatus =
        action === "review" ? "in-review" : "changes-requested";
      c.definitionApproval = null;
    }
    if (action === "archive") {
      ensure(
        !c.definition.usages.length || cmd.acknowledge === true,
        "Подтвердите архивирование: секции всё ещё требуют этой функциональности.",
      );
      c.archived = true;
    }
    if (action === "restore") c.archived = false;
    const visualAction = [
      "upload",
      "edit-reference",
      "remove-reference",
      "reorder-references",
      "primary-reference",
    ].includes(action);
    if (action === "upload") {
      if (cmd.referenceId)
        ensure(
          c.references.some((r) => r.id === cmd.referenceId),
          "Референс не найден.",
        );
      ensure(c.references.length < 40, "Максимум 40 референсов на компонент.");
      const original = text(cmd.filename, 255);
      const base64 = text(cmd.base64, 12_000_000);
      ensure(
        /^[A-Za-z0-9+/]*={0,2}$/.test(base64),
        "Неверные данные изображения.",
      );
      const bytes = Buffer.from(base64, "base64");
      const extension = validateImage(original, bytes);
      const refId = `ref-${randomUUID()}`;
      const imagePath = `references/components/${c.id}/${refId}.${extension}`;
      await atomic(root, imagePath, bytes);
      const ref: Reference = {
        id: refId,
        componentId: c.id,
        imagePath,
        originalFilename: path.basename(original.replaceAll("\\", "/")),
        uploadedAt: date,
        title: original.slice(0, 160),
        sourceUrl: "",
        explanation: "",
        borrow: "",
        reject: "",
        appearance: "",
        layout: "",
        desktop: "",
        mobile: "",
        interaction: "",
        unresolved: "",
        status: "exploratory",
        approval: null,
      };
      if (cmd.referenceId) {
        const target = c.references.findIndex((r) => r.id === cmd.referenceId);
        ensure(target >= 0, "Референс не найден.");
        const old = c.references[target];
        c.references[target] = {
          ...ref,
          ...Object.fromEntries(referenceFields.map((k) => [k, old[k]])),
          id: old.id,
        };
        if (c.primaryReferenceId === old.id) c.primaryReferenceId = old.id;
      } else c.references.push(ref);
    }
    if (action === "edit-reference") {
      const ref = c.references.find((r) => r.id === cmd.referenceId);
      ensure(ref, "Референс не найден.");
      const edit = referenceEdit(cmd.reference);
      const changed = referenceFields.some((k) => ref[k] !== edit[k]);
      Object.assign(ref, edit);
      if (changed) {
        ref.status = ref.approval ? "in-review" : "exploratory";
        ref.approval = null;
      }
    }
    if (action === "remove-reference") {
      ensure(
        c.references.some((r) => r.id === cmd.referenceId),
        "Референс не найден.",
      );
      c.references = c.references.filter((r) => r.id !== cmd.referenceId);
      if (c.primaryReferenceId === cmd.referenceId) c.primaryReferenceId = null;
    }
    if (action === "primary-reference") {
      ensure(
        cmd.primaryReferenceId === null ||
          c.references.some((r) => r.id === cmd.primaryReferenceId),
        "Референс не найден.",
      );
      c.primaryReferenceId = cmd.primaryReferenceId as string | null;
    }
    if (action === "reorder-references") {
      ensure(
        Array.isArray(cmd.order) &&
          cmd.order.length === c.references.length &&
          new Set(cmd.order).size === c.references.length &&
          cmd.order.every((x) => c.references.some((r) => r.id === x)),
        "Некорректный порядок.",
      );
      c.references = cmd.order.map((x) =>
        c.references.find((r) => r.id === x)!,
      );
    }
    if (
      visualAction &&
      (JSON.stringify(c.references) !== JSON.stringify(before?.references) ||
        c.primaryReferenceId !== before?.primaryReferenceId)
    ) {
      c.visualStatus = c.references.length
        ? c.visualApproval
          ? "design-in-review"
          : "references-added"
        : "no-reference";
      c.visualApproval = null;
    }
    c.revision++;
    c.history.push({
      revision: c.revision,
      timestamp: date,
      reviewer,
      action,
      previousDefinitionApproval: before?.definitionApproval || null,
      previousVisualApproval: before?.visualApproval || null,
    });
    ensure(c.history.length <= 10000, "Лимит истории достигнут.");
    // Marker precedes canonical commit. Derived files are recoverable, never a second source of truth.
    await atomic(
      root,
      "components/.sync-pending",
      "Regenerate documentation from canonical JSON.\n",
    );
    if (before)
      await atomic(
        root,
        `components/history/${c.id}/${before.revision}.json`,
        json(before),
      );
    const raw = json(c);
    await atomic(root, `components/registry/${c.id}.json`, raw);
    await generateDocs(root);
    await unlink(await safe(root, "components/.sync-pending"));
    return { record: c, digest: hash(raw) };
  });
}
export async function recoverDocs(root = designRoot) {
  try {
    await lstat(await safe(root, "components/.sync-pending"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return;
    throw e;
  }
  await locked(root, async () => {
    await generateDocs(root);
    await unlink(await safe(root, "components/.sync-pending"));
  });
}
export async function imageBytes(
  componentId: string,
  referenceId: string,
  root = designRoot,
) {
  id(componentId);
  id(referenceId);
  const c = (await readComponents(root)).find(
    (c) => c.record.id === componentId,
  );
  const ref = c?.record.references.find((r) => r.id === referenceId);
  ensure(ref, "Изображение не найдено.", 404);
  ensure(
    new RegExp(
      `^references/components/${componentId}/ref-[a-f0-9-]+\\.(png|jpg|webp)$`,
    ).test(ref.imagePath),
    "Некорректный путь изображения.",
  );
  return {
    bytes: await readFile(await safe(root, ref.imagePath)),
    type: ref.imagePath.endsWith(".png")
      ? "image/png"
      : ref.imagePath.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg",
  };
}
