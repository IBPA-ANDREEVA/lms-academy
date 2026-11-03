"use client";
import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Home-local filtering feedback; outer panel transitions remain group-owned. */
export function useOfferSelectionMotion(root: RefObject<HTMLDivElement | null>, selection: string | undefined, compact = false) {
  const previous = useRef(selection);
  useGSAP(() => {
    const changed = previous.current !== selection;
    previous.current = selection;
    const element = root.current;
    if (!changed || !element || element.closest('[inert]')) return;
    const track = element.matches('[data-offer-carousel]') ? element : element.querySelector('[data-offer-carousel]');
    if (!track) return;
    const bounds = track.getBoundingClientRect();
    const cards = Array.from(track.children).filter(card => {
      const box = card.getBoundingClientRect();
      return box.right > bounds.left && box.left < bounds.right && !card.contains(document.activeElement);
    });
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(cards, { opacity: .6, y: compact ? 4 : 8 }, { opacity: 1, y: 0, duration: compact ? .22 : .28, stagger: .025, ease: "power2.out", clearProps: "opacity,transform" });
    });
    const settle = () => {
      gsap.killTweensOf(cards);
      cards.forEach(card => { if (card instanceof HTMLElement) { card.style.removeProperty("opacity"); card.style.removeProperty("transform"); } });
    };
    element.addEventListener("focusin", settle);
    window.addEventListener("resize", settle);
    return () => { element.removeEventListener("focusin", settle); window.removeEventListener("resize", settle); media.revert(); settle(); };
  }, { scope: root, dependencies: [selection], revertOnUpdate: true });
}
