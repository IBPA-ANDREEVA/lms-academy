"use client";
import { type Section, phases, phaseLabels } from "./model";
import styles from "./workspace.module.css";

type Props = {
  section: Section;
  index: number;
  total: number;
  saved?: Section;
  update: (patch: Partial<Section>) => void;
  move: (delta: number) => void;
  remove: () => void;
  include: (value: Section["inclusion"]) => void;
};
const fields: [keyof Section, string][] = [
  ["purpose", "Назначение / краткое описание"],
  ["content", "Необходимое содержание"],
  ["primaryAction", "Главное действие"],
  ["interactions", "Взаимодействия"],
  ["dependencies", "Зависимости данных"],
  ["desktop", "Поведение на компьютере"],
  ["mobile", "Поведение на телефоне"],
  ["states", "Загрузка, пустое состояние, ошибки и недоступность"],
  ["notes", "Заметки о композиции и дизайне"],
];
export default function SectionEditor({
  section: s,
  index,
  total,
  saved,
  update,
  move,
  remove,
  include,
}: Props) {
  const changed =
    !saved ||
    fields.some(([key]) => s[key] !== saved[key]) ||
    s.name !== saved.name ||
    s.phase !== saved.phase ||
    s.inclusion !== saved.inclusion ||
    JSON.stringify(s.sources) !== JSON.stringify(saved.sources);
  return (
    <li className={styles.section}>
      <details>
        <summary>
          <span className={styles.ordinal}>{index + 1}</span>
          <span className={styles.summaryText}>
            <strong>{s.name}</strong>
            <span>{s.purpose}</span>
            <small>
              {phaseLabels[s.phase]} ·{" "}
              {s.inclusion === "excluded"
                ? "Исключена"
                : s.inclusion === "conditional"
                  ? "Условная"
                  : "Включена"}{" "}
              · {s.reviewed ? "Проверена" : "Не проверена"}
              {s.required ? " · Исходное требование" : ""}
            </small>
          </span>
        </summary>
        <div className={styles.sectionBody}>
          <p className={styles.small}>
            <code>{s.id}</code>
          </p>
          <label>
            Название секции
            <input
              value={s.name}
              maxLength={200}
              onChange={(e) => update({ name: e.target.value })}
            />
          </label>
          <div className={styles.twoColumns}>
            <div>
              <label htmlFor={`${s.id}-phase`}>Фаза секции</label>
              <select
                id={`${s.id}-phase`}
                value={s.phase}
                onChange={(e) =>
                  update({ phase: e.target.value as Section["phase"] })
                }
              >
                {phases.map((p) => (
                  <option key={p} value={p}>
                    {phaseLabels[p]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${s.id}-inclusion`}>Включение</label>
              <select
                id={`${s.id}-inclusion`}
                value={s.inclusion}
                onChange={(e) =>
                  include(e.target.value as Section["inclusion"])
                }
              >
                <option value="included">Включена в свою фазу</option>
                <option value="conditional">Условная</option>
                <option value="excluded">Исключена из композиции</option>
              </select>
            </div>
          </div>
          {fields.map(([key, label]) => (
            <div key={key}>
              <label htmlFor={`${s.id}-${key}`}>{label}</label>
              <textarea
                id={`${s.id}-${key}`}
                className="resize-none"
                style={{ resize: "none" }}
                rows={key === "content" || key === "states" ? 4 : 3}
                maxLength={12000}
                value={s[key] as string}
                onChange={(e) => update({ [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label htmlFor={`${s.id}-sources`}>
              Источники — один путь docs/...md на строку
            </label>
            <textarea
              id={`${s.id}-sources`}
              className="resize-none"
              style={{ resize: "none" }}
              rows={3}
              value={s.sources.join("\n")}
              onChange={(e) => update({ sources: e.target.value.split("\n") })}
            />
          </div>
          <p className={styles.small}>
            Источники описывают требования. Визуальные заметки не заменяют
            утверждённый референс.
          </p>
        </div>
      </details>
      <div className={styles.sectionActions}>
        <button
          aria-label={`Выше: ${s.name}`}
          disabled={index === 0}
          onClick={() => move(-1)}
        >
          Выше
        </button>
        <button
          aria-label={`Ниже: ${s.name}`}
          disabled={index === total - 1}
          onClick={() => move(1)}
        >
          Ниже
        </button>
        <button aria-label={`Удалить: ${s.name}`} onClick={remove}>
          Удалить
        </button>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={s.reviewed}
            disabled={changed}
            onChange={(e) => update({ reviewed: e.target.checked })}
          />
          Проверена
        </label>
        {changed && (
          <span className={styles.small}>Сначала сохраните правки</span>
        )}
      </div>
    </li>
  );
}
