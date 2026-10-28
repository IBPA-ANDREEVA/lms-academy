# Internal section-planning workspace

Scope: `/dev/sections` only. This is a reversible functional proposal, not an approved LMS screen or reusable component system. The maintained design entry point is [docs/design/README.md](docs/design/README.md); its precedence and [selected decisions](docs/design/DECISIONS.md) remain authoritative.

The owner requested page structures before any component identification. Existing component candidates are not expanded or implemented here. Native controls and editor-specific React files stay in `src/features/section-planning`. No production-domain module imports this tool.

Typography: local Manrope variable font, weights 400–700, for all functional headings and controls. Source: Google Fonts `ofl/manrope/Manrope[wght].ttf`; unmodified SIL OFL 1.1 font and copyright/license bundled in `src/features/section-planning/fonts`. Unbounded's Google Fonts OFL source was verified but the editor has no display-type use; it does not install or claim a production display implementation.

Token mapping: `workspace.module.css` scopes the selected plum, page/surface, foreground/muted, border, focus and semantic feedback values from `docs/design/SYSTEM.md` to the internal workspace. No dark-mode redesign, imagery, new icon system or expressive signature. Modest 4px control radius, visible focus, native 44px actions, ordered disclosure list, quiet page navigation. The inherited starter root remains unchanged.

Layout: desktop navigation rail and natural-height editor; below 700px, bounded page navigation above a single-column editor. The document owns editor scrolling. No horizontal overflow. Scrollbars are scoped to every planning-workspace element; production starter styles are not changed for this tool.

References inspected: `GLOBAL-001` and `HOME-HERO-001`. Their photo/type split and overlap apply only to the home hero, so they are intentionally absent here. No editor-specific reference or human approval exists. Review screenshots under `docs/design/section-planning/qa` before treating this layout as accepted.

Behavior and ownership: [UX-CONTRACT.md](UX-CONTRACT.md). No Japanese locale/market scope; Russian tool labels, English engineering documentation. Source requirements remain in their original language. No English product localization is introduced.
