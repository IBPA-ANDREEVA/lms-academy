"use client";
import { useLayoutEffect } from "react";

/** Native dialog owns focus; this lock additionally prevents background scrolling. */
export function useScrollLock(open: boolean) {
  useLayoutEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: "fixed", top: `-${y}px`, width: "100%", overflow: "hidden" });
    return () => { Object.assign(body.style, previous); window.scrollTo({ top: y, behavior: "instant" }); };
  }, [open]);
}
