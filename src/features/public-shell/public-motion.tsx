"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PageWipeTransition } from "./page-wipe-transition";
import { SplashLoader } from "./splash-loader";
import { RouteLoadingContext } from "./route-loading";
import styles from "./public-motion.module.css";

export function PublicMotion({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [loadingCount, setLoadingCount] = useState(0);
  const [wipeOwnsLoading, setWipeOwnsLoading] = useState(false);
  // Splash handles welcome/cold-entry loading. Once navigation uses Wipe,
  // a slow-response watchdog must never start a second fullscreen loader.
  const onWipeActive = useCallback((active: boolean) => { if (active) setWipeOwnsLoading(true); }, []);
  const register = useCallback(() => {
    setLoadingCount(count => count + 1);
    return () => setLoadingCount(count => Math.max(0, count - 1));
  }, []);
  return <RouteLoadingContext value={register}>
    <div className={styles.root}>
      <div ref={content} className={styles.content}>{children}</div>
      <PageWipeTransition content={content} pathname={pathname} loading={loadingCount > 0} onActive={onWipeActive} />
      <SplashLoader active={loadingCount > 0} suppressed={wipeOwnsLoading} welcome={pathname === "/"} />
    </div>
  </RouteLoadingContext>;
}
