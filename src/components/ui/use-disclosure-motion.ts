"use client";

import { type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Enhance native details; callers retain markup, copy and open-state ownership. */
export function useDisclosureMotion(root: RefObject<HTMLElement | null>) {
  useGSAP((_, contextSafe) => {
    const scope = root.current;
    if (!scope || !contextSafe) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const states = new Map<HTMLDetailsElement, { open: boolean; content: HTMLElement; tween: gsap.core.Tween }>();
    const clear = (content: HTMLElement) => {
      for (const property of ["height", "opacity", "overflow"]) content.style.removeProperty(property);
      if (!content.getAttribute("style")) content.removeAttribute("style");
    };
    const settle = () => {
      for (const [details, state] of states) { state.tween.kill(); details.open = state.open; clear(state.content); }
      states.clear();
    };
    const click = contextSafe((event: MouseEvent) => {
      const summary = (event.target as Element).closest("summary");
      const details = summary?.parentElement;
      if (!(details instanceof HTMLDetailsElement) || !scope.contains(details)) return;
      const content = summary?.nextElementSibling;
      if (!(content instanceof HTMLElement)) return;
      if (preference.matches) { settle(); return; }
      event.preventDefault();
      const prior = states.get(details);
      const open = !(prior?.open ?? details.open);
      const height = details.open ? content.getBoundingClientRect().height : 0;
      prior?.tween.kill();
      if (!open && content.contains(document.activeElement)) summary?.focus({ preventScroll: true });
      details.open = true;
      content.style.height = "auto";
      const target = content.getBoundingClientRect().height;
      content.style.overflow = "clip";
      const tween = gsap.fromTo(content, { height, opacity: open ? .65 : 1 }, {
        height: open ? target : 0, opacity: open ? 1 : 0, duration: matchMedia("(max-width: 760px)").matches ? .26 : .32,
        ease: "power2.inOut", onComplete: () => { details.open = open; clear(content); states.delete(details); },
      });
      states.set(details, { open, content, tween });
    });
    scope.addEventListener("click", click);
    preference.addEventListener("change", settle);
    window.addEventListener("resize", settle);
    return () => { scope.removeEventListener("click", click); preference.removeEventListener("change", settle); window.removeEventListener("resize", settle); settle(); };
  }, { scope: root });
}
