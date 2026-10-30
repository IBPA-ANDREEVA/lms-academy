import { PageContainer } from "@/features/public-shell";
import { CourseCard } from "../../course-card";
import type { CatalogItem } from "../../catalog-data";
import styles from "./courses-section.module.css";
export function CoursesSection({items,filtered,onReset,demonstration}:{items:CatalogItem[];filtered:boolean;onReset:()=>void;demonstration:boolean}){
 return <section className={styles.section} aria-labelledby="course-results-title"><PageContainer size="wide"><div className={styles.heading}><h2 id="course-results-title">КУРСЫ</h2><p aria-live="polite">{demonstration?"Примеры оформления — набор и цены не утверждены":`Найдено курсов: ${items.length}`}</p></div>{items.length?<div className={styles.grid}>{items.map(item=><CourseCard key={item.id} course={item.course} variant="brutalist" demonstration={demonstration} />)}</div>:<div className={styles.empty}><h3>{filtered?"По этим фильтрам курсов нет":"Курсы готовятся к публикации"}</h3><p>{filtered?"Измените параметры или сбросьте фильтры.":"Здесь появятся программы после проверки содержания и условий обучения."}</p>{filtered&&<button type="button" onClick={onReset}>Сбросить фильтры</button>}</div>}</PageContainer></section>
}
