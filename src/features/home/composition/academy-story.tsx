"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { publicMotion as motion } from "@/features/public-shell/motion-tokens";
import styles from "./academy-story.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** One home-only editorial handoff. CSS sticky adds no scroll distance. */
export function AcademyStory({ about, founder, seam }: { about: ReactNode; founder: ReactNode; seam: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const outgoing = useRef<HTMLDivElement>(null);
  const incoming = useRef<HTMLDivElement>(null);
  useGSAP((_, contextSafe) => {
    if (!root.current || !outgoing.current || !incoming.current || !contextSafe) return;
    const group = root.current;
    const hold = outgoing.current;
    const surface = hold.firstElementChild;
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)", () => {
      group.dataset.stickyStory = "true";
      // A tall story scrolls fully before its bottom edge sticks.
      const measure = () => hold.style.setProperty("--story-top", `${Math.min(90, innerHeight - hold.offsetHeight)}px`);
      measure();
      const timeline = gsap.timeline({ scrollTrigger: {
        id: "home-academy-story", trigger: incoming.current, start: "top bottom", end: `+=${motion.storyOverlap}`, scrub: true,
      }}).to(surface, { scale: .975, borderRadius: 20, transformOrigin: "50% 100%", ease: "none" });
      let previousHeight = group.offsetHeight;
      const observer = new ResizeObserver(() => {
        measure();
        if (previousHeight !== group.offsetHeight) { previousHeight = group.offsetHeight; ScrollTrigger.refresh(); }
      });
      observer.observe(group);
      const focus = contextSafe(() => {
        // Keyboard users should never focus a story concealed by its successor.
        timeline.scrollTrigger?.kill();
        timeline.revert();
        delete group.dataset.stickyStory;
      });
      hold.addEventListener("focusin", focus);
      window.addEventListener("resize", measure);
      return () => { observer.disconnect(); window.removeEventListener("resize", measure); hold.removeEventListener("focusin", focus); hold.style.removeProperty("--story-top"); delete group.dataset.stickyStory; };
    });
    return () => media.revert();
  }, { scope: root });
  return <div ref={root} className={styles.story}>
    <div ref={outgoing} className={styles.outgoing}><div className={styles.surface}>{about}</div></div>
    <div ref={incoming} className={styles.incoming}>{seam}{founder}</div>
  </div>;
}
