// Owner-requested demonstration sizes, not a production eligibility/pricing policy.
export const packageSizes = [2, 3, 6] as const;
export type PackageSize = (typeof packageSizes)[number];

// Initial subject directions from requirements; no published course inventory exists.
export const previewChoices = [
  { id: "nails", direction: "Ногти" },
  { id: "lashes", direction: "Наращивание ресниц" },
  { id: "lamination", direction: "Ламинирование ресниц" },
  { id: "brows", direction: "Брови" },
  { id: "makeup", direction: "Макияж" },
  { id: "cosmetology", direction: "Косметология" },
] as const;
