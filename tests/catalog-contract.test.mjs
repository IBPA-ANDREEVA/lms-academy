import assert from 'node:assert/strict';
import { test } from 'node:test';
import { previewProduct, readPreviewIds, initialPreviewIds } from '../src/features/catalog/preview/preview-data.ts';

test('preview identifiers restore deterministic data and reject stored product/price objects', () => {
  assert.deepEqual(readPreviewIds(null), initialPreviewIds);
  assert.deepEqual(readPreviewIds('[]'), []);
  for (const raw of ['null','{}','["real-course"]','["demo-course-0","demo-course-0"]','[{"price":1}]']) assert.throws(() => readPreviewIds(raw));
  assert.equal(previewProduct('real-course'), null);
  assert.equal(previewProduct('demo-mini-1').curatorSupport, false);
  assert.equal(previewProduct('demo-course-0').price.currency, 'USD');
});
