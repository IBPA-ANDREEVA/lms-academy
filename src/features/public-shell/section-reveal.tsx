"use client";

import { useRef, type ComponentProps } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { publicMotion as motion, type RevealTreatment } from "./motion-tokens";

gsap.registerPlugin(useGSAP);

/** Opt-in, enter-once enhancement. SSR and every interrupted state stay readable. */
export function SectionReveal({ treatment = "editorial", ...props }: ComponentProps<"div"> & { treatment?: RevealTreatment }) {
  const root = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  useGSAP((_, contextSafe) => {
    const element = root.current;
    if (!element || !contextSafe) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (seen.current) return;
      let targets: HTMLElement[] = [];
      let timeline: gsap.core.Timeline | undefined;
      const clear = () => {
        timeline?.kill();
        targets.forEach(target => {
          for (const property of ["opacity", "transform", "clip-path"]) target.style.removeProperty(property);
        });
      };
      const observer = new IntersectionObserver(contextSafe(entries => {
        if (!entries.some(entry => entry.isIntersecting) || element.closest('[inert],[aria-hidden="true"]')) return;
        seen.current = true;
        observer.disconnect();
        if (element.closest('[data-learning-offers],[data-transitioning],[data-animating],[data-route-motion]') || element.contains(document.activeElement)) return;
        const visible = (target: HTMLElement) => target.getBoundingClientRect().height > 0 && !target.closest('[hidden],[inert]');
        const headings = Array.from(element.querySelectorAll<HTMLElement>("h1,h2,[data-motion-heading]")).filter(visible);
        const explicit = Array.from(element.querySelectorAll<HTMLElement>(treatment === "cards" ? "article" : "[data-motion-item], [data-motion-body]")).filter(visible);
        // Animate only the heading and a few authored groups. Forms, disclosures,
        // lists of benefits and every ordinary descendant do not all need entrances.
        const content = explicit.filter(target => !headings.includes(target) && !target.matches("form,li") && !headings.some(heading => target.contains(heading))).slice(0, 4);
        if (!content.length) content.push(...Array.from(element.children).filter((target): target is HTMLElement => target instanceof HTMLElement && !target.querySelector("h1,h2") && !target.matches("form") && visible(target)).slice(0, 2));
        targets = [...headings, ...content];
        const mobile = matchMedia("(max-width: 760px)").matches;
        timeline = gsap.timeline({ defaults: { ease: motion.ease, duration: mobile ? motion.mobileReveal : motion.reveal } });
        if (headings.length) timeline.fromTo(headings, { y: mobile ? 6 : 12, clipPath: "inset(0 0 100% 0)" }, {
          y: 0, clipPath: "inset(0 0 -5% 0)", stagger: motion.stagger, clearProps: "transform,clipPath",
        }, 0);
        if (content.length) timeline.fromTo(content, { opacity: .65, y: mobile ? 4 : 8 }, {
          opacity: 1, y: 0, stagger: mobile ? motion.mobileStagger : motion.stagger, clearProps: "opacity,transform",
        }, .04);
      }), { threshold: 0, rootMargin: "0px 0px -24px 0px" });
      observer.observe(element);
      element.addEventListener("focusin", clear);
      window.addEventListener("resize", clear);
      return () => { observer.disconnect(); element.removeEventListener("focusin", clear); window.removeEventListener("resize", clear); clear(); };
    });
    return () => media.revert();
  }, { scope: root });
  return <div {...props} ref={root} data-motion-reveal={treatment} />;
}
