"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form-controls";
import { packageSizes, previewChoices, type PackageSize } from "../package-preview-data";
import styles from "./package-builder.module.css";

export function PackageBuilder({ initialSize, onClose }: { initialSize: PackageSize; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [size, setSize] = useState<PackageSize>(initialSize);
  const [selected, setSelected] = useState<string[]>([]);
  const [review, setReview] = useState(false);
  const summaryRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      trigger?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => { if (review) summaryRef.current?.focus(); }, [review]);

  return <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="package-builder-title" aria-describedby="package-builder-note" onClose={(event) => {
    // Strict Mode reopens the dialog after its cleanup. Ignore the stale close.
    if (!event.currentTarget.open) onClose();
  }}>
    <div className={styles.header}><h2 id="package-builder-title">Собрать свой пакет</h2><Button intent="secondary" size="sm" onClick={() => dialogRef.current?.close()} aria-label="Закрыть конструктор">×</Button></div>
    <p id="package-builder-note" className={styles.note}>Демонстрация выбора. Здесь показаны макеты курсов; пакеты пока недоступны. Выбор не сохраняется и не отправляется.</p>
    {!review ? <>
      <fieldset className={styles.sizes}><legend>Размер примера</legend>{packageSizes.map((value) => <label key={value}><input type="radio" name="package-size" checked={size === value} onChange={() => setSize(value)} />{value} {value === 6 ? "направлений" : "направления"}</label>)}</fieldset>
      <p className={styles.count} role="status">Выбрано {selected.length} из {size}{selected.length > size ? ". Уберите лишние направления." : ""}</p>
      <fieldset className={styles.choices}><legend>Выберите макеты курсов по направлениям</legend>{previewChoices.map((choice) => <div key={choice.id}><Checkbox label={<><strong>{choice.direction}</strong><small>Название курса появится после публикации</small></>} checked={selected.includes(choice.id)} disabled={!selected.includes(choice.id) && selected.length >= size} onChange={(event) => setSelected(event.target.checked ? [...selected, choice.id] : selected.filter((id) => id !== choice.id))} /></div>)}</fieldset>
      <p className={styles.module}>+ Модуль «Старт в США» · без куратора</p>
      <Button appearance="neoBrutalist" fullWidth disabled={selected.length !== size} onClick={() => setReview(true)}>ПОСМОТРЕТЬ СОСТАВ <span aria-hidden="true">→</span></Button>
    </> : <div className={styles.summary}>
      <h3 ref={summaryRef} tabIndex={-1}>Ваш пример пакета</h3>
      <ul>{selected.map((id) => <li key={id}>{previewChoices.find((choice) => choice.id === id)?.direction}<small>Макет курса</small></li>)}<li>Старт в США<small>Один модуль · без куратора</small></li></ul>
      <p>Это предварительный выбор. Доступные сочетания курсов и цена появятся после утверждения пакетов.</p>
      <Button appearance="neoBrutalist" intent="secondary" onClick={() => setReview(false)}>ИЗМЕНИТЬ ВЫБОР</Button>
    </div>}
  </dialog>;
}
