import { IntroductionSection } from "./sections/01-introduction/introduction-section";
import { CatalogExperience } from "./components/catalog-experience";

export function CatalogPage() {
  return <main id="main-content"><IntroductionSection /><Suspense fallback={<p role="status" style={{padding:"48px var(--page-gutter)"}}>Загружаем каталог…</p>}><CatalogExperience /></Suspense></main>;
}
import { Suspense } from "react";
