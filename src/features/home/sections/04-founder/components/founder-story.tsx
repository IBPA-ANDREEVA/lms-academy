"use client";
import { useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "../founder-section.module.css";
gsap.registerPlugin(useGSAP);

export function FounderStory({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const fromHeight = useRef(0);
  useGSAP(() => {
    if (!viewport.current) return;
    const element = viewport.current;
    const media = gsap.matchMedia();
    media.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, context => {
      const duration = context.conditions?.reduce ? 0 : .55;
      gsap.fromTo(element, { height: fromHeight.current }, { height: open ? element.scrollHeight : 0, duration, ease: "power3.inOut", onComplete: () => { if (open) element.style.height = "auto"; } });
      if (open) gsap.fromTo(element.querySelectorAll("p"), { opacity: duration ? 0 : 1, y: duration ? 18 : 0 }, { opacity: 1, y: 0, duration: duration * .8, stagger: duration ? .09 : 0, clearProps: "opacity,transform" });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [open], revertOnUpdate: true });
  return <div ref={root} className={styles.story}>
    <button type="button" aria-expanded={open} aria-controls="founder-story" onClick={() => { fromHeight.current = viewport.current?.getBoundingClientRect().height ?? 0; setOpen(!open); }}>
      <span>{open ? "Свернуть историю" : "Профессиональный путь"}</span><span aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    <div id="founder-story" ref={viewport} className={styles.storyViewport} aria-hidden={!open} inert={!open}><div className={styles.storyText}>{children}</div></div>
  </div>;
}
