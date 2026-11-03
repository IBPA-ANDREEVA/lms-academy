"use client";
import { useEffect, useRef, useState } from "react";
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
 const pathname=usePathname();const router=useRouter();const search=useSearchParams();const kind:Kind=pathname==="/mini-courses"?"mini-courses":"courses";const filters=readFilters(new URLSearchParams(search.toString()));
 const root=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null),previous=useRef<Kind>(kind),fromHeight=useRef<number|null>(null);const [offset,setOffset]=useState(112);
 function href(nextKind:Kind,next:Filters){const query=new URLSearchParams();for(const key of ["direction","language","level"] as const)if(next[key])query.set(key,next[key]);return `/${nextKind}${query.size?`?${query}`:""}`}
 function navigate(nextKind:Kind,next:Filters){fromHeight.current=track.current?.getBoundingClientRect().height??null;router.push(href(nextKind,next),{scroll:false})}
 useEffect(()=>{const header=document.querySelector("header");if(!header)return;const update=()=>setOffset(header.getBoundingClientRect().height);update();const observer=new ResizeObserver(update);observer.observe(header);return()=>observer.disconnect()},[]);
 useGSAP((_, contextSafe) => {
  const container = track.current;
  const active = container?.querySelector<HTMLElement>(`[data-kind="${kind}"]`);
  if (!container || !active || !contextSafe) return;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const changed = previous.current !== kind;
  let timeline: gsap.core.Timeline | undefined;
  const settle = () => {
   timeline?.kill();
   active.style.removeProperty("transform");
   active.style.removeProperty("opacity");
   container.style.removeProperty("height");
   delete container.dataset.animating;
  };
  if (changed && fromHeight.current !== null && !preference.matches) {
   container.dataset.animating = "true";
   const mobile = matchMedia("(max-width: 760px)").matches;
   const sign = kind === "mini-courses" ? 1 : -1;
   timeline = gsap.timeline({ onComplete: settle })
    .fromTo(container, { height: fromHeight.current }, { height: active.offsetHeight, duration: .36, ease: "power2.inOut" }, 0)
    .fromTo(active, { x: sign * (mobile ? 10 : 24), opacity: .4 }, { x: 0, opacity: 1, duration: .36, ease: "power2.out", clearProps: "transform,opacity" }, 0);
  }
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

 const catalog = useCatalog();
 const visible = catalog.products.filter(p => p.publication === "published" && p.approval === "approved");
 const courseDemo=catalog.enabled,miniDemo=catalog.enabled;
 const courseItems=matches(visible.filter(p => p.kind === "course").map(toCatalogItem),filters),miniItems=matches(visible.filter(p => p.kind === "mini-course").map(toCatalogItem),filters);const filtered=!!(filters.direction||filters.language||filters.level);
 return <div ref={root} className={styles.root} style={{"--catalog-header-offset":`${offset}px`} as React.CSSProperties}>
  <FilteringSection kind={kind} filters={filters} onFilter={(field,value)=>navigate(kind,{...filters,[field]:value})} onSwitch={next=>{if(next===kind)return;const focused=document.activeElement; if(track.current?.contains(focused))document.getElementById(`catalog-tab-${next}`)?.focus({preventScroll:true});navigate(next,filters);requestAnimationFrame(()=>document.getElementById(`catalog-tab-${next}`)?.focus({preventScroll:true}))}} onReset={()=>navigate(kind,empty)}/>
  <div ref={track} className={styles.track}>
   <div data-kind="courses" role="tabpanel" id="catalog-panel-courses" aria-labelledby="catalog-tab-courses" aria-hidden={kind!=="courses"} inert={kind!=="courses"} className={styles.panel}><CoursesSection status={catalog.status} items={courseItems} filtered={filtered} demonstration={courseDemo} onReset={()=>navigate(kind,empty)}/></div>
   <div data-kind="mini-courses" role="tabpanel" id="catalog-panel-mini-courses" aria-labelledby="catalog-tab-mini-courses" aria-hidden={kind!=="mini-courses"} inert={kind!=="mini-courses"} className={styles.panel}><MiniCoursesSection status={catalog.status} items={miniItems} filtered={filtered} demonstration={miniDemo} onReset={()=>navigate(kind,empty)}/></div>
  </div>
 </div>
}
