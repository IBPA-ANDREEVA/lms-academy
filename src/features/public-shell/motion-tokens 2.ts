/** Public motion values in seconds / CSS pixels. See docs/design/MOTION.md. */
export const publicMotion = {
  ease: "power3.out",
  transitionEase: "power2.inOut",
  reveal: .48,
  mobileReveal: .36,
  panel: .36,
  mobilePanel: .3,
  stagger: .055,
  mobileStagger: .035,
  distance: 16,
  mobileDistance: 8,
  wipeCover: .24,
  wipeReveal: .32,
  wipePush: 28,
  loaderDelay: 180,
  circleExpand: .38,
  circleReveal: .28,
  switchShrink: .12,
  switchSlide: .28,
  switchExpand: .16,
  storyOverlap: 160,
  featuredTravel: 120,
} as const;

export type RevealTreatment = "editorial" | "portrait" | "contact" | "cards" | "compact";
