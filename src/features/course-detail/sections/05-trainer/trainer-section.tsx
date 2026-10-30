import { PageContainer } from "@/features/public-shell";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import type { DetailProduct } from "../../detail-data";
import { MediaPlaceholder } from "../../components/media-placeholder";
import { SectionLabel } from "../../components/section-label";
import styles from "./trainer-section.module.css";

export function TrainerSection({ product }: { product: DetailProduct }) {
  return (
    <section id="trainer" className={styles.section} aria-labelledby="trainer-title">
      <PageContainer size="content" className={styles.grid}>
        <div className={styles.intro}>
          <SectionLabel>ПРЕПОДАВАТЕЛЬ</SectionLabel>
          <SectionHeading id="trainer-title" display>Человек<br /><span>за курсом</span></SectionHeading>
          <p>Автор уроков и куратор могут быть разными людьми. Профиль преподавателя появится после подтверждения данных.</p>
        </div>
        <div className={styles.portrait}>{product.trainer?.image
          ? <Image src={product.trainer.image.src} alt={product.trainer.image.alt} fill sizes="(max-width: 600px) 80vw, 30vw" />
          : <MediaPlaceholder portrait label="Фото преподавателя ожидает утверждения" />}</div>
        <div className={styles.bio}>
          <p className={styles.role}>АВТОР ОБУЧЕНИЯ</p>
          <h3>{product.trainer?.name ?? "Имя уточняется"}</h3>
          <p>{product.trainer?.biography ?? "Биография и релевантный опыт будут опубликованы после проверки."}</p>
          {product.trainer?.qualifications?.length
            ? <ul>{product.trainer.qualifications.map((qualification) => <li key={qualification}>{qualification}</li>)}</ul>
            : <p className={styles.qualifications}>Подтверждённые квалификации пока не предоставлены.</p>}
        </div>
      </PageContainer>
    </section>
  );
}
