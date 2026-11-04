"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { BrandLogo } from "./brand-logo";
import { NavigationEntry } from "./navigation-entry";
import type { NavigationItem, NavigationLink } from "./navigation";
import styles from "./mobile-navigation.module.css";

gsap.registerPlugin(useGSAP);
type Props = { navigation: readonly NavigationItem[]; brand: NavigationLink; account?: NavigationLink; showAuth: boolean; onAuth: () => void };
function MenuLinks({ navigation, onNavigate }: { navigation: Props["navigation"]; onNavigate?: () => void }) {
  return <ul className={styles.links}>{navigation.map(item => <li key={item.label}>
    {item.children?.length ? <div className={styles.learningGroup}><p className={styles.groupTitle}>{item.label}</p><ul>{item.children.map(child => <li key={child.label}><NavigationEntry entry={child} onNavigate={onNavigate} showPreviewLabel={false} /></li>)}</ul></div> : <NavigationEntry entry={item} onNavigate={onNavigate} showPreviewLabel={false} />}
  </li>)}</ul>;
}
export function MobileNavigation({ navigation, brand, account, showAuth, onAuth }: Props) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const closing = useRef(false);
  const menuMotion = useRef<gsap.core.Timeline | null>(null);
  useScrollLock(open);
  useEffect(() => {
    const media = matchMedia("(min-width: 761px)");
    const close = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  const { contextSafe } = useGSAP(() => {
    const surface = dialog.current;
    if (!surface) return;
    if (!open) { surface.close(); return; }
    surface.showModal();
    closing.current = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      if (!preference.matches || !dialog.current) return;
      menuMotion.current?.progress(1).kill();
      menuMotion.current = null;
      if (closing.current) setOpen(false);
    };
    preference.addEventListener("change", settle);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const items = surface.querySelectorAll(`.${styles.links} > li`);
      menuMotion.current = gsap.timeline({ onReverseComplete: () => setOpen(false) })
        .fromTo(surface, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: .4, ease: "power3.inOut" }, 0)
        .fromTo(items, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .28, stagger: .035, ease: "power3.out" }, .12);
    });
    return () => { preference.removeEventListener("change", settle); media.revert(); menuMotion.current = null; };
  }, { scope: root, dependencies: [open], revertOnUpdate: true });
  function closeAnimated() { contextSafe(() => {
    closing.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setOpen(false); return; }
    if (menuMotion.current) menuMotion.current.timeScale(1.35).reverse(); else setOpen(false);
  })(); }
  return <div ref={root} className={styles.root}>
    <button ref={trigger} data-mobile-menu-trigger className={styles.trigger} type="button" aria-label="Открыть меню" aria-expanded={open} aria-controls={id} onMouseDown={event => { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); }} onClick={() => setOpen(true)}><span /><span /><span /></button>
    <dialog ref={dialog} id={id} className={styles.dialog} aria-label="Меню сайта" onCancel={event => { event.preventDefault(); closeAnimated(); }} onClose={() => { if (dialog.current?.open) return; setOpen(false); trigger.current?.focus({ preventScroll: true }); }} onClick={event => { if (event.target === event.currentTarget) closeAnimated(); }}>
      <div className={styles.panel}>
        <div className={styles.heading}><Link href={brand.href} aria-label={brand.label} onClick={() => setOpen(false)}><BrandLogo /></Link><button type="button" aria-label="Закрыть меню" onClick={closeAnimated}>×</button></div>
        <nav aria-label="Мобильная навигация"><MenuLinks navigation={navigation} onNavigate={() => setOpen(false)} /></nav>
        {showAuth ? <Button className={styles.login} onClick={() => { setOpen(false); onAuth(); }}>Войти в кабинет</Button> : account ? <ButtonLink href={account.href} onClick={() => setOpen(false)} className={styles.login}>{account.label}</ButtonLink> : null}
      </div>
    </dialog>
    <noscript><details className={styles.fallback}><summary>Меню</summary><nav aria-label="Мобильная навигация"><MenuLinks navigation={navigation} /></nav></details><style>{`[data-mobile-menu-trigger]{display:none!important}`}</style></noscript>
  </div>;
}
