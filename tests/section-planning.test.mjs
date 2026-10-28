import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  readFile,
  writeFile,
  readdir,
  mkdir,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Compile the real store into an isolated temporary ESM directory. No test writes
// touch the user's version-controlled planning files.
const sandbox = await mkdtemp(path.join(tmpdir(), "lms-planning-test-"));
for (const name of ["model", "validation", "store", "server"]) {
  const source = await readFile(
    `src/features/section-planning/${name}.ts`,
    "utf8",
  );
  const output = ts
    .transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
    })
    .outputText.replace(/from (["'])(\.\/[^"']+)\1/g, 'from "$2.mjs"');
  await writeFile(path.join(sandbox, `${name}.mjs`), output);
}
const { readPage, readPages, savePage } = await import(
  pathToFileURL(path.join(sandbox, "store.mjs")).href
);
const { guard } = await import(
  pathToFileURL(path.join(sandbox, "server.mjs")).href
);
const { validateCommand } = await import(
  pathToFileURL(path.join(sandbox, "validation.mjs")).href
);
test.after(async () => {
  assert.equal(path.dirname(path.resolve(sandbox)),path.resolve(tmpdir()));
  assert.ok(path.basename(sandbox).startsWith('lms-planning-test-'));
  await rm(sandbox, { recursive: true, force: true });
});
async function fixture() {
  const root = await mkdtemp(path.join(sandbox, "pages-"));
  const fixture = JSON.parse(
    await readFile("docs/design/section-planning/pages/home.json", "utf8"),
  );
  Object.assign(fixture, {
    revision: 1,
    status: "draft",
    approval: null,
    history: [],
    notes: "",
    deletedSections: [],
  });
  fixture.sections.forEach((s) => (s.reviewed = false));
  await writeFile(
    path.join(root, "home.json"),
    JSON.stringify(fixture, null, 2) + "\n",
  );
  return root;
}
function command(item, overrides = {}) {
  return {
    id: item.page.id,
    digest: item.digest,
    action: "save",
    reviewer: "Test reviewer",
    notes: item.page.notes,
    sections: structuredClone(item.page.sections),
    acknowledged: [],
    ...overrides,
  };
}

test("inventory: valid unique pages/sections, existing sources and explicit approval metadata", async () => {
  const pages = await readPages();
  assert.equal(pages.length, 60);
  const ids = new Set();
  for (const item of pages) {
    validateCommand(command(item));
    if (item.page.status === "approved") {
      assert.ok(item.page.approval?.reviewer);
      assert.equal(item.page.approval.revision, item.page.revision);
    } else assert.equal(item.page.approval, null);
    assert.ok(item.page.sections.length);
    for (const [index, s] of item.page.sections.entries()) {
      assert.ok(!ids.has(s.id));
      ids.add(s.id);
      assert.equal(s.position, index + 1);
      for (const source of s.sources) await readFile(source.split("#")[0]);
    }
  }
  const sitemap = await readFile("docs/architecture/public-sitemap.md", "utf8");
  const routes = [...sitemap.matchAll(/^\| `(\/[^`]*|\/)` \|/gm)].map(
    (m) => m[1],
  );
  for (const route of routes)
    assert.ok(
      pages.some((x) => x.page.route === route),
      `Missing ${route}`,
    );
});
test("save, reorder, delete, reload and restore retain stable identities", async () => {
  const root = await fixture();
  let item = await readPage("home", root);
  const cmd = command(item);
  const first = cmd.sections.shift();
  cmd.sections.push(first);
  cmd.sections[0].purpose = "Edited purpose";
  item = await savePage(cmd, root);
  assert.equal(item.page.revision, 2);
  assert.equal(item.page.sections.at(-1).id, first.id);
  const deletion = command(item);
  deletion.sections = deletion.sections.filter((s) => s.id !== first.id);
  await assert.rejects(savePage(deletion, root), /Подтвердите/);
  deletion.acknowledged = [first.id];
  item = await savePage(deletion, root);
  item = await readPage("home", root);
  assert.equal(item.page.deletedSections[0].id, first.id);
  const restore = command(item);
  restore.sections.push(item.page.deletedSections[0]);
  item = await savePage(restore, root);
  assert.equal(item.page.deletedSections.length, 0);
  assert.ok(item.page.sections.some((s) => s.id === first.id));
});
test("approval requires identity and saved reviewed content; edits invalidate but preserve evidence", async () => {
  const root = await fixture();
  let item = await readPage("home", root);
  await assert.rejects(
    savePage(command(item, { action: "approve", reviewer: "" }), root),
    /имя/,
  );
  await assert.rejects(
    savePage(command(item, { action: "approve" }), root),
    /Проверьте/,
  );
  const review = command(item);
  review.sections.forEach((s) => (s.reviewed = true));
  item = await savePage(review, root);
  item = await savePage(command(item, { action: "approve" }), root);
  assert.equal(item.page.status, "approved");
  assert.equal(item.page.approval.revision, 3);
  assert.equal(item.page.approval.reviewer, "Test reviewer");
  assert.ok(Date.parse(item.page.approval.date));
  item = await savePage(command(item, { notes: "A new note" }), root);
  assert.equal(item.page.status, "in-review");
  assert.equal(item.page.approval, null);
  assert.equal(item.page.history.at(-1).previousApproval.revision, 3);
  const edit = command(item);
  edit.sections[0].content = "Changed";
  edit.sections[0].reviewed = true;
  item = await savePage(edit, root);
  assert.equal(item.page.sections[0].reviewed, false);
  item = await savePage(
    command(item, { action: "request-changes", notes: "Rework first section" }),
    root,
  );
  assert.equal(item.page.status, "changes-requested");
});
test("optimistic conflict, manual file edits and filesystem lock never overwrite", async () => {
  const root = await fixture();
  const item = await readPage("home", root);
  const results = await Promise.allSettled([
    savePage(command(item, { notes: "one" }), root),
    savePage(command(item, { notes: "two" }), root),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  await assert.rejects(
    savePage(command(item, { notes: "stale" }), root),
    /Конфликт/,
  );
  const fresh = await readPage("home", root);
  await writeFile(
    path.join(root, "home.json"),
    JSON.stringify({ ...fresh.page, notes: "manual" }),
  );
  await assert.rejects(savePage(command(fresh), root), /Конфликт/);
  await mkdir(path.join(root, "home.json.lock"));
  await assert.rejects(
    savePage(command(await readPage("home", root)), root),
    /занят/,
  );
  assert.equal(
    (await readdir(root)).filter((x) => x.endsWith(".tmp")).length,
    0,
  );
});
test("strict validation denies traversal, forged metadata, duplicate IDs and unacknowledged exclusion", async () => {
  const root = await fixture();
  const item = await readPage("home", root);
  for (const patch of [
    { id: "../../outside" },
    { status: "approved" },
    { digest: "wrong" },
    { sections: [{ ...item.page.sections[0], required: "no" }] },
  ])
    await assert.rejects(savePage(command(item, patch), root));
  const dupe = command(item);
  dupe.sections.push(dupe.sections[0]);
  await assert.rejects(savePage(dupe, root));
  const change = command(item);
  change.sections[0].required = false;
  await assert.rejects(savePage(change, root));
  change.sections[0].required = true;
  change.sections[0].inclusion = "excluded";
  await assert.rejects(savePage(change, root), /Подтвердите/);
  change.acknowledged = [change.sections[0].id];
  await savePage(change, root);
});
test("production, disabled dev, remote host, cross-origin, proxy and missing token are blocked", () => {
  const before = {
    NODE_ENV: process.env.NODE_ENV,
    SECTIONS_WORKSPACE: process.env.SECTIONS_WORKSPACE,
  };
  try {
    process.env.SECTIONS_WORKSPACE = "1";
    process.env.NODE_ENV = "production";
    const local = new Request("http://127.0.0.1:3000/dev/sections/data", {
      headers: { host: "127.0.0.1:3000" },
    });
    assert.throws(
      () => guard(local),
      (e) => e.status === 404,
    );
    process.env.NODE_ENV = "development";
    process.env.SECTIONS_WORKSPACE = "0";
    assert.throws(
      () => guard(local),
      (e) => e.status === 404,
    );
    process.env.SECTIONS_WORKSPACE = "1";
    assert.doesNotThrow(() => guard(local));
    assert.throws(
      () => guard(new Request(local, { headers: { host: "evil.test" } })),
      (e) => e.status === 403,
    );
    assert.throws(
      () =>
        guard(
          new Request(local, {
            headers: { host: "127.0.0.1:3000", "x-forwarded-host": "remote" },
          }),
        ),
      (e) => e.status === 403,
    );
    assert.throws(
      () =>
        guard(
          new Request(local, {
            headers: { host: "127.0.0.1:3000", origin: "http://evil.test" },
          }),
          true,
        ),
      (e) => e.status === 403,
    );
    assert.throws(
      () =>
        guard(
          new Request(local, {
            headers: {
              host: "127.0.0.1:3000",
              origin: "http://127.0.0.1:3000",
            },
          }),
          true,
        ),
      (e) => e.status === 403,
    );
  } finally {
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
