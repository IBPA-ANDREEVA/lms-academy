"use client";
import { useLayoutEffect } from "react";

/** Native dialog owns focus; this lock additionally prevents background scrolling. */
export function useScrollLock(open: boolean) {
  useLayoutEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const rootOverflow = root.style.overflow;
    const width = body.getBoundingClientRect().width;
    root.style.overflow = "hidden";
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: "fixed", top: `-${y}px`, width: `${width}px`, overflow: "hidden" });
    const resize = () => { body.style.width = `${root.getBoundingClientRect().width}px`; };
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); root.style.overflow = rootOverflow; Object.assign(body.style, previous); window.scrollTo({ top: y, behavior: "instant" }); };
  }, [open]);
}
