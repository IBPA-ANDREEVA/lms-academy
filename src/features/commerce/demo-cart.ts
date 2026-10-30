/** Review fixtures only. Never an offer, quote, order or production currency policy. */
export type DemoItem = {
  id: "demo-course" | "demo-mini";
  title: string;
  kind: "Курс" | "Мини-курс";
  amount: number;
  demonstration: true;
};

export const demoItems: readonly DemoItem[] = [
  { id: "demo-course", title: "Тестовый курс", kind: "Курс", amount: 12000, demonstration: true },
  { id: "demo-mini", title: "Тестовый мини-курс", kind: "Мини-курс", amount: 3500, demonstration: true },
];

export const DEMO_CART_KEY = "lms.la09.demo-cart.v1";
export type DemoScenario = "ready" | "recalculating" | "unavailable" | "price-changed" | "error";

export function readDemoSelection(raw: string | null): DemoItem[] {
  if (raw === null) return [];
  const ids: unknown = JSON.parse(raw);
  if (!Array.isArray(ids) || ids.length > demoItems.length ||
    ids.some(id => typeof id !== "string" || !demoItems.some(item => item.id === id)) ||
    new Set(ids).size !== ids.length) throw new Error("Invalid demo cart");
  // Restore identifiers only; never trust stored amounts or product objects.
  return ids.map(id => demoItems.find(item => item.id === id)!);
}

export function formatDemoAmount(amount: number) {
  return `${new Intl.NumberFormat("ru-RU").format(amount)} ₽`;
}
