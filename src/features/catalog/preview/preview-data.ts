import type { CatalogProduct, ProductKind } from "@/features/catalog/catalog-view-types";

export const PREVIEW_KEY = "lms.catalog.preview.v1";
export const initialPreviewIds = [0, 1, 2, 3].flatMap(index => [`demo-course-${index}`, `demo-mini-${index}`]);
const categories = [
  { id: "lash-extensions", title: "Наращивание ресниц" },
  { id: "nails", title: "Ногти" },
  { id: "brows", title: "Брови" },
  { id: "makeup", title: "Макияж" },
];

/** Deterministic fictional records, reconstructed from IDs, never trusted storage objects. */
export function previewProduct(id: string): CatalogProduct | null {
  const match = /^demo-(course|mini)-(\d{1,4})$/.exec(id);
  if (!match) return null;
  const index = Number(match[2]);
  const kind: ProductKind = match[1] === "course" ? "course" : "mini-course";
  const category = categories[index % categories.length];
  const title = `Демо: ${category.title.toLowerCase()} ${index + 1}`;
  const description = "Вымышленная программа для проверки интерфейса. Содержание, преподаватель и стоимость — тестовые данные. Обучение и оплата недоступны.";
  const lessonCount = kind === "course" ? 6 + index % 6 : 2 + index % 3;
  const draft = index % 6 === 5;
  return {
    id, slug: id, kind, category,
    publication: draft ? "draft" : "published", approval: draft ? "pending" : "approved",
    sale: index % 6 === 4 ? "paused" : "open", priceApproval: "approved",
    content: { ru: { title, description, outcomes: ["Пример результата обучения — демонстрация интерфейса"] },
      ...(index % 2 ? { en: { title: `Demo: beauty practice ${index + 1}`, description: "Fictional preview content." } } : {}) },
    languages: index % 2 ? ["ru", "en"] : ["ru"],
    trainer: { id: "demo-trainer", name: "Демо-преподаватель (вымышленный)", approvedCredentials: [],
      photo: { src: "/images/demo-course.svg", alt: "Демонстрационная иллюстрация, не фотография преподавателя" } },
    level: index % 2 ? "advanced" : "beginner",
    curriculum: [{ title: "Демонстрационная программа", lessons: Array.from({ length: lessonCount }, (_, i) => ({ title: `Тестовый урок ${i + 1}`, durationMinutes: 15 })) }],
    lessonCount, durationMinutes: lessonCount * 15,
    cover: { src: "/images/demo-course.svg", alt: "Демонстрационный материал — не опубликованный курс" },
    price: { amountMinor: (kind === "course" ? 12000 : 3500) + index * 500, currency: "USD" },
    curatorSupport: kind === "course", completionRequirements: ["Демонстрация: просмотр всех записанных уроков"],
    createdAt: "2026-11-03T00:00:00Z", updatedAt: "2026-11-03T00:00:00Z",
    publishedAt: draft ? null : "2026-11-03T00:00:00Z", demonstration: true,
  };
}
export function readPreviewIds(raw: string | null): string[] {
  if (raw === null) return [...initialPreviewIds];
  const ids: unknown = JSON.parse(raw);
  if (!Array.isArray(ids) || ids.length > 200 || new Set(ids).size !== ids.length ||
    ids.some(id => typeof id !== "string" || !previewProduct(id))) throw new Error("Invalid preview identifiers");
  return ids;
}
