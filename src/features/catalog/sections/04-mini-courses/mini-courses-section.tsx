import { PageContainer } from "@/features/public-shell";
import { CourseCard } from "../../course-card";
import type { CatalogItem } from "../../catalog-data";
import styles from "../03-courses/courses-section.module.css";
export function MiniCoursesSection({items,filtered,onReset,demonstration}:{items:CatalogItem[];filtered:boolean;onReset:()=>void;demonstration:boolean}){
 return <section className={styles.section} aria-labelledby="mini-results-title"><PageContainer size="wide"><div className={styles.heading}><h2 id="mini-results-title">МИНИ-КУРСЫ</h2><p aria-live="polite">{demonstration?"Примеры оформления — набор и цены не утверждены":`Найдено мини-курсов: ${items.length}`}</p></div>{items.length?<div className={styles.grid}>{items.map(item=><CourseCard key={item.id} course={item.course} variant="compact" demonstration={demonstration} />)}</div>:<div className={styles.empty}><h3>{filtered?"По этим фильтрам мини-курсов нет":"Мини-курсы готовятся к публикации"}</h3><p>{filtered?"Измените параметры или сбросьте фильтры.":"Короткие уроки в записи появятся после утверждения программы. Без куратора и проверки работ."}</p>{filtered&&<button type="button" onClick={onReset}>Сбросить фильтры</button>}</div>}</PageContainer></section>
}
