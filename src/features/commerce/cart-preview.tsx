"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useCart } from "./cart-provider";
import { formatDemoAmount } from "./demo-cart";
import { CartItems } from "./components/cart-items";
import { CartFeedback } from "./components/cart-feedback";
import { DemoControls } from "./components/demo-controls";
import styles from "./commerce.module.css";

gsap.registerPlugin(useGSAP);

export function CartPreview({ triggerClassName, iconClassName, countClassName }: {
  triggerClassName?: string; iconClassName?: string; countClassName?: string;
}) {
  const cart = useCart();
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const motion = useRef<gsap.core.Tween | null>(null);
  const desiredOpen = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressFocus = useRef(false);
  const id = useId();
  const cancelClose = () => { if (timer.current) clearTimeout(timer.current); };
  const close = () => { cancelClose(); setOpenedAt(null); };
  useGSAP((_, contextSafe) => {
    if (!panel.current || !contextSafe) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tween = gsap.fromTo(panel.current, { autoAlpha: 0, y: -8 }, {
      autoAlpha: 1, y: 0, duration: .22, ease: "power2.out", paused: true,
    });
    motion.current = tween;
    const settle = contextSafe(() => { tween.progress(desiredOpen.current ? 1 : 0).pause(); });
    const onPreference = contextSafe(() => { if (preference.matches) settle(); });
    preference.addEventListener("change", onPreference);
    window.addEventListener("resize", settle);
    return () => {
      preference.removeEventListener("change", onPreference);
      window.removeEventListener("resize", settle);
      motion.current = null;
    };
  }, { scope: root });
  useGSAP(() => {
    desiredOpen.current = open;
    const tween = motion.current;
    if (!tween) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) tween.progress(open ? 1 : 0).pause();
    else if (open) tween.play();
    else tween.reverse();
  }, { scope: root, dependencies: [open], revertOnUpdate: true });
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpenedAt(null);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const blocked = cart.loading || cart.error || cart.scenario !== "ready";
  return <div ref={root} className={styles.previewRoot}
    onPointerEnter={event => { if (event.pointerType === "mouse") { cancelClose(); setOpenedAt(pathname); } }}
    onPointerLeave={event => {
      if (event.pointerType !== "mouse") return;
      cancelClose();
      timer.current = setTimeout(() => {
        const active = document.activeElement;
        if (active && active !== trigger.current && root.current?.contains(active)) return;
        setOpenedAt(null);
      }, 180);
    }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
    onKeyDown={event => {
      if (event.key === "Escape" && open) {
        event.preventDefault(); event.stopPropagation(); close();
        suppressFocus.current = true; trigger.current?.focus(); suppressFocus.current = false;
      }
    }}>
    <button ref={trigger} type="button" className={triggerClassName || styles.cartTrigger} aria-label={`Корзина, продуктов: ${cart.items.length}`} aria-expanded={open} aria-controls={id}
      onFocus={() => { if (!suppressFocus.current) { cancelClose(); setOpenedAt(pathname); } }}
      onClick={() => { cancelClose(); setOpenedAt(pathname); }}>
      <span className={iconClassName || styles.cartIcon} aria-hidden="true" />
      {cart.items.length > 0 && <span className={countClassName || styles.badge} aria-hidden="true">{cart.items.length}</span>}
    </button>
    <div ref={panel} id={id} className={styles.previewBridge} inert={!open} aria-hidden={!open}>
      <section className={styles.preview} aria-label="Предпросмотр корзины" data-cart-surface tabIndex={-1}>
        <div className={styles.previewHeading}><h2>В корзине</h2></div>
        <CartFeedback />
        {!cart.loading && !cart.error && (cart.items.length ? <>
          <CartItems compact />
          <div className={styles.previewTotal}><span>Демо-итог</span><strong>{cart.scenario === "recalculating" ? "Пересчёт…" : formatDemoAmount(cart.total)}</strong></div>
          {blocked ? <Button appearance="cut" fullWidth disabled>Перейти к оплате</Button> : <ButtonLink appearance="cut" fullWidth href="/checkout" onClick={close}>Перейти к оплате <span aria-hidden="true">→</span></ButtonLink>}
          <p className={styles.previewLink}><Link href="/cart" onClick={close}>Открыть корзину</Link></p>
        </> : <div className={styles.previewEmpty}><p>Ваша корзина пока пуста.</p><Link href="/courses" onClick={close}>Выбрать курс →</Link><p><Link href="/cart" onClick={close}>Открыть корзину</Link></p></div>)}
        <DemoControls compact />
      </section>
    </div>
  </div>;
}
