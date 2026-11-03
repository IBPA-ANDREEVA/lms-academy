import { notFound } from "next/navigation";
import type { ProductKind } from "@/server/catalog/contracts";
import { fetchPublishedProduct } from "@/server/catalog";
import { testPreview } from "@/lib/site-environment";
import { pageMetadata, productMetadata } from "@/lib/seo/metadata";
import { productSchema } from "@/lib/seo/structured-data";
import { StructuredData } from "@/features/public-shell/structured-data";
import { toDetailProduct } from "@/features/catalog/catalog-presentation";
import { CatalogState } from "@/features/catalog/components/catalog-state";
import { PageContainer } from "@/features/public-shell";
import { DetailPage } from "./detail-page";
import { PreviewDetail } from "./preview-detail";
import styles from "./route-fallback.module.css";

export async function detailMetadata(kind: ProductKind, slug: string) {
  if (testPreview) return pageMetadata("Демонстрация программы", "Тестовая страница. Данные вымышлены, покупка недоступна.");
  const result = await fetchPublishedProduct(kind, slug);
  return result.status === "success" ? productMetadata(result.product) : pageMetadata(
    result.status === "missing" ? "Программа не найдена" : "Программа временно недоступна",
    "Вернитесь в каталог или повторите попытку позже.");
}
export async function ProductRoute({ kind, slug }: { kind: ProductKind; slug: string }) {
  if (testPreview) {
    if (!/^demo-(course|mini)-\d{1,4}$/.test(slug) || (kind === "course") !== slug.startsWith("demo-course-")) notFound();
    return <PreviewDetail kind={kind} slug={slug} />;
  }
  const result = await fetchPublishedProduct(kind, slug);
  if (result.status === "missing") notFound();
  if (result.status === "unavailable") return <main id="main-content" className={styles.main}><PageContainer><h1>Программа временно недоступна</h1><CatalogState status="unavailable" mini={kind === "mini-course"} /></PageContainer></main>;
  return <><StructuredData value={productSchema(result.product)} /><DetailPage product={toDetailProduct(result.product)} /></>;
}
