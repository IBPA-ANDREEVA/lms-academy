"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilteringSection, type Filters } from "../sections/02-filtering/filtering-section";
import { CoursesSection } from "../sections/03-courses/courses-section";
import { MiniCoursesSection } from "../sections/04-mini-courses/mini-courses-section";
import { publishedCourses,publishedMiniCourses,courseExamples,miniCourseExamples,directions,type CatalogItem } from "../catalog-data";
import styles from "./catalog-experience.module.css";
gsap.registerPlugin(useGSAP);
type Kind="courses"|"mini-courses";
const empty:Filters={direction:"",language:"",level:""};
function readFilters(search:URLSearchParams):Filters{return {direction:directions.some(d=>d.id===search.get("direction"))?search.get("direction")!:"",language:["ru","en"].includes(search.get("language")||"")?search.get("language")!:"",level:["beginner","advanced"].includes(search.get("level")||"")?search.get("level")!:""}}
function matches(items:CatalogItem[],filters:Filters){return items.filter(i=>(!filters.direction||i.directionId===filters.direction)&&(!filters.language||i.languages.includes(filters.language))&&(!filters.level||i.levelId===filters.level))}
export function CatalogExperience(){
 const pathname=usePathname();const router=useRouter();const search=useSearchParams();const kind:Kind=pathname==="/mini-courses"?"mini-courses":"courses";const filters=readFilters(new URLSearchParams(search.toString()));
 const root=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null),previous=useRef<Kind>(kind),fromHeight=useRef<number|null>(null);const [offset,setOffset]=useState(112);
 function href(nextKind:Kind,next:Filters){const query=new URLSearchParams();for(const key of ["direction","language","level"] as const)if(next[key])query.set(key,next[key]);return `/${nextKind}${query.size?`?${query}`:""}`}
 function navigate(nextKind:Kind,next:Filters){fromHeight.current=track.current?.getBoundingClientRect().height??null;if(nextKind!==kind)root.current?.scrollIntoView({block:"start",behavior:"instant"});router.push(href(nextKind,next),{scroll:false})}
 useEffect(()=>{const header=document.querySelector("header");if(!header)return;const update=()=>setOffset(header.getBoundingClientRect().height);update();const observer=new ResizeObserver(update);observer.observe(header);return()=>observer.disconnect()},[]);
 useGSAP((_, contextSafe) => {
  const container = track.current;
  const active = container?.querySelector<HTMLElement>(`[data-kind="${kind}"]`);
  if (!container || !active || !contextSafe) return;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const changed = previous.current !== kind;
  const outgoing = changed ? container.querySelector<HTMLElement>(`[data-kind="${previous.current}"]`) : null;
  let timeline: gsap.core.Timeline | undefined;
  const settle = () => {
   timeline?.kill();
   for (const element of [active, outgoing]) {
    element?.style.removeProperty("transform");
    element?.style.removeProperty("opacity");
    element?.style.removeProperty("visibility");
   }
   container.style.removeProperty("height");
   delete container.dataset.animating;
  };
  if (changed && outgoing && !preference.matches) {
   container.dataset.animating = "true";
   const sign = kind === "mini-courses" ? 1 : -1;
   gsap.set(outgoing, { visibility: "visible" });
   timeline = gsap.timeline({ onComplete: () => { settle(); root.current?.scrollIntoView({ block: "start", behavior: "instant" }); } })
    .fromTo(container, { height: fromHeight.current ?? outgoing.offsetHeight }, { height: active.offsetHeight, duration: .46, ease: "power2.inOut" }, 0)
    .fromTo(outgoing, { xPercent: 0, opacity: 1 }, { xPercent: -sign * 12, opacity: 0, duration: .22, ease: "power2.in" }, 0)
    .fromTo(active, { xPercent: sign * 12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .34, ease: "power3.out" }, .12);
  }
  if (changed && preference.matches) root.current?.scrollIntoView({ block: "start", behavior: "instant" });
  // A resize may invalidate the measured endpoint. Natural active height wins.
  let height = active.offsetHeight;
  const observer = new ResizeObserver(() => {
   if (height !== active.offsetHeight) { height = active.offsetHeight; settle(); }
  });
  observer.observe(active);
  preference.addEventListener("change", settle);
  window.addEventListener("resize", settle);
  previous.current = kind;
  fromHeight.current = null;
  return () => { preference.removeEventListener("change", settle); window.removeEventListener("resize", settle); observer.disconnect(); settle(); };
 }, { scope: root, dependencies: [kind], revertOnUpdate: true });

 const courseDemo=publishedCourses.length===0,miniDemo=publishedMiniCourses.length===0;
 const courseItems=matches(courseDemo?courseExamples:publishedCourses,filters),miniItems=matches(miniDemo?miniCourseExamples:publishedMiniCourses,filters);const filtered=!!(filters.direction||filters.language||filters.level);
 return <div ref={root} className={styles.root} style={{"--catalog-header-offset":`${offset}px`} as React.CSSProperties}>
  <FilteringSection kind={kind} filters={filters} onFilter={(field,value)=>navigate(kind,{...filters,[field]:value})} onSwitch={next=>{if(next===kind)return;const focused=document.activeElement; if(track.current?.contains(focused))document.getElementById(`catalog-tab-${next}`)?.focus({preventScroll:true});navigate(next,filters);requestAnimationFrame(()=>document.getElementById(`catalog-tab-${next}`)?.focus({preventScroll:true}))}} onReset={()=>navigate(kind,empty)}/>
  <div ref={track} className={styles.track}>
   <div data-kind="courses" role="tabpanel" id="catalog-panel-courses" aria-labelledby="catalog-tab-courses" aria-hidden={kind!=="courses"} inert={kind!=="courses"} className={styles.panel}><CoursesSection items={courseItems} filtered={filtered} demonstration={courseDemo} onReset={()=>navigate(kind,empty)}/></div>
   <div data-kind="mini-courses" role="tabpanel" id="catalog-panel-mini-courses" aria-labelledby="catalog-tab-mini-courses" aria-hidden={kind!=="mini-courses"} inert={kind!=="mini-courses"} className={styles.panel}><MiniCoursesSection items={miniItems} filtered={filtered} demonstration={miniDemo} onReset={()=>navigate(kind,empty)}/></div>
  </div>
 </div>
}
