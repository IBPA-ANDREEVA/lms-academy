import "server-only";
import type { Metadata } from "next";
import { siteOrigin, testPreview } from "../site-environment";
import type { CatalogProduct } from "@/features/catalog/catalog-view-types";
import { isIndexableProduct } from "@/lib/seo/product-indexability";

export const siteName = "Beauty Business Academy";
export const staticPublicPages = [
  { path: "/", title: "Обучение в сфере красоты", description: "Beauty Business Academy — обучение в сфере красоты. Узнайте о форматах обучения, курсах с куратором и мини-курсах в записи." },
  { path: "/courses", title: "Курсы в сфере красоты", description: "Каталог курсов Beauty Business Academy: направления, языки и уровни подготовки. Программа и условия доступны на странице опубликованного курса." },
  { path: "/mini-courses", title: "Мини-курсы в записи", description: "Мини-курсы Beauty Business Academy: короткие программы в записи без куратора и проверки работ. Выберите направление и язык обучения." },
] as const;

export function pageMetadata(title: string, description: string, path?: string, approved = false): Metadata {
  const origin = siteOrigin();
  const index = approved && Boolean(origin) && !testPreview;
  const url = origin && path && !testPreview ? `${origin}${path}` : undefined;
  const fullTitle = `${title} — ${siteName}`;
  const images = origin ? [{ url: `${origin}/brand/social.png`, width: 1200, height: 630, alt: siteName }] : [];
  return {
    title: { absolute: fullTitle }, description,
    robots: { index, follow: index },
    alternates: { canonical: url ?? null },
    openGraph: { title: fullTitle, description, type: "website", siteName, locale: "ru_RU", url, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map(image => image.url) },
  };
}
export function staticMetadata(path: string) {
  const page = staticPublicPages.find(page => page.path === path)!;
  return pageMetadata(page.title, page.description, page.path, true);
}
export function productMetadata(product: CatalogProduct): Metadata {
  if (!isIndexableProduct(product)) return pageMetadata("Страница недоступна", "Вернитесь в каталог доступных программ.");
  return pageMetadata(product.content.ru!.title, product.content.ru!.description,
    `/${product.kind === "course" ? "courses" : "mini-courses"}/${product.slug}`, true);
}
