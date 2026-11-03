"use client";

import { createContext, useContext, useLayoutEffect } from "react";
import { PageContainer } from "./page-container";
import styles from "./public-motion.module.css";

export const RouteLoadingContext = createContext<(() => () => void) | null>(null);

/** Mounted only by a real Next loading boundary, never by a welcome timer. */
export function PublicRouteLoading() {
  const register = useContext(RouteLoadingContext);
  useLayoutEffect(() => register?.(), [register]);
  return <main id="main-content" tabIndex={-1} data-route-loading className={styles.loading}>
    <PageContainer size="content"><p role="status">Загружаем страницу обучения…</p></PageContainer>
  </main>;
}
