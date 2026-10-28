// Dedicated synthetic record only. Never approve/edit existing user components or source pages.
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";
import { registryRuntime } from "../scripts/component-registry-runtime.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.COMPONENTS_URL || "http://127.0.0.1:3001";
const id = `browser-fixture-${Date.now()}`;
const actor = "AUTOMATED SYNTHETIC FIXTURE — NOT HUMAN APPROVAL";
const qa = "docs/design/components/qa";
await mkdir(qa, { recursive: true });
const sources = new Map(
  await Promise.all(
    (await readdir("docs/design/section-planning/pages")).map(async (f) => [
      f,
      await readFile(`docs/design/section-planning/pages/${f}`, "utf8"),
    ]),
  ),
);
const browser = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || "msedge",
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
async function mutation(action) {
  const waiting = page.waitForResponse(
    (r) => r.url().endsWith("/data") && r.request().method() === "POST",
  );
  await action();
  const result = await waiting;
  assert.equal(result.status(), 200, await result.text());
  await page
    .getByRole("status")
    .filter({ hasText: /Сохранено|Загружено/ })
    .waitFor();
  return result.json();
}
async function click(name) {
  return page.getByRole("button", { name, exact: true }).click();
}
async function disk() {
  return JSON.parse(
    await readFile(`docs/design/components/registry/${id}.json`, "utf8"),
  );
}
try {
  await page.goto(base + "/dev/components?component=public-header");
  await page
    .getByRole("heading", { name: "PublicHeader", exact: true })
    .waitFor();
  await page
    .getByLabel("Поиск компонентов", { exact: true })
    .fill("no-such-component");
  await page.getByText(/Нет совпадений/).waitFor();
  await click("Очистить поиск");
  await click("Добавить компонент");
  await page.getByLabel("ID нового компонента").fill(id);
  await page
    .getByLabel("Название нового компонента")
    .fill("Browser test fixture");
  await page.getByLabel("Автор создания").fill(actor);
  await mutation(() => click("Создать черновик"));
  await page
    .getByRole("heading", { name: "Browser test fixture", exact: true })
    .waitFor();
  await page
    .getByLabel("Описание", { exact: true })
    .fill("Persistent description");
  await page
    .getByLabel("Назначение / ответственность", { exact: true })
    .fill("Synthetic validation only");
  await page
    .getByLabel("Категория компонента", { exact: true })
    .selectOption("primitive");
  await page
    .getByLabel("Приоритет компонента", { exact: true })
    .selectOption("P0");
  await page.getByText("Архитектура и поведение", { exact: true }).click();
  await page.getByLabel("Владелец / модуль", { exact: true }).fill("test");
  await mutation(() => click("Сохранить изменения"));
  await page.getByText("Использование · 0 секций", { exact: true }).click();
  await page
    .getByLabel("Добавить утверждённую секцию")
    .selectOption("home--hero");
  await page
    .getByLabel("Обоснование новой связи")
    .fill("Synthetic test relationship; no change to source");
  await click("Добавить связь");
  await mutation(() => click("Сохранить изменения"));
  await mutation(() =>
    page
      .getByLabel("Загрузить референсы", { exact: true })
      .setInputFiles("docs/design/references/pages/home/HOME-HERO-001.png"),
  );
  await page.getByRole("button", { name: /Увеличить:/ }).click();
  await page.getByRole("dialog").locator("img").waitFor();
  assert.ok(
    await page
      .getByRole("dialog")
      .locator("img")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  );
  await page.keyboard.press("Escape");
  await click("Редактировать объяснение");
  await page
    .getByLabel("Название референса", { exact: true })
    .fill("Browser reference");
  await page
    .getByLabel("Что заимствовать", { exact: true })
    .fill("Spacing only; synthetic test");
  await page
    .getByLabel("Что не копировать", { exact: true })
    .fill("Brand and imagery");
  await page
    .getByLabel("Почему выбран этот референс", { exact: true })
    .fill("Persistence validation");
  await mutation(() => click("Сохранить объяснение"));
  await mutation(() => click("Сделать основным"));
  await page.reload();
  await page
    .getByRole("heading", { name: "Browser test fixture", exact: true })
    .waitFor();
  assert.equal(
    await page.getByLabel("Описание", { exact: true }).inputValue(),
    "Persistent description",
  );
  assert.equal(
    (await disk()).references[0].borrow,
    "Spacing only; synthetic test",
  );
  await page.getByLabel("Имя проверяющего / автора изменения").fill(actor);
  await click("Утвердить определение");
  await mutation(() =>
    page
      .getByRole("dialog")
      .getByRole("button", { name: "Утвердить определение", exact: true })
      .click(),
  );
  assert.equal((await disk()).definitionStatus, "approved");
  await page
    .getByLabel("Описание", { exact: true })
    .fill("Edited approved definition");
  await mutation(() => click("Сохранить изменения"));
  assert.equal((await disk()).definitionStatus, "in-review");
  await click("Архивировать компонент");
  assert.match(
    await page.getByRole("dialog").innerText(),
    /Связей с секциями: 1/,
  );
  await mutation(() =>
    page
      .getByRole("dialog")
      .getByRole("button", { name: "Архивировать компонент", exact: true })
      .click(),
  );
  assert.equal((await disk()).archived, true);
  await mutation(() => click("Восстановить компонент"));
  assert.equal((await disk()).archived, false);
  // Concurrent-tab conflict preserves draft; network failure does too.
  const other = await context.newPage();
  await other.goto(base + `/dev/components?component=${id}`);
  await other.getByLabel("Описание", { exact: true }).waitFor();
  await page.getByLabel("Описание", { exact: true }).fill("Latest server");
  await mutation(() => click("Сохранить изменения"));
  await other.getByLabel("Имя проверяющего / автора изменения").fill(actor);
  await other.getByLabel("Описание", { exact: true }).fill("Stale draft");
  await other
    .getByRole("button", { name: "Сохранить изменения", exact: true })
    .click();
  await other
    .getByRole("alert")
    .filter({ hasText: /Конфликт/ })
    .waitFor();
  assert.equal(
    await other.getByLabel("Описание", { exact: true }).inputValue(),
    "Stale draft",
  );
  await other.close({ runBeforeUnload: false });
  await page.route("**/dev/components/data", (r) =>
    r.request().method() === "POST" ? r.abort("failed") : r.continue(),
  );
  await page.getByLabel("Описание", { exact: true }).fill("Offline draft");
  await click("Сохранить изменения");
  await page.getByRole("alert").filter({hasText:/Failed to fetch/}).waitFor();
  assert.equal(
    await page.getByLabel("Описание", { exact: true }).inputValue(),
    "Offline draft",
  );
  await page.unroute("**/dev/components/data");
  await mutation(() => click("Сохранить изменения"));
  const c = await disk();
  assert.match(
    await readFile(`docs/design/components/specs/${id}.md`, "utf8"),
    /Offline draft/,
  );
  assert.match(
    await readFile(
      `docs/design/references/components/${id}/${c.references[0].id}.md`,
      "utf8",
    ),
    /Spacing only/,
  );
  await readFile(path.join("docs/design", c.references[0].imagePath));
  assert.deepEqual(errors, []);
  console.log(
    "PASS browser CRUD, usage, upload/preview/explanation, persistence, approval/invalidation, archive/restore, conflict, network recovery.",
  );
} finally {
  await context.close();
  await browser.close();
  // Delete only this script's generated synthetic paths after verifying provenance.
  let fixture;
  try {
    fixture = await disk();
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  if (fixture) {
    assert.ok(fixture.history.every((h) => h.reviewer === actor));
    assert.equal(fixture.id, id);
    for (const relative of [
      `components/registry/${id}.json`,
      `components/specs/${id}.md`,
      `components/history/${id}`,
      `references/components/${id}`,
    ]) {
      const target = path.resolve("docs/design", relative);
      assert.ok(target.startsWith(path.resolve("docs/design") + path.sep));
      assert.ok(target.includes(id));
      await rm(target, { recursive: true, force: true });
    }
    const rt = await registryRuntime();
    try {
      await rt.store.syncDocs();
    } finally {
      await rm(rt.dir, { recursive: true, force: true });
    }
  }
  for (const [f, original] of sources)
    assert.equal(
      await readFile(`docs/design/section-planning/pages/${f}`, "utf8"),
      original,
      "Source page changed: " + f,
    );
}
const clean = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || "msedge",
});
try {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [360, 800],
    [768, 1024],
  ]) {
    const p = await clean.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    await p.goto(base + "/dev/components?component=public-header");
    await p
      .getByRole("heading", { name: "PublicHeader", exact: true })
      .waitFor();
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.screenshot({ path: `${qa}/${width}x${height}.png` });
    await p.getByText("Архитектура и поведение", { exact: true }).click();
    await p.getByLabel("Категория компонента", { exact: true }).focus();
    await p.keyboard.press("ArrowDown");
    await p.keyboard.press("Escape");
    await p
      .getByLabel("Название", { exact: true })
      .fill(
        "Очень длинное название компонента для проверки переноса текста на узком экране",
      );
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.screenshot({ path: `${qa}/${width}x${height}-expanded.png` });
    await p.close({ runBeforeUnload: false });
  }
  console.log(
    "PASS responsive 1440×900 / 390×844 / 360×800 / 768×1024; long copy, keyboard select, reduced motion, no overflow.",
  );
} finally {
  await clean.close();
}
await writeFile(
  `${qa}/browser-results.json`,
  JSON.stringify(
    {
      passed: true,
      viewports: ["1440x900", "390x844", "360x800", "768x1024"],
      consoleErrors: errors,
      sourcePagesUnchanged: true,
    },
    null,
    2,
  ) + "\n",
);
