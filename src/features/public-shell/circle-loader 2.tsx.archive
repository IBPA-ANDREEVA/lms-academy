"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { publicMotion as motion } from "./motion-tokens";
import styles from "./public-motion.module.css";

gsap.registerPlugin(useGSAP);

/** A delayed visual for genuine loading. The active surface survives completion
 * only for its short radial reveal; fast loads never create an overlay. */
export function CircleLoader({ active, suppressed = false, inline = false }: { active: boolean; suppressed?: boolean; inline?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const shown = useRef(false);
  const controls = useRef<{ update: (active: boolean, suppressed: boolean) => void } | null>(null);
  useGSAP((_, contextSafe) => {
    const surface = root.current;
    if (!surface || !contextSafe) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let tween: gsap.core.Tween | undefined;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const hide = () => {
      clearTimeout(timer);
      tween?.kill();
      shown.current = false;
      surface.hidden = true;
      surface.removeAttribute("style");
      delete surface.dataset.circleVisible;
    };
    const update = contextSafe((pending: boolean, suppress: boolean) => {
      clearTimeout(timer);
      tween?.kill();
      if (suppress || preference.matches) { hide(); return; }
      const radius = () => Math.hypot(surface.clientWidth / 2, surface.clientHeight / 2) + 2;
      if (pending) {
        if (shown.current) return;
        timer = setTimeout(contextSafe(() => {
          surface.hidden = false;
          surface.dataset.circleVisible = "true";
          shown.current = true;
          surface.style.removeProperty("mask-image");
          tween = gsap.fromTo(surface, { clipPath: "circle(12px at 50% 50%)" }, {
            clipPath: `circle(${radius()}px at 50% 50%)`, duration: motion.circleExpand, ease: motion.transitionEase,
          });
        }), motion.loaderDelay);
      } else if (shown.current) {
        // No minimum display time, no finishing the expansion before revealing.
        surface.style.maskImage = "radial-gradient(circle at 50% 50%, transparent var(--hole), #000 calc(var(--hole) + 1px))";
        tween = gsap.fromTo(surface, { "--hole": "0px" }, {
          "--hole": `${radius()}px`, duration: motion.circleReveal, ease: motion.ease, onComplete: hide,
        });
      } else hide();
    });
    controls.current = { update };
    const interrupt = () => hide();
    preference.addEventListener("change", interrupt);
    window.addEventListener("resize", interrupt);
    window.addEventListener("pagehide", interrupt);
    window.addEventListener("keydown", interrupt);
    if (!inline) window.addEventListener("pointerdown", interrupt);
    return () => {
      controls.current = null; hide();
      preference.removeEventListener("change", interrupt);
      window.removeEventListener("resize", interrupt);
      window.removeEventListener("pagehide", interrupt);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("pointerdown", interrupt);
    };
  }, { scope: root });
  useLayoutEffect(() => { controls.current?.update(active, suppressed); }, [active, suppressed]);
  return <div ref={root} hidden aria-hidden="true" data-circle-loader className={`${styles.circle} ${inline ? styles.inlineCircle : ""}`} />;
}
