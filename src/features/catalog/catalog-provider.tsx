"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { CatalogProduct, CatalogResult, ProductKind } from "@/server/catalog/contracts";
import { initialPreviewIds, PREVIEW_KEY, previewProduct, previewPackage, readPreviewIds, type PreviewPackage } from "./preview/preview-data";

type CatalogContextValue = {
  enabled: boolean;
  products: CatalogProduct[];
  packages: PreviewPackage[];
  status: CatalogResult["status"] | "loading";
  warning: boolean;
  add: (kind: ProductKind | "package", count?: number) => string[];
  clear: () => void;
  reset: () => void;
  simulate: (status: "success" | "unavailable" | "loading") => void;
};
const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ enabled, initial, children }: { enabled: boolean; initial: CatalogResult; children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const idsRef = useRef(ids);
  const [ready, setReady] = useState(!enabled);
  const [warning, setWarning] = useState(false);
  const [scenario, setScenario] = useState<"success" | "unavailable" | "loading">("success");
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const restore = () => {
      try {
        const next = readPreviewIds(localStorage.getItem(PREVIEW_KEY));
        idsRef.current = next; setIds(next); setWarning(false);
      } catch {
        idsRef.current = [...initialPreviewIds]; setIds([...initialPreviewIds]); setWarning(true);
        console.error({ event: "preview.catalog.restore.failed", reference: "preview-catalog-storage", outcome: "session_defaults" });
      }
      setReady(true);
    };
    queueMicrotask(() => { if (active) restore(); });
    const sync = (event: StorageEvent) => { if (event.key === PREVIEW_KEY || event.key === null) restore(); };
    window.addEventListener("storage", sync);
    return () => { active = false; window.removeEventListener("storage", sync); };
  }, [enabled]);
  function save(next: string[]) {
    if (!enabled) return;
    idsRef.current = next; setIds(next); setScenario("success"); setReady(true);
    try { localStorage.setItem(PREVIEW_KEY, JSON.stringify(next)); setWarning(false); }
    catch { setWarning(true); console.error({ event: "preview.catalog.save.failed", reference: "preview-catalog-storage", outcome: "memory_only" }); }
  }
  const products = enabled ? ids.map(id => previewProduct(id)!).filter(Boolean) : initial.products;
  const packages = enabled ? ids.map(id => previewPackage(id)!).filter(Boolean) : [];
  const status = !enabled ? initial.status : !ready ? "loading" : scenario !== "success" ? scenario : products.length || packages.length ? "success" : "empty";
  return <CatalogContext.Provider value={{ enabled, products, packages, status, warning,
    add: (kind, count = 1) => {
      if (!enabled) return [];
      const prefix = kind === "course" ? "demo-course-" : kind === "package" ? "demo-package-" : "demo-mini-";
      const nextIndex = Math.max(-1, ...idsRef.current.filter(id => id.startsWith(prefix)).map(id => Number(id.slice(prefix.length)))) + 1;
      const added = Array.from({ length: Math.min(count, 200 - idsRef.current.length, 10000 - nextIndex) }, (_, i) => `${prefix}${nextIndex + i}`);
      save([...idsRef.current, ...added]); return added;
    },
    clear: () => save([]), reset: () => save([...initialPreviewIds]),
    simulate: next => { if (enabled) setScenario(next); },
  }}>{children}</CatalogContext.Provider>;
}
export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("CatalogProvider is required");
  return value;
}
