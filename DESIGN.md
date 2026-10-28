# Internal section-planning workspace

Scope: `/dev/sections` only. This is a reversible functional proposal, not an approved LMS screen or reusable component system. The maintained design entry point is [docs/design/README.md](docs/design/README.md); its precedence and [selected decisions](docs/design/DECISIONS.md) remain authoritative.

The owner requested page structures before any component identification. Existing component candidates are not expanded or implemented here. Native controls and editor-specific React files stay in `src/features/section-planning`. No production-domain module imports this tool.

Typography: local Manrope variable font, weights 400–700, for all functional headings and controls. Source: Google Fonts `ofl/manrope/Manrope[wght].ttf`; unmodified SIL OFL 1.1 font and copyright/license bundled in `src/features/section-planning/fonts`. Unbounded's Google Fonts OFL source was verified but the editor has no display-type use; it does not install or claim a production display implementation.

Token mapping: `workspace.module.css` scopes the selected plum, page/surface, foreground/muted, border, focus and semantic feedback values from `docs/design/SYSTEM.md` to the internal workspace. No dark-mode redesign, imagery, new icon system or expressive signature. Modest 4px control radius, visible focus, native 44px actions, ordered disclosure list, quiet page navigation. The inherited starter root remains unchanged.

Layout: desktop navigation rail and natural-height editor; below 700px, bounded page navigation above a single-column editor. The document owns editor scrolling. No horizontal overflow. Scrollbars are scoped to every planning-workspace element; production starter styles are not changed for this tool.

References inspected: `GLOBAL-001` and `HOME-HERO-001`. Their photo/type split and overlap apply only to the home hero, so they are intentionally absent here. No editor-specific reference or human approval exists. Review screenshots under `docs/design/section-planning/qa` before treating this layout as accepted.

Behavior and ownership: [UX-CONTRACT.md](UX-CONTRACT.md). No Japanese locale/market scope; Russian tool labels, English engineering documentation. Source requirements remain in their original language. No English product localization is introduced.

## Component registry extension

`/dev/components` is the second internal planning workflow. It uses the same restrained functional Manrope typography, plum/off-white/charcoal/blush palette and semantic feedback values, scoped in `src/features/component-registry/workspace.module.css`. It adds a grouped component rail, progressive detail disclosures, three distinct approval dimensions and reference-image management. This is a reversible management-interface proposal, not a new public LMS visual direction or component showcase. No expressive display typography is needed, so Unbounded is not installed or simulated here.

Desktop uses a 300px navigation rail and natural-height document editor. Below 700px navigation becomes a bounded list above the editor; reference layouts stack below 1000px. Default details are concise; source relationships and long architecture fields expand explicitly. Native selects retain OS popup behavior. Reference images use contained thumbnails and native modal enlargement; no motion is introduced. Exact global/hero reference images were inspected; neither approves the editor or unrelated component aesthetics. Screenshots and deviations are recorded in `docs/design/components/qa/REPORT.md`. Human visual approval is pending.
