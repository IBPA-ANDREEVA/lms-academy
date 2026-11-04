"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { motionCoverBlocking, motionReadyEvent, motionRevealEvent } from "@/features/public-shell/motion-handoff";
import { homeScenes, homeSceneTimeline, type HomeScene } from "./home-entrance-scenes";

gsap.registerPlugin(useGSAP);

/** Prepare in the layout lifecycle; scroll only plays already-prepared timelines.
 * SSR stays readable. If hydration arrives after exposure, never hide that scene. */
export function HomeEntranceMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null);
  const seen = useRef(new Set<string>());
  useGSAP((_, contextSafe) => {
    const main = root.current;
    if (!main || !contextSafe) return;
    const scenes = homeScenes(main);
    const media = gsap.matchMedia();
    media.add({ mobile: "(max-width:760px)", desktop: "(min-width:761px)", reduce: "(prefers-reduced-motion:reduce)" }, context => {
      const mobile = Boolean(context.conditions?.mobile);
      const entryLine = mobile ? .9 : .85;
      const entryInset = () => Math.round(innerHeight * (1 - entryLine));
      const animations = new Map<HomeScene, ReturnType<typeof homeSceneTimeline>>();
      const ownedTargets = new Set<HTMLElement>();
      let stopped = false;
      const clearTarget = (target: HTMLElement) => {
        for (const property of ["opacity", "transform", "translate", "rotate", "scale", "clip-path", "will-change"]) target.style.removeProperty(property);
      };
      const reset = (scene: HomeScene) => {
        const animation = animations.get(scene);
        animation?.timeline.kill();
        animation?.targets.forEach(clearTarget);
        animations.delete(scene);
      };
      const settle = (scene: HomeScene) => {
        reset(scene);
        seen.current.add(scene.id);
        scene.trigger.dataset.homeSceneState = "complete";
      };
      const inactive = (scene: HomeScene) => Boolean(scene.scope.closest('[hidden],[inert],[aria-hidden="true"]'));
      const exposed = (scene: HomeScene) => {
        const box = scene.trigger.getBoundingClientRect();
        return !inactive(scene) && box.height > 0 && box.top < innerHeight && box.bottom > 0;
      };
      const prepare = (scene: HomeScene, first = false) => {
        scene.trigger.dataset.homeScene = scene.id;
        if (seen.current.has(scene.id)) return;
        // Never hide already-exposed SSR content on slow hydration/restoration.
        if (context.conditions?.reduce || scene.scope.contains(document.activeElement)
          || (first && !motionCoverBlocking() && exposed(scene))) { settle(scene); return; }
        reset(scene);
        const animation = homeSceneTimeline(scene, mobile, () => settle(scene));
        animation.targets.forEach(target => ownedTargets.add(target));
        animations.set(scene, animation);
        scene.trigger.dataset.homeSceneState = "prepared";
      };
      scenes.forEach(scene => prepare(scene, true));
      // Playback creates no tweens. Keeping it outside contextSafe also avoids
      // nesting the parent useGSAP context inside its own matchMedia child.
      const scan = () => {
        if (stopped) return;
        const blocked = motionCoverBlocking();
        for (const scene of scenes) {
          const animation = animations.get(scene);
          if (!animation) continue;
          const playing = scene.trigger.dataset.homeSceneState === "playing";
          if (playing) {
            if (blocked || inactive(scene)) settle(scene);
            continue;
          }
          if (blocked || inactive(scene)) continue;
          const box = scene.trigger.getBoundingClientRect();
          if (!box.height) continue;
          // Fast scroll can jump over a scene; leave it readable on return.
          if (box.bottom <= 0) { settle(scene); continue; }
          if (box.top > innerHeight - entryInset()) continue;
          if (scene.scope.contains(document.activeElement)) { settle(scene); continue; }
          scene.trigger.dataset.homeSceneState = "playing";
          if (!animation.targets.size) { settle(scene); continue; }
          animation.timeline.play(0);
        }
      };
      let observer: IntersectionObserver;
      const observe = () => {
        observer?.disconnect();
        // Use pixels: IO percentage margins resolve against viewport width,
        // whereas the authored entry line is a fraction of viewport height.
        observer = new IntersectionObserver(scan, { rootMargin: `0px 0px -${entryInset()}px 0px` });
        scenes.forEach(scene => observer.observe(scene.trigger));
      };
      observe();
      const changes = new MutationObserver(context.add("refreshScenes", (records: MutationRecord[]) => {
        // Preview hydration replaces loading/empty subtrees. Prepare real targets
        // in this pre-paint microtask, never in a later intersection frame.
        for (const scene of scenes) if (!seen.current.has(scene.id) && scene.trigger.dataset.homeSceneState !== "playing" && records.some(record => record.type === "childList" && scene.scope.contains(record.target))) prepare(scene);
        scan();
      }) as MutationCallback);
      changes.observe(main, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-hidden", "hidden", "data-transitioning"] });
      document.querySelectorAll("[data-splash-loader],[data-page-wipe]").forEach(el => changes.observe(el, { attributes: true, attributeFilter: ["hidden", "data-motion-phase"] }));
      const interact = (event: Event) => {
        for (const scene of animations.keys()) if (event.target instanceof Node && scene.scope.contains(event.target)) settle(scene);
      };
      const resize = () => {
        for (const scene of animations.keys()) if (scene.trigger.dataset.homeSceneState === "playing") settle(scene);
        observe();
        scan();
      };
      main.addEventListener("focusin", interact);
      main.addEventListener("pointerdown", interact, true);
      window.addEventListener("resize", resize);
      window.addEventListener("public-layout", scan);
      window.addEventListener(motionRevealEvent, scan);
      scan();
      return () => {
        stopped = true; observer.disconnect(); changes.disconnect();
        main.removeEventListener("focusin", interact);
        main.removeEventListener("pointerdown", interact, true);
        window.removeEventListener("resize", resize);
        window.removeEventListener("public-layout", scan);
        window.removeEventListener(motionRevealEvent, scan);
        for (const scene of animations.keys()) {
          if ((animations.get(scene)?.timeline.time() ?? 0) > 0) settle(scene);
          else reset(scene);
        }
        // GSAP reverts recorded start snapshots before this cleanup, including
        // already-completed timelines. Release every owned target, not just the
        // still-pending map (important for Activity restoration/media changes).
        ownedTargets.forEach(clearTarget);
      };
    });
    main.dataset.homeMotionReady = "true";
    let mounted = true;
    // A streamed/hydrated child can mount after the shell's layout effect.
    // Notify only after its own preparation, outside any GSAP context.
    queueMicrotask(() => { if (mounted) window.dispatchEvent(new Event(motionReadyEvent)); });
    return () => { mounted = false; delete main.dataset.homeMotionReady; media.revert(); };
  }, { scope: root });
  return <main ref={root} id="main-content" tabIndex={-1} className={className} data-home-entrances>{children}</main>;
}
