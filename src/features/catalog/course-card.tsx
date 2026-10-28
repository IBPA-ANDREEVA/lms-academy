import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./course-card.module.css";

export type CourseCardProps = {
  course: {
    href: string;
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
}: CourseCardProps) {
  return (
    <article className={styles.card}>
      {course.image && (
        <div className={styles.media}>
          <Image
            src={course.image.src}
            alt={course.image.alt}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className={styles.content}>
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
          <Link href={course.href}>{course.title}</Link>
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
        {status === "available" && action && (
          <div className={styles.action}>{action}</div>
        )}
      </div>
    </article>
  );
}
