"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Shared by the home course, package and mini-course carousels. No offer rules. */
export function useSnapCarousel(itemCount = 0) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const requestedIndex = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncIndex = useCallback(function syncIndex() {
    if (requestedIndex.current !== null) {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => { requestedIndex.current = null; syncIndex(); }, 180);
      return;
    }
    const track = trackRef.current;
    if (!track || track.scrollWidth <= track.clientWidth + 1) return;
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    let closest = 0;
    let distance = Infinity;
    Array.from(track.children).forEach((child, index) => {
      const box = child.getBoundingClientRect();
      const nextDistance = Math.abs(box.left + box.width / 2 - center);
      if (nextDistance < distance) { distance = nextDistance; closest = index; }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const interrupt = () => { requestedIndex.current = null; };
    const settle = () => { requestedIndex.current = null; syncIndex(); };
    track.addEventListener("pointerdown", interrupt, { passive: true });
    track.addEventListener("wheel", interrupt, { passive: true });
    track.addEventListener("scrollend", settle);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (preference.matches) { track.scrollTo({ left: track.scrollLeft, behavior: "instant" }); settle(); } };
    preference.addEventListener("change", reduce);
    return () => {
      track.removeEventListener("pointerdown", interrupt);
      track.removeEventListener("wheel", interrupt);
      track.removeEventListener("scrollend", settle);
      preference.removeEventListener("change", reduce);
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, [syncIndex]);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setCanScroll(track.scrollWidth > track.clientWidth + 8);
    const observer = new ResizeObserver(update);
    observer.observe(track);
    Array.from(track.children).forEach((child) => observer.observe(child));
    update();
    return () => observer.disconnect();
  }, [itemCount]);

  function goTo(index: number) {
    const track = trackRef.current;
    const card = track?.children.item(index) as HTMLElement | null;
    if (!track || !card) return;
    const box = card.getBoundingClientRect();
    const left = track.scrollLeft + box.left - track.getBoundingClientRect().left - (track.clientWidth - box.width) / 2;
    requestedIndex.current = index;
    track.scrollTo({ left, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setActiveIndex(index);
  }


  function reset() {
    requestedIndex.current = null;
    if (settleTimer.current) clearTimeout(settleTimer.current);
    setActiveIndex(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "instant" });
  }

  return { trackRef, activeIndex, goTo, syncIndex, reset, canScroll };
}
