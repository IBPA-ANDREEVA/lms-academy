# Existing SVG Icon Library: Usage and Approval

## Source of truth

- The user-supplied assets in `public/icons/` are the chosen **functional** icon library.
- Preserve the original SVGs until an explicit variant-selection and color review is complete.
- Do not replace them with generated lookalikes, Lucide/Heroicons, emoji or speculative icon paths.
- This does **not** mean every beauty-category illustration is already available: branded large category artwork remains a separate approval task.

## Current repository inventory

- 130 icon base names.
- Six SVG files per base name: `name.svg`, `name.1.svg` … `name.5.svg` (780 total).
- Some variants are byte-identical; others are different fill/outline treatments. **Numbered suffixes have no approved universal meaning.**
- Representative icons use `viewBox="0 0 24 24"`, 1.5px rounded strokes and hardcoded `#292556` (indigo).
- No permission to bulk delete, recolor, normalize viewBox or assume `.1` means filled or active.

## Application usage policy

1. Select a **specific** asset visually for a component and record its file name in the component's documented semantic mapping.
2. Prefer an explicit map such as `{ dashboard: '/icons/home.svg', search: '/icons/search.svg' }` over dynamically constructing filenames and numbered suffixes.
3. Check icon size and contrast at the rendered size. Expose text labels for ambiguous actions; use decorative alt only with accompanying visible text.
4. Never infer state from a suffix; define a separate explicit `default` or `active` selection only after checking both actual SVGs.
5. Because `#292556` is **not** in the agreed palette, do not assume it is approved as a UI color. Confirm the intent before any systematic recoloring. If approved, preserve originals and create documented `currentColor` variants or an explicit styling pipeline.
6. Do not mix icon sets unless a documented exception is approved.

## Icon Style Usage

### Default
Use Outline icons for standard functional UI.

### Selected / Active
Use Solid icons selectively when the design requires
stronger emphasis.

### Duotone
Use for selected visual highlights and branded areas.

### Mixed / Broken
Use only when explicitly supported by an approved
visual reference.

### Rules
- Prefer Outline as the functional default.
- Do not randomly mix variants in one navigation group.
- Do not automatically use Solid for every active state.
- Never select icon styles randomly.
- Reuse approved icons instead of generating replacements.
- Icon color must follow approved design decisions.
