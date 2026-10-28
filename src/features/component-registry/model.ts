export const categories = [
  "primitive",
  "shared",
  "feature",
  "section",
] as const;
export const definitions = [
  "draft",
  "in-review",
  "changes-requested",
  "approved",
] as const;
export const visuals = [
  "no-reference",
  "references-added",
  "design-in-review",
  "design-approved",
] as const;
export const priorities = ["P0", "P1", "P2", "P3"] as const;
export const labels: Record<string, string> = {
  primitive: "UI-примитив",
  shared: "Общая композиция",
  feature: "Компонент модуля",
  section: "Уникальная секция",
  draft: "Черновик",
  "in-review": "На проверке",
  "changes-requested": "Нужны изменения",
  approved: "Утверждено",
  "no-reference": "MISSING REFERENCE",
  "references-added": "Референсы добавлены",
  "design-in-review": "Дизайн на проверке",
  "design-approved": "Дизайн утверждён",
  "not-started": "Не начато",
  "in-progress": "В работе",
  implemented: "Реализовано",
  "qa-approved": "QA утверждено",
};
export type Approval = {
  reviewer: string;
  timestamp: string;
  revision: number;
};
export type Usage = {
  pageId: string;
  sectionId: string;
  reason: string;
  sourceRevision: number;
};
export type Reference = {
  id: string;
  componentId: string;
  imagePath: string;
  originalFilename: string;
  uploadedAt: string;
  title: string;
  sourceUrl: string;
  explanation: string;
  borrow: string;
  reject: string;
  appearance: string;
  layout: string;
  desktop: string;
  mobile: string;
  interaction: string;
  unresolved: string;
  status: "exploratory" | "in-review" | "approved";
  approval: Approval | null;
};
export const detailFields = [
  "name",
  "description",
  "purpose",
  "ownership",
  "implementationPath",
  "requiredData",
  "interactions",
  "states",
  "responsive",
  "variants",
  "openQuestions",
  "implementationNotes",
  "notes",
] as const;
export type Definition = Record<(typeof detailFields)[number], string> & {
  category: (typeof categories)[number];
  priority: (typeof priorities)[number];
  usages: Usage[];
  dependencies: string[];
};
export type ComponentRecord = {
  schemaVersion: 1;
  id: string;
  revision: number;
  definition: Definition;
  definitionStatus: (typeof definitions)[number];
  definitionApproval: Approval | null;
  visualStatus: (typeof visuals)[number];
  visualApproval: Approval | null;
  implementationStatus:
    "not-started" | "in-progress" | "implemented" | "qa-approved";
  primaryReferenceId: string | null;
  references: Reference[];
  archived: boolean;
  history: {
    revision: number;
    timestamp: string;
    reviewer: string;
    action: string;
    previousDefinitionApproval: Approval | null;
    previousVisualApproval: Approval | null;
  }[];
};
export type Loaded = { record: ComponentRecord; digest: string };
export type SourceSection = {
  pageId: string;
  pageName: string;
  sectionId: string;
  name: string;
  phase: string;
  inclusion: string;
  revision: number;
  approved: boolean;
  content: string;
  purpose: string;
  states: string;
  desktop: string;
  mobile: string;
  interactions: string;
  dependencies: string;
  issues: string[];
};
export type Bundle = {
  components: Loaded[];
  sources: SourceSection[];
  pages: { id: string; name: string; status: string; revision: number }[];
  token: string;
};
export function emptyDefinition(name = "Новый компонент"): Definition {
  return {
    name,
    description: "",
    purpose: "",
    ownership: "",
    implementationPath: "",
    requiredData: "",
    interactions: "",
    states: "",
    responsive: "",
    variants: "",
    openQuestions: "",
    implementationNotes: "",
    notes: "",
    category: "section",
    priority: "P2",
    usages: [],
    dependencies: [],
  };
}
export const referenceFields = [
  "title",
  "sourceUrl",
  "explanation",
  "borrow",
  "reject",
  "appearance",
  "layout",
  "desktop",
  "mobile",
  "interaction",
  "unresolved",
] as const;
