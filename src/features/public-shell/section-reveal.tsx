"use client";

import { useRef, type ComponentProps } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { publicMotion as motion, type RevealTreatment } from "./motion-tokens";
import { motionCoverBlocking, motionRevealEvent } from "./motion-handoff";

gsap.registerPlugin(useGSAP);

/** Opt-in progressive enhancement. Prepare before exposure, then only play once. */
export function SectionReveal({ treatment = "editorial", ...props }: ComponentProps<"div"> & { treatment?: RevealTreatment }) {
  const root = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  useGSAP((_, contextSafe) => {
    const element = root.current;
    if (!element || !contextSafe || element.closest("[data-home-entrances],[data-catalog-experience]")) return;
    const media = gsap.matchMedia();
    media.add({ reduce: "(prefers-reduced-motion: reduce)", animate: "(prefers-reduced-motion: no-preference)" }, context => {
      if (seen.current) return;
      const box = element.getBoundingClientRect();
      if (context.conditions?.reduce || element.closest('[data-learning-offers],[data-transitioning],[data-animating]')
        || element.contains(document.activeElement) || (!motionCoverBlocking() && box.bottom > 0 && box.top < innerHeight)) {
        seen.current = true;
        return;
      }
      const headings = Array.from(element.querySelectorAll<HTMLElement>("h1,h2,[data-motion-heading]"));
      const explicit = Array.from(element.querySelectorAll<HTMLElement>(treatment === "cards" ? "article" : "[data-motion-item], [data-motion-body]"));
      const content = explicit.filter(target => !headings.includes(target) && !target.matches("form,li") && !headings.some(heading => target.contains(heading))).slice(0, 4);
      if (!content.length) content.push(...Array.from(element.children).filter((target): target is HTMLElement => target instanceof HTMLElement && !target.querySelector("h1,h2") && !target.matches("form")).slice(0, 2));
      const targets = [...headings, ...content];
      const mobile = matchMedia("(max-width: 760px)").matches;
      let playing = false;
      const clear = () => {
        timeline.kill();
        targets.forEach(target => {
          for (const property of ["opacity", "transform", "clip-path"]) target.style.removeProperty(property);
        });
      };
      const finish = () => { seen.current = true; clear(); };
      const timeline = gsap.timeline({ paused: true, defaults: { ease: motion.ease, duration: mobile ? motion.mobileReveal : motion.reveal }, onComplete: finish });
      gsap.set(headings, { y: mobile ? 6 : 12, clipPath: "inset(0 0 100% 0)" });
      gsap.set(content, { opacity: .65, y: mobile ? 4 : 8 });
      if (headings.length) timeline.to(headings, { y: 0, clipPath: "inset(0 0 -5% 0)", stagger: motion.stagger, clearProps: "transform,clipPath" }, 0);
      if (content.length) timeline.to(content, { opacity: 1, y: 0, stagger: mobile ? motion.mobileStagger : motion.stagger, clearProps: "opacity,transform" }, .04);
      const play = () => {
        if (seen.current || playing || motionCoverBlocking() || element.closest('[hidden],[inert],[aria-hidden="true"]')) return;
        const bounds = element.getBoundingClientRect();
        if (!bounds.height || bounds.top > innerHeight + 120) return;
        if (bounds.bottom <= 0) { finish(); return; }
        playing = true;
        seen.current = true;
        timeline.play(0);
      };
      const observer = new IntersectionObserver(play, { rootMargin: "0px 0px 120px 0px" });
      observer.observe(element);
      element.addEventListener("focusin", finish);
      element.addEventListener("pointerdown", finish, true);
      window.addEventListener("resize", finish);
      window.addEventListener(motionRevealEvent, play);
      play();
      return () => {
        observer.disconnect(); element.removeEventListener("focusin", finish); element.removeEventListener("pointerdown", finish, true);
        window.removeEventListener("resize", finish); window.removeEventListener(motionRevealEvent, play); clear();
      };
    });
    return () => media.revert();
  }, { scope: root });
  return <div {...props} ref={root} data-motion-reveal={treatment} />;
}
