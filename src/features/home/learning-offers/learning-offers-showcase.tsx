"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./learning-offers-showcase.module.css";

gsap.registerPlugin(useGSAP);

const sections = [
  { id: "courses", anchor: "catalog-status", label: "Основные курсы" },
  { id: "packages", anchor: "packages", label: "Пакеты", preview: true },
  { id: "mini-courses", anchor: "mini-courses", label: "Мини-курсы" },
  { id: "start-usa", anchor: "start-usa", label: "Старт в США", preview: true },
] as const;

export function LearningOffersShowcase({ panels }: { panels: [ReactNode, ReactNode, ReactNode, ReactNode] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const groupRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0);
  const startHeight = useRef<number | null>(null);
  const direction = useRef(1);
  const startColor = useRef<string | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const pendingAnchor = useRef<string | null>(null);

  function goTo(index: number) {
    if (index === activeRef.current) return;
    startHeight.current = trackRef.current?.getBoundingClientRect().height ?? null;
    direction.current = index > activeRef.current ? 1 : -1;
    startColor.current = groupRef.current ? getComputedStyle(groupRef.current).backgroundColor : null;
    // A link within the outgoing panel must not leave focus inside inert content.
    const oldPanel = trackRef.current?.children.item(activeRef.current);
    if (oldPanel?.contains(document.activeElement)) tabsRef.current[index]?.focus({ preventScroll: true });
    activeRef.current = index;
    setActiveIndex(index);
  }

  useGSAP((_, contextSafe) => {
    const track = trackRef.current;
    const panel = track?.children.item(activeIndex) as HTMLElement | null;
    const group = groupRef.current;
    if (!track || !panel || !group || !contextSafe) return;
    const media = gsap.matchMedia();
    media.add({ reduce: "(prefers-reduced-motion: reduce)", animate: "(prefers-reduced-motion: no-preference)" }, (context) => {
      const duration = context.conditions?.reduce ? 0 : .38;
      let lastHeight = panel.offsetHeight;
      const resize = contextSafe(() => {
        const height = panel.offsetHeight;
        if (height === lastHeight) return;
        const from = track.style.height ? track.getBoundingClientRect().height : lastHeight;
        lastHeight = height;
        gsap.fromTo(track, { height: from }, { height, duration, ease: "power2.inOut", overwrite: true, clearProps: "height" });
      });
      track.dataset.transitioning = "true";
      const timeline = gsap.timeline({
        defaults: { duration, ease: "power2.inOut" },
        onComplete: () => { delete track.dataset.transitioning; },
      });
      if (startHeight.current !== null) {
        timeline.fromTo(track, { height: startHeight.current }, { height: lastHeight, clearProps: "height" }, 0);
        timeline.fromTo(panel, { opacity: duration ? 0 : 1, x: duration ? direction.current * 18 : 0 }, { opacity: 1, x: 0, clearProps: "opacity,transform" }, 0);
      }
      const colors = getComputedStyle(group);
      const backgroundColor = colors.getPropertyValue(activeIndex === 0 ? "--brand" : "--background").trim();
      timeline.fromTo(group, { backgroundColor: startColor.current ?? backgroundColor }, { backgroundColor }, 0);
      const observer = new ResizeObserver(resize);
      observer.observe(panel);
      return () => observer.disconnect();
    });
    if (pendingAnchor.current) {
      const target = document.getElementById(pendingAnchor.current);
      target?.scrollIntoView({ block: "start", behavior: "instant" });
      pendingAnchor.current = null;
    } else {
      // Switching a tall panel near its bottom keeps the sticky switcher reachable.
      const nav = tabsRef.current[activeIndex]?.parentElement;
      if (nav && track.getBoundingClientRect().bottom < nav.getBoundingClientRect().bottom) {
        group.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
    const tab = tabsRef.current[activeIndex];
    const list = tab?.parentElement;
    if (tab && list) list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - (list.clientWidth - tab.clientWidth) / 2, behavior: "instant" });
    return () => {
      media.revert();
      delete track.dataset.transitioning;
    };
  }, { scope: groupRef, dependencies: [activeIndex], revertOnUpdate: true });

  useEffect(() => {
    const group = groupRef.current;
    const header = document.querySelector("header");
    if (!group || !header) return;
    const resize = new ResizeObserver(() => group.style.setProperty("--public-header-offset", `${header.getBoundingClientRect().height}px`));
    resize.observe(header);
    const onHash = () => {
      const hash = location.hash.slice(1);
      const index = hash === "usa-topics" ? 3 : sections.findIndex((section) => section.anchor === hash);
      if (index < 0) return;
      if (index !== activeRef.current) {
        pendingAnchor.current = hash;
        goTo(index);
      } else document.getElementById(hash)?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    // Next Link uses history.pushState for same-page hashes, which does not
    // emit hashchange. Select the destination before trying to reveal it.
    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      if (!sections.some((section) => `#${section.anchor}` === url.hash) && url.hash !== "#usa-topics") return;
      event.preventDefault();
      if (location.hash !== url.hash) window.history.pushState(null, "", url.hash);
      onHash();
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    document.addEventListener("click", onAnchor, true);
    const initialHash = requestAnimationFrame(onHash);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(initialHash);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
      document.removeEventListener("click", onAnchor, true);
    };
  }, []);

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % sections.length : event.key === "ArrowLeft" ? (index + sections.length - 1) % sections.length : event.key === "Home" ? 0 : event.key === "End" ? sections.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    tabsRef.current[next]?.focus();
    goTo(next);
  }

  return <div className={styles.group} ref={groupRef} id="learning-offers" data-learning-offers data-active-offer={sections[activeIndex].id} data-flow-section>
    <div className={styles.topGeometry} aria-hidden="true" data-offers-geometry="top" />
    <div className={styles.bottomGeometry} aria-hidden="true" data-offers-geometry="bottom" />
    <div className={styles.switcher} role="tablist" aria-label="Форматы обучения">
      {sections.map((section, index) => <button key={section.id} ref={(node) => { tabsRef.current[index] = node; }} type="button" role="tab" id={`offer-tab-${section.id}`} aria-controls={`offer-panel-${section.id}`} aria-selected={index === activeIndex} tabIndex={index === activeIndex ? 0 : -1} onClick={() => goTo(index)} onKeyDown={(event) => onTabKey(event, index)}>
        <span>{section.label}</span>{"preview" in section && <small>ПРЕВЬЮ</small>}
      </button>)}
    </div>
    <div ref={trackRef} className={styles.track} data-offers-track
      onTouchStart={(event) => {
        const target = event.target as HTMLElement;
        const touch = event.touches[0];
        touchStart.current = touch && !target.closest('button, a, input, textarea, select, nav, [data-offer-carousel]') ? { x: touch.clientX, y: touch.clientY } : null;
      }}
      onTouchCancel={() => { touchStart.current = null; }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const touch = event.changedTouches[0];
        touchStart.current = null;
        if (!start || !touch) return;
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 2) goTo(Math.max(0, Math.min(sections.length - 1, activeRef.current + (dx < 0 ? 1 : -1))));
      }}
    >
      {sections.map((section, index) => <div className={styles.panel} key={section.id} id={`offer-panel-${section.id}`} role="tabpanel" aria-labelledby={`offer-tab-${section.id}`} aria-hidden={index !== activeIndex} inert={index !== activeIndex} tabIndex={0}>
        {panels[index]}
      </div>)}
    </div>
  </div>;
}
