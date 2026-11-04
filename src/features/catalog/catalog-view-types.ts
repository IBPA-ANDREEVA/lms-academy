/** Temporary frontend/preview view types, not an authoritative API contract.
 * Replace transport types with generated FastAPI OpenAPI contracts during integration.
 * No persistence, React or secret imports.
 */
export type ProductKind = "course" | "mini-course";
export type Locale = "ru" | "en";
export type CatalogProduct = {
  id: string;
  slug: string;
  kind: ProductKind;
  category: { id: string; title: string };
  publication: "draft" | "published" | "archived";
  approval: "pending" | "approved";
  sale: "open" | "paused";
  priceApproval: "pending" | "approved";
  content: Partial<Record<Locale, { title: string; description: string; outcomes?: string[] }>>;
  languages: Locale[];
  trainer: { id: string; name: string; photo?: { src: string; alt: string }; approvedCredentials: string[] };
  level: "beginner" | "advanced";
  curriculum: { title: string; lessons: { title: string; durationMinutes: number }[] }[];
  lessonCount: number;
  durationMinutes: number;
  cover?: { src: string; alt: string };
  preview?: { url: string; captionsUrl?: string };
  price: { amountMinor: number; currency: "USD" } | null;
  curatorSupport: boolean;
  completionRequirements: string[];
  reviews?: { approved: true; text: string; authorDisplayName: string }[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  demonstration: boolean;
};
export type CatalogQuery = { kind?: ProductKind; category?: string; language?: Locale };
export type CatalogResult =
  | { status: "success"; products: CatalogProduct[] }
  | { status: "empty"; products: [] }
  | { status: "unavailable"; products: []; diagnosticId: string };
export type ProductResult =
  | { status: "success"; product: CatalogProduct }
  | { status: "missing" }
  | { status: "unavailable"; diagnosticId: string };
