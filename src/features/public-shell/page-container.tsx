"use client";
import { useRef, type ComponentProps } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./page-container.module.css";
gsap.registerPlugin(useGSAP);
export type PageContainerProps = ComponentProps<"div"> & {
  size?: "wide" | "content" | "reading" | "fullBleed";
  reveal?: boolean;
};
export function PageContainer({ size = "wide", className = "", reveal = false, ...props }: PageContainerProps) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP((_, contextSafe) => {
    if (!reveal || !root.current || !contextSafe) return;
    const element = root.current;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const observer = new IntersectionObserver(contextSafe(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        gsap.fromTo(element, { opacity: .2, y: 24 }, { opacity: 1, y: 0, duration: .75, ease: "power3.out", clearProps: "opacity,transform" });
        observer.disconnect();
      }), { threshold: .08 });
      observer.observe(element);
      return () => observer.disconnect();
    });
    return () => media.revert();
  }, { scope: root, dependencies: [reveal], revertOnUpdate: true });
  return <div {...props} ref={root} className={`${styles.container} ${styles[size]} ${className}`} />;
}
