import type { CourseCardProps } from "@/features/catalog";
import placeholderImage from "./course-photo-placeholder.png";

// Presentation templates only. These are not published courses or offers.
export const placeholderCourses: { id: string; directionId: string; course: CourseCardProps["course"] }[] = [
  { id: "nails-template", directionId: "nails", course: { kind: "course", title: "Здесь будет название курса", direction: "Ногти", level: "Уровень уточняется", trainer: "Тренер — после публикации", image: { src: placeholderImage, alt: "Здесь будет фото курса" } } },
  { id: "lashes-template", directionId: "lashes", course: { kind: "course", title: "Здесь будет название курса", direction: "Ресницы", level: "Уровень уточняется", trainer: "Тренер — после публикации", image: { src: placeholderImage, alt: "Здесь будет фото курса" } } },
  { id: "brows-template", directionId: "brows", course: { kind: "course", title: "Здесь будет название курса", direction: "Брови", level: "Уровень уточняется", trainer: "Тренер — после публикации", image: { src: placeholderImage, alt: "Здесь будет фото курса" } } },
];

export const placeholderDirections = [
  { id: "nails", label: "Ногти", href: "#catalog-status" },
  { id: "lashes", label: "Ресницы", href: "#catalog-status" },
  { id: "brows", label: "Брови", href: "#catalog-status" },
];
