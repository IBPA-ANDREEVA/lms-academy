import type { CourseCardProps } from "./course-card";

export type CatalogItem = { id: string; directionId: string; levelId?: string; languages: string[]; course: CourseCardProps["course"] };

// Documented subject directions; final launch taxonomy/slugs remain open (OQ-017).
export const directions = [
  { id: "nails", label: "Ногти" },
  { id: "lash-extensions", label: "Наращивание ресниц" },
  { id: "lash-lamination", label: "Ламинирование ресниц" },
  { id: "brows", label: "Брови" },
  { id: "makeup", label: "Макияж" },
  { id: "cosmetology", label: "Косметология" },
] as const;
