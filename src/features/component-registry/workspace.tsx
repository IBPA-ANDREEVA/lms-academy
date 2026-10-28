"use client";
import { useEffect, useRef, useState, useId } from "react";
import { useRouter } from "next/navigation";
import {
  type Bundle,
  type Loaded,
  type Definition,
  type Reference,
  categories,
  definitions,
  visuals,
  priorities,
  labels,
  emptyDefinition,
  referenceFields,
} from "./model";
import styles from "./workspace.module.css";

const fields: Record<string, string> = {
  name: "Название",
  description: "Описание",
  purpose: "Назначение / ответственность",
  ownership: "Владелец / модуль",
  implementationPath: "Предлагаемый путь реализации",
  requiredData: "Необходимые данные",
  interactions: "Действия пользователя",
  states: "Состояния",
  responsive: "Desktop и mobile",
  variants: "Варианты",
  openQuestions: "Открытые вопросы",
  implementationNotes: "Заметки реализации",
  notes: "Дополнительные заметки",
};
const refLabels: Record<string, string> = {
  title: "Название референса",
  sourceUrl: "URL источника",
  explanation: "Почему выбран этот референс",
  borrow: "Что заимствовать",
  reject: "Что не копировать",
  appearance: "Ожидаемый вид компонента",
  layout: "Композиция и оформление",
  desktop: "Desktop",
  mobile: "Mobile",
  interaction: "Взаимодействия и анимация",
  unresolved: "Нерешённые детали",
};
function Field({
  label,
  value,
  onChange,
  multiline = false,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label>
      {label}
      {multiline ? (
        <textarea
          className="resize-none"
          aria-label={label}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          rows={3}
          style={{ resize: "none" }}
        />
      ) : (
        <input
          aria-label={label}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </label>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label>
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((x) => (
          <option key={x} value={x}>
            {labels[x] || x || "Все"}
          </option>
        ))}
      </select>
    </label>
  );
}
function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: React.ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.showModal();
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <h2 id={titleId}>{title}</h2>
      <button onClick={close}>Отмена / закрыть</button>
      {children}
    </dialog>
  );
}
function ReferenceEditor({
  reference,
  busy,
  save,
  markDirty,
}: {
  reference: Reference;
  busy: boolean;
  save: (value: Reference) => Promise<void>;
  markDirty: (v: boolean) => void;
}) {
  const [draft, setDraft] = useState(reference);
  const dirty = JSON.stringify(draft) !== JSON.stringify(reference);
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void save(draft);
      }}
    >
      <fieldset disabled={busy}>
        {referenceFields.map((k) => (
          <Field
            key={k}
            label={refLabels[k]}
            value={draft[k]}
            multiline={!["title", "sourceUrl"].includes(k)}
            onChange={(v) => {
              setDraft({ ...draft, [k]: v });
              markDirty(true);
            }}
          />
        ))}
        <button className={styles.primary} disabled={!dirty}>
          Сохранить объяснение
        </button>
      </fieldset>
    </form>
  );
}
export default function ComponentWorkspace() {
  const router = useRouter();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [selected, setSelected] = useState<Loaded | null>(null);
  const [draft, setDraft] = useState<Definition | null>(null);
  const [reviewer, setReviewer] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [visual, setVisual] = useState("");
  const [archived, setArchived] = useState(false);
  const [modal, setModal] = useState<{
    title: string;
    body: string;
    action: () => void;
    label: string;
  } | null>(null);
  const [creating, setCreating] = useState(false);
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [preview, setPreview] = useState<Reference | null>(null);
  const [editRef, setEditRef] = useState<Reference | null>(null);
  const [refDirty, setRefDirty] = useState(false);
  const [usage, setUsage] = useState("");
  const [reason, setReason] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const dirty =
    !!selected &&
    !!draft &&
    JSON.stringify(selected.record.definition) !== JSON.stringify(draft);
  const unsaved = dirty || refDirty;
  const record = selected?.record;
  function choose(item: Loaded) {
    setSelected(item);
    setDraft(structuredClone(item.record.definition));
    setEditRef(null);
    setRefDirty(false);
    setError("");
    const url = new URL(location.href);
    url.searchParams.set("component", item.record.id);
    history.replaceState(null, "", url);
  }
  async function load() {
    try {
      const r = await fetch("/dev/components/data", { cache: "no-store" });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      setBundle(b);
      setError("");
      const wanted = new URL(location.href).searchParams.get("component");
      const item =
        b.components.find((x: Loaded) => x.record.id === wanted) ||
        b.components.find((x: Loaded) => !x.record.archived);
      if (item) choose(item);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    const abort = new AbortController();
    fetch("/dev/components/data", { cache: "no-store", signal: abort.signal })
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok) throw new Error(b.error);
        return b as Bundle;
      })
      .then((b) => {
        setBundle(b);
        const wanted = new URL(location.href).searchParams.get("component");
        const item =
          b.components.find((x) => x.record.id === wanted) ||
          b.components.find((x) => !x.record.archived);
        if (item) choose(item);
        setBusy(false);
      })
      .catch((e) => {
        if (!abort.signal.aborted) {
          setError(String(e));
          setBusy(false);
        }
      });
    return () => abort.abort();
  }, []);
  useEffect(() => {
    if (!unsaved) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [unsaved]);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  function guarded(action: () => void) {
    if (busy) return;
    if (unsaved)
      setModal({
        title: "Несохранённые изменения",
        body: "Скачать черновик можно перед выходом. Продолжение отменит несохранённые правки.",
        label: "Продолжить без сохранения",
        action,
      });
    else action();
  }
  function accept(item: Loaded) {
    setBundle((b) =>
      b
        ? {
            ...b,
            components: [
              ...b.components.filter((x) => x.record.id !== item.record.id),
              item,
            ].sort((a, b) => a.record.id.localeCompare(b.record.id)),
          }
        : b,
    );
    setSelected(item);
    setDraft(structuredClone(item.record.definition));
    setMessage(`Сохранено · ревизия ${item.record.revision}`);
  }
  async function send(
    action: string,
    extra: Record<string, unknown> = {},
    target = selected,
  ): Promise<Loaded> {
    if (!reviewer.trim())
      throw new Error("Укажите имя проверяющего / автора изменения.");
    const r = await fetch("/dev/components/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-registry-token": bundle?.token || "",
      },
      body: JSON.stringify({
        action,
        id: target?.record.id,
        digest: target?.digest,
        reviewer,
        ...extra,
      }),
      signal: AbortSignal.timeout(60000),
    });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error);
    return result;
  }
  async function run(action: string, extra: Record<string, unknown> = {}) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const item = await send(action, extra);
      accept(item);
      return item;
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  function save() {
    if (!draft) return;
    const removed = record?.definition.usages.some(
      (u) =>
        !draft.usages.some(
          (n) => n.sectionId === u.sectionId && n.pageId === u.pageId,
        ),
    );
    if (removed)
      setModal({
        title: "Удалить связи с секциями?",
        body: "Требуемая функциональность остаётся в утверждённых структурах. После удаления обзор покажет отсутствие определения.",
        label: "Сохранить удаление связей",
        action: () =>
          void run("save", { definition: draft, acknowledge: true }),
      });
    else void run("save", { definition: draft });
  }
  function update(k: keyof Definition, value: Definition[keyof Definition]) {
    if (draft) setDraft({ ...draft, [k]: value });
  }
  function download() {
    const blob = new Blob(
      [
        JSON.stringify(
          { component: record, definition: draft, reference: editRef },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record?.id || "component"}-draft.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function upload(files: FileList | null, replace?: string) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    setMessage("");
    let current = selected;
    let count = 0;
    try {
      for (const f of Array.from(files)) {
        if (f.size > 8 * 1024 * 1024)
          throw new Error(`${f.name}: максимум 8 MiB.`);
        setMessage(`Загрузка ${count + 1} из ${files.length}: ${f.name}`);
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1]);
          reader.onerror = () => reject(new Error("Не удалось прочесть файл."));
          reader.readAsDataURL(f);
        });
        current = await send(
          "upload",
          {
            filename: f.name,
            base64,
            ...(replace ? { referenceId: replace } : {}),
          },
          current,
        );
        accept(current);
        count++;
      }
      setMessage(`Загружено: ${count}. Объяснения можно добавить ниже.`);
    } catch (e) {
      setError(
        `${String(e)} Сохранено файлов: ${count}. Повторите только оставшиеся.`,
      );
    } finally {
      setBusy(false);
    }
  }
  const active = bundle?.components.filter((x) => !x.record.archived) || [];
  const filtered = (bundle?.components || []).filter(
    ({ record: c }) =>
      c.archived === archived &&
      (!query ||
        `${c.id} ${c.definition.name} ${c.definition.ownership}`
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (!category || c.definition.category === category) &&
      (!priority || c.definition.priority === priority) &&
      (!status || c.definitionStatus === status) &&
      (!visual || c.visualStatus === visual),
  );
  const groups = [
    ...new Set(
      filtered.map((x) => x.record.definition.ownership || "Без владельца"),
    ),
  ].sort();
  const approvedSources = bundle?.sources.filter((s) => s.approved) || [];
  const gap = approvedSources.filter(
    (s) =>
      !active.some(
        (c) =>
          c.record.definitionStatus === "approved" &&
          c.record.definition.usages.some(
            (u) =>
              u.sectionId === s.sectionId &&
              u.pageId === s.pageId &&
              u.sourceRevision === s.revision,
          ),
      ),
  );
  const ready = active.filter(
    (c) =>
      c.record.definitionStatus === "approved" &&
      c.record.visualStatus === "design-approved" &&
      !c.record.definition.openQuestions.trim() &&
      c.record.definition.usages.every((u) =>
        approvedSources.some(
          (s) =>
            s.sectionId === u.sectionId &&
            s.revision === u.sourceRevision &&
            s.phase === "MVP" &&
            s.inclusion === "included",
        ),
      ) &&
      c.record.definition.dependencies.every((d) =>
        active.some(
          (x) =>
            x.record.id === d &&
            x.record.definitionStatus === "approved" &&
            x.record.visualStatus === "design-approved",
        ),
      ),
  );
  const imageUrl = (r: Reference) =>
    `/dev/components/data?component=${record?.id}&image=${r.id}&revision=${record?.revision}`;
  return (
    <div className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>LMS / Локальное проектирование</p>
          <h1>Реестр компонентов</h1>
          <p>
            Определения, связи и визуальные ориентиры. Реализация — отдельный
            этап.
          </p>
        </div>
        <a
          href="/dev/sections"
          onClick={(e) => {
            if (unsaved) {
              e.preventDefault();
              guarded(() => router.push("/dev/sections"));
            }
          }}
        >
          Структуры страниц ↗
        </a>
      </header>
      <div className={styles.summary}>
        <span>
          <b>
            {
              active.filter((x) => x.record.definitionStatus !== "approved")
                .length
            }
          </b>{" "}
          предложено
        </span>
        <span>
          <b>
            {
              active.filter((x) => x.record.definitionStatus === "approved")
                .length
            }
          </b>{" "}
          утверждено
        </span>
        <span>
          <b>
            {
              active.filter(
                (x) =>
                  x.record.visualStatus !== "design-approved" ||
                  !x.record.definition.purpose ||
                  !x.record.definition.ownership,
              ).length
            }
          </b>{" "}
          требуют уточнения
        </span>
        <span>
          <b>{approvedSources.length}</b> утверждённых секций
        </span>
      </div>
      <div className={styles.feedback} aria-live="polite" role="status">
        {busy
          ? message || "Сохранение / загрузка…"
          : message ||
            "Изменения сохраняются в репозитории только после вашего действия."}
      </div>
      {error && (
        <div className={styles.error} role="alert" tabIndex={-1} ref={errorRef}>
          {error}
          <div className={styles.actions}>
            <button onClick={download}>Скачать черновик</button>
            <button disabled={busy} onClick={() => guarded(() => void load())}>
              Перечитать реестр
            </button>
          </div>
        </div>
      )}
      {!bundle ? (
        <main className={styles.empty}>
          {busy ? "Загрузка…" : "Реестр не загружен."}
          <button disabled={busy} onClick={() => void load()}>
            Повторить загрузку
          </button>
        </main>
      ) : (
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <fieldset disabled={busy}>
              <label>
                Поиск компонентов
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Название, ID или модуль"
                />
              </label>
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                >
                  Очистить поиск
                </button>
              )}
              <details>
                <summary>
                  Фильтры{" "}
                  {category || priority || status || visual ? "· включены" : ""}
                </summary>
                <Select
                  label="Категория"
                  value={category}
                  onChange={setCategory}
                  options={["", ...categories]}
                />
                <Select
                  label="Приоритет"
                  value={priority}
                  onChange={setPriority}
                  options={["", ...priorities]}
                />
                <Select
                  label="Утверждение определения"
                  value={status}
                  onChange={setStatus}
                  options={["", ...definitions]}
                />
                <Select
                  label="Визуальный статус"
                  value={visual}
                  onChange={setVisual}
                  options={["", ...visuals]}
                />
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={archived}
                    onChange={(e) => setArchived(e.target.checked)}
                  />
                  Показать архив
                </label>
              </details>
              <button
                className={styles.primary}
                onClick={() => guarded(() => setCreating(true))}
              >
                Добавить компонент
              </button>
              <nav aria-label="Компоненты" className={styles.navigation}>
                {!filtered.length && (
                  <p>
                    Нет совпадений. Измените фильтры или создайте компонент.
                  </p>
                )}
                {groups.map((group) => (
                  <section key={group}>
                    <h2>{group}</h2>
                    {filtered
                      .filter(
                        (x) =>
                          (x.record.definition.ownership || "Без владельца") ===
                          group,
                      )
                      .map((item) => (
                        <button
                          key={item.record.id}
                          aria-current={
                            record?.id === item.record.id ? "true" : undefined
                          }
                          onClick={() => guarded(() => choose(item))}
                        >
                          <strong>{item.record.definition.name}</strong>
                          <span>
                            {item.record.definition.priority} ·{" "}
                            {labels[item.record.definitionStatus]}
                          </span>
                          <small>{labels[item.record.visualStatus]}</small>
                        </button>
                      ))}
                  </section>
                ))}
              </nav>
            </fieldset>
          </aside>
          <main className={styles.main}>
            <details className={styles.overview}>
              <summary>
                Связи и приоритеты · {gap.length} секций без утверждённых
                определений
              </summary>
              <p>
                Готовы к следующему этапу MVP: {ready.length}. Требуются
                утверждение определения, дизайн, актуальные источники и закрытые
                вопросы. Это не разрешение на выпуск.
              </p>
              <h3>Приоритет по реальному использованию</h3>
              <ol>
                {[...active]
                  .sort(
                    (a, b) =>
                      a.record.definition.priority.localeCompare(
                        b.record.definition.priority,
                      ) ||
                      b.record.definition.usages.length -
                        a.record.definition.usages.length,
                  )
                  .slice(0, 12)
                  .map((c) => (
                    <li key={c.record.id}>
                      <button onClick={() => guarded(() => choose(c))}>
                        {c.record.definition.name}
                      </button>{" "}
                      · {c.record.definition.priority} ·{" "}
                      {c.record.definition.usages.length} связей ·{" "}
                      {c.record.references.length
                        ? "референсы есть"
                        : "MISSING REFERENCE"}
                    </li>
                  ))}
              </ol>
              <h3>Зависимости</h3>
              {active
                .filter((c) => c.record.definition.dependencies.length)
                .map((c) => (
                  <p key={c.record.id}>
                    {c.record.definition.name} →{" "}
                    {c.record.definition.dependencies
                      .map(
                        (dep) =>
                          `${dep}${active.some((x) => x.record.id === dep) ? "" : " (архив / отсутствует)"}`,
                      )
                      .join(", ")}
                  </p>
                ))}
              <details>
                <summary>
                  Секции без утверждённых определений ({gap.length})
                </summary>
                {gap.map((s) => (
                  <p key={s.sectionId}>
                    <a
                      href={`/dev/sections?page=${s.pageId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.pageId} / {s.sectionId}
                    </a>{" "}
                    · {s.phase} ·{" "}
                    {active.some((c) =>
                      c.record.definition.usages.some(
                        (u) => u.sectionId === s.sectionId,
                      ),
                    )
                      ? "кандидаты есть"
                      : "НЕТ КАНДИДАТОВ"}
                  </p>
                ))}
              </details>
              <details>
                <summary>Страницы, ожидающие утверждения</summary>
                {bundle.pages
                  .filter((p) => p.status !== "approved")
                  .map((p) => (
                    <p key={p.id}>
                      {p.name} · {labels[p.status] || p.status}
                    </p>
                  ))}
              </details>
            </details>
            {!record || !draft ? (
              <p>Выберите или добавьте компонент.</p>
            ) : (
              <>
                <div className={styles.title}>
                  <div>
                    <p className={styles.eyebrow}>
                      {record.id} · ревизия {record.revision}
                    </p>
                    <h2>{record.definition.name}</h2>
                  </div>
                  <span className={styles.badge}>
                    {record.archived
                      ? "Архив"
                      : labels[record.definitionStatus]}
                  </span>
                </div>
                <div className={styles.dimensions}>
                  <p>
                    Определение
                    <br />
                    <strong>{labels[record.definitionStatus]}</strong>
                  </p>
                  <p>
                    Визуальный дизайн
                    <br />
                    <strong>{labels[record.visualStatus]}</strong>
                  </p>
                  <p>
                    Реализация
                    <br />
                    <strong>{labels[record.implementationStatus]}</strong>
                  </p>
                </div>
                {record.visualStatus !== "design-approved" && (
                  <p className={styles.notice}>
                    MISSING REFERENCE — утверждённого визуального направления
                    компонента нет. Загруженные изображения сами по себе не
                    являются утверждением.
                  </p>
                )}
                <Field
                  label="Имя проверяющего / автора изменения"
                  value={reviewer}
                  onChange={setReviewer}
                />
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    save();
                  }}
                >
                  <fieldset disabled={busy || record.archived}>
                    <div className={styles.grid}>
                      <Field
                        label="Название"
                        value={draft.name}
                        onChange={(v) => update("name", v)}
                      />
                      <Field label="Стабильный ID" value={record.id} readOnly />
                      <Select
                        label="Категория компонента"
                        value={draft.category}
                        options={categories}
                        onChange={(v) =>
                          update("category", v as Definition["category"])
                        }
                      />
                      <Select
                        label="Приоритет компонента"
                        value={draft.priority}
                        options={priorities}
                        onChange={(v) =>
                          update("priority", v as Definition["priority"])
                        }
                      />
                    </div>
                    <Field
                      label={fields.description}
                      value={draft.description}
                      multiline
                      onChange={(v) => update("description", v)}
                    />
                    <Field
                      label={fields.purpose}
                      value={draft.purpose}
                      multiline
                      onChange={(v) => update("purpose", v)}
                    />
                    <details>
                      <summary>Архитектура и поведение</summary>
                      {[
                        "ownership",
                        "implementationPath",
                        "requiredData",
                        "interactions",
                        "states",
                        "responsive",
                        "variants",
                        "openQuestions",
                        "implementationNotes",
                        "notes",
                      ].map((k) => (
                        <Field
                          key={k}
                          label={fields[k]}
                          value={draft[k as keyof Definition] as string}
                          multiline={
                            !["ownership", "implementationPath"].includes(k)
                          }
                          onChange={(v) => update(k as keyof Definition, v)}
                        />
                      ))}
                      <label>
                        Зависимости (ID через запятую)
                        <input
                          value={draft.dependencies.join(", ")}
                          onChange={(e) =>
                            update(
                              "dependencies",
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            )
                          }
                        />
                      </label>
                    </details>
                    <details>
                      <summary>
                        Использование · {draft.usages.length} секций
                      </summary>
                      {draft.usages.map((u, i) => {
                        const source = bundle.sources.find(
                          (s) =>
                            s.pageId === u.pageId &&
                            s.sectionId === u.sectionId,
                        );
                        return (
                          <div
                            key={`${u.pageId}/${u.sectionId}`}
                            className={styles.usage}
                          >
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`/dev/sections?page=${u.pageId}`}
                            >
                              {u.pageId} / {u.sectionId}
                            </a>
                            <p>
                              {source?.name} · {source?.phase} ·{" "}
                              {source?.inclusion} · ревизия {u.sourceRevision}
                            </p>
                            {(!source?.approved ||
                              source.revision !== u.sourceRevision) && (
                              <p className={styles.notice}>
                                Источник изменился или не утверждён. Требуется
                                повторная проверка связи.
                              </p>
                            )}
                            <Field
                              label={`Обоснование: ${u.sectionId}`}
                              value={u.reason}
                              onChange={(value) =>
                                update(
                                  "usages",
                                  draft.usages.map((x, n) =>
                                    n === i ? { ...x, reason: value } : x,
                                  ),
                                )
                              }
                            />
                            <button
                              type="button"
                              onClick={() =>
                                update(
                                  "usages",
                                  draft.usages.filter((_, n) => n !== i),
                                )
                              }
                            >
                              Убрать связь
                            </button>
                            {source?.approved &&
                              source.revision !== u.sourceRevision && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    update(
                                      "usages",
                                      draft.usages.map((x, n) =>
                                        n === i
                                          ? {
                                              ...x,
                                              sourceRevision: source.revision,
                                            }
                                          : x,
                                      ),
                                    )
                                  }
                                >
                                  Подтвердить актуальность источника
                                </button>
                              )}
                          </div>
                        );
                      })}
                      <label>
                        Добавить утверждённую секцию
                        <select
                          aria-label="Добавить утверждённую секцию"
                          value={usage}
                          onChange={(e) => setUsage(e.target.value)}
                        >
                          <option value="">Выберите секцию</option>
                          {approvedSources
                            .filter(
                              (s) =>
                                !draft.usages.some(
                                  (u) => u.sectionId === s.sectionId,
                                ),
                            )
                            .map((s) => (
                              <option key={s.sectionId} value={s.sectionId}>
                                {s.pageId} / {s.name} · {s.phase}
                              </option>
                            ))}
                        </select>
                      </label>
                      <Field
                        label="Обоснование новой связи"
                        value={reason}
                        onChange={setReason}
                      />
                      <button
                        type="button"
                        disabled={!usage || !reason.trim()}
                        onClick={() => {
                          const s = approvedSources.find(
                            (s) => s.sectionId === usage,
                          )!;
                          update("usages", [
                            ...draft.usages,
                            {
                              pageId: s.pageId,
                              sectionId: s.sectionId,
                              sourceRevision: s.revision,
                              reason,
                            },
                          ]);
                          setUsage("");
                          setReason("");
                        }}
                      >
                        Добавить связь
                      </button>
                    </details>
                    <div className={styles.actions}>
                      <button
                        className={styles.primary}
                        disabled={!dirty}
                        type="submit"
                      >
                        Сохранить изменения
                      </button>
                      <button
                        type="button"
                        onClick={() => guarded(() => choose(selected!))}
                        disabled={!dirty}
                      >
                        Отменить правки
                      </button>
                      <span>
                        {dirty
                          ? "Есть несохранённые изменения"
                          : "Определение сохранено"}
                      </span>
                    </div>
                  </fieldset>
                </form>
                <section className={styles.section}>
                  <h3>Проверка определения</h3>
                  <p>
                    Визуальное утверждение и реализация пока доступны только как
                    отдельные статусы. Они не меняются при утверждении
                    определения.
                  </p>
                  {record.definitionApproval && (
                    <p>
                      Утвердил: {record.definitionApproval.reviewer} ·{" "}
                      {new Date(
                        record.definitionApproval.timestamp,
                      ).toLocaleString("ru-RU")}{" "}
                      · ревизия {record.definitionApproval.revision}
                    </p>
                  )}
                  <div className={styles.actions}>
                    <button
                      disabled={busy || unsaved || record.archived}
                      onClick={() => void run("review")}
                    >
                      На проверку
                    </button>
                    <button
                      disabled={busy || unsaved || record.archived}
                      onClick={() =>
                        setModal({
                          title: `Утвердить ${record.definition.name}?`,
                          body: "Утверждается только сохранённое определение. Визуальный дизайн, реализация и продуктовые вопросы не утверждаются.",
                          label: "Утвердить определение",
                          action: () => void run("approve"),
                        })
                      }
                    >
                      Утвердить определение
                    </button>
                    <button
                      disabled={busy || unsaved || record.archived}
                      onClick={() => void run("request-changes")}
                    >
                      Запросить изменения
                    </button>
                  </div>
                  {unsaved && <p>Сначала сохраните правки или отмените их.</p>}
                </section>
                <section className={styles.section}>
                  <h3>Визуальные референсы</h3>
                  <p>
                    PNG, JPEG, WebP · до 8 MiB на файл · до 40 изображений. Это
                    ориентиры для дизайна, не лицензированные материалы для
                    выпуска.
                  </p>
                  <fieldset disabled={busy || unsaved || record.archived}>
                    <label>
                      Загрузить референсы
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => {
                          void upload(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </fieldset>
                  {!record.references.length && (
                    <div className={styles.empty}>
                      MISSING REFERENCE
                      <br />
                      Добавьте изображение и объясните, какие элементы нужно
                      адаптировать.
                    </div>
                  )}
                  {record.references.map((r, i) => (
                    <article
                      key={`${r.id}-${record.revision}`}
                      className={styles.reference}
                    >
                      <button
                        className={styles.preview}
                        disabled={busy}
                        onClick={() => setPreview(r)}
                        aria-label={`Увеличить: ${r.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl(r)}
                          alt={r.title}
                          width={320}
                          height={200}
                        />
                      </button>
                      <div>
                        <h4>{r.title}</h4>
                        <p>
                          {record.primaryReferenceId === r.id
                            ? "Основное направление · "
                            : ""}
                          {r.status === "exploratory"
                            ? "На рассмотрении"
                            : r.status === "approved"
                              ? "Утверждён"
                              : "На проверке"}
                        </p>
                        <small>
                          {r.originalFilename} · {r.id}
                        </small>
                        <div className={styles.actions}>
                          <button
                            disabled={busy || unsaved || record.archived}
                            onClick={() => {
                              setEditRef(r);
                              setRefDirty(false);
                            }}
                          >
                            Редактировать объяснение
                          </button>
                          <button
                            disabled={
                              busy ||
                              unsaved ||
                              record.archived ||
                              record.primaryReferenceId === r.id
                            }
                            onClick={() =>
                              void run("primary-reference", {
                                primaryReferenceId: r.id,
                              })
                            }
                          >
                            Сделать основным
                          </button>
                          <button
                            aria-label={`Выше: ${r.title}`}
                            disabled={
                              busy || unsaved || record.archived || i === 0
                            }
                            onClick={() => {
                              const ids = record.references.map((x) => x.id);
                              [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]];
                              void run("reorder-references", { order: ids });
                            }}
                          >
                            Выше
                          </button>
                          <button
                            aria-label={`Ниже: ${r.title}`}
                            disabled={
                              busy ||
                              unsaved ||
                              record.archived ||
                              i === record.references.length - 1
                            }
                            onClick={() => {
                              const ids = record.references.map((x) => x.id);
                              [ids[i + 1], ids[i]] = [ids[i], ids[i + 1]];
                              void run("reorder-references", { order: ids });
                            }}
                          >
                            Ниже
                          </button>
                          <button
                            disabled={busy || unsaved || record.archived}
                            onClick={() =>
                              setModal({
                                title: "Убрать референс?",
                                body: "Связь будет удалена. Изображение и прежнее объяснение сохранятся в истории репозитория; визуальное утверждение будет снято.",
                                label: "Убрать референс",
                                action: () =>
                                  void run("remove-reference", {
                                    referenceId: r.id,
                                  }),
                              })
                            }
                          >
                            Убрать
                          </button>
                        </div>
                        <fieldset disabled={busy || unsaved || record.archived}>
                          <label>
                            Заменить изображение
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(e) => {
                                void upload(e.target.files, r.id);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </fieldset>
                        <details>
                          <summary>Сохранённое объяснение</summary>
                          {referenceFields
                            .filter((k) => !["title", "sourceUrl"].includes(k))
                            .map((k) => (
                              <p key={k}>
                                <strong>{refLabels[k]}:</strong>{" "}
                                {r[k] || "Не указано"}
                              </p>
                            ))}
                        </details>
                      </div>
                    </article>
                  ))}
                </section>
                <section className={styles.section}>
                  <details>
                    <summary>
                      История · {record.history.length} изменений
                    </summary>
                    {[...record.history].reverse().map((h) => (
                      <p key={h.revision}>
                        r{h.revision} · {h.action} · {h.reviewer} ·{" "}
                        {new Date(h.timestamp).toLocaleString("ru-RU")}
                      </p>
                    ))}
                  </details>
                  <div className={styles.actions}>
                    <button
                      disabled={busy || unsaved}
                      onClick={() =>
                        record.archived
                          ? void run("restore")
                          : setModal({
                              title: `Архивировать ${record.definition.name}?`,
                              body: `Компонент исчезнет из активного плана. Связей с секциями: ${record.definition.usages.length}. Их функциональность остаётся обязательством; изображения и история сохраняются. Компонент можно восстановить.`,
                              label: "Архивировать компонент",
                              action: () =>
                                void run("archive", { acknowledge: true }),
                            })
                      }
                    >
                      {record.archived
                        ? "Восстановить компонент"
                        : "Архивировать компонент"}
                    </button>
                    <button onClick={download}>Скачать черновик</button>
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      )}
      {modal && (
        <Modal title={modal.title} close={() => setModal(null)}>
          <p>{modal.body}</p>
          <button
            className={styles.primary}
            onClick={() => {
              const action = modal.action;
              setModal(null);
              action();
            }}
          >
            {modal.label}
          </button>
        </Modal>
      )}
      {creating && (
        <Modal title="Новый компонент" close={() => setCreating(false)}>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void run("create", {
                id: newId,
                definition: emptyDefinition(newName),
              }).then((item) => {
                if (item) {
                  choose(item);
                  setCreating(false);
                  setNewId("");
                  setNewName("");
                }
              });
            }}
          >
            <fieldset disabled={busy}>
              <Field
                label="ID нового компонента"
                value={newId}
                onChange={setNewId}
              />
              <p>Латиница, цифры и дефисы. После создания ID не меняется.</p>
              <Field
                label="Название нового компонента"
                value={newName}
                onChange={setNewName}
              />
              <Field
                label="Автор создания"
                value={reviewer}
                onChange={setReviewer}
              />
              {error && <p role="alert">{error}</p>}
              <button className={styles.primary}>Создать черновик</button>
            </fieldset>
          </form>
        </Modal>
      )}
      {preview && (
        <Modal title={preview.title} close={() => setPreview(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.enlarged}
            src={imageUrl(preview)}
            alt={preview.title}
          />
        </Modal>
      )}
      {editRef && (
        <Modal
          title="Объяснение референса"
          close={() => {
            if (refDirty) {
              setModal({
                title: "Закрыть без сохранения?",
                body: "Несохранённое объяснение будет потеряно.",
                label: "Закрыть без сохранения",
                action: () => {
                  setEditRef(null);
                  setRefDirty(false);
                },
              });
            } else setEditRef(null);
          }}
        >
          <ReferenceEditor
            reference={editRef}
            busy={busy}
            markDirty={setRefDirty}
            save={async (r) => {
              setEditRef(r);
              const item = await run("edit-reference", {
                referenceId: r.id,
                reference: Object.fromEntries(
                  referenceFields.map((k) => [k, r[k]]),
                ),
              });
              if (item) {
                setEditRef(null);
                setRefDirty(false);
              }
            }}
          />
          {error && <p role="alert">{error}</p>}
        </Modal>
      )}
    </div>
  );
}
