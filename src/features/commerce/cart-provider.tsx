"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_CART_KEY, demoItems, readDemoSelection, type DemoItem, type DemoScenario } from "./demo-cart";
import styles from "./commerce.module.css";

type CartState = {
  items: readonly DemoItem[];
  loading: boolean;
  error: boolean;
  storageWarning: boolean;
  scenario: DemoScenario;
};
type CartContextValue = CartState & {
  demoEnabled: boolean;
  total: number;
  addDemo: (id: DemoItem["id"]) => void;
  remove: (id: string) => void;
  clear: () => void;
  retry: () => void;
  setScenario: (scenario: DemoScenario) => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const initial: CartState = { items: [], loading: true, error: false, storageWarning: false, scenario: "ready" };

/** One root-owned review cart. Production has no local cart or fabricated service. */
export function CartProvider({ children }: { children: ReactNode }) {
  const demoEnabled = process.env.NODE_ENV === "development";
  const [state, setState] = useState<CartState>(initial);
  const restore = useCallback(() => {
    if (!demoEnabled) {
      setState({ ...initial, loading: false });
      return;
    }
    try {
      const items = readDemoSelection(localStorage.getItem(DEMO_CART_KEY));
      setState({ ...initial, loading: false, items });
    } catch {
      setState(current => ({ ...current, loading: false, error: true }));
    }
  }, [demoEnabled]);

  useEffect(() => {
    // Async restoration keeps the server and initial browser render identical.
    let active = true;
    queueMicrotask(() => { if (active) restore(); });
    const sync = (event: StorageEvent) => {
      if (event.key === DEMO_CART_KEY || event.key === null) restore();
    };
    if (demoEnabled) window.addEventListener("storage", sync);
    return () => { active = false; window.removeEventListener("storage", sync); };
  }, [demoEnabled, restore]);

  function save(items: readonly DemoItem[]) {
    if (!demoEnabled) return;
    let storageWarning = false;
    try { localStorage.setItem(DEMO_CART_KEY, JSON.stringify(items.map(item => item.id))); }
    catch { storageWarning = true; }
    setState({ items, loading: false, error: false, storageWarning, scenario: "ready" });
  }

  return <CartContext.Provider value={{
    ...state, demoEnabled, total: state.items.reduce((sum, item) => sum + item.amount, 0),
    addDemo: id => {
      const item = demoItems.find(item => item.id === id);
      if (item && !state.items.some(selected => selected.id === id)) save([...state.items, item]);
    },
    remove: id => save(state.items.filter(item => item.id !== id)),
    clear: () => save([]),
    retry: () => {
      if (state.scenario === "error") setState(current => ({ ...current, scenario: "ready" }));
      else restore();
    },
    setScenario: scenario => { if (demoEnabled) setState(current => ({ ...current, scenario })); },
  }}>{children}<span className={styles.visuallyHidden} role="status" aria-live="polite">{state.loading ? "" : `Корзина обновлена. Продуктов: ${state.items.length}.`}</span></CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("Cart UI requires CartProvider");
  return cart;
}
