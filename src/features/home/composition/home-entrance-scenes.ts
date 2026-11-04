import { gsap } from "gsap";

type Treatment = "hero" | "photo" | "copy" | "learning" | "cards" | "topics" | "reviews" | "faq" | "contact";
export type HomeScene = { id: string; scope: HTMLElement; trigger: HTMLElement; treatment: Treatment };

/** Authored home targets, separate from structural seams and stateful panel owners. */
export function homeScenes(main: HTMLElement): HomeScene[] {
  const scenes: HomeScene[] = [];
  const add = (id: string, selector: string, treatment: Treatment, trigger?: string) => {
    const scope = main.querySelector<HTMLElement>(selector);
    const target = trigger ? scope?.querySelector<HTMLElement>(trigger) : scope;
    if (scope && target) scenes.push({ id, scope, trigger: target, treatment });
  };
  add("hero", "[data-home-hero]", "hero");
  for (const id of ["about", "founder"]) {
    add(`${id}-photo`, `#${id} [data-motion-photo]`, "photo");
    add(id, `#${id}`, "copy", "h2");
  }
  add("learning", "#learning-preview", "copy", "h2");
  add("learning-demo", "[data-home-learning-demo]", "learning");
  add("courses", "#catalog-status", "cards");
  add("packages", "#packages", "cards");
  add("mini-courses", "#mini-courses", "cards");
  add("start-usa", "#start-usa", "topics");
  add("reviews", "#reviews", "reviews", "h2");
  add("faq", "#faq", "faq", "h2");
  add("contact", "#contact", "contact", "h2");
  return scenes;
}

export function homeSceneTimeline(scene: HomeScene, mobile: boolean, complete: () => void) {
  const { scope, treatment } = scene;
  const targets = new Set<HTMLElement>();
  // Inactive offer panels must be prepared too, before their first visible frame.
  const select = (selector: string) => Array.from(scope.querySelectorAll<HTMLElement>(selector));
  // Keep the authored choreography, but leave enough visible travel after the
  // trigger. The hero builds gently while the existing curtain is opening.
  const timeline = gsap.timeline({ paused: true, defaults: { ease: treatment === "hero" ? "power2.inOut" : "power2.out" }, onComplete: complete });
  timeline.timeScale(mobile ? .6 : .7);
  const enter = (elements: HTMLElement[], from: gsap.TweenVars, duration: number, at: number, stagger = 0) => {
    if (!elements.length) return;
    elements.forEach(el => targets.add(el));
    gsap.set(elements, from);
    timeline.to(elements, { opacity: 1, x: 0, y: 0, yPercent: 0, rotation: 0, scale: 1,
      duration: mobile ? duration * .75 : duration, stagger: mobile ? stagger * .65 : stagger,
      clearProps: "opacity,transform,clipPath,willChange", ...("clipPath" in from ? { clipPath: "inset(-12% -4% -12% -4%)" } : {}),
    }, at);
  };
  const headings = select("h1,h2");
  const lines = headings.flatMap(heading => {
    const spans = Array.from(heading.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.tagName === "SPAN");
    const hasRawText = Array.from(heading.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
    return spans.length && !hasRawText ? spans : [heading];
  });
  const headline = () => enter(lines, { yPercent: mobile ? 24 : 48, opacity: 0, clipPath: "inset(0 0 100% 0)", willChange: "transform,clip-path" }, .9, 0, .1);
  const body = () => {
    const copy = select("[data-motion-item],[data-motion-body]").filter(el =>
      !headings.includes(el) && !el.closest("form") && !el.querySelector("h1,h2") && !el.matches("li"));
    enter(copy, { opacity: .35, y: mobile ? 10 : 20 }, .8, .16, .08);
    enter(select("li[data-motion-item]"), { opacity: .35, y: mobile ? 12 : 26 }, .75, .28, .065);
  };

  if (treatment === "photo") {
    enter(select("img"), { scale: mobile ? 1.035 : 1.075, yPercent: mobile ? 0 : 2, opacity: .65 }, 1.35, 0);
  } else if (treatment === "hero") {
    headline();
    enter(select("[data-home-supporting]"), { opacity: 0, y: 12 }, .8, .12);
    const actions = select("[data-home-cta]");
    actions.forEach(el => targets.add(el));
    // Reveal the control and its label together; leave its CSS hover transform free.
    gsap.set(actions, { opacity: 0 });
    timeline.to(actions, { opacity: 1, duration: mobile ? .45 : .65, clearProps: "opacity" }, .24);
    enter(select("img"), { scale: mobile ? 1.025 : 1.055 }, 1.5, 0);
  } else if (treatment === "copy") {
    headline(); body();
  } else if (treatment === "learning") {
    enter(select('[role="tablist"] button'), { opacity: .3, y: 12 }, .6, 0, .06);
    enter(select('[role="tabpanel"][aria-hidden="false"] > div'), { opacity: .35, y: 18 }, .85, .12);
  } else if (treatment === "cards") {
    enter(select("article"), { opacity: 0, y: mobile ? 18 : 42, rotation: mobile ? 0 : .7, willChange: "transform,opacity" }, .95, 0, .1);
  } else if (treatment === "topics") {
    enter(select("#usa-topics > *, [data-motion-body]"), { opacity: .4, y: 20 }, .8, 0, .07);
  } else if (treatment === "reviews") {
    headline();
    enter(select("article"), { opacity: .3, x: mobile ? 16 : 44 }, 1, .12, .1);
  } else if (treatment === "faq") {
    headline();
    enter(select("details"), { opacity: .35, y: mobile ? 10 : 20 }, .75, .14, .055);
  } else if (treatment === "contact") {
    headline(); body(); // Input fields, form geometry and entered values stay still.
  }
  return { timeline, targets };
}
