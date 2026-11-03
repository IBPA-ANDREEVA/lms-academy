import type { CatalogProduct } from "@/server/catalog/contracts";
import type { CatalogItem } from "./catalog-data";
import type { DetailProduct } from "@/features/course-detail/detail-data";

export function priceLabel(product: CatalogProduct) {
  return product.price && product.priceApproval === "approved"
    ? new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(product.price.amountMinor / 100)
    : undefined;
}
export function toCatalogItem(product: CatalogProduct): CatalogItem {
  return { id: product.id, directionId: product.category.id, levelId: product.level, languages: product.languages,
    course: { href: `/${product.kind === "course" ? "courses" : "mini-courses"}/${product.slug}`, kind: product.kind,
      title: product.content.ru!.title, direction: product.category.title,
      level: product.level === "beginner" ? "Начальный" : "Продвинутый", language: product.languages.join(" / ").toUpperCase(),
      trainer: product.trainer.name, duration: `${product.lessonCount} уроков · ${product.durationMinutes} мин`,
      image: product.cover, priceLabel: priceLabel(product), format: product.curatorSupport ? "С куратором" : "В записи" } };
}
export function toDetailProduct(product: CatalogProduct): DetailProduct {
  const card = toCatalogItem(product).course;
  return { slug: product.slug, kind: product.kind, title: card.title, direction: card.direction, level: card.level,
    language: card.language, duration: card.duration, lessonCount: product.lessonCount, description: product.content.ru!.description,
    summary: product.content.ru!.description, outcomes: product.content.ru!.outcomes, heroImage: product.cover,
    modules: product.curriculum.map(module => ({ title: module.title, lessons: module.lessons.map(lesson => ({ title: lesson.title, duration: `${lesson.durationMinutes} мин` })) })),
    trainer: { name: product.trainer.name, image: product.trainer.photo, qualifications: product.trainer.approvedCredentials },
    previewUrl: product.preview?.url, previewCaptionsUrl: product.preview?.captionsUrl,
    priceLabel: priceLabel(product), offerState: "unavailable", demonstration: product.demonstration };
}
