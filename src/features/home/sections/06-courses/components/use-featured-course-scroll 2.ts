"use client";

import { type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { publicMotion as motion } from "@/features/public-shell/motion-tokens";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** A 120px editorial beat for HOME-06 only; never the standard catalog. */
export function useFeaturedCourseScroll(root: RefObject<HTMLDivElement | null>, selection?: string) {
  useGSAP((_, contextSafe) => {
    const stage = root.current;
    if (!stage || !contextSafe) return;
    const panel = stage.closest('[role="tabpanel"]');
    let media: gsap.MatchMedia | undefined;
    const setup = contextSafe(() => {
      media?.revert();
      if (panel?.hasAttribute("inert")) return;
      media = gsap.matchMedia();
      media.add("(min-width: 1100px) and (min-height: 780px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-featured-card]"));
        // Never pin content taller than the free viewport, or a lone filtered card.
        if (cards.length < 2 || stage.offsetHeight > innerHeight - 220) return;
        stage.dataset.featuredScroll = "true";
        stage.style.setProperty("--featured-travel", `${motion.featuredTravel}px`);
        const timeline = gsap.timeline({ scrollTrigger: {
          id: "home-featured-courses", trigger: stage, start: "top 180px", end: `+=${motion.featuredTravel}`,
          scrub: true, invalidateOnRefresh: true,
        }});
        cards.forEach((card, index) => {
          timeline.to(card, { y: -8 - index * 4, scale: .99 - index * .003, ease: "none", duration: 1 }, 0);
          const image = card.querySelector("img");
          if (image) timeline.fromTo(image, { scale: 1.06, yPercent: 2 }, { scale: 1.015, yPercent: -2, ease: "none", duration: 1 }, 0);
        });
        const focus = () => { timeline.scrollTrigger?.kill(); timeline.revert(); delete stage.dataset.featuredScroll; stage.style.removeProperty("--featured-travel"); };
        stage.addEventListener("focusin", focus);
        return () => { stage.removeEventListener("focusin", focus); delete stage.dataset.featuredScroll; stage.style.removeProperty("--featured-travel"); };
      });
    });
    setup();
    const observer = new MutationObserver(setup);
    if (panel) observer.observe(panel, { attributes: true, attributeFilter: ["inert"] });
    // Breakpoint/viewport changes may make cards too tall; rebuild after layout settles.
    let frame = 0;
    const resize = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(setup); };
    window.addEventListener("resize", resize);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("resize", resize); media?.revert(); };
  }, { scope: root, dependencies: [selection], revertOnUpdate: true });
}
