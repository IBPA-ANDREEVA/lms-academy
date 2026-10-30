import { courseExamples, miniCourseExamples } from "@/features/catalog";
import type { ReactNode } from "react";
import type { ImageProps } from "next/image";

export type DetailKind = "course" | "mini-course";
export type OfferState = "available" | "unavailable" | "owned" | "loading" | "error";

export type DetailLesson = { title: string; duration?: string };
export type DetailModule = { title: string; lessons: DetailLesson[] };

export type DetailProduct = {
  slug: string;
  kind: DetailKind;
  title: string;
  direction?: string;
  level?: string;
  language?: string;
  duration?: string;
  lessonCount?: number;
  summary?: string;
  heroImage?: { src: ImageProps["src"]; alt: string };
  description?: string;
  outcomes?: string[];
  modules?: DetailModule[];
  previewUrl?: string;
  previewCaptionsUrl?: string;
  trainer?: { name: string; biography?: string; qualifications?: string[]; image?: { src: ImageProps["src"]; alt: string } };
  priceLabel?: string;
  accessTerms?: string;
  supportTerms?: string;
  certificateTerms?: string;
  refundTerms?: string;
  offerState: OfferState;
  purchaseAction?: ReactNode;
  learningHref?: string;
  demonstration?: boolean;
};

/** OQ-009: these are review-only pages derived from catalog examples, not published offers. */
export function getDetailProduct(kind: DetailKind, slug: string): DetailProduct | null {
  const item = (kind === "course" ? courseExamples : miniCourseExamples).find((entry) => entry.id === slug);
  if (!item) return null;

  return {
    slug,
    kind,
    title: item.course.title,
    direction: item.course.direction,
    level: item.course.level,
    language: item.course.language,
    offerState: "unavailable",
    demonstration: true,
  };
}
