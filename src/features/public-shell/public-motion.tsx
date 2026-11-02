"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Animate only this owned element: streamed descendants may not be hydrated yet. */
export function PublicMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(root.current, { opacity: .35 }, { opacity: 1, duration: .35, clearProps: "opacity" });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true });
  // Opacity does not change the containing block of sticky descendants.
  return <div ref={root} style={{ minWidth: 0 }}>{children}</div>;
}
