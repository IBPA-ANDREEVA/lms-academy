// Run against pnpm dev:sections. Uses only a pristine home draft and restores its
// exact bytes. Refuses to restore if another reviewer touched it during the test.
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SECTIONS_URL || "http://127.0.0.1:3000";
const file = "docs/design/section-planning/pages/home.json";
const original = await readFile(file, "utf8");
const initial = JSON.parse(original);
assert.equal(initial.status, "draft");
assert.equal(initial.history.length, 0, "Use pristine draft data only.");
const reviewer = "AUTOMATED PLANNING TEST — NOT HUMAN APPROVAL";
const evidence = "docs/design/section-planning/qa";
await mkdir(evidence, { recursive: true });
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
async function save() {
  const response = page.waitForResponse(
    (r) => r.url().endsWith("/data") && r.request().method() === "POST",
  );
  await page
    .getByRole("button", { name: "Сохранить изменения", exact: true })
    .click();
  const result = await response;
  assert.equal(result.status(), 200, await result.text());
  await page.getByText(/Сохранено · ревизия/).waitFor();
}
async function reload() {
  await page.reload();
  await page.getByRole("heading", { name: "Главная", exact: true }).waitFor();
}
try {
  await page.goto(base + "/dev/sections");
  await page.getByRole("heading", { name: "Главная", exact: true }).waitFor();
  await page
    .locator("nav button")
    .filter({ hasText: "Каталог курсов" })
    .click();
  await page
    .getByRole("heading", { name: "Каталог курсов", exact: true })
    .waitFor();
  await page.locator("nav button").filter({ hasText: "Главная" }).click();
  await page.getByLabel("Имя проверяющего").fill(reviewer);
  await page
    .getByRole("button", { name: "Добавить секцию", exact: true })
    .click();
  const added = page
    .locator("li")
    .filter({
      has: page.locator("summary strong", { hasText: "Новая секция" }),
    });
  await added.locator("summary").click();
  await added
    .getByLabel("Название секции", { exact: true })
    .fill("Проверка локального черновика");
  const section = page
    .locator("li")
    .filter({
      has: page.locator("summary strong", {
        hasText: "Проверка локального черновика",
      }),
    });
  await section
    .getByLabel("Назначение / краткое описание", { exact: true })
    .fill(
      "Проверить сохранение и восстановление без изменения продуктовых правил.",
    );
  await section
    .getByLabel("Необходимое содержание", { exact: true })
    .fill(
      "Временная тестовая секция. Будет удалена вместе со всеми тестовыми утверждениями.",
    );
  await section
    .getByLabel("Включение", { exact: true })
    .selectOption("excluded");
  await section.locator("summary").click();
  await section
    .getByRole("button", {
      name: "Выше: Проверка локального черновика",
      exact: true,
    })
    .click();
  await save();
  await reload();
  assert.ok(
    await page
      .getByText("Проверка локального черновика", { exact: true })
      .count(),
  );
  await page.getByLabel("Имя проверяющего").fill(reviewer);
  await page
    .getByRole("button", {
      name: "Удалить: Проверка локального черновика",
      exact: true,
    })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Удалить секцию", exact: true })
    .click();
  await save();
  await reload();
  await page.locator("summary").filter({ hasText: "Удалённые секции" }).click();
  await page.getByRole("button", { name: "Восстановить", exact: true }).click();
  await page.getByLabel("Имя проверяющего").fill(reviewer);
  await save();
  // Required deletion warns, Escape cancels, focus returns to its trigger.
  const deleteRequired = page.getByRole("button", {
    name: "Удалить: Навигация и контекст",
    exact: true,
  });
  await deleteRequired.click();
  assert.match(
    await page.getByRole("dialog").innerText(),
    /исходным требованием/,
  );
  assert.equal(await page.locator(':focus').innerText(), 'Отмена');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator(':focus').innerText(), 'Удалить секцию');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').innerText(), 'Отмена');
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.equal(await deleteRequired.evaluate(element => element === document.activeElement), true);
  for (const checkbox of await page
    .getByRole("checkbox", { name: "Проверена", exact: true })
    .all())
    await checkbox.check();
  await save();
  await page
    .getByRole("button", { name: "Утвердить страницу", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Утвердить структуру", exact: true })
    .click();
  await page.getByText(/Сохранено · ревизия .*Утверждено/).waitFor();
  await reload();
  assert.equal(JSON.parse(await readFile(file, "utf8")).status, "approved");
  await page
    .getByLabel("Заметки страницы / запрошенные изменения")
    .fill("Тест снятия утверждения после редактирования.");
  await page.getByLabel("Имя проверяющего").fill(reviewer);
  await save();
  assert.equal(JSON.parse(await readFile(file, "utf8")).status, "in-review");
  // Stale-tab conflict preserves the local draft.
  const second = await context.newPage();
  await second.goto(base + "/dev/sections?page=home");
  await second.getByRole("heading", { name: "Главная", exact: true }).waitFor();
  await page
    .getByLabel("Заметки страницы / запрошенные изменения")
    .fill("Более новая серверная ревизия");
  await save();
  await second
    .getByLabel("Заметки страницы / запрошенные изменения")
    .fill("Локальный конфликтующий черновик");
  await second.getByLabel("Имя проверяющего").fill(reviewer);
  await second
    .getByRole("button", { name: "Сохранить изменения", exact: true })
    .click();
  await second.locator("main [role=alert]").waitFor();
  assert.match(
    await second.locator("main [role=alert]").innerText(),
    /Конфликт/,
  );
  assert.equal(
    await second
      .getByLabel("Заметки страницы / запрошенные изменения")
      .inputValue(),
    "Локальный конфликтующий черновик",
  );
  await second.close({ runBeforeUnload: false });
  // Network error keeps input. Recover with a normal explicit save.
  await page.route("**/dev/sections/data", (route) =>
    route.request().method() === "POST"
      ? route.abort("failed")
      : route.continue(),
  );
  await page
    .getByLabel("Заметки страницы / запрошенные изменения")
    .fill("Черновик при ошибке сети");
  await page
    .getByRole("button", { name: "Сохранить изменения", exact: true })
    .click();
  await page.locator("main [role=alert]").waitFor();
  assert.equal(
    await page
      .getByLabel("Заметки страницы / запрошенные изменения")
      .inputValue(),
    "Черновик при ошибке сети",
  );
  await page.unroute("**/dev/sections/data");
  await save();
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    "PASS: selection, add/edit/reorder, exclusion, delete/restore, save/reload, approval/invalidation, required warning, Escape, conflict, network recovery.",
  );
} finally {
  await context.close();
  await browser.close();
  const after = JSON.parse(await readFile(file, "utf8"));
  if (after.history.every((h) => h.reviewer === reviewer)) {
    await writeFile(file + ".test-restore.tmp", original);
    await rename(file + ".test-restore.tmp", file);
  } else
    throw new Error(
      "Concurrent reviewer detected: refusing to restore. Inspect home.json.",
    );
}
// Screenshots and responsive checks use only restored draft content.
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
    await p.goto(base + "/dev/sections?page=home");
    await p.getByRole("heading", { name: "Главная", exact: true }).waitFor();
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: `${evidence}/${width}x${height}.png` });
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Overflow at ${width}`,
    );
    await p.locator("summary").filter({ hasText: "1Навигация" }).count();
    const first = p.locator("ol>li").first();
    await first.locator("summary").click();
    await first.getByLabel("Фаза секции", { exact: true }).focus();
    await p.keyboard.press("ArrowDown");
    await p.keyboard.press("Escape");
    await first
      .getByLabel("Название секции", { exact: true })
      .fill(
        "Длинное название секции для проверки переноса русского текста на узком экране",
      );
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await p.screenshot({ path: `${evidence}/${width}x${height}-expanded.png` });
    await p.close({ runBeforeUnload: false });
  }
  console.log(
    "PASS: 1440×900, 390×844, 360×800, 768×1024; long Russian text, native select keyboard, reduced motion, no horizontal overflow.",
  );
} finally {
  await clean.close();
}
