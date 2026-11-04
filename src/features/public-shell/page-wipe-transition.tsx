"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { publicMotion as motion } from "./motion-tokens";
import styles from "./public-motion.module.css";
import { motionReadyEvent, releaseMotionCover, navigationStartEvent, navigationEndEvent } from "./motion-handoff";

gsap.registerPlugin(useGSAP);
const publicPage = (path: string) => /^\/(?:$|(?:mini-)?courses(?:\/[^/]+)?$)/.test(path);
const historyKey = "lmsMotionIndex";

type Navigation = { href: string; path: string; hash: string; direction: number; submitted: boolean; history: boolean; focus: Element | null; positioned?: boolean; anchorRequested?: boolean; instant?: boolean; vertical?: boolean };

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
    const endNavigation = () => window.dispatchEvent(new Event(navigationEndEvent));
    const hideCover = () => {
      if (cover.matches(":popover-open")) cover.hidePopover();
      cover.hidden = true;
    };
    const finish = (notify = true) => {
      clearTimeout(timeout); clearTimeout(waiting); cancelAnimationFrame(frame);
      timeline?.kill(); clearTargets();
      if (navigation && notify) endNavigation();
      hideCover();
      cover.removeAttribute("style");
      delete cover.dataset.waiting;
      delete cover.dataset.direction;
      delete cover.dataset.axis;
      delete page.dataset.routeMotion;
      navigation = null; revealed = false;
      onActive(false);
    };
    const visibleContent = () => Array.from(page.querySelectorAll<HTMLElement>("main h1, main h2"))
      .filter(element => {
        const box = element.getBoundingClientRect();
        return box.height > 0 && box.bottom > 0 && box.top < innerHeight
          && !element.closest('[data-learning-offers],[data-sticky-story],[data-home-entrances],[data-motion-reveal]');
      });
    const focusDestination = (request: Navigation) => {
      const focused = document.activeElement;
      const restoredMenuTrigger = request.focus?.closest("dialog") && focused?.hasAttribute("data-mobile-menu-trigger");
      if (focused === document.body || focused === request.focus || !focused?.isConnected || restoredMenuTrigger) {
        const main = (request.hash ? document.getElementById(decodeURIComponent(request.hash.slice(1))) : null) ?? Array.from(page.querySelectorAll<HTMLElement>('main:not([data-route-loading])'))
          .find(element => element.getClientRects().length > 0);
        if (main && !main.hasAttribute("tabindex")) main.tabIndex = -1;
        main?.focus({ preventScroll: true });
      }
    };
    const reveal = contextSafe(() => {
      const request = navigation;
      if (!request || !request.submitted || revealed || committedPath !== request.path) return;
      if (Array.from(page.querySelectorAll<HTMLElement>("[data-route-loading]")).some(element => element.getClientRects().length > 0)) return;
      const home = Array.from(page.querySelectorAll<HTMLElement>("[data-home-entrances]")).find(element => element.getClientRects().length > 0);
      if (home && home.dataset.homeMotionReady !== "true") return;
      if (request.hash && !request.positioned) {
        if (!request.anchorRequested) {
          request.anchorRequested = true;
          window.dispatchEvent(new Event("public-anchor"));
        }
        const destination = document.getElementById(decodeURIComponent(request.hash.slice(1)));
        // Next may retain the previous route in a hidden Activity tree. A
        // matching id is not ready until its actual layout has been restored.
        if (destination && (!destination.getClientRects().length || destination.getBoundingClientRect().height === 0 || destination.closest('[inert],[aria-hidden="true"]'))) {
          frame = requestAnimationFrame(reveal);
          return;
        }
        destination?.scrollIntoView({ block: "start", behavior: "instant" });
        request.positioned = true;
      }
      if (!request.hash && !request.history && !request.positioned) {
        window.scrollTo({ top: 0, behavior: "instant" });
        request.positioned = true;
      }
      revealed = true;
      clearTimeout(timeout); clearTimeout(waiting);
      delete cover.dataset.waiting;
      timeline?.kill(); clearTargets();
      releaseMotionCover(cover);
      if (preference.matches || request.instant) { finish(); focusDestination(request); return; }
      targets = visibleContent();
      timeline = gsap.timeline({ defaults: { duration: motion.wipeReveal, ease: motion.ease }, onComplete: () => { finish(); focusDestination(request); } })
        .to(cover, request.vertical ? { yPercent: 100 } : { xPercent: -100 * request.direction }, 0);
      if (targets.length) timeline.fromTo(targets, request.vertical ? { y: -12 } : { x: request.direction * motion.wipePush }, { x: 0, y: 0, clearProps: "transform" }, 0);
    });
    const submit = (request: Navigation) => {
      if (navigation !== request || request.submitted) return;
      request.submitted = true;
      if (request.path === location.pathname && request.hash) {
        history.pushState({ ...history.state, [historyKey]: ++index }, "", request.href);
        reveal();
      } else router.push(request.href, { scroll: !request.hash });
    };
    const begin = contextSafe((request: Navigation) => {
      finish(false); navigation = request;
      window.dispatchEvent(new CustomEvent(navigationStartEvent, { detail: request.focus?.closest("dialog") }));
      // Freeze the axis for this navigation so a resize cannot turn a wipe diagonal.
      request.vertical = matchMedia("(max-width: 760px)").matches;
      onActive(true);
      page.dataset.routeMotion = "wipe";
      cover.hidden = false;
      // The existing curtain must share the native menu's top layer.
      // It stays above the dialog until the destination is fully revealed.
      cover.showPopover?.();
      cover.dataset.motionPhase = "covering";
      cover.dataset.direction = request.direction === 1 ? "forward" : "back";
      cover.dataset.axis = request.vertical ? "vertical" : "horizontal";
      // Prefetch runs alongside the outgoing animation, using Next's own cache.
      // Commit is requested at the covered frame; no invented loading dwell.
      if (!request.history) router.prefetch(request.href);
      waiting = setTimeout(() => { if (navigation === request) cover.dataset.waiting = "true"; }, 700);
      timeout = setTimeout(() => {
        if (navigation !== request) return;
        console.warn({ event: "public_motion_timeout", phase: "navigation", path: request.path });
        request.instant = true;
        submit(request);
        reveal();
        // Leave mounted content usable while Next resolves a slow destination.
        // Keep the request until commit so hash positioning cannot be discarded.
        endNavigation();
        hideCover();
        releaseMotionCover(cover);
        timeline?.kill(); clearTargets();
        delete page.dataset.routeMotion;
      }, 5000);
      if (request.history) {
        // popstate cannot be delayed. Cover synchronously and mirror the reveal;
        // Next retains complete ownership of scroll restoration and history.
        gsap.set(cover, { xPercent: 0, yPercent: 0 });
        frame = requestAnimationFrame(reveal);
      } else {
        targets = visibleContent();
        timeline = gsap.timeline({ defaults: { duration: motion.wipeCover, ease: motion.transitionEase }, onComplete: () => submit(request) })
          .fromTo(cover, { xPercent: request.vertical ? 0 : 100 * request.direction, yPercent: request.vertical ? -100 : 0 }, { xPercent: 0, yPercent: 0 }, 0);
        if (targets.length) timeline.to(targets, request.vertical ? { y: 12 } : { x: -request.direction * motion.wipePush }, 0);
      }
    });
    const click = contextSafe((event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href);
      const excluded = url.origin !== location.origin || !publicPage(location.pathname) || !publicPage(url.pathname)
        || (url.pathname === location.pathname && !url.hash) || url.hash === "#main-content" || anchor.closest('[data-motion="none"]');
      if (excluded || preference.matches) { if (navigation) finish(); return; }
      event.preventDefault();
      begin({ href: url.pathname + url.search + url.hash, path: url.pathname, hash: url.hash, direction: 1, submitted: false, history: false, focus: anchor });
    });
    const pop = contextSafe((event: PopStateEvent) => {
      const nextIndex = Number(event.state?.[historyKey] ?? index - 1);
      const direction = nextIndex < index ? -1 : 1;
      index = nextIndex;
      if (!publicPage(committedPath) || !publicPage(location.pathname) || preference.matches) { finish(); return; }
      begin({ href: location.pathname + location.search + location.hash, path: location.pathname, hash: location.hash, direction, submitted: true, history: true, focus: document.activeElement });
    });
    const interrupt = () => {
      const request = navigation;
      if (!request) return;
      request.instant = true;
      timeline?.kill(); clearTargets();
      endNavigation();
      hideCover();
      releaseMotionCover(cover);
      submit(request);
      reveal();
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
    // Window capture precedes feature-local document handlers, so hash links
    // have one transition owner even when a mounted feature handles anchors.
    window.addEventListener("click", click, true);
    window.addEventListener("popstate", pop);
    window.addEventListener(motionReadyEvent, reveal);
    preference.addEventListener("change", interrupt);
    window.addEventListener("pagehide", interrupt);
    window.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      controls.current = null; finish();
      window.removeEventListener("click", click, true);
      window.removeEventListener("popstate", pop);
      window.removeEventListener(motionReadyEvent, reveal);
      preference.removeEventListener("change", interrupt);
      window.removeEventListener("pagehide", interrupt);
      window.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, { scope: panel });
  // Invoke the persistent context from a plain layout effect. Nesting its
  // contextSafe callback in another useGSAP context would make that context
  // revert the entire navigation controller on every pathname update.
  useLayoutEffect(() => { controls.current?.committed(pathname); }, [pathname, loading]);
  return <div ref={panel} popover="manual" hidden className={styles.wipe} data-page-wipe aria-hidden="true"><span>Загружаем страницу…</span></div>;
}
