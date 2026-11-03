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
    const states = new Map<HTMLDetailsElement, { open: boolean; tween: gsap.core.Tween }>();
    const clear = (details: HTMLDetailsElement) => {
      for (const property of ["height", "overflow", "--disclosure-progress"]) details.style.removeProperty(property);
      if (!details.getAttribute("style")) details.removeAttribute("style");
    };
    const settle = () => {
      for (const [details, state] of states) { state.tween.kill(); details.open = state.open; clear(details); }
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
      const height = details.getBoundingClientRect().height;
      const currentProgress = Number.parseFloat(getComputedStyle(details).getPropertyValue("--disclosure-progress"));
      const progress = Number.isNaN(currentProgress) ? (details.open ? 1 : 0) : currentProgress;
      prior?.tween.kill();
      if (!open && content.contains(document.activeElement)) summary?.focus({ preventScroll: true });
      details.open = true;
      details.style.height = "auto";
      const computed = getComputedStyle(details);
      const frame = parseFloat(computed.borderTopWidth) + parseFloat(computed.borderBottomWidth) + parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
      const target = open ? details.getBoundingClientRect().height : summary!.getBoundingClientRect().height + frame;
      details.style.overflow = "clip";
      const tween = gsap.fromTo(details, { height, "--disclosure-progress": progress }, {
        height: target, "--disclosure-progress": open ? 1 : 0, duration: .4,
        ease: "power3.inOut", onComplete: () => { details.open = open; clear(details); states.delete(details); window.dispatchEvent(new Event("public-layout")); },
      });
      states.set(details, { open, tween });
    });
    scope.addEventListener("click", click);
    preference.addEventListener("change", settle);
    window.addEventListener("resize", settle);
    return () => { scope.removeEventListener("click", click); preference.removeEventListener("change", settle); window.removeEventListener("resize", settle); settle(); };
  }, { scope: root });
}
