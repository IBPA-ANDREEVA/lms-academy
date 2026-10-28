# Design system — tokens and constraints

STATUS: Color HEX values and semantic narrative selected. Type-family roles selected. Numeric sizes and geometric ratios below are candidate implementation values until verified with real Unbounded glyphs and browser screenshots. Never call them owner-approved pixel-perfect specs.

PALETTE (source of truth):
- brand.plum `#782858`; hover `#64204A`; pressed `#52183D`; onPlum `#FFFFFF`
- concept.explore/page `#FAF9FA`
- concept.learn `#782858`
- concept.practice/text `#1D1B1F`
- concept.progress/softPlum `#F7EFF4`
- surface `#FFFFFF`; surface.muted `#F4F1F3`
- text.primary `#1D1B1F`; text.muted `#655F67`
- border `#E6E0E5`; plum.border `#D9B6CA`; focus `#A64E84`; disabledNeutral `#ACA5AD`
- feedback.success.text `#177245` / background `#E9F7EF`
- feedback.warning.text `#91600F` / background `#FFF5DF`
- feedback.error.text `#B42332` / background `#FDEDEF`
- feedback.info.text `#2455A4` / background `#EDF3FF`

COLOR SEMANTICS:
- Off-white/Explore, plum/Learn, charcoal/Practice, blush/Progress are narrative devices for editorial compositions, not universal mappings for button or page function. Consistent functional actions keep standard primary/secondary button semantics.
- Never render plum text on charcoal as a readable text combination. Check all actual pairs, overlays and focus rings for WCAG AA contrast.
- Never invent a second saturated brand accent to make design more playful. Semantic success/warning/error/info are allowed when communicating real statuses.
- Do not recolor existing icon SVG files globally before approved asset/token policy.

FONTS:
- Display: Unbounded, confirmed selected by owner on 2026-10-27. Short hero, statement and expressive section headings only.
- Functional: Manrope 400, 500, 600, 700. Navigation, cards, body, CTA, forms, headings in task-heavy workspaces, prices, schedules and metadata.
- DO NOT USE Angry as brand font. `src/app/fonts/Angry.otf` is a legacy asset, not evidence the font decision changed. Keep asset untouched until a separately authorized asset cleanup.
- Unbounded is NOT currently installed in repo snapshot. Confirm webfont source and commercial rights, acquire an authorized asset or verified supported font integration, and test Cyrillic. Do not fabricate a font file, repurpose Angry, or claim the raster mockup uses authentic Unbounded.
- Load fonts through supported Next.js integration; update `src/app/layout.tsx`, global tokens and Russian default language when implementing frontend, not in this documentation-only task.
- Never use synthetic font weights or arbitrary CSS deformation to imitate the generated image. Keep meaningful semantic headings in DOM; decorative duplicates must be aria-hidden and must not introduce duplicate reading order.

CANDIDATE TYPE SCALE (tune after screenshots):
- Hero display: desktop clamp approximately 72–120px; mobile approximately 36–56px. Actual rendered fit, not maximum size, decides.
- Expressive section heading: desktop 40–64px; mobile 28–36px.
- Page title/functional H1: 28–40px; mobile 24–32px, mostly Manrope.
- Course/card title: 18–24px; mobile 18–20px Manrope.
- Large body 18/1.5; body 16/1.55–1.65; compact 14/1.5; metadata 12–14/1.45; buttons 14–16/1.3. Never reduce legal text below readable level.
- Display line height candidate 0.95–1.1 depending on font; no collisions between Cyrillic glyphs.

LAYOUT AND GEOMETRY:
- Grid: 4px base, useful steps 8/12/16/24/32/48/64/96; no fixed spacer quota.
- Desktop content maximum candidate 1320px; allow intentional full-bleed hero/photo and structured inner grid. Mobile side padding candidate 16–20px. Responsive breakpoints follow content, not device names alone.
- Editorial hero left photo width candidate 40–45%, right content candidate 55–60%, with controlled cross-boundary overlap. This is a design start, not a CSS constant for every viewport.
- Major editorial surfaces: square/sharp corners by default, selective cut corner; no systemwide randomized polygon shapes.
- Functional controls: rectangular, accessible, modest radius candidate 0–6px; consistently sized. Minimum touch target 44×44px (prefer 48px for primary actions). Focus visible.
- Functional cards: mostly flat and restrained. Heavy outlines, offset shadows, big radius and shiny gradients require a specific reference and approval.
- Keep body and all navigation free from horizontal scroll. Overlap must never cover text or tap targets.

MEDIA/INTERACTION:
- Image needs predictable art-directed crop, alt text and responsive `sizes` for Next/Image. Avoid auto-generated decorative filler.
- Motion only where it clarifies state or supports one intentional narrative; support `prefers-reduced-motion`.
- Provide hover, focus, pressed, loading, disabled and error visual behavior as relevant. Do not show hover as only navigation affordance.
- Prefer CSS composition to fixed-position hacks; maintain DOM logical reading order on mobile.

SCREENSHOTS ARE AUTHORITY FOR VISUAL REVIEW ONLY WITHIN DOCUMENTED SCOPE. The generated concept's sampled colors, letterforms, and visual detail may differ from exact selected fonts/tokens; tokens and owner decisions take precedence, and the discrepancy must be brought to review.
