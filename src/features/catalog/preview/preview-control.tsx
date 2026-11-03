"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/commerce/cart-provider";
import { useCatalog } from "../catalog-provider";
import styles from "./preview-control.module.css";

export function PreviewControl() {
  const catalog = useCatalog();
  const cart = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!open) return;
    heading.current?.focus();
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); trigger.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", dismiss); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  useEffect(() => { queueMicrotask(() => setOpen(false)); }, [pathname]);
  if (!catalog.enabled) return null;
  const available = catalog.products.filter(p => p.publication === "published" && p.approval === "approved" && p.sale === "open");
  const course = available.find(p => p.kind === "course");
  const mini = available.find(p => p.kind === "mini-course");
  return <div ref={root} className={styles.root} data-preview-control>
    <Button ref={trigger} intent="secondary" size="sm" aria-expanded={open} aria-controls="catalog-preview-panel" aria-label="Тестовое меню" onClick={() => setOpen(value => !value)}>
      <Image src="/icons/line/code.svg" width={20} height={20} alt="" />
    </Button>
    {open && <section id="catalog-preview-panel" aria-labelledby="catalog-preview-title" className={styles.panel}>
      <div className={styles.heading}><h2 ref={heading} tabIndex={-1} id="catalog-preview-title">Тестовое меню</h2><Button intent="secondary" size="sm" aria-label="Закрыть тестовое меню" onClick={() => { setOpen(false); trigger.current?.focus(); }}>×</Button></div>
      <p>Данные только в этом браузере. Оплата и зачисление отключены.</p>
      {catalog.warning && <p role="alert">Не удалось прочитать или сохранить данные браузера. Изменения доступны в этой вкладке. Можно сбросить примеры.</p>}
      <p role="status">Продуктов: {catalog.products.length} · Опубликованных примеров: {catalog.products.filter(p => p.publication === "published").length} · В корзине: {cart.items.length}</p>
      {catalog.products.length >= 200 && <p>Достигнут предел: 200 примеров. Очистите или сбросьте каталог.</p>}
      <h3>Каталог</h3><div className={styles.actions}>
        <Button intent="secondary" size="sm" disabled={catalog.products.length >= 200} onClick={() => catalog.add("course")}>Добавить демо-курс</Button>
        <Button intent="secondary" size="sm" disabled={catalog.products.length >= 200} onClick={() => catalog.add("mini-course")}>Добавить демо-мини-курс</Button>
        <Button intent="secondary" size="sm" disabled={catalog.products.length >= 200} onClick={() => catalog.add("course", 3)}>Добавить 3 курса</Button>
        <Button intent="secondary" size="sm" onClick={() => { catalog.clear(); cart.clear(); }}>Очистить каталог</Button>
        <Button intent="secondary" size="sm" onClick={catalog.reset}>Сбросить каталог</Button>
        <Button intent="secondary" size="sm" onClick={() => catalog.simulate("unavailable")}>Показать ошибку каталога</Button>
        <Button intent="secondary" size="sm" onClick={() => catalog.simulate("loading")}>Показать загрузку</Button>
        <Button intent="secondary" size="sm" onClick={() => catalog.simulate("success")}>Вернуть каталог</Button>
      </div>
      <h3>Корзина</h3><div className={styles.actions}>
        <Button intent="secondary" size="sm" disabled={!course || cart.loading} onClick={() => course && cart.addDemo(course.id)}>Курс в корзину</Button>
        <Button intent="secondary" size="sm" disabled={!mini || cart.loading} onClick={() => mini && cart.addDemo(mini.id)}>Мини-курс в корзину</Button>
        <Button intent="secondary" size="sm" disabled={!available.length || cart.loading} onClick={() => cart.addMany(available.map(p => p.id))}>Несколько товаров в корзину</Button>
        <Button intent="secondary" size="sm" onClick={cart.clear}>Очистить корзину / пустое состояние</Button>
      </div>
      {!available.length && <p>Сначала добавьте опубликованный демо-продукт или сбросьте каталог.</p>}
      {cart.items.length > 0 && <ul className={styles.items}>{cart.items.map(item => <li key={item.id}><span>{item.title}</span><Button intent="secondary" size="sm" onClick={() => cart.remove(item.id)} aria-label={`Убрать из тестовой корзины: ${item.title}`}>Убрать</Button></li>)}</ul>}
      <Button size="sm" onClick={() => { catalog.reset(); cart.clear(); }}>Сбросить все демо-данные</Button>
    </section>}
  </div>;
}
