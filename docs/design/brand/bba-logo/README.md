# Beauty Business Academy — logo kit

STATUS: owner-supplied logo (raster, 2026-11-02), rebuilt as vectors on request. Not integrated into the site: the header/footer still use concept 01 (D-018). The academy name itself remains OQ-006.

## Source and fidelity

- `source/reference-supplied.webp`: the supplied 2000×667 raster (both supplied files were byte-identical).
- Type: Montserrat 9.000 variable font (SIL OFL, `source/OFL-Montserrat.txt`), downloaded from google/fonts with the user's approval. Text is converted to outlines, so no font is needed at runtime.
  - "Beauty Business": weight 525, tracking −0.0735 em.
  - "Academy": weight 450, tracking −0.04 em, set about 1.2× larger than line 1.
  - Weights, tracking and cap heights were fitted to the raster by pixel overlap.
- Symbol: two parallelograms with edges at slope 0.645, each rounded (r = 42 in raster px) only at the top-left and bottom-right corners. It overlaps the raster at about 97.6%.
- Montserrat is the asset's own lettering, used here at the user's request. It is not a site typeface: site typography stays Unbounded + Manrope (D-002).

## Palette mapping

| Asset colour | Palette token |
| --- | --- |
| plum `#680B34` | brand plum `#782858` |
| grey `#BFBFC0` | neutral `#ACA5AD` (disabledNeutral, the nearest palette neutral) |
| text `#04050B` | ink `#1D1B1F` |

Colorways (all files have transparent backgrounds):

| Colorway | Use on | Text | Accent bar | Second bar |
| --- | --- | --- | --- | --- |
| `primary` | light surfaces | ink | plum | neutral |
| `inverse` | charcoal | white | `#D9B6CA` | `#655F67` |
| `inverse-plum` | plum | white | white | `#D9B6CA` |
| `mono-ink` | one-colour, dark on light | ink | ink | ink |
| `mono-white` | one-colour, light on dark | white | white | white |

The `inverse` colorway does not use plum on charcoal: it is too low-contrast, and SYSTEM.md forbids the plum/charcoal pair for text.

## Files

- `svg/bba-logo-{colorway}.svg`: full lockup. `svg/bba-symbol-{colorway}.svg`: symbol only. Both are tight-cropped.
- `favicon/`:
  - `favicon.svg`: switches to `#D9B6CA` in the browser's dark theme.
  - `favicon.ico`: 16/32/48 px.
  - `favicon-{16,32,48,64,96,128}.png`: transparent.
  - `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`: white background.
  - `icon-maskable-512.png`: symbol inside the 80% safe zone.
  - `icon-512-plum.png`: plum background variant.
- `png/bba-logo-{primary,inverse}-{160,240,320,480,960}w.png`: transparent lockup exports.
- `index.html`: preview sheet. Serve the folder (`python3 -m http.server`) and open it.

Regenerate from the repo root (needs `rsvg-convert`, fontTools, Pillow):
`python3 docs/design/brand/bba-logo/generate.py`
