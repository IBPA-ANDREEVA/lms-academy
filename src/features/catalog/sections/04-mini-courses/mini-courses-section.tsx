import { PageContainer } from "@/features/public-shell";
import { CourseCard } from "../../course-card";
import { CatalogState } from "../../components/catalog-state";
import type { CatalogItem } from "../../catalog-data";
import type { CatalogResult } from "@/server/catalog/contracts";
import styles from "../03-courses/courses-section.module.css";
export function MiniCoursesSection({items,filtered,onReset,demonstration,status="success"}:{items:CatalogItem[];filtered:boolean;onReset:()=>void;demonstration:boolean;status?:CatalogResult["status"]|"loading"}){
 return <section className={styles.section} aria-labelledby="mini-results-title"><PageContainer reveal="cards" size="wide"><div className={styles.heading}><h2 id="mini-results-title">МИНИ-КУРСЫ</h2></div>{status === "unavailable" || status === "loading" || !items.length ? <CatalogState status={status} mini={true} filtered={filtered} onReset={onReset} /> : <><p role="status">Программ: {items.length}{demonstration ? " · Демонстрационные данные" : ""}</p><div className={styles.grid}>{items.map(item=><CourseCard key={item.id} course={item.course} variant="compact" demonstration={demonstration} />)}</div></>}</PageContainer></section>;
}
