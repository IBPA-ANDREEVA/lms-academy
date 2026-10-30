"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, ButtonLink } from "@/components/ui/button";
import { AuthModal } from "@/features/identity";
import { CartPreview } from "@/features/commerce";
import { NavigationEntry } from "./navigation-entry";
import { PageContainer } from "./page-container";
import type { NavigationItem, NavigationLink } from "./navigation";
import styles from "./public-header.module.css";

gsap.registerPlugin(useGSAP);

export type PublicHeaderProps = {
  brand: NavigationLink;
  navigation: readonly NavigationItem[];
  account?: NavigationLink;
  cart?: NavigationLink & { count?: number };
  locales?: readonly (NavigationLink & { current?: boolean })[];
  showAuth?: boolean;
  showCartPreview?: boolean;
};

function NavigationLinks({ items, pathname, onNavigate }: {
  items: readonly NavigationItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return <ul>{items.map((item) => {
    const children = item.children?.length ? <ul className={styles.dropdown}>
      {item.children.map((child) => <li key={child.label}><NavigationEntry entry={child} onNavigate={onNavigate} showPreviewLabel={false} /></li>)}
    </ul> : null;
    return <li key={item.label}>
      {children ? <details><summary>{item.label}<span aria-hidden="true" className={styles.chevron} /></summary>{children}</details>
        : <NavigationEntry entry={item} current={pathname === item.href} onNavigate={onNavigate} showPreviewLabel={false} />}
    </li>;
  })}</ul>;
}

/** Caller-owned links and unavailable preview entries. */
export function PublicHeader({
  brand,
  navigation,
  account,
  cart,
  locales = [],
  showAuth = false,
  showCartPreview = false,
}: PublicHeaderProps) {
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const [homeScrolled, setHomeScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const authButton = useRef<HTMLButtonElement>(null);
  function closeDropdowns() {
    root.current
      ?.querySelectorAll("details[open]")
      .forEach((item) => item.removeAttribute("open"));
  }
  function navigate() {
    closeDropdowns();
  }

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      root.current?.querySelectorAll("details[open]").forEach((item) => {
        if (!item.contains(event.target as Node)) item.removeAttribute("open");
      });
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);

  useGSAP((_, contextSafe) => {
    const header = root.current;
    if (!header || !contextSafe || pathname !== "/") {
      return;
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const appearance = (progress: number) => ({
      "--header-progress": progress,
      "--header-ink": progress ? "#1d1b1f" : "#ffffff",
      "--header-cart-ink": progress ? "#782858" : "#ffffff",
    });
    let target = window.scrollY > 48 ? 1 : 0;
    let frame = 0;
    gsap.set(header, appearance(target));

    const update = contextSafe(() => {
      frame = 0;
      const next = window.scrollY > 48 ? 1 : 0;
      setHomeScrolled(Boolean(next));
      if (next === target) return;
      target = next;
      gsap.to(header, {
        ...appearance(next),
        duration: motion.matches ? 0 : next ? 0.42 : 0.54,
        ease: next ? "power2.inOut" : "power2.out",
        overwrite: true,
      });
    });
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onMotionChange = contextSafe(() => {
      if (motion.matches) {
        gsap.killTweensOf(header);
        gsap.set(header, appearance(target));
      }
    });
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    motion.addEventListener("change", onMotionChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      motion.removeEventListener("change", onMotionChange);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(header);
    };
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true });

  const localeLinks = locales.length > 1 && (
    <nav aria-label="Язык сайта" className={styles.locales}>
      {locales.map((locale) => (
        <Link
          key={locale.label}
          href={locale.href}
          aria-current={locale.current ? "true" : undefined}
          onNavigate={navigate}
        >
          {locale.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header
      ref={root}
      className={styles.header}
      data-home-route={pathname === "/"}
      data-home-scrolled={homeScrolled}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        const details = (event.target as HTMLElement).closest("details[open]");
        if (details) {
          event.preventDefault();
          event.stopPropagation();
          details.removeAttribute("open");
          details.querySelector("summary")?.focus();
        }
      }}
    >
      <PageContainer>
        <div className={styles.bar}>
          <Link href={brand.href} className={styles.brand}>
            {brand.label}
          </Link>
          <nav aria-label="Основная навигация" className={styles.navigation}>
            <NavigationLinks
              items={navigation}
              pathname={pathname}
              onNavigate={navigate}
            />
          </nav>
          <div className={styles.actions}>
            <div className={styles.desktopLocale}>{localeLinks}</div>
            {cart ? (
              <Link
                href={cart.href}
                className={styles.cart}
                aria-label={`${cart.label}${cart.count ? `, товаров: ${cart.count}` : ""}`}
              >
                <span className={styles.cartIcon} aria-hidden="true" />
                {cart.count ? (
                  <span className={styles.count}>{cart.count}</span>
                ) : null}
              </Link>
            ) : showCartPreview ? (
              <CartPreview key={pathname} triggerClassName={styles.cart} iconClassName={styles.cartIcon} countClassName={styles.count} />
            ) : null}
            {showAuth ? (
              <Button ref={authButton} className={styles.signIn} onClick={() => {
                setAuthOpen(true);
              }}>Войти</Button>
            ) : account && (
              <ButtonLink href={account.href} className={styles.signIn}>
                {account.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </PageContainer>
      {showAuth && <AuthModal open={authOpen} onClose={() => {
        setAuthOpen(false);
        authButton.current?.focus();
      }} />}
    </header>
  );
}
