"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./public-motion.module.css";
import { motionReadyEvent, releaseMotionCover } from "./motion-handoff";

gsap.registerPlugin(useGSAP);

/** The server-rendered welcome starts fully plum, then reveals from top to bottom.
 * Pending route loading uses the same surface without replaying an ink entrance. */
export function SplashLoader({ active, suppressed = false, inline = false, welcome = false, coordinated = false }: {
  active: boolean; suppressed?: boolean; inline?: boolean; welcome?: boolean; coordinated?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [initialWelcome] = useState(welcome);
  const welcomeDismissed = useRef(false);
  const controls = useRef<{ update: (pending: boolean, suppress: boolean) => void } | null>(null);
  useGSAP((_, contextSafe) => {
    const surface = root.current;
    if (!surface || !contextSafe) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let timeline: gsap.core.Timeline | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending = active;
    let intro = welcome;
    let ready = !coordinated;
    const hide = () => {
      clearTimeout(timer);
      timeline?.kill();
      surface.hidden = true;
      surface.removeAttribute("style");
    };
    const clear = contextSafe(() => {
      if (!ready || surface.dataset.motionPhase === "revealing") return;
      if (getComputedStyle(surface).visibility === "hidden") { welcomeDismissed.current = true; hide(); return; }
      surface.removeAttribute("data-welcome-splash");
      timeline?.kill();
      releaseMotionCover(surface);
      timeline = gsap.timeline({ onComplete: hide }).to(surface, {
        clipPath: "polygon(0 112%, 100% 100%, 100% 100%, 0 100%)", duration: .8, ease: "power3.inOut",
      });
    });
    const show = contextSafe(() => {
      clearTimeout(timer);
      timeline?.kill();
      if (preference.matches) { hide(); return; }
      if (intro && getComputedStyle(surface).visibility === "hidden") { welcomeDismissed.current = true; intro = false; hide(); return; }
      surface.hidden = false;
      surface.dataset.motionPhase = "covering";
      gsap.set(surface, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", visibility: "visible" });
      intro = false;
      if (!pending) clear();
    });
    controls.current = { update: contextSafe((next, suppress) => {
      pending = next;
      if (suppress || preference.matches) { intro = false; hide(); return; }
      if (intro) return;
      clearTimeout(timer);
      if (next && surface.hidden) timer = setTimeout(show, 180);
      else if (!next && !surface.hidden) clear();
    }) };
    if (welcome && !preference.matches && !welcomeDismissed.current) show();
    else hide();
    const mounted = () => {
      if (welcome && !document.querySelector('[data-home-motion-ready="true"]')) return;
      ready = true;
      if (!pending && !surface.hidden) clear();
    };
    window.addEventListener(motionReadyEvent, mounted);
    const interrupt = () => { welcomeDismissed.current = true; intro = false; if (!surface.hidden) releaseMotionCover(surface); hide(); };
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
      window.removeEventListener(motionReadyEvent, mounted);
      preference.removeEventListener("change", interrupt);
      window.removeEventListener("resize", interrupt);
      window.removeEventListener("pagehide", interrupt);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("wheel", interrupt);
    };
  }, { scope: root });
  useLayoutEffect(() => { controls.current?.update(active, suppressed); }, [active, suppressed]);
  return <><div ref={root} hidden={!initialWelcome} aria-hidden="true" data-splash-loader data-welcome-splash={initialWelcome || undefined} className={`${styles.splash} ${inline ? styles.inlineSplash : ""}`} /><noscript><style>{`[data-splash-loader]{display:none!important}`}</style></noscript></>;
}
