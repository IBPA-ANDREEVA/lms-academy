import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/features/public-shell";
import type { DetailProduct } from "../../detail-data";
import { MediaPlaceholder } from "../../components/media-placeholder";
import { PurchasePanel } from "../../components/purchase-panel";
import { ProductFacts } from "./components/product-facts";
import styles from "./hero-purchase-section.module.css";

export function HeroPurchaseSection({ product }: { product: DetailProduct }) {
  const catalogHref = product.kind === "mini-course" ? "/mini-courses" : "/courses";
  return (
    <section className={styles.section} aria-labelledby="detail-title">
      <PageContainer size="content">
        <nav aria-label="Хлебные крошки" className={styles.crumbs}>
          <Link href="/">Главная</Link><span aria-hidden="true">/</span>
          <Link href={catalogHref}>{product.kind === "mini-course" ? "Мини-курсы" : "Курсы"}</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{product.title}</span>
        </nav>
        <div className={styles.grid}>
          <div className={styles.copy}>
            {product.demonstration && <p className={styles.demo}>ДЕМОНСТРАЦИЯ СТРАНИЦЫ · ПРОДУКТ НЕ ОПУБЛИКОВАН</p>}
            <p className={styles.kind}>{product.kind === "mini-course" ? "КОРОТКОЕ ОБУЧЕНИЕ В ЗАПИСИ" : "ПРАКТИЧЕСКОЕ ОБУЧЕНИЕ"}</p>
            <h1 id="detail-title">{product.title}</h1>
            <p className={styles.summary}>{product.summary ?? "Описание, программа и условия появятся после утверждения курса."}</p>
            <ProductFacts product={product} />
            <ButtonLink href="#preview" appearance="cut" intent="secondary" className={styles.previewLink}>Смотреть превью ↓</ButtonLink>
          </div>
          <div className={styles.media}>
            {product.heroImage
              ? <Image src={product.heroImage.src} alt={product.heroImage.alt} fill sizes="(max-width: 760px) 100vw, 55vw" />
              : <MediaPlaceholder label={product.kind === "mini-course" ? "Медиа мини-курса ожидает утверждения" : "Медиа курса ожидает утверждения"} />}
          </div>
          <div className={styles.purchase}><PurchasePanel product={product} /></div>
        </div>
      </PageContainer>
    </section>
  );
}
