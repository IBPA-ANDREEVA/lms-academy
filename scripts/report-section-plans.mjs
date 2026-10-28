import { readFile, readdir, writeFile } from "node:fs/promises";
const root = "docs/design/section-planning";
const pages = await Promise.all(
  (await readdir(root + "/pages"))
    .filter((x) => x.endsWith(".json"))
    .map(async (f) => JSON.parse(await readFile(root + "/pages/" + f, "utf8"))),
);
const groups = [
  "Public",
  "Commerce",
  "Authentication",
  "Legal",
  "Student",
  "Trainer",
  "Manager",
  "Administration",
];
const lines = [
  "# Initial section review inventory",
  "",
  "Generated from the JSON documents. This is a review snapshot; the workspace and JSON files are authoritative after edits. No URL or structure approval is implied. Rebuild this summary with `node scripts/report-section-plans.mjs`.",
  "",
  `${pages.length} pages/screens; ${pages.reduce((n, p) => n + p.sections.length, 0)} meaningful sections. ${pages.filter((p) => p.status === "approved").length} approved.`,
  "",
  "All non-root URL spellings are proposals. `/` is implemented only as the starter. Required screens with no URL may become nested screens or in-page surfaces after structure review, rather than separate routes.",
  "",
];
for (const group of groups) {
  lines.push(
    `## ${group}`,
    "",
    "| Page / source specification | URL status | Phase | Ordered sections |",
    "| --- | --- | --- | --- |",
  );
  for (const p of pages.filter((p) => p.group === group))
    lines.push(
      `| [${p.name}](pages/${p.id}.json) | ${p.route ? "`" + p.route + "` · " + p.routeStatus : "Unresolved URL"} | ${p.phase} | ${p.sections.map((s) => s.name + (s.phase !== p.phase ? " [" + s.phase + "]" : "")).join(" → ")} |`,
    );
  lines.push("");
}
await writeFile(root + "/INVENTORY.md", lines.join("\n") + "\n");
console.log(
  JSON.stringify(
    {
      pages: pages.length,
      sections: pages.reduce((n, p) => n + p.sections.length, 0),
      phases: Object.fromEntries(
        ["MVP", "Phase 2", "Phase 3", "Conditional", "Unresolved"].map((x) => [
          x,
          pages.filter((p) => p.phase === x).length,
        ]),
      ),
      groups: Object.fromEntries(
        groups.map((x) => [x, pages.filter((p) => p.group === x).length]),
      ),
    },
    null,
    2,
  ),
);
