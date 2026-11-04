import assert from "node:assert/strict";
import { test } from "node:test";
import { readDemoSelection, formatDemoAmount } from "../src/features/commerce/demo-cart.ts";

test("demo restoration accepts unique identifiers and rejects stored money/objects", () => {
  assert.deepEqual(readDemoSelection(null), []);
  assert.deepEqual(readDemoSelection('["demo-mini-0","demo-course-0"]'), ['demo-mini-0', 'demo-course-0']);
  assert.deepEqual(readDemoSelection('["demo-package-2"]'), ['demo-package-2']);
  for (const raw of ['{}', 'null', '["real-product"]', '["demo-course-0","demo-course-0"]',
    '[{"id":"demo-course-0","amount":1}]', '[{"id":"demo-package-0","amount":1}]', '["demo-package-10000"]', 'invalid']) {
    assert.throws(() => readDemoSelection(raw));
  }
});

test("demo amounts use Russian formatting and an explicit illustrative currency", () => {
  assert.match(formatDemoAmount(15500), /155,00\s*\$/);
});
