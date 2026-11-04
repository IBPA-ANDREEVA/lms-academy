/** Synchronous presentation handoff: entrances start on the same frame as the
 * existing curtain's reveal, not after its hidden attribute eventually changes. */
export const motionReadyEvent = "public-motion-ready";
export const motionRevealEvent = "public-content-reveal";

export function releaseMotionCover(surface: HTMLElement) {
  surface.dataset.motionPhase = "revealing";
  window.dispatchEvent(new Event(motionRevealEvent));
}

export function motionCoverBlocking() {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-splash-loader],[data-page-wipe]"))
    .some(surface => !surface.hidden && surface.dataset.motionPhase !== "revealing"
      && getComputedStyle(surface).visibility !== "hidden" && getComputedStyle(surface).display !== "none");
}

export const navigationStartEvent = "public-navigation-start";
export const navigationEndEvent = "public-navigation-end";
