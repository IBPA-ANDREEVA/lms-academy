"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageContainer } from "./page-container";
import type { NavigationItem, NavigationLink } from "./navigation";
import styles from "./public-header.module.css";

export type PublicHeaderProps = {
  brand: NavigationLink;
  navigation: readonly NavigationItem[];
  account?: NavigationLink;
  cart?: NavigationLink & { count?: number };
  locales?: readonly (NavigationLink & { current?: boolean })[];
};

function NavigationLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: readonly NavigationItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.href}>
          {item.children?.length ? (
            <details>
              <summary>
                {item.label}
                <span aria-hidden="true" className={styles.chevron} />
              </summary>
              <ul className={styles.dropdown}>
                <li>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onNavigate={onNavigate}
                  >
                    Все: {item.label.toLocaleLowerCase("ru")}
                  </Link>
                </li>
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} onNavigate={onNavigate}>
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <Link
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onNavigate={onNavigate}
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Shell navigation only; the caller supplies published, phase-valid destinations. */
export function PublicHeader({
  brand,
  navigation,
  account,
  cart,
  locales = [],
}: PublicHeaderProps) {
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const titleId = useId();

  function closeMenu() {
    dialog.current?.close();
    setOpen(false);
  }
  function closeDropdowns() {
    root.current
      ?.querySelectorAll("details[open]")
      .forEach((item) => item.removeAttribute("open"));
  }
  function navigate() {
    closeDropdowns();
    closeMenu();
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

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const wide = matchMedia("(min-width: 1025px)");
    const onResize = () => {
      if (wide.matches) {
        dialog.current?.close();
        setOpen(false);
      }
    };
    wide.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      wide.removeEventListener("change", onResize);
    };
  }, [open]);

  const localeLinks = locales.length > 1 && (
    <nav aria-label="Язык сайта" className={styles.locales}>
      {locales.map((locale) => (
        <Link
          key={locale.href}
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
          <nav aria-label="Основная навигация" className={styles.desktopLinks}>
            <NavigationLinks
              items={navigation}
              pathname={pathname}
              onNavigate={navigate}
            />
          </nav>
          <div className={styles.actions}>
            <div className={styles.desktopLocale}>{localeLinks}</div>
            {cart && (
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
            )}
            {account && (
              <ButtonLink href={account.href} className={styles.signIn}>
                {account.label}
              </ButtonLink>
            )}
            <Button
              ref={menuButton}
              intent="secondary"
              className={styles.menuButton}
              aria-label="Открыть меню"
              aria-expanded={open}
              aria-controls={dialogId}
              aria-haspopup="dialog"
              onClick={() => {
                dialog.current?.showModal();
                setOpen(true);
              }}
            >
              <span className={styles.menuIcon} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </PageContainer>
      <dialog
        ref={dialog}
        id={dialogId}
        aria-labelledby={titleId}
        className={styles.dialog}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const targets = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'a[href], button:not(:disabled), summary, [tabindex="0"]',
            ),
          ).filter((element) => element.getClientRects().length > 0);
          const first = targets[0];
          const last = targets.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => {
          setOpen(false);
          menuButton.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.dialogHeading}>
            <Link
              id={titleId}
              href={brand.href}
              className={styles.brand}
              onNavigate={navigate}
            >
              {brand.label}
            </Link>
            <Button
              intent="secondary"
              className={styles.closeButton}
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <span className={styles.closeIcon} aria-hidden="true" />
            </Button>
          </div>
          <nav aria-label="Мобильная навигация" className={styles.mobileLinks}>
            <NavigationLinks
              items={navigation}
              pathname={pathname}
              onNavigate={navigate}
            />
          </nav>
          {(locales.length > 1 || account || cart) && (
            <div className={styles.mobileActions}>
              {localeLinks}
              {account && (
                <ButtonLink
                  href={account.href}
                  fullWidth
                  className={styles.mobileSignIn}
                  onNavigate={navigate}
                >
                  {account.label}
                </ButtonLink>
              )}
              {cart && (
                <Link
                  href={cart.href}
                  className={styles.mobileCart}
                  onNavigate={navigate}
                >
                  <span className={styles.cartIcon} aria-hidden="true" />
                  {cart.label}
                  <span className={styles.chevron} aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </div>
      </dialog>
    </header>
  );
}
