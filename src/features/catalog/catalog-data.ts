import type { CourseCardProps } from "./course-card";

export type CatalogItem = { id: string; directionId: string; levelId?: string; languages: string[]; course: CourseCardProps["course"] };

// OQ-009: publication data has not been approved. These collections are intentionally empty.
export const publishedCourses: CatalogItem[] = [];
export const publishedMiniCourses: CatalogItem[] = [];

// Visual demonstration only. Links lead to explicitly marked detail previews, never checkout.
export const courseExamples: CatalogItem[] = [
  { id:"course-lashes",directionId:"lash-extensions",levelId:"beginner",languages:["ru"],course:{href:"/courses/course-lashes",kind:"course",title:"Пример курса: наращивание ресниц",direction:"Наращивание ресниц",level:"Начальный",language:"RU",format:"С куратором"}},
  { id:"course-nails",directionId:"nails",levelId:"beginner",languages:["ru"],course:{href:"/courses/course-nails",kind:"course",title:"Пример курса: маникюр",direction:"Ногти",level:"Начальный",language:"RU",format:"С куратором"}},
  { id:"course-lamination",directionId:"lash-lamination",levelId:"advanced",languages:["ru"],course:{href:"/courses/course-lamination",kind:"course",title:"Пример курса: ламинирование ресниц",direction:"Ламинирование ресниц",level:"Продвинутый",language:"RU",format:"С куратором"}},
  { id:"course-brows",directionId:"brows",levelId:"beginner",languages:["ru"],course:{href:"/courses/course-brows",kind:"course",title:"Пример курса: брови",direction:"Брови",level:"Начальный",language:"RU",format:"С куратором"}},
];
export const miniCourseExamples: CatalogItem[] = [
  { id:"mini-lashes",directionId:"lash-extensions",levelId:"beginner",languages:["ru"],course:{href:"/mini-courses/mini-lashes",kind:"mini-course",title:"Пример мини-курса: ресницы",direction:"Наращивание ресниц",level:"Начальный",language:"RU",format:"В записи"}},
  { id:"mini-nails",directionId:"nails",levelId:"beginner",languages:["ru"],course:{href:"/mini-courses/mini-nails",kind:"mini-course",title:"Пример мини-курса: покрытие",direction:"Ногти",level:"Начальный",language:"RU",format:"В записи"}},
  { id:"mini-brows",directionId:"brows",levelId:"beginner",languages:["ru"],course:{href:"/mini-courses/mini-brows",kind:"mini-course",title:"Пример мини-курса: окрашивание бровей",direction:"Брови",level:"Начальный",language:"RU",format:"В записи"}},
  { id:"mini-makeup",directionId:"makeup",levelId:"beginner",languages:["ru"],course:{href:"/mini-courses/mini-makeup",kind:"mini-course",title:"Пример мини-курса: макияж",direction:"Макияж",level:"Начальный",language:"RU",format:"В записи"}},
];

// Documented subject directions; final launch taxonomy/slugs remain open (OQ-017).
export const directions = [
  { id: "nails", label: "Ногти" },
  { id: "lash-extensions", label: "Наращивание ресниц" },
  { id: "lash-lamination", label: "Ламинирование ресниц" },
  { id: "brows", label: "Брови" },
  { id: "makeup", label: "Макияж" },
  { id: "cosmetology", label: "Косметология" },
] as const;
