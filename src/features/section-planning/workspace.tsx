"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type Bundle,
  type LoadedPage,
  type Section,
  type Command,
  statusLabels,
  phaseLabels,
} from "./model";
import SectionEditor from "./section-editor";
import styles from "./workspace.module.css";

const groups: Record<string, string> = {
  Public: "Публичные страницы",
  Commerce: "Покупка",
  Authentication: "Вход и аккаунт",
  Legal: "Правовые документы",
  Student: "Ученик",
  Trainer: "Тренер-куратор",
  Manager: "Менеджер · этап 2",
  Administration: "Администрирование",
};
const navigationOrder = [
  "home",
  "courses",
  "course-detail",
  "mini-courses",
  "mini-detail",
  "packages",
  "package-detail",
  "start-usa",
  "certificate-verification",
  "cart",
  "checkout",
  "checkout-result",
  "login",
  "register",
  "verify-email",
  "forgot-password",
  "reset-password",
  "role-context",
  "student-dashboard",
  "student-course",
  "student-lesson",
  "student-assignment",
  "student-certificates",
];
type Confirmation = {
  title: string;
  body: string;
  action: string;
  run: () => void;
};
const endpoint = "/dev/sections/data";
export default function Workspace() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [current, setCurrent] = useState<LoadedPage | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [notes, setNotes] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [localRemoved, setLocalRemoved] = useState<Section[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const loadGeneration = useRef(0);
  const dirty =
    !!current &&
    (JSON.stringify(sections) !== JSON.stringify(current.page.sections) ||
      notes !== current.page.notes);
  function select(item: LoadedPage) {
    setCurrent(item);
    setSections(structuredClone(item.page.sections));
    setNotes(item.page.notes);
    setAcknowledged([]);
    setLocalRemoved([]);
    setError("");
    setNotice("");
    const url = new URL(window.location.href);
    url.searchParams.set("page", item.page.id);
    window.history.replaceState(null, "", url);
    requestAnimationFrame(() => heading.current?.focus());
  }
  const load = useCallback(async () => {
    const generation = ++loadGeneration.current;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(endpoint, {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (generation !== loadGeneration.current) return;
      if (!response.ok)
        throw new Error(
          data.error || "Не удалось открыть рабочее пространство.",
        );
      const next = data as Bundle;
      setBundle(next);
      const id = new URLSearchParams(window.location.search).get("page");
      const item =
        next.pages.find((x) => x.page.id === id) ||
        next.pages.find((x) => x.page.id === "home") ||
        next.pages[0];
      if (item) select(item);
    } catch (e) {
      if (generation === loadGeneration.current)
        setError(e instanceof Error ? e.message : "Не удалось загрузить данные.");
    } finally {
      if (generation === loadGeneration.current) setBusy(false);
    }
  }, []);
  // Synchronize with repository files on mount; results arrive asynchronously.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    return () => {
      // This is a request generation counter, not a DOM ref snapshot.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      loadGeneration.current++;
    };
  }, [load]);
  useEffect(() => {
    if (!dirty) return;
    const listener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, [dirty]);
  useEffect(() => {
    if (confirmation) {
      dialog.current?.showModal();
      cancelButton.current?.focus();
    } else dialog.current?.close();
  }, [confirmation]);
  function navigate(item: LoadedPage) {
    if (current?.page.id === item.page.id) return;
    if (dirty)
      setConfirmation({
        title: "Несохранённые изменения",
        body: "При переходе черновик текущей страницы будет сброшен. Сохраните его перед переходом, если он нужен.",
        action: "Сбросить и перейти",
        run: () => select(item),
      });
    else select(item);
  }
  function update(id: string, patch: Partial<Section>) {
    setSections((items) =>
      items.map((s) =>
        s.id === id
          ? {
              ...s,
              ...patch,
              ...("reviewed" in patch ? {} : { reviewed: false }),
            }
          : s,
      ),
    );
    setNotice("");
  }
  function reorder(id: string, delta: number) {
    setSections((items) => {
      const list = [...items];
      const index = list.findIndex((s) => s.id === id);
      const target = index + delta;
      if (target < 0 || target >= list.length) return items;
      [list[index], list[target]] = [list[target], list[index]];
      return list.map((s, i) => ({ ...s, position: i + 1 }));
    });
    setNotice("");
  }
  function remove(section: Section) {
    setConfirmation({
      title: `Удалить «${section.name}»?`,
      body:
        (section.required
          ? "Секция связана с исходным требованием. Удаление из композиции не отменяет требование: перенесите обязательное содержание в другую секции и объясните решение в заметках. "
          : "") +
        "Удалённую сохранённую секцию можно восстановить, в том числе после перезагрузки. Новая несохранённая секция восстанавливается до следующего сохранения.",
      action: "Удалить секцию",
      run: () => {
        setAcknowledged((a) => [...a, section.id]);
        setLocalRemoved((items) => [
          ...items.filter((s) => s.id !== section.id),
          section,
        ]);
        setSections((items) =>
          items
            .filter((s) => s.id !== section.id)
            .map((s, i) => ({ ...s, position: i + 1 })),
        );
        setNotice("Секция удалена из черновика. Доступно восстановление.");
      },
    });
  }
  function include(section: Section, inclusion: Section["inclusion"]) {
    const run = () => {
      setAcknowledged((a) => [...a, section.id]);
      update(section.id, { inclusion });
    };
    if (section.required && inclusion !== section.inclusion)
      setConfirmation({
        title: "Изменить включение обязательной секции?",
        body: "Это не отменяет исходное требование. Сохраните его содержание в другой секции либо зафиксируйте вопрос в заметках для проверки.",
        action: "Изменить включение",
        run,
      });
    else run();
  }
  function add() {
    if (!current) return;
    const section: Section = {
      id: `${current.page.id}--${crypto.randomUUID()}`,
      position: sections.length + 1,
      name: "Новая секция",
      purpose: "Уточнить назначение",
      content: "",
      primaryAction: "",
      interactions: "",
      dependencies: "",
      sources: [],
      phase: current.page.phase,
      inclusion: "conditional",
      required: false,
      reviewed: false,
      desktop: "",
      mobile: "",
      states: "",
      notes:
        "Предложение для проверки. Не добавляет утверждённую продуктовую функцию.",
    };
    setSections((items) => [...items, section]);
    setNotice(
      "Новая условная секция добавлена. Раскройте её и заполните содержание.",
    );
  }
  function exportDraft() {
    if (!current) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            ...current.page,
            sections,
            notes,
            status:
              current.page.status === "approved" && dirty
                ? "in-review"
                : current.page.status,
            approval: dirty ? null : current.page.approval,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${current.page.id}-draft.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function save(action: Command["action"]) {
    if (!current || !bundle || busy) return;
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-planning-token": bundle.token,
        },
        body: JSON.stringify({
          id: current.page.id,
          digest: current.digest,
          action,
          reviewer,
          notes,
          sections: sections.map((s) => ({
            ...s,
            sources: s.sources.map((x) => x.trim()).filter(Boolean),
          })),
          acknowledged,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ошибка сохранения.");
      const item = data as LoadedPage;
      setCurrent(item);
      setSections(structuredClone(item.page.sections));
      setNotes(item.page.notes);
      setAcknowledged([]);
      setLocalRemoved([]);
      setBundle({
        ...bundle,
        pages: bundle.pages.map((x) => (x.page.id === item.page.id ? item : x)),
      });
      setNotice(
        `Сохранено · ревизия ${item.page.revision} · ${statusLabels[item.page.status]}`,
      );
    } catch (e) {
      setError(
        (e instanceof Error ? e.message : "Ошибка сохранения.") +
          " Изменения остались на экране. При неизвестном результате скачайте черновик и перечитайте файл перед повтором.",
      );
    } finally {
      setBusy(false);
    }
  }
  const page = current?.page;
  const removed = page
    ? [
        ...new Map(
          [
            ...page.deletedSections,
            ...page.sections.filter(
              (s) => !sections.some((x) => x.id === s.id),
            ),
            ...localRemoved,
          ].map((s) => [s.id, s]),
        ).values(),
      ].filter((s) => !sections.some((x) => x.id === s.id))
    : [];
  const ready = sections.length > 0 && sections.every((s) => s.reviewed);
  const progress =
    bundle?.pages.filter((x) => x.page.status === "approved").length || 0;
  const filtered = (
    bundle?.pages.filter((x) =>
      `${x.page.name} ${x.page.route || ""} ${x.page.id}`
        .toLocaleLowerCase("ru")
        .includes(query.toLocaleLowerCase("ru")),
    ) || []
  ).sort((a, b) => {
    const order = (id: string) =>
      navigationOrder.includes(id) ? navigationOrder.indexOf(id) : 100;
    return order(a.page.id) - order(b.page.id);
  });
  return (
    <div className={styles.workspace}>
      <a href="#page-editor" className={styles.skip}>
        Перейти к структуре
      </a>
      <header className={styles.top}>
        <div>
          <p className={styles.eyebrow}>LMS / локальное планирование</p>
          <h1>Структуры страниц</h1>
        </div>
        <div className={styles.progress}>
          <strong>
            {progress} / {bundle?.pages.length || 0}
          </strong>
          <span>страниц утверждено</span>
          <progress
            aria-label="Прогресс утверждения"
            max={bundle?.pages.length || 1}
            value={progress}
          />
        </div>
      </header>
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Страницы платформы">
          <label htmlFor="page-search">Найти страницу</label>
          <div className={styles.search}>
            <input
              ref={search}
              id="page-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  search.current?.focus();
                }}
              >
                Очистить
              </button>
            )}
          </div>
          <p className={styles.small}>
            Найдено: {filtered.length}. Фаза и URL не утверждаются вместе со
            структурой.
          </p>
          <nav>
            {Object.entries(groups).map(([key, label]) => {
              const list = filtered.filter((x) => x.page.group === key);
              return list.length ? (
                <section key={key}>
                  <h2>{label}</h2>
                  {list.map((item) => (
                    <button
                      disabled={busy}
                      key={item.page.id}
                      aria-current={
                        page?.id === item.page.id ? "page" : undefined
                      }
                      className={styles.pageLink}
                      onClick={() => navigate(item)}
                    >
                      <strong>{item.page.name}</strong>
                      <span>{item.page.route || "URL не определён"}</span>
                      <span>
                        {phaseLabels[item.page.phase]} ·{" "}
                        {statusLabels[item.page.status]}
                      </span>
                    </button>
                  ))}
                </section>
              ) : null;
            })}
          </nav>
          {bundle && !filtered.length && <p>Нет совпадений. Очистите поиск.</p>}
        </aside>
        <main id="page-editor" className={styles.editor}>
          <div
            className={styles.feedback}
            aria-live="polite"
            aria-atomic="true"
          >
            {busy
              ? "Загрузка / сохранение…"
              : notice ||
                (dirty
                  ? "Есть несохранённые изменения."
                  : "Изменения сохраняются только по вашему действию.")}
          </div>
          {error && (
            <div role="alert" className={styles.error}>
              <p>{error}</p>
              <div className={styles.actions}>
                {page && (
                  <button onClick={exportDraft}>Скачать черновик</button>
                )}
                <button
                  disabled={busy}
                  onClick={() =>
                    dirty
                      ? setConfirmation({
                          title: "Загрузить актуальные файлы?",
                          body: "Несохранённые изменения будут сброшены. Сначала скачайте черновик для сравнения.",
                          action: "Сбросить и загрузить",
                          run: () => void load(),
                        })
                      : void load()
                  }
                >
                  Перечитать файлы
                </button>
              </div>
            </div>
          )}
          {!bundle && !busy && !error && <p>Нет данных.</p>}
          {page && (
            <fieldset disabled={busy} className={styles.editorFields}>
              <div className={styles.pageHeading}>
                <p className={styles.eyebrow}>
                  {groups[page.group]} / {phaseLabels[page.phase]}
                </p>
                <h2 ref={heading} tabIndex={-1}>
                  {page.name}
                </h2>
                <p>{page.purpose}</p>
                <div className={styles.metadata}>
                  <code>{page.route || "URL не определён"}</code>
                  <span>
                    {page.routeStatus === "implemented-starter"
                      ? "Существует только starter"
                      : page.routeStatus === "proposed"
                        ? "URL предложен"
                        : page.routeStatus === "confirmed"
                          ? "URL подтверждён"
                          : "Экран без утверждённого URL"}
                  </span>
                  <span>
                    {
                      statusLabels[
                        dirty && page.status === "approved"
                          ? "in-review"
                          : page.status
                      ]
                    }{" "}
                    · r{page.revision}
                    {dirty ? " + черновик" : ""}
                  </span>
                </div>
              </div>
              <details className={styles.context}>
                <summary>Задача, исходные требования и зависимости</summary>
                <dl>
                  <dt>ID / роль</dt>
                  <dd>
                    {page.id} · {page.roles.join(", ")}
                  </dd>
                  <dt>Главное действие</dt>
                  <dd>{page.primaryAction}</dd>
                  <dt>Реализация</dt>
                  <dd>{page.implementation}</dd>
                  <dt>Обязательное содержание из источников</dt>
                  <dd className={styles.pre}>{page.requiredContent}</dd>
                  <dt>Зависимости</dt>
                  <dd>{page.dependencies}</dd>
                </dl>
                <p className={styles.small}>
                  Эти сведения описывают исходный scope. Композицию редактируйте
                  ниже; изменение структуры не изменяет продуктовые требования.
                </p>
              </details>
              <details className={styles.context}>
                <summary>
                  Источники и открытые вопросы · {page.issues.length}
                </summary>
                <ul>
                  {page.sources.map((source) => (
                    <li key={source}>
                      <code>{source}</code>
                    </li>
                  ))}
                </ul>
                {page.issues.map((id) => (
                  <p key={id} className={styles.question}>
                    <strong>{id}</strong>
                    <br />
                    {bundle?.questions[id] ||
                      "См. соответствующий регистр. Решение не принято."}
                  </p>
                ))}
              </details>
              <div className={styles.sectionHeading}>
                <h3>Порядок секций</h3>
                <span>
                  {sections.filter((s) => s.reviewed).length} /{" "}
                  {sections.length} проверено
                </span>
              </div>
              <p className={styles.small}>
                Названия и цели видны сразу. Раскройте секцию для
                редактирования. Сначала сохраните содержательные правки, затем
                отметьте секцию проверенной.
              </p>
              {!sections.length && (
                <p className={styles.empty}>
                  Секций нет. Добавьте новую или восстановите удалённую. Пустую
                  страницу утвердить нельзя.
                </p>
              )}
              <ol className={styles.sections}>
                {sections.map((section, index) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    index={index}
                    total={sections.length}
                    saved={page.sections.find((s) => s.id === section.id)}
                    update={(patch) => update(section.id, patch)}
                    move={(delta) => reorder(section.id, delta)}
                    remove={() => remove(section)}
                    include={(value) => include(section, value)}
                  />
                ))}
              </ol>
              <button onClick={add} disabled={sections.length >= 80}>
                Добавить секцию
              </button>
              {removed.length > 0 && (
                <details className={styles.context}>
                  <summary>Удалённые секции · {removed.length}</summary>
                  {removed.map((s) => (
                    <div key={s.id} className={styles.trash}>
                      <span>
                        {s.name}
                        {s.required ? " · исходное требование" : ""}
                      </span>
                      <button
                        onClick={() => {
                          setSections((items) => {
                            const next = [...items];
                            next.splice(
                              Math.min(s.position - 1, next.length),
                              0,
                              { ...s, reviewed: false },
                            );
                            return next.map((x, i) => ({
                              ...x,
                              position: i + 1,
                            }));
                          });
                          setNotice(
                            "Секция восстановлена в черновике. Сохраните изменения.",
                          );
                        }}
                      >
                        Восстановить
                      </button>
                    </div>
                  ))}
                </details>
              )}
              <label className={styles.notes}>
                Заметки страницы / запрошенные изменения
                <textarea
                  className="resize-none"
                  rows={4}
                  value={notes}
                  maxLength={12000}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ resize: "none" }}
                />
              </label>
              <section className={styles.review} aria-labelledby="review-title">
                <h3 id="review-title">Проверка и утверждение</h3>
                <p>
                  Утверждается только структура. Открытые продуктовые вопросы,
                  URL и визуальные решения остаются открытыми.
                </p>
                {page.approval && (
                  <p className={styles.approval}>
                    {dirty
                      ? "Предыдущее утверждение будет снято при сохранении. "
                      : ""}
                    Проверяющий: {page.approval.reviewer} ·{" "}
                    {new Date(page.approval.date).toLocaleString("ru-RU")} ·
                    ревизия {page.approval.revision}
                  </p>
                )}
                <label>
                  Имя проверяющего (вводится вами)
                  <input
                    value={reviewer}
                    maxLength={120}
                    onChange={(e) => setReviewer(e.target.value)}
                    autoComplete="name"
                  />
                </label>
                <div className={styles.actions}>
                  <button
                    className={styles.primary}
                    onClick={() => void save("save")}
                    disabled={!dirty}
                  >
                    Сохранить изменения
                  </button>
                  <button
                    onClick={() => void save("review")}
                    disabled={!reviewer.trim()}
                  >
                    На проверку
                  </button>
                  <button
                    onClick={() => void save("request-changes")}
                    disabled={!reviewer.trim() || !notes.trim()}
                  >
                    Запросить изменения
                  </button>
                  <button
                    onClick={() =>
                      setConfirmation({
                        title: "Утвердить структуру страницы?",
                        body: `«${page.name}», ревизия ${page.revision}. Проверяющий: ${reviewer}. Утверждение сохранится в файле; последующая правка снимет его.`,
                        action: "Утвердить структуру",
                        run: () => void save("approve"),
                      })
                    }
                    disabled={
                      dirty ||
                      !ready ||
                      !reviewer.trim() ||
                      page.status === "approved"
                    }
                  >
                    Утвердить страницу
                  </button>
                </div>
                <p className={styles.small}>
                  Для утверждения: сохраните изменения, отметьте все секции
                  проверенными, сохраните отметки и введите имя. Исключённые
                  секции тоже требуют проверки.
                </p>
              </section>
              <details className={styles.context}>
                <summary>История ревизий · {page.history.length}</summary>
                {page.history.length ? (
                  <ol>
                    {page.history.toReversed().map((h) => (
                      <li key={h.revision}>
                        r{h.revision} ·{" "}
                        {new Date(h.date).toLocaleString("ru-RU")} · {h.action}{" "}
                        · {h.reviewer || "имя не указано"} ·{" "}
                        {statusLabels[h.status]}
                        {h.previousApproval &&
                          ` · предыдущее утверждение: ${h.previousApproval.reviewer}, r${h.previousApproval.revision}`}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>Исходный черновик. Утверждений ещё нет.</p>
                )}
                <p>
                  История содержит метаданные операций и предыдущих утверждений.
                  Полные версии восстанавливаются через Git; удалённые секции —
                  выше.
                </p>
              </details>
            </fieldset>
          )}
        </main>
      </div>
      <dialog
        ref={dialog}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const buttons = dialog.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
          if (!buttons?.length) return;
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onCancel={() => setConfirmation(null)}
        aria-labelledby="confirmation-title"
        className={styles.dialog}
      >
        <h2 id="confirmation-title">{confirmation?.title}</h2>
        <p>{confirmation?.body}</p>
        <div className={styles.actions}>
          <button ref={cancelButton} onClick={() => setConfirmation(null)}>
            Отмена
          </button>
          <button
            onClick={() => {
              const run = confirmation?.run;
              setConfirmation(null);
              run?.();
            }}
          >
            {confirmation?.action}
          </button>
        </div>
      </dialog>
    </div>
  );
}
