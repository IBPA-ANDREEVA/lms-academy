import type { CourseCardProps } from "@/features/catalog";

// Presentation templates only. These are not published courses or offers.
export const placeholderCourses: { id: string; directionId: string; course: CourseCardProps["course"] }[] = [
  { id: "nails-template", directionId: "nails", course: { href: "/courses/course-nails", kind: "course", title: "Маникюр", direction: "Ногти" } },
  { id: "lashes-template", directionId: "lashes", course: { href: "/courses/course-lashes", kind: "course", title: "Наращивание ресниц", direction: "Ресницы" } },
  { id: "brows-template", directionId: "brows", course: { href: "/courses/course-brows", kind: "course", title: "Брови", direction: "Брови" } },
];

export const placeholderDirections = [
  { id: "nails", label: "Ногти", href: "#catalog-status" },
  { id: "lashes", label: "Ресницы", href: "#catalog-status" },
  { id: "brows", label: "Брови", href: "#catalog-status" },
];
