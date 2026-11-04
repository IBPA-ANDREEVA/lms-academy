"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { DEMO_CART_KEY, readDemoSelection, type DemoItem, type DemoScenario } from "./demo-cart";
import styles from "./commerce.module.css";

type CartContextValue = {
  items: readonly DemoItem[]; loading: boolean; error: boolean; storageWarning: boolean;
  scenario: DemoScenario; demoEnabled: boolean; total: number;
  addDemo: (id: string) => void; addMany: (ids: string[]) => void;
  remove: (id: string) => void; clear: () => void; retry: () => void;
  setScenario: (scenario: DemoScenario) => void;
};
const CartContext = createContext<CartContextValue | null>(null);

/** Preview identifiers only. No order, enrollment, payment or server mutation exists here. */
export function CartProvider({ children }: { children: ReactNode }) {
  const catalog = useCatalog();
  const demoEnabled = catalog.enabled;
  const [ids, setIds] = useState<string[]>([]);
  const idsRef = useRef(ids);
  const [loading, setLoading] = useState(demoEnabled);
  const [error, setError] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [scenario, setScenario] = useState<DemoScenario>("ready");
  const available = catalog.products.filter(p => p.demonstration && p.publication === "published" && p.approval === "approved" && p.sale === "open" && p.priceApproval === "approved" && p.price);
  function restore() {
    if (!demoEnabled) return;
    try {
      const saved = readDemoSelection(localStorage.getItem(DEMO_CART_KEY));
      idsRef.current = saved; setIds(saved); setError(false);
    } catch {
      setError(true);
      console.error({ event: "preview.cart.restore.failed", reference: "preview-cart-storage", outcome: "blocked" });
    }
    setLoading(false);
  }
  useEffect(() => {
    if (!demoEnabled) return;
    let active = true;
    queueMicrotask(() => { if (active) restore(); });
    const sync = (event: StorageEvent) => { if (event.key === DEMO_CART_KEY || event.key === null) restore(); };
    window.addEventListener("storage", sync);
    return () => { active = false; window.removeEventListener("storage", sync); };
    // Restoration only depends on the server-selected mode, never product/price objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoEnabled]);
  function save(next: string[]) {
    if (!demoEnabled) return;
    idsRef.current = next; setIds(next); setLoading(false); setError(false); setScenario("ready");
    try { localStorage.setItem(DEMO_CART_KEY, JSON.stringify(next)); setStorageWarning(false); }
    catch { setStorageWarning(true); console.error({ event: "preview.cart.save.failed", reference: "preview-cart-storage", outcome: "memory_only" }); }
  }
  function addMany(next: string[]) {
    if (!demoEnabled || catalog.status === "unavailable" || catalog.status === "loading") return;
    const valid = next.map(id => id === "demo-course" ? available.find(p => p.kind === "course")?.id : id === "demo-mini" ? available.find(p => p.kind === "mini-course")?.id : id)
      .filter((id): id is string => Boolean(id && (available.some(p => p.id === id) || catalog.packages.some(p => p.id === id))));
    save([...new Set([...idsRef.current, ...valid])]);
  }
  const items: DemoItem[] = demoEnabled ? ids.flatMap<DemoItem>(id => {
    const pack = catalog.packages.find(p => p.id === id);
    if (pack) return [{ id, title: pack.title, kind: "Пакет" as const, amount: pack.amountMinor, demonstration: true as const }];
    const product = available.find(p => p.id === id);
    return product ? [{ id, title: product.content.ru!.title, kind: product.kind === "course" ? "Курс" as const : "Мини-курс" as const, amount: product.price!.amountMinor, demonstration: true as const }] : [];
  }) : [];
  return <CartContext.Provider value={{ items, loading: loading || (demoEnabled && catalog.status === "loading"), error, storageWarning, scenario, demoEnabled,
    total: items.reduce((sum, item) => sum + item.amount, 0), addDemo: id => addMany([id]), addMany,
    remove: id => save(idsRef.current.filter(selected => selected !== id)), clear: () => save([]),
    retry: () => { if (scenario === "error") setScenario("ready"); else restore(); },
    setScenario: next => { if (demoEnabled) setScenario(next); },
  }}>{children}<span className={styles.visuallyHidden} role="status" aria-live="polite">{loading ? "" : `Корзина обновлена. Продуктов: ${items.length}.`}</span></CartContext.Provider>;
}
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("Cart UI requires CartProvider");
  return cart;
}
