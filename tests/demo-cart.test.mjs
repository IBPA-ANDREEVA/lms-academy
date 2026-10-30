import assert from "node:assert/strict";
import { test } from "node:test";
import { readDemoSelection, demoItems, formatDemoAmount } from "../src/features/commerce/demo-cart.ts";

test("demo restoration preserves unique selections and only uses fixture amounts", () => {
  assert.deepEqual(readDemoSelection(null), []);
  assert.deepEqual(readDemoSelection('["demo-mini","demo-course"]'), [demoItems[1], demoItems[0]]);
  assert.equal(readDemoSelection('["demo-course"]')[0].demonstration, true);
  for (const raw of ['{}', 'null', '["real-product"]', '["demo-course","demo-course"]',
    '[{"id":"demo-course","amount":1}]', 'invalid']) {
    assert.throws(() => readDemoSelection(raw));
  }
});

test("demo amounts use Russian formatting and an explicit illustrative currency", () => {
  assert.match(formatDemoAmount(15500), /15\s500 ₽/);
});
