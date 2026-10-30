import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import styles from "./course-card.module.css";

export type CourseCardProps = {
  course: {
    href?: string;
    title: string;
    kind: "course" | "mini-course";
    image?: { src: ImageProps["src"]; alt: string };
    direction?: string;
    level?: string;
    language?: string;
    trainer?: string;
    duration?: string;
    format?: string;
    priceLabel?: string;
  };
  headingLevel?: "h2" | "h3";
  status?: "available" | "owned" | "in-cart" | "unavailable" | "stale";
  action?: ReactNode;
  variant?: "default" | "brutalist" | "compact";
  demonstration?: boolean;
};

const statusLabels = {
  available: "",
  owned: "Курс уже приобретён",
  "in-cart": "В корзине",
  unavailable: "Сейчас недоступен",
  stale: "Условия изменились. Проверьте их на странице курса.",
};

/** Presentation only. Commerce supplies an authorized action and server-formatted price. */
export function CourseCard({
  course,
  headingLevel: Heading = "h3",
  status = "available",
  action,
  variant = "default",
  demonstration = false,
}: CourseCardProps) {
  const detailPreview = demonstration && course.href;
  return (
    <article className={`${styles.card} ${styles[variant]} ${detailPreview ? styles.clickable : ""}`}>
      {course.image ? (
        <div className={styles.media}>
          <Image
            src={course.image.src}
            alt={course.image.alt}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : variant !== "default" ? <div className={styles.media} aria-hidden="true"><span className={styles.imageMark}>◇</span></div> : null}
      <div className={styles.content}>
        {demonstration && <p className={styles.demo}>ДЕМОНСТРАЦИЯ КАРТОЧКИ</p>}
        <p className={styles.meta}>
          {[
            course.kind === "mini-course" ? "Мини-курс" : "Курс",
            course.direction,
            course.level,
            course.language,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <Heading className={styles.title}>
          {course.href ? <Link href={course.href}>{course.title}</Link> : course.title}
        </Heading>
        {course.trainer && <p>{course.trainer}</p>}
        {(course.duration || course.format) && (
          <p className={styles.meta}>
            {[course.duration, course.format].filter(Boolean).join(" · ")}
          </p>
        )}
        {course.kind === "mini-course" && (
          <p className={styles.meta}>В записи, без куратора и проверки работ</p>
        )}
        {course.priceLabel && (
          <p className={styles.price}>{course.priceLabel}</p>
        )}
        {status !== "available" && (
          <p className={styles.meta}>{statusLabels[status]}</p>
        )}
        {status === "available" && action && !demonstration && (
          <div className={styles.action}>{action}</div>
        )}
        {demonstration && (
          <div className={styles.action}>
            {course.href ? (
              <ButtonLink
                href={course.href}
                appearance="cut"
                intent="secondary"
                aria-label={variant === "compact" ? `Открыть пример мини-курса: ${course.title}` : undefined}
              >
                {variant === "compact" ? "→" : "Смотреть пример →"}
              </ButtonLink>
            ) : (
              <Button appearance="cut" intent="secondary" disabled>После публикации</Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
