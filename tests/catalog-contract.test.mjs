import assert from 'node:assert/strict';
import { test } from 'node:test';
import { previewProduct, readPreviewIds, initialPreviewIds } from '../src/features/catalog/preview/preview-data.ts';
import { isPublicProduct, isPurchasable, selectPublished } from '../src/server/catalog/policy.ts';

test('preview identifiers restore deterministic data and reject stored product/price objects', () => {
  assert.deepEqual(readPreviewIds(null), initialPreviewIds);
  assert.deepEqual(readPreviewIds('[]'), []);
  for (const raw of ['null','{}','["real-course"]','["demo-course-0","demo-course-0"]','[{"price":1}]']) assert.throws(() => readPreviewIds(raw));
  assert.equal(previewProduct('real-course'), null);
  assert.equal(previewProduct('demo-mini-1').curatorSupport, false);
  assert.equal(previewProduct('demo-course-0').price.currency, 'USD');
});
test('publication and sale are independent; preview records never pass production gate', () => {
  const demo = previewProduct('demo-course-0');
  assert.equal(isPublicProduct(demo), false);
  // Synthetic unit-test record only; never supplied to the application adapter.
  const real = { ...demo, id:'verified', slug:'verified', demonstration:false };
  assert.equal(isPublicProduct(real), true);
  assert.equal(isPurchasable(real), true);
  for (const patch of [{slug:'demo-course-0'},{publication:'draft'},{publication:'archived'},{approval:'pending'},{publishedAt:null},{content:{}}]) assert.equal(isPublicProduct({...real,...patch}),false);
  const paused = {...real,sale:'paused'};
  assert.equal(isPublicProduct(paused),true);
  assert.equal(isPurchasable(paused),false);
  for (const patch of [{price:null},{priceApproval:'pending'},{price:{amountMinor:-1,currency:'USD'}}]) assert.equal(isPurchasable({...real,...patch}),false);
  assert.deepEqual(selectPublished([demo,real,paused], {language:'en'}),[]);
  assert.equal(selectPublished([demo,real,paused],{kind:'course'}).length,2);
});
