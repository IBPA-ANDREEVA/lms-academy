import assert from 'node:assert/strict';
import { test } from 'node:test';
import { previewProduct } from '../src/features/catalog/preview/preview-data.ts';
import { isIndexableProduct } from '../src/lib/seo/product-indexability.ts';

test('SEO excludes demo and unpublished content without treating paused sales as hidden', () => {
  const demo = previewProduct('demo-course-0');
  assert.equal(isIndexableProduct(demo), false);
  // Synthetic SEO test input only; never provided to the disconnected frontend source.
  const published = { ...demo, id: 'seo-example', slug: 'seo-example', demonstration: false };
  assert.equal(isIndexableProduct(published), true);
  assert.equal(isIndexableProduct({ ...published, sale: 'paused' }), true);
  for (const patch of [
    { slug: 'demo-course-0' }, { publication: 'draft' }, { publication: 'archived' },
    { approval: 'pending' }, { publishedAt: null }, { content: {} },
  ]) assert.equal(isIndexableProduct({ ...published, ...patch }), false);
});
