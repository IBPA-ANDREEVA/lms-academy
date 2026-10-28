// Checks public home, the live component preview, and isolated component states.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { webpack } = require("next/dist/compiled/webpack/webpack");
const base = process.env.FRONTEND_URL || "http://localhost:3100";
const evidence = process.env.FRONTEND_EVIDENCE || "/tmp/lms-frontend-qa";
const temp = await mkdtemp(path.join(os.tmpdir(), "lms-component-test-"));
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || "chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => {
  errors.push(e.message);
  console.error(e.message);
});
const widths = [320, 360, 390, 768, 800, 920, 1024, 1440, 1920, 2560];
async function noOverflow() {
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `Horizontal overflow at ${page.viewportSize().width}`,
  );
}
try {
  // Production path: real Next routing, fonts, hydration, active navigation and removed routes.
  for (const width of widths) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await noOverflow();
    assert.equal(await page.locator("html").getAttribute("lang"), "ru");
    assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
    await page.screenshot({
      path: path.join(evidence, `home-${width}.png`),
      fullPage: true,
    });
    if (width <= 1024) {
      await page.getByRole("button", { name: "Открыть меню" }).click();
      await page.getByRole("dialog").waitFor();
      await page.keyboard.press("Tab");
      assert.ok(
        await page.evaluate(() =>
          document.querySelector("dialog").contains(document.activeElement),
        ),
      );
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page
        .getByRole("button", { name: "Открыть меню" })
        .evaluate((el) => {
          if (el !== document.activeElement)
            throw Error("Menu focus not restored");
        });
    }
  }
  for (const route of [
    "/dev/components",
    "/dev/components/data",
    "/dev/sections",
    "/dev/sections/data",
  ])
    assert.equal((await page.request.get(base + route)).status(), 404);
  const links = await page
    .locator("a[href]")
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
  for (const href of new Set(
    links.filter((href) => href.startsWith("/") && !href.startsWith("//")),
  ))
    assert.equal((await page.request.get(base + href)).status(), 200, href);

  // User-authorized live preview: check real Next navigation and local demo controls.
  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto(base + "/preview/components");
    await page.evaluate(() => document.fonts.ready);
    await noOverflow();
    assert.equal(await page.locator("main > section").count(), 8);
    assert.ok(
      (
        await page.locator('meta[name="robots"]').getAttribute("content")
      ).includes("noindex"),
    );
    await page.screenshot({
      path: path.join(evidence, `preview-${width}.png`),
      fullPage: true,
    });
  }
  const previewHeader = page.locator("#public-header");
  await previewHeader.getByRole("button", { name: "Открыть меню" }).click();
  await previewHeader.getByRole("dialog").waitFor();
  await page.screenshot({
    path: path.join(evidence, "preview-menu-mobile.png"),
  });
  await page.keyboard.press("Escape");
  await previewHeader.getByRole("dialog").waitFor({ state: "hidden" });
  await page
    .getByRole("button", { name: "Показать загрузку", exact: true })
    .click();
  assert.ok(
    await page
      .getByRole("button", { name: "Показать загрузку", exact: true })
      .isDisabled(),
  );
  await page
    .getByRole("button", { name: "Сбросить загрузку", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Проверить форму", exact: true })
    .click();
  const demoEmail = page.getByLabel("Email — демо", { exact: true });
  assert.equal(await demoEmail.getAttribute("aria-invalid"), "true");
  assert.ok(await demoEmail.evaluate((el) => el === document.activeElement));
  await demoEmail.fill("demo@example.com");
  await page
    .getByRole("button", { name: "Проверить форму", exact: true })
    .click();
  await page
    .getByText("Проверка пройдена. Данные никуда не отправлены.")
    .waitFor();
  await page
    .getByRole("button", { name: "Добавить — демо", exact: true })
    .first()
    .click();
  assert.equal(
    await page.getByLabel("Состояние карточек").inputValue(),
    "in-cart",
  );
  await page.getByLabel("Состояние карточек").selectOption("available");
  const categoryPreview = page.locator("#category-navigation");
  await categoryPreview
    .getByRole("link", { name: "Практические занятия — пример" })
    .click();
  assert.equal(
    await categoryPreview
      .getByRole("link", { name: "Практические занятия — пример" })
      .getAttribute("aria-current"),
    "page",
  );
  await categoryPreview.getByRole("link", { name: "Все направления" }).click();
  await categoryPreview.getByText("Выбраны все направления.").waitFor();

  // Use Next's already-installed webpack and TypeScript to load real source components.
  // Stubs only remove Next router context from the isolated fixture; production checks above use the real router.
  const tsLoader = path.join(temp, "typescript.cjs");
  await writeFile(
    tsLoader,
    `const ts=require(${JSON.stringify(require.resolve("typescript"))});module.exports=function(s){return ts.transpileModule(s,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText}`,
  );
  const cssLoader = path.join(temp, "css.cjs");
  await writeFile(
    cssLoader,
    `module.exports=function(s){const p=require('node:path').basename(this.resourcePath).replace(/[^a-z]/gi,'');const names={};s=s.replace(/url\\([^)]*\\)|\\.([a-zA-Z_][\\w-]*)/g,(_,n)=>{if(!n)return _;names[n]=p+'_'+n;return '.'+names[n]});return 'const el=document.createElement("style");el.textContent='+JSON.stringify(s)+';document.head.appendChild(el);export default '+JSON.stringify(names)}`,
  );
  const linkStub = path.join(temp, "link.cjs");
  await writeFile(
    linkStub,
    `const React=require(${JSON.stringify(require.resolve("react"))});module.exports=function({onNavigate,children,...props}){return React.createElement('a',{...props,onClick:()=>onNavigate?.()},children)}`,
  );
  const navigationStub = path.join(temp, "navigation.cjs");
  await writeFile(navigationStub, `exports.usePathname=()=>'/';`);
  await new Promise((resolve, reject) => {
    const compiler = webpack({
      mode: "development",
      plugins: [
        new webpack.DefinePlugin({
          "process.env": JSON.stringify({ NODE_ENV: "development" }),
        }),
      ],
      devtool: false,
      entry: path.resolve("tests/frontend.fixture.tsx"),
      output: { path: temp, filename: "fixture.js" },
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
          "@": path.resolve("src"),
          "next/link$": linkStub,
          "next/navigation$": navigationStub,
        },
      },
      module: {
        rules: [
          { test: /\.tsx?$/, use: tsLoader },
          { test: /\.module\.css$/, use: cssLoader },
        ],
      },
    });
    compiler.run((error, stats) =>
      compiler.close(() =>
        error || stats.hasErrors()
          ? reject(error || Error(stats.toString({ all: false, errors: true })))
          : resolve(),
      ),
    );
  });
  await page.goto(base);
  const css = (await readFile("src/app/globals.css", "utf8"))
    .replace('@import "tailwindcss";', "")
    .replace(/@theme inline\s*\{[^}]*\}/, "");
  const fontContext = await page.evaluate(() => ({
    className: document.documentElement.className,
    styles: [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map((el) => el.outerHTML)
      .join(""),
  }));
  await page.route(base + "/", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<html lang="ru" class="${fontContext.className}"><head>${fontContext.styles}<style>${css}</style></head><body><div id="root"></div></body></html>`,
    }),
  );
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.addScriptTag({
    content: await readFile(path.join(temp, "fixture.js"), "utf8"),
  });
  await page.getByRole("heading", { name: "Проверка компонентов" }).waitFor();
  for (const width of widths) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    await noOverflow();
    for (const size of ["wide", "content", "reading", "fullBleed"]) {
      const geometry = await page
        .locator(`[data-container="${size}"]`)
        .evaluate((el) => ({
          width: el.clientWidth,
          padding: parseFloat(getComputedStyle(el).paddingLeft),
        }));
      if (size === "fullBleed") assert.equal(geometry.padding, 0);
      else {
        assert.ok(geometry.padding >= 20);
        assert.ok(
          geometry.width - geometry.padding * 2 <=
            { wide: 1920, content: 1440, reading: 760 }[size] + 1,
        );
      }
    }
    await page.screenshot({
      path: path.join(evidence, `components-${width}.png`),
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  const desktop = page.getByRole("navigation", { name: "Основная навигация" });
  await desktop.locator("summary").click();
  await desktop.getByRole("link", { name: "Брови", exact: true }).waitFor();
  await page.screenshot({
    path: path.join(evidence, "header-desktop-dropdown.png"),
  });
  await page.keyboard.press("Escape");
  assert.equal(await desktop.locator("details[open]").count(), 0);
  await desktop.locator("summary").click();
  await page.getByRole("heading", { name: "Проверка компонентов" }).click();
  assert.equal(await desktop.locator("details[open]").count(), 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.screenshot({
    path: path.join(evidence, "header-mobile-open.png"),
  });
  const dialog = page.getByRole("dialog");
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    assert.ok(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    );
  }
  await dialog.locator("summary").click();
  await dialog.getByRole("link", { name: "Брови", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  const password = page.getByLabel("Пароль", { exact: true });
  assert.equal(await password.getAttribute("type"), "password");
  await page.getByRole("button", { name: "Показать пароль" }).click();
  assert.equal(await password.getAttribute("type"), "text");
  await page.getByRole("button", { name: "Скрыть пароль" }).click();
  assert.equal(await password.getAttribute("type"), "password");
  const email = page.getByLabel("Email", { exact: true });
  assert.equal(await email.getAttribute("aria-invalid"), "true");
  for (const id of (await email.getAttribute("aria-describedby")).split(" "))
    assert.ok(await page.evaluate((id) => !!document.getElementById(id), id));
  await page.getByLabel("Тестовый выбор").check();
  await page.getByLabel("Формат").selectOption({ label: "В записи" });
  assert.equal(
    await page.getByRole("button", { name: "Не должно отображаться" }).count(),
    0,
  );
  const submit = page.getByRole("button", { name: "Отправить", exact: true });
  const before = await submit.boundingBox();
  await submit.click();
  assert.equal(await submit.isDisabled(), true);
  assert.equal(await submit.getAttribute("aria-busy"), "true");
  assert.equal((await submit.boundingBox()).width, before.width);
  assert.equal(await page.getByLabel("Отправок").textContent(), "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await submit.evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
  );
  await page.setViewportSize({ width: 320, height: 844 });
  await noOverflow();
  assert.deepEqual(errors, []);
  await writeFile(
    path.join(evidence, "results.json"),
    JSON.stringify(
      {
        production: true,
        livePreview: true,
        isolatedComponents: true,
        widths,
        errors,
        removedRoutes: "404",
        keyboard: "passed",
        loading: "passed",
        forms: "passed",
      },
      null,
      2,
    ),
  );
  console.log(
    `Passed: public home, live preview, retired routes, responsive components, menu/dropdown, forms, pending state. Evidence: ${evidence}`,
  );
} finally {
  await browser.close();
  await rm(temp, { recursive: true, force: true });
}
