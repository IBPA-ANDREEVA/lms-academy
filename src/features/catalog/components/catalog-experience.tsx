"use client";
import { startTransition, useEffect, useLayoutEffect, useOptimistic, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilteringSection, type Filters } from "../sections/02-filtering/filtering-section";
import { CoursesSection } from "../sections/03-courses/courses-section";
import { MiniCoursesSection } from "../sections/04-mini-courses/mini-courses-section";
import { directions, type CatalogItem } from "../catalog-data";
import { useCatalog } from "../catalog-provider";
import { toCatalogItem } from "../catalog-presentation";
import styles from "./catalog-experience.module.css";
gsap.registerPlugin(useGSAP);
type Kind="courses"|"mini-courses";
const empty:Filters={direction:"",language:"",level:""};
function readFilters(search:URLSearchParams):Filters{return {direction:directions.some(d=>d.id===search.get("direction"))?search.get("direction")!:"",language:["ru","en"].includes(search.get("language")||"")?search.get("language")!:"",level:["beginner","advanced"].includes(search.get("level")||"")?search.get("level")!:""}}
function matches(items:CatalogItem[],filters:Filters){return items.filter(i=>(!filters.direction||i.directionId===filters.direction)&&(!filters.language||i.languages.includes(filters.language))&&(!filters.level||i.levelId===filters.level))}
export function CatalogExperience(){
 const pathname=usePathname();const router=useRouter();const search=useSearchParams();const routeKind:Kind=pathname==="/mini-courses"?"mini-courses":"courses";const [kind,setKind]=useOptimistic(routeKind);const filters=readFilters(new URLSearchParams(search.toString()));
 const root=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null);const [offset,setOffset]=useState(112);
 const motion=useRef<{select:(next:Kind)=>void}|null>(null);
 function href(nextKind:Kind,next:Filters){const query=new URLSearchParams();for(const key of ["direction","language","level"] as const)if(next[key])query.set(key,next[key]);return `/${nextKind}${query.size?`?${query}`:""}`}
 function navigate(nextKind:Kind,next:Filters){
  if(nextKind!==kind)root.current?.scrollIntoView({block:"start",behavior:"instant"});
  startTransition(()=>{setKind(nextKind);router.push(href(nextKind,next),{scroll:false})});
 }
 useEffect(()=>{router.prefetch(href("courses",readFilters(new URLSearchParams(search.toString()))));router.prefetch(href("mini-courses",readFilters(new URLSearchParams(search.toString()))))},[router,search]);
 useEffect(()=>{const header=document.querySelector("header");if(!header)return;const update=()=>setOffset(header.getBoundingClientRect().height);update();const observer=new ResizeObserver(update);observer.observe(header);return()=>observer.disconnect()},[]);
 // One controller owns both panels for the lifetime of this persistent layout.
 // Route commits must not revert a running tween or restore stale panel poses.
 useGSAP((_, contextSafe) => {
  const container = track.current;
  const courses = container?.querySelector<HTMLElement>('[data-kind="courses"]');
  const mini = container?.querySelector<HTMLElement>('[data-kind="mini-courses"]');
  if (!container || !courses || !mini || !contextSafe) return;
  const panels = [courses, mini];
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const position = { value: kind === "mini-courses" ? 1 : 0 };
  let destination = position.value;
  let tween: gsap.core.Tween | undefined;
  let heights = panels.map(panel => panel.offsetHeight);
  const setCourseX = gsap.quickSetter(courses, "xPercent");
  const setMiniX = gsap.quickSetter(mini, "xPercent");
  const clear = () => {
   for (const panel of panels) {
    for (const property of ["transform", "visibility", "will-change"]) panel.style.removeProperty(property);
   }
   container.style.removeProperty("height");
   delete container.dataset.animating;
  };
  const settle = () => {
   tween?.kill();
   tween = undefined;
   position.value = destination;
   clear();
  };
  const render = () => {
   // Complementary positions: opaque panels share an edge, never overlap.
   // A single progress value also makes rapid reversals geometrically continuous.
   setCourseX(-100 * position.value);
   setMiniX(100 * (1 - position.value));
   container.style.height = `${heights[0] + (heights[1] - heights[0]) * position.value}px`;
  };
  motion.current = { select: contextSafe((next: Kind) => {
   const target = next === "mini-courses" ? 1 : 0;
   if (target === destination) return;
   destination = target;
   tween?.kill();
   if (preference.matches || Math.abs(position.value - target) < .0001) { settle(); return; }
   heights = panels.map(panel => panel.offsetHeight);
   container.dataset.animating = "true";
   for (const panel of panels) {
    panel.style.visibility = "visible";
    panel.style.willChange = "transform";
   }
   render();
   tween = gsap.to(position, {
    value: target, duration: .36, ease: "power2.inOut",
    onUpdate: render, onComplete: settle,
   });
  }) };
  // Content/image changes update the natural heights without restarting motion.
  const observer = new ResizeObserver(() => {
   heights = panels.map(panel => panel.offsetHeight);
   if (tween) render();
  });
  panels.forEach(panel => observer.observe(panel));
  preference.addEventListener("change", settle);
  window.addEventListener("resize", settle);
  return () => {
   motion.current = null;
   observer.disconnect();
   preference.removeEventListener("change", settle);
   window.removeEventListener("resize", settle);
   settle();
  };
 }, { scope: root });
 // Deliberately outside a dependency-driven GSAP context: changing selection
 // redirects the same progress tween instead of reverting both DOM panels.
 useLayoutEffect(() => { motion.current?.select(kind); }, [kind]);

 const catalog = useCatalog();
 const visible = catalog.products.filter(p => p.publication === "published" && p.approval === "approved");
 const courseDemo=catalog.enabled,miniDemo=catalog.enabled;
 const courseItems=matches(visible.filter(p => p.kind === "course").map(toCatalogItem),filters),miniItems=matches(visible.filter(p => p.kind === "mini-course").map(toCatalogItem),filters);const filtered=!!(filters.direction||filters.language||filters.level);
 return <div ref={root} data-catalog-experience className={styles.root} style={{"--catalog-header-offset":`${offset}px`} as React.CSSProperties}>
  <FilteringSection kind={kind} filters={filters} onFilter={(field,value)=>navigate(kind,{...filters,[field]:value})} onSwitch={next=>{if(next===kind)return;const focused=document.activeElement; if(track.current?.contains(focused))document.getElementById(`catalog-tab-${next}`)?.focus({preventScroll:true});navigate(next,filters);requestAnimationFrame(()=>document.getElementById(`catalog-tab-${next}`)?.focus({preventScroll:true}))}} onReset={()=>navigate(kind,empty)}/>
  <div ref={track} className={styles.track}>
   <div data-kind="courses" role="tabpanel" id="catalog-panel-courses" aria-labelledby="catalog-tab-courses" aria-hidden={kind!=="courses"} inert={kind!=="courses"} className={styles.panel}><CoursesSection active={kind==="courses"} status={catalog.status} items={courseItems} filtered={filtered} demonstration={courseDemo} onReset={()=>navigate(kind,empty)}/></div>
   <div data-kind="mini-courses" role="tabpanel" id="catalog-panel-mini-courses" aria-labelledby="catalog-tab-mini-courses" aria-hidden={kind!=="mini-courses"} inert={kind!=="mini-courses"} className={styles.panel}><MiniCoursesSection active={kind==="mini-courses"} status={catalog.status} items={miniItems} filtered={filtered} demonstration={miniDemo} onReset={()=>navigate(kind,empty)}/></div>
  </div>
 </div>
}
