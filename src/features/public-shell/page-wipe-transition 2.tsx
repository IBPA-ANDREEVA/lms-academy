"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { publicMotion as motion } from "./motion-tokens";
import styles from "./public-motion.module.css";

gsap.registerPlugin(useGSAP);
const publicPage = (path: string) => /^\/(?:$|(?:mini-)?courses(?:\/[^/]+)?$)/.test(path);
const historyKey = "lmsMotionIndex";

type Navigation = { href: string; path: string; direction: number; submitted: boolean; history: boolean; focus: Element | null };

/** Presentation around Next's router. No content fetching, route cache, cloned
 * React trees, history patches, scroll locks, or replacement routing layer. */
export function PageWipeTransition({ content, pathname, loading, onActive }: {
  content: RefObject<HTMLDivElement | null>; pathname: string; loading: boolean; onActive: (active: boolean) => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const controls = useRef<{ committed: (path: string) => void } | null>(null);
  useGSAP((_, contextSafe) => {
    const cover = panel.current;
    const page = content.current;
    if (cover) cover.dataset.motionReady = String(Boolean(page && contextSafe));
    if (!cover || !page || !contextSafe) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let committedPath = pathname;
    let index = Number(history.state?.[historyKey] ?? 0);
    history.replaceState({ ...history.state, [historyKey]: index }, "");
    let navigation: Navigation | null = null;
    let timeline: gsap.core.Timeline | undefined;
    let targets: HTMLElement[] = [];
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let waiting: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let revealed = false;
    const clearTargets = () => {
      targets.forEach(target => target.style.removeProperty("transform"));
      targets = [];
    };
    const finish = () => {
      clearTimeout(timeout); clearTimeout(waiting); cancelAnimationFrame(frame);
      timeline?.kill(); clearTargets();
      cover.hidden = true;
      cover.removeAttribute("style");
      delete cover.dataset.waiting;
      delete cover.dataset.direction;
      delete page.dataset.routeMotion;
      navigation = null; revealed = false;
      onActive(false);
    };
    const visibleContent = () => Array.from(page.querySelectorAll<HTMLElement>("main section"))
      .filter(element => {
        const box = element.getBoundingClientRect();
        return box.height > 0 && box.bottom > 0 && box.top < innerHeight
          && !element.parentElement?.closest("section")
          && !element.closest('[data-learning-offers],[data-sticky-story]');
      });
    const focusDestination = (request: Navigation) => {
      const focused = document.activeElement;
      if (focused === document.body || focused === request.focus || !focused?.isConnected) {
        const main = Array.from(page.querySelectorAll<HTMLElement>('main:not([data-route-loading])'))
          .find(element => element.getClientRects().length > 0);
        if (main && !main.hasAttribute("tabindex")) main.tabIndex = -1;
        main?.focus({ preventScroll: true });
      }
    };
    const reveal = contextSafe(() => {
      const request = navigation;
      if (!request || !request.submitted || revealed || committedPath !== request.path) return;
      if (Array.from(page.querySelectorAll<HTMLElement>("[data-route-loading]")).some(element => element.getClientRects().length > 0)) return;
      revealed = true;
      clearTimeout(timeout); clearTimeout(waiting);
      delete cover.dataset.waiting;
      timeline?.kill(); clearTargets();
      if (preference.matches) { finish(); focusDestination(request); return; }
      targets = visibleContent();
      timeline = gsap.timeline({ defaults: { duration: motion.wipeReveal, ease: motion.ease }, onComplete: () => { finish(); focusDestination(request); } })
        .to(cover, { xPercent: -100 * request.direction }, 0);
      if (targets.length) timeline.fromTo(targets, { x: request.direction * (innerWidth < 761 ? 12 : motion.wipePush) }, { x: 0, clearProps: "transform" }, 0);
    });
    const submit = (request: Navigation) => {
      if (navigation !== request || request.submitted) return;
      request.submitted = true;
      router.push(request.href);
    };
    const begin = contextSafe((request: Navigation) => {
      finish(); navigation = request;
      onActive(true);
      page.dataset.routeMotion = "wipe";
      cover.hidden = false;
      cover.dataset.direction = request.direction === 1 ? "forward" : "back";
      // Prefetch runs alongside the outgoing animation, using Next's own cache.
      // Commit is requested at the covered frame; no invented loading dwell.
      if (!request.history) router.prefetch(request.href);
      waiting = setTimeout(() => { if (navigation === request) cover.dataset.waiting = "true"; }, 700);
      timeout = setTimeout(() => {
        if (navigation !== request) return;
        console.warn({ event: "public_motion_timeout", phase: "navigation", path: request.path });
        submit(request); finish(); // Return control to native loading/error recovery.
      }, 5000);
      if (request.history) {
        // popstate cannot be delayed. Cover synchronously and mirror the reveal;
        // Next retains complete ownership of scroll restoration and history.
        gsap.set(cover, { xPercent: 0 });
        frame = requestAnimationFrame(reveal);
      } else {
        targets = visibleContent();
        timeline = gsap.timeline({ defaults: { duration: motion.wipeCover, ease: motion.transitionEase }, onComplete: () => submit(request) })
          .fromTo(cover, { xPercent: 100 * request.direction }, { xPercent: 0 }, 0);
        if (targets.length) timeline.to(targets, { x: -request.direction * (innerWidth < 761 ? 12 : motion.wipePush) }, 0);
      }
    });
    const click = contextSafe((event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href);
      const excluded = url.origin !== location.origin || !publicPage(location.pathname) || !publicPage(url.pathname)
        || url.pathname === location.pathname || Boolean(url.hash) || anchor.closest('dialog,[data-motion="none"]');
      if (excluded || preference.matches) { if (navigation) finish(); return; }
      event.preventDefault();
      begin({ href: url.pathname + url.search, path: url.pathname, direction: 1, submitted: false, history: false, focus: anchor });
    });
    const pop = contextSafe((event: PopStateEvent) => {
      const nextIndex = Number(event.state?.[historyKey] ?? index - 1);
      const direction = nextIndex < index ? -1 : 1;
      index = nextIndex;
      if (!publicPage(committedPath) || !publicPage(location.pathname) || location.pathname === committedPath || location.hash || preference.matches) { finish(); return; }
      begin({ href: location.pathname + location.search, path: location.pathname, direction, submitted: true, history: true, focus: document.activeElement });
    });
    const interrupt = () => {
      if (navigation) submit(navigation);
      finish();
    };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") interrupt(); };
    const visibility = () => { if (document.hidden) interrupt(); };
    controls.current = { committed: contextSafe((path: string) => {
      if (committedPath !== path) {
        if (!navigation?.history) index += 1;
        history.replaceState({ ...history.state, [historyKey]: index }, "");
        committedPath = path;
        if (navigation && !publicPage(path)) { finish(); return; }
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reveal);
    }) };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", pop);
    preference.addEventListener("change", interrupt);
    window.addEventListener("resize", interrupt);
    window.addEventListener("pagehide", interrupt);
    window.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      controls.current = null; finish();
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", pop);
      preference.removeEventListener("change", interrupt);
      window.removeEventListener("resize", interrupt);
      window.removeEventListener("pagehide", interrupt);
      window.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, { scope: panel });
  // Invoke the persistent context from a plain layout effect. Nesting its
  // contextSafe callback in another useGSAP context would make that context
  // revert the entire navigation controller on every pathname update.
  useLayoutEffect(() => { controls.current?.committed(pathname); }, [pathname, loading]);
  return <div ref={panel} hidden className={styles.wipe} data-page-wipe aria-hidden="true"><span>Загружаем страницу…</span></div>;
}
