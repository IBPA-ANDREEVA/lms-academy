export const phases = [
  "MVP",
  "Phase 2",
  "Phase 3",
  "Conditional",
  "Unresolved",
] as const;
export type Phase = (typeof phases)[number];
export type Status = "draft" | "in-review" | "changes-requested" | "approved";
export const statusLabels: Record<Status, string> = {
  draft: "Черновик",
  "in-review": "На проверке",
  "changes-requested": "Нужны изменения",
  approved: "Утверждено",
};
export const phaseLabels: Record<Phase, string> = {
  MVP: "MVP",
  "Phase 2": "Этап 2",
  "Phase 3": "Этап 3",
  Conditional: "Условно",
  Unresolved: "Фаза не решена",
};
export type Section = {
  id: string;
  name: string;
  position: number;
  purpose: string;
  content: string;
  primaryAction: string;
  interactions: string;
  dependencies: string;
  sources: string[];
  phase: Phase;
  inclusion: "included" | "conditional" | "excluded";
  required: boolean;
  reviewed: boolean;
  desktop: string;
  mobile: string;
  states: string;
  notes: string;
};
export type Approval = { reviewer: string; date: string; revision: number };
export type History = {
  revision: number;
  date: string;
  action: string;
  reviewer: string;
  previousApproval: Approval | null;
  status: Status;
};
export type PageSpec = {
  schemaVersion: 1;
  id: string;
  name: string;
  group: string;
  route: string | null;
  routeStatus: "implemented-starter" | "proposed" | "unresolved" | "confirmed";
  roles: string[];
  phase: Phase;
  purpose: string;
  primaryAction: string;
  requiredContent: string;
  dependencies: string;
  issues: string[];
  sources: string[];
  implementation: string;
  notes: string;
  revision: number;
  status: Status;
  approval: Approval | null;
  history: History[];
  sections: Section[];
  deletedSections: Section[];
};
export type LoadedPage = { page: PageSpec; digest: string };
export type Bundle = {
  pages: LoadedPage[];
  token: string;
  questions: Record<string, string>;
};
export type Command = {
  id: string;
  digest: string;
  action: "save" | "review" | "approve" | "request-changes";
  reviewer: string;
  notes: string;
  sections: Section[];
  acknowledged: string[];
};
