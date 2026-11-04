import { CatalogExperience } from "./components/catalog-experience";

export function CatalogPage() {
  return <main id="main-content"><Suspense fallback={<p role="status" style={{padding:"48px var(--page-gutter)"}}>Загружаем каталог…</p>}><CatalogExperience /></Suspense></main>;
}
import { Suspense } from "react";
