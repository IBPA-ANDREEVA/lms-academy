"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./filter-dropdown.module.css";

export type FilterOption = { value: string; label: string };

type FilterDropdownProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

export function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  function focusOption(index: number) {
    list.current?.querySelectorAll<HTMLButtonElement>('button[role="option"]')[index]?.focus();
  }

  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div
      ref={root}
      className={styles.root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <span className={styles.label} id={`${id}-label`}>{label}</span>
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          setOpen(true);
          requestAnimationFrame(() => focusOption(Math.max(0, options.findIndex((option) => option.value === value))));
        }}
      >
        <span id={`${id}-value`}>{selected.label}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className={styles.list}
          onKeyDown={(event) => {
            const current = Array.from(list.current?.querySelectorAll('button[role="option"]') ?? [])
              .indexOf(document.activeElement as HTMLButtonElement);
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              trigger.current?.focus();
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              focusOption((current + 1) % options.length);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              focusOption((current - 1 + options.length) % options.length);
            } else if (event.key === "Home") {
              event.preventDefault();
              focusOption(0);
            } else if (event.key === "End") {
              event.preventDefault();
              focusOption(options.length - 1);
            }
          }}
        >
          {options.map((option, index) => (
            <li key={option.value}>
              <button type="button" role="option" aria-selected={option.value === value} onClick={() => choose(index)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
