# Beauty Business Academy — logo concepts

STATUS: created 2026-11-02 on request. Concept 01 «Срез» is `selected-direction` for the header and footer (D-018); concepts 02/03 remain `proposal`. OD-001 / OQ-006 (approved academy name, logo, domain, issuer identity) remain open until the owner records a decision in `docs/design/DECISIONS.md` and `docs/product/decisions.md`.

Built only from the selected system (`docs/design/SYSTEM.md`): Unbounded 800/700 for the mark, Manrope 700 for the tracked "ACADEMY" line, palette plum `#782858`, charcoal `#1D1B1F`, off-white `#FAF9FA`, blush `#F7EFF4`, plum border `#D9B6CA`. Glyphs are outlined from the project's OFL fonts in `src/assets/fonts`, so the SVGs need no font at runtime.

- `01-cut-*` "Срез" (recommended primary): BBA monogram sliced by the same "/" diagonal as the hero boundary; ink/plum halves. Mark + horizontal lockup, light / plum / charcoal.
- `02-tile-*` "Плитка": square tile with one cut corner returned as the detached Cut-button slash; for favicon, app icon, avatar. At 16px "BBA" is barely legible; a 16px favicon would need a simplified glyph.
- `03-wordmark-*` "Строка": type-only two-line wordmark with a plum slash.

On charcoal, the plum half switches to `#D9B6CA` (plum on charcoal is a forbidden text pair).

Preview: serve this folder (`python3 -m http.server`) and open `index.html`.
Regenerate from the repo root (the third argument also rewrites the runtime artwork used by `BrandLogo`):
`python3 docs/design/brand/logo-concepts/generate.py . docs/design/brand/logo-concepts src/features/public-shell/brand-logo-artwork.ts`
