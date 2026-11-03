"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./public-motion.module.css";

gsap.registerPlugin(useGSAP);

/** Plum ink spreads in three overlapping lobes, then clears the viewport.
 * Welcome is a short entrance, never a claim that a request is still loading. */
export function SplashLoader({ active, suppressed = false, inline = false, welcome = false }: {
  active: boolean; suppressed?: boolean; inline?: boolean; welcome?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const controls = useRef<{ update: (pending: boolean, suppress: boolean) => void } | null>(null);
  useGSAP((_, contextSafe) => {
    const surface = root.current;
    if (!surface || !contextSafe) return;
    const ink = surface.querySelectorAll("span");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let timeline: gsap.core.Timeline | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending = active;
    let intro = welcome;
    const hide = () => {
      clearTimeout(timer);
      timeline?.kill();
      surface.hidden = true;
      surface.removeAttribute("style");
      ink.forEach(node => node.removeAttribute("style"));
    };
    const clear = contextSafe(() => {
      timeline?.kill();
      timeline = gsap.timeline({ onComplete: hide }).to(surface, {
        clipPath: "inset(0 0 100% 0)", duration: .48, ease: "power3.inOut",
      });
    });
    const show = contextSafe(() => {
      hide();
      if (preference.matches) return;
      surface.hidden = false;
      gsap.set(surface, { clipPath: "inset(0 0 0% 0)" });
      timeline = gsap.timeline({ onComplete: () => { intro = false; if (!pending) clear(); } })
        .fromTo(ink, { scale: 0, rotation: -16 }, {
          scale: 1, rotation: 0, duration: .62, stagger: .045, ease: "power3.inOut",
        });
    });
    controls.current = { update: contextSafe((next, suppress) => {
      pending = next;
      if (suppress || preference.matches) { intro = false; hide(); return; }
      if (intro) return;
      clearTimeout(timer);
      if (next && surface.hidden) timer = setTimeout(show, 180);
      else if (!next && !surface.hidden) clear();
    }) };
    if (welcome && !preference.matches) show();
    const interrupt = () => { intro = false; hide(); };
    preference.addEventListener("change", interrupt);
    window.addEventListener("resize", interrupt);
    window.addEventListener("pagehide", interrupt);
    if (!inline) {
      window.addEventListener("pointerdown", interrupt);
      window.addEventListener("keydown", interrupt);
      window.addEventListener("wheel", interrupt, { passive: true });
    }
    return () => {
      controls.current = null; hide();
      preference.removeEventListener("change", interrupt);
      window.removeEventListener("resize", interrupt);
      window.removeEventListener("pagehide", interrupt);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("wheel", interrupt);
    };
  }, { scope: root });
  useLayoutEffect(() => { controls.current?.update(active, suppressed); }, [active, suppressed]);
  return <div ref={root} hidden aria-hidden="true" data-splash-loader className={`${styles.splash} ${inline ? styles.inlineSplash : ""}`}><span /><span /><span /></div>;
}
