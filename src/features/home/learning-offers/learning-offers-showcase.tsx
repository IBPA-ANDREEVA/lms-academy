"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { publicMotion as motion } from "@/features/public-shell/motion-tokens";
import styles from "./learning-offers-showcase.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const subscribe = () => () => {};
const sections = [
  { id: "courses", anchor: "catalog-status", label: "Основные курсы" },
  { id: "packages", anchor: "packages", label: "Пакеты", preview: true },
  { id: "mini-courses", anchor: "mini-courses", label: "Мини-курсы" },
  { id: "start-usa", anchor: "start-usa", label: "Старт в США", preview: true },
] as const;

export function LearningOffersShowcase({ panels }: { panels: [ReactNode, ReactNode, ReactNode, ReactNode] }) {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const [activeIndex, setActiveIndex] = useState(0);
  const groupRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0);
  const startHeight = useRef<number | null>(null);
  const direction = useRef(1);
  const fromIndex = useRef<number | null>(null);
  const startColor = useRef<string | null>(null);
  const pendingAnchor = useRef<string | null>(null);

  function goTo(index: number) {
    if (index === activeRef.current) return;
    fromIndex.current = activeRef.current;
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
    if (!enhanced || !track || !panel || !group || !contextSafe) return;
    const oldPanel = fromIndex.current === null ? null : track.children.item(fromIndex.current) as HTMLElement | null;
    const media = gsap.matchMedia();
    let refreshFrame = 0;
    media.add({ reduce: "(prefers-reduced-motion: reduce)", animate: "(prefers-reduced-motion: no-preference)" }, (context) => {
      const mobile = matchMedia("(max-width: 760px)").matches;
      const reduce = context.conditions?.reduce;
      const colors = getComputedStyle(group);
      const backgroundColor = colors.getPropertyValue(activeIndex === 0 ? "--brand" : "--background").trim();
      let timeline: gsap.core.Timeline | undefined;
      let heightTween: gsap.core.Tween | undefined;
      let lastHeight = panel.offsetHeight;
      const settle = () => {
        timeline?.kill();
        heightTween?.kill();
        for (const target of [panel, oldPanel]) {
          if (!target) continue;
          for (const property of ["opacity", "transform", "visibility", "will-change"]) target.style.removeProperty(property);
        }
        track.style.removeProperty("height");
        group.style.backgroundColor = backgroundColor;
        delete track.dataset.transitioning;
        if (activeRef.current === activeIndex) {
          startHeight.current = null;
          fromIndex.current = null;
        }
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      if (oldPanel && oldPanel !== panel && startHeight.current !== null && !reduce && !pendingAnchor.current) {
        track.dataset.transitioning = "true";
        const sign = direction.current;
        const shrink = mobile ? .98 : .96;
        const slide = mobile ? .22 : motion.switchSlide;
        const total = motion.switchShrink + slide + motion.switchExpand;
        gsap.set(oldPanel, { visibility: "visible", xPercent: 0, x: 0, scale: 1 });
        gsap.set(panel, { xPercent: sign * 100, x: sign * 20, scale: shrink });
        timeline = gsap.timeline({ defaults: { ease: motion.transitionEase }, onComplete: settle });
        timeline.to(oldPanel, { scale: shrink, duration: motion.switchShrink }, 0)
          .to(oldPanel, { xPercent: -sign * 100, x: -sign * 20, duration: slide }, motion.switchShrink)
          .to(panel, { xPercent: 0, x: 0, duration: slide }, motion.switchShrink)
          .to(panel, { scale: 1, duration: motion.switchExpand, ease: motion.ease })
          .fromTo(track, { height: startHeight.current }, { height: lastHeight, duration: total }, 0)
          .fromTo(group, { backgroundColor: startColor.current ?? backgroundColor }, { backgroundColor, duration: total }, 0);
      } else settle();
      const resize = contextSafe(() => {
        const height = panel.offsetHeight;
        if (height === lastHeight) return;
        const from = track.style.height ? track.getBoundingClientRect().height : lastHeight;
        lastHeight = height;
        // Content changes during a switch invalidate its geometry immediately.
        if (track.dataset.transitioning) { settle(); return; }
        heightTween?.kill();
        heightTween = gsap.fromTo(track, { height: from }, {
          height, duration: reduce ? 0 : motion.mobilePanel, ease: motion.transitionEase,
          clearProps: "height", onComplete: () => ScrollTrigger.refresh(),
        });
      });
      const observer = new ResizeObserver(resize);
      observer.observe(panel);
      window.addEventListener("resize", settle);
      panel.addEventListener("focusin", settle);
      return () => { observer.disconnect(); window.removeEventListener("resize", settle); panel.removeEventListener("focusin", settle); settle(); };
    });
    if (pendingAnchor.current) {
      const target = document.getElementById(pendingAnchor.current);
      target?.scrollIntoView({ block: "start", behavior: "instant" });
      pendingAnchor.current = null;
    }
    const tab = tabsRef.current[activeIndex];
    const list = tab?.parentElement;
    if (tab && list) list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - (list.clientWidth - tab.clientWidth) / 2, behavior: "instant" });
    return () => {
      media.revert();
      cancelAnimationFrame(refreshFrame);
      delete track.dataset.transitioning;
    };
  }, { scope: groupRef, dependencies: [activeIndex, enhanced], revertOnUpdate: true });

  useEffect(() => {
    const group = groupRef.current;
    const header = document.querySelector("header");
    if (!group || !header) return;
    const updateDock = () => {
      const nav = group.querySelector('[role="tablist"]');
      const docked = Boolean(nav && group.getBoundingClientRect().top <= header.getBoundingClientRect().bottom + 24 && group.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom + 56);
      header.dataset.offersDocked = String(docked);
      const bar = header.querySelector(':scope > div > div');
      const gap = nav && bar ? Math.max(0, nav.getBoundingClientRect().top - bar.getBoundingClientRect().bottom) : 0;
      header.style.setProperty("--offers-bridge-height", `${Math.min(24, gap)}px`);
    };
    window.addEventListener("scroll", updateDock, { passive: true });
    window.addEventListener("resize", updateDock);
    updateDock();
    const resize = new ResizeObserver(() => { group.style.setProperty("--public-header-offset", `${header.getBoundingClientRect().height}px`); updateDock(); });
    resize.observe(header);
    resize.observe(group);
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
      window.removeEventListener("scroll", updateDock);
      window.removeEventListener("resize", updateDock);
      delete header.dataset.offersDocked;
      header.style.removeProperty("--offers-bridge-height");
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
    tabsRef.current[next]?.focus({ preventScroll: true });
    goTo(next);
  }

  return <div className={styles.group} ref={groupRef} id="learning-offers" data-learning-offers data-enhanced={enhanced} data-active-offer={sections[activeIndex].id} data-flow-section>
    <div className={styles.topGeometry} aria-hidden="true" data-offers-geometry="top" />
    <div className={styles.bottomGeometry} aria-hidden="true" data-offers-geometry="bottom" />
    <div className={styles.switcher} role="tablist" aria-label="Форматы обучения">
      {sections.map((section, index) => <button key={section.id} ref={(node) => { tabsRef.current[index] = node; }} type="button" role="tab" id={`offer-tab-${section.id}`} aria-controls={`offer-panel-${section.id}`} aria-selected={index === activeIndex} tabIndex={index === activeIndex ? 0 : -1} onMouseDown={event => { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); }} onClick={() => goTo(index)} onKeyDown={(event) => onTabKey(event, index)}>
        <span>{section.label}</span>
      </button>)}
    </div>
    <div ref={trackRef} className={styles.track} data-offers-track>
      {sections.map((section, index) => <div className={styles.panel} key={section.id} id={`offer-panel-${section.id}`} role="tabpanel" aria-labelledby={`offer-tab-${section.id}`} aria-hidden={enhanced && index !== activeIndex} inert={enhanced && index !== activeIndex} tabIndex={0}>
        {panels[index]}
      </div>)}
    </div>
  </div>;
}
