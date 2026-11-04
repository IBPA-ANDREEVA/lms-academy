import "server-only";
import { siteOrigin, testPreview } from "../site-environment";
import { siteName } from "./metadata";
import type { CatalogProduct } from "@/features/catalog/catalog-view-types";
import { isIndexableProduct } from "@/lib/seo/product-indexability";

export function websiteSchema() {
  const origin = siteOrigin();
  if (!origin || testPreview) return null;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${origin}/#organization`, name: siteName, url: origin, logo: `${origin}/brand/logo.svg` },
    { "@type": "WebSite", "@id": `${origin}/#website`, name: siteName, url: origin, inLanguage: "ru", publisher: { "@id": `${origin}/#organization` } },
  ] };
}
export function productSchema(product: CatalogProduct) {
  const origin = siteOrigin();
  if (!origin || testPreview || !isIndexableProduct(product)) return null;
  const listing = product.kind === "course" ? "/courses" : "/mini-courses";
  const url = `${origin}${listing}/${product.slug}`;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Course", name: product.content.ru!.title, description: product.content.ru!.description, url,
      inLanguage: product.languages, provider: { "@type": "Organization", name: siteName, url: origin } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: product.kind === "course" ? "Курсы" : "Мини-курсы", item: `${origin}${listing}` },
      { "@type": "ListItem", position: 3, name: product.content.ru!.title, item: url },
    ] },
  ] };
}
