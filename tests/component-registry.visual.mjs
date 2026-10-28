import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.COMPONENTS_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({
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
    const p = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    await p.goto(base + "/dev/components?component=public-header");
    const heading = p.getByRole("heading", {
      name: "PublicHeader",
      exact: true,
    });
    await heading.waitFor();
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    const prefix = `docs/design/components/qa/${width}x${height}`;
    await p.screenshot({ path: prefix + ".png" });
    await heading.scrollIntoViewIfNeeded();
    await p.screenshot({ path: prefix + "-editor.png" });
    await p.getByText("Архитектура и поведение", { exact: true }).click();
    await p
      .getByLabel("Владелец / модуль", { exact: true })
      .scrollIntoViewIfNeeded();
    await p.screenshot({ path: prefix + "-expanded.png" });
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.close();
  }
  console.log(
    "PASS refreshed desktop/mobile/tablet screenshots, detail editor and expanded fields; no overflow.",
  );
} finally {
  await browser.close();
}
