import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  readdir,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { registryRuntime } from "../scripts/component-registry-runtime.mjs";
const rt = await registryRuntime();
const sandbox = await mkdtemp(path.join(tmpdir(), "lms-registry-tests-"));
const image = await readFile(
  "docs/design/references/pages/home/HOME-HERO-001.png",
);
test.after(async () => {
  for (const dir of [rt.dir, sandbox]) {
    assert.equal(path.dirname(dir), tmpdir());
    assert.match(path.basename(dir), /^lms-registry-/);
    await rm(dir, { recursive: true, force: true });
  }
});
async function fixture() {
  const root = await mkdtemp(path.join(sandbox, "fixture-"));
  await mkdir(path.join(root, "section-planning/pages"), { recursive: true });
  await mkdir(path.join(root, "references"));
  await writeFile(
    path.join(root, "references/INDEX.md"),
    "# Existing evidence\n\nKeep this text.\n",
  );
  await writeFile(
    path.join(root, "section-planning/pages/test.json"),
    JSON.stringify({
      id: "test",
      name: "Test",
      status: "approved",
      revision: 3,
      approval: { revision: 3 },
      issues: [],
      sections: [
        {
          id: "test--intro",
          name: "Intro",
          phase: "MVP",
          inclusion: "included",
          reviewed: true,
          content: "Real content",
          purpose: "Read",
          states: "Default",
          desktop: "Wide",
          mobile: "Stack",
          interactions: "Read",
          dependencies: "None",
        },
      ],
    }),
  );
  return root;
}
const def = () => ({
  ...rt.model.emptyDefinition("Test fixture"),
  purpose: "Test only",
  ownership: "test",
  usages: [
    {
      pageId: "test",
      sectionId: "test--intro",
      reason: "Testing",
      sourceRevision: 3,
    },
  ],
});
async function create(root) {
  return rt.store.mutate(
    {
      action: "create",
      id: "test-component",
      reviewer: "AUTOMATED FIXTURE ONLY",
      definition: def(),
    },
    root,
  );
}
const cmd = (c, action, extra = {}) => ({
  id: c.record.id,
  digest: c.digest,
  reviewer: "AUTOMATED FIXTURE ONLY",
  action,
  ...extra,
});
test("CRUD, approvals, architecture invalidation, archive/restore and immutable history", async () => {
  const root = await fixture();
  let c = await create(root);
  assert.equal(c.record.definitionStatus, "draft");
  c = await rt.store.mutate(cmd(c, "approve"), root);
  assert.equal(c.record.definitionApproval.revision, 2);
  assert.equal(c.record.visualStatus, "no-reference");
  const old = c;
  c = await rt.store.mutate(
    cmd(c, "save", {
      definition: {
        ...c.record.definition,
        name: "Renamed",
        description: "Changed",
      },
    }),
    root,
  );
  assert.equal(c.record.id, "test-component");
  assert.equal(c.record.definitionStatus, "in-review");
  assert.equal(c.record.definitionApproval, null);
  assert.equal(
    JSON.parse(
      await readFile(
        path.join(root, "components/history/test-component/2.json"),
      ),
    ).definitionApproval.revision,
    2,
  );
  await assert.rejects(
    () => rt.store.mutate(cmd(old, "review"), root),
    /Конфликт/,
  );
  await assert.rejects(
    () => rt.store.mutate(cmd(c, "archive"), root),
    /Подтвердите/,
  );
  c = await rt.store.mutate(cmd(c, "archive", { acknowledge: true }), root);
  assert.equal(c.record.archived, true);
  c = await rt.store.mutate(cmd(c, "restore"), root);
  assert.equal(c.record.archived, false);
  c = await rt.store.mutate(cmd(c, "request-changes"), root);
  assert.equal(c.record.definitionStatus, "changes-requested");
});
test("relationships reject unapproved/missing sources, require removal acknowledgement, preserve phase evidence", async () => {
  const root = await fixture();
  let c = await create(root);
  await assert.rejects(
    () =>
      rt.store.mutate(
        cmd(c, "save", {
          definition: {
            ...c.record.definition,
            usages: [
              {
                pageId: "test",
                sectionId: "test--missing",
                reason: "x",
                sourceRevision: 3,
              },
            ],
          },
        }),
        root,
      ),
    /утверждённую/,
  );
  await assert.rejects(
    () =>
      rt.store.mutate(
        cmd(c, "save", { definition: { ...c.record.definition, usages: [] } }),
        root,
      ),
    /Подтвердите/,
  );
  c = await rt.store.mutate(
    cmd(c, "save", {
      definition: { ...c.record.definition, usages: [] },
      acknowledge: true,
    }),
    root,
  );
  assert.equal(c.record.definition.usages.length, 0);
});
test("upload validation: extension, signatures, size and executable content", () => {
  assert.equal(rt.validation.validateImage("reference.PNG", image), "png");
  for (const [name, bytes] of [
    ["image.jpg", image],
    ["image.svg", image],
    ["x.png", Buffer.from("<script>alert(1)</script>".repeat(5))],
    ["large.png", Buffer.alloc(8 * 1024 * 1024 + 1)],
    ["x.webp", Buffer.from("RIFFnotwebp".repeat(10))],
  ])
    assert.throws(() => rt.validation.validateImage(name, bytes));
  const truncated = image.subarray(0, 100);
  assert.throws(() => rt.validation.validateImage("x.png", truncated));
});
test("references preserve definition approval; docs, reorder, replace, removal and retained assets", async () => {
  const root = await fixture();
  let c = await create(root);
  c = await rt.store.mutate(cmd(c, "approve"), root);
  c = await rt.store.mutate(
    cmd(c, "upload", {
      filename: "../../first.png",
      base64: image.toString("base64"),
    }),
    root,
  );
  const ref = c.record.references[0];
  assert.equal(ref.originalFilename, "first.png");
  assert.equal(c.record.definitionStatus, "approved");
  assert.equal(c.record.visualStatus, "references-added");
  c = await rt.store.mutate(
    cmd(c, "edit-reference", {
      referenceId: ref.id,
      reference: Object.fromEntries(
        rt.model.referenceFields.map((k) => [
          k,
          k === "title"
            ? "Precise reference"
            : k === "sourceUrl"
              ? "https://example.org/source"
              : `Specific ${k}`,
        ]),
      ),
    }),
    root,
  );
  const doc = await readFile(
    path.join(root, `references/components/test-component/${ref.id}.md`),
    "utf8",
  );
  assert.match(doc, /Specific borrow/);
  assert.match(doc, /Specific reject/);
  assert.match(doc, /Specific mobile/);
  const before = await readFile(path.join(root, "components/INDEX.md"));
  await rt.store.syncDocs(root);
  assert.deepEqual(
    await readFile(path.join(root, "components/INDEX.md")),
    before,
  );
  assert.match(
    await readFile(path.join(root, "references/INDEX.md"), "utf8"),
    /Keep this text/,
  );
  c = await rt.store.mutate(
    cmd(c, "upload", {
      filename: "second.png",
      base64: image.toString("base64"),
    }),
    root,
  );
  c = await rt.store.mutate(
    cmd(c, "reorder-references", {
      order: c.record.references.map((r) => r.id).reverse(),
    }),
    root,
  );
  c = await rt.store.mutate(
    cmd(c, "primary-reference", { primaryReferenceId: ref.id }),
    root,
  );
  c = await rt.store.mutate(
    cmd(c, "upload", {
      referenceId: ref.id,
      filename: "replace.png",
      base64: image.toString("base64"),
    }),
    root,
  );
  assert.equal(
    c.record.references.find((r) => r.id === ref.id).title,
    "Precise reference",
  );
  assert.notEqual(
    c.record.references.find((r) => r.id === ref.id).imagePath,
    ref.imagePath,
  );
  await readFile(path.join(root, ref.imagePath));
  c = await rt.store.mutate(
    cmd(c, "remove-reference", { referenceId: ref.id }),
    root,
  );
  assert.equal(c.record.primaryReferenceId, null);
  await readFile(path.join(root, ref.imagePath));
  await assert.rejects(() => rt.store.imageBytes("../outside", ref.id, root));
});
test("visual approval invalidates independently, including selected reference and approved explanation", async () => {
  const root = await fixture();
  let c = await create(root);
  c = await rt.store.mutate(cmd(c, "approve"), root);
  c = await rt.store.mutate(
    cmd(c, "upload", { filename: "x.png", base64: image.toString("base64") }),
    root,
  );
  const record = c.record;
  const approval = {
    reviewer: "ISOLATED FUTURE WORKFLOW FIXTURE",
    timestamp: new Date().toISOString(),
    revision: record.revision,
  };
  record.visualStatus = "design-approved";
  record.visualApproval = approval;
  record.references[0].status = "approved";
  record.references[0].approval = approval;
  await writeFile(
    path.join(root, "components/registry/test-component.json"),
    JSON.stringify(record, null, 2) + "\n",
  );
  c = (await rt.store.readComponents(root))[0];
  c = await rt.store.mutate(
    cmd(c, "edit-reference", {
      referenceId: record.references[0].id,
      reference: Object.fromEntries(
        rt.model.referenceFields.map((k) => [
          k,
          k === "explanation" ? "Changed explanation" : record.references[0][k],
        ]),
      ),
    }),
    root,
  );
  assert.equal(c.record.visualStatus, "design-in-review");
  assert.equal(c.record.visualApproval, null);
  assert.equal(c.record.references[0].approval, null);
  assert.equal(c.record.references[0].status, "in-review");
  assert.equal(c.record.definitionStatus, "approved");
});
test("strict validation rejects traversal, injected lifecycle, unsafe URLs and dependency cycles", async () => {
  const root = await fixture();
  let c = await create(root);
  await assert.rejects(() =>
    rt.store.mutate({ ...cmd(c, "review"), id: "../outside" }, root),
  );
  await assert.rejects(
    () =>
      rt.store.mutate(
        { ...cmd(c, "review"), definitionStatus: "approved" },
        root,
      ),
    /Неизвестное поле/,
  );
  await assert.rejects(() =>
    rt.store.mutate(
      cmd(c, "save", {
        definition: { ...c.record.definition, dependencies: [c.record.id] },
      }),
      root,
    ),
  );
  await assert.rejects(() =>
    rt.store.mutate(cmd(c, "approve", { reviewer: "" }), root),
  );
  assert.throws(
    () =>
      rt.validation.referenceEdit(
        Object.fromEntries(
          rt.model.referenceFields.map((k) => [
            k,
            k === "title"
              ? "x"
              : k === "sourceUrl"
                ? "javascript:alert(1)"
                : "",
          ]),
        ),
      ),
    /HTTP/,
  );
  c = await rt.store.mutate(
    cmd(c, "save", { definition: { ...c.record.definition, notes: "Safe" } }),
    root,
  );
  assert.equal(c.record.definition.notes, "Safe");
});
test("concurrent writes cannot both overwrite one revision; pending projection recovery", async () => {
  const root = await fixture();
  const c = await create(root);
  const results = await Promise.allSettled([
    rt.store.mutate(cmd(c, "review"), root),
    rt.store.mutate(cmd(c, "request-changes"), root),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  await writeFile(path.join(root, "components/.sync-pending"), "pending");
  await writeFile(
    path.join(root, "components/specs/test-component.md"),
    "interrupted projection",
  );
  await rt.store.recoverDocs(root);
  assert.match(
    await readFile(
      path.join(root, "components/specs/test-component.md"),
      "utf8",
    ),
    /Test fixture/,
  );
  assert.ok(
    !(await readdir(path.join(root, "components"))).includes(".sync-pending"),
  );
});
test("production, host, origin and token guards", () => {
  const oldEnv = process.env.NODE_ENV;
  const oldFlag = process.env.COMPONENTS_WORKSPACE;
  try {
    process.env.NODE_ENV = "production";
    process.env.COMPONENTS_WORKSPACE = "1";
    assert.throws(
      () =>
        rt.server.guard(
          new Request("http://localhost:3000/dev/components/data", {
            headers: { host: "localhost:3000" },
          }),
        ),
      /Not found/,
    );
    process.env.NODE_ENV = "development";
    assert.throws(
      () =>
        rt.server.guard(
          new Request("http://localhost:3000/dev/components/data", {
            headers: { host: "evil.example:3000" },
          }),
        ),
      /локальный/,
    );
    assert.throws(
      () =>
        rt.server.guard(
          new Request("http://localhost:3000/dev/components/data", {
            headers: { host: "localhost:3000", forwarded: "host=evil.example" },
          }),
        ),
      /Прокси/,
    );
    assert.throws(
      () =>
        rt.server.guard(
          new Request("http://localhost:3000/dev/components/data", {
            method: "POST",
            headers: { host: "localhost:3000", origin: "https://evil.example" },
          }),
          true,
        ),
      /источник/,
    );
    assert.throws(
      () =>
        rt.server.guard(
          new Request("http://localhost:3000/dev/components/data", {
            method: "POST",
            headers: {
              host: "localhost:3000",
              origin: "http://localhost:3000",
            },
          }),
          true,
        ),
      /Сессия/,
    );
  } finally {
    process.env.NODE_ENV = oldEnv;
    if (oldFlag === undefined) delete process.env.COMPONENTS_WORKSPACE;
    else process.env.COMPONENTS_WORKSPACE = oldFlag;
  }
});
