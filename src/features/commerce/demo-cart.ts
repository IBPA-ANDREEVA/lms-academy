/** Preview presentation only. Authoritative money/quotes belong to server Commerce. */
export type DemoItem = {
  id: string;
  title: string;
  kind: "Курс" | "Мини-курс";
  /** Integer USD cents, read from the centralized preview catalog. */
  amount: number;
  demonstration: true;
};
export const DEMO_CART_KEY = "lms.catalog.preview-cart.v2";
export type DemoScenario = "ready" | "recalculating" | "unavailable" | "price-changed" | "error";

export function readDemoSelection(raw: string | null): string[] {
  if (raw === null) return [];
  const ids: unknown = JSON.parse(raw);
  if (!Array.isArray(ids) || ids.length > 200 || new Set(ids).size !== ids.length ||
    ids.some(id => typeof id !== "string" || !/^demo-(course|mini)-\d{1,4}$/.test(id))) throw new Error("Invalid preview cart identifiers");
  // Caller resolves records/prices from the preview catalog; storage never supplies objects.
  return ids;
}
export function formatDemoAmount(amount: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(amount / 100);
}
