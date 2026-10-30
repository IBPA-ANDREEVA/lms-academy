import { FilterDropdown } from "./components/filter-dropdown";
import { directions } from "../../catalog-data";
import styles from "./filtering-section.module.css";

export type Filters = { direction: string; language: string; level: string };
export function FilteringSection({kind,filters,onFilter,onSwitch,onReset}:{kind:"courses"|"mini-courses";filters:Filters;onFilter:(field:keyof Filters,value:string)=>void;onSwitch:(kind:"courses"|"mini-courses")=>void;onReset:()=>void}){
  return <section id="catalog-filters" className={styles.filters} aria-label="Фильтры каталога">
    <div className={styles.inner}>
      <div className={styles.tabs} role="tablist" aria-label="Формат обучения">
        <button id="catalog-tab-courses" type="button" role="tab" aria-selected={kind==="courses"} aria-controls="catalog-panel-courses" tabIndex={kind==="courses"?0:-1} onClick={()=>onSwitch("courses")} onKeyDown={e=>{if(e.key==="ArrowRight"||e.key==="End"){e.preventDefault();onSwitch("mini-courses");}else if(e.key==="ArrowLeft"||e.key==="Home"){e.preventDefault();onSwitch("courses");}}}>Курсы</button>
        <button id="catalog-tab-mini-courses" type="button" role="tab" aria-selected={kind==="mini-courses"} aria-controls="catalog-panel-mini-courses" tabIndex={kind==="mini-courses"?0:-1} onClick={()=>onSwitch("mini-courses")} onKeyDown={e=>{if(e.key==="ArrowLeft"||e.key==="Home"){e.preventDefault();onSwitch("courses");}else if(e.key==="ArrowRight"||e.key==="End"){e.preventDefault();onSwitch("mini-courses");}}}>Мини-курсы</button>
      </div>
      <FilterDropdown label="Направление" value={filters.direction} onChange={value=>onFilter("direction",value)} options={[{value:"",label:"Все направления"},...directions.map(d=>({value:d.id,label:d.label}))]} />
      <FilterDropdown label="Язык курса" value={filters.language} onChange={value=>onFilter("language",value)} options={[{value:"",label:"Любой"},{value:"ru",label:"Русский"},{value:"en",label:"Английский"}]} />
      <FilterDropdown label="Уровень" value={filters.level} onChange={value=>onFilter("level",value)} options={[{value:"",label:"Все уровни"},{value:"beginner",label:"Начальный"},{value:"advanced",label:"Продвинутый"}]} />
      <button className={styles.reset} type="button" onClick={onReset}>Сбросить фильтры</button>
    </div>
  </section>;
}
