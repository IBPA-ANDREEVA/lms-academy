# HOME-HERO-001 — Minimal photo-left statement hero

Status: `selected-direction` / liked image. NOT `approved-implementation`.
Asset: `HOME-HERO-001.png` (AI-generated after user requested less text and information, 2026-10-27). Based primarily on user-supplied `GLOBAL-001` reference. Image is a composition study; its font is NOT a validated Unbounded raster and its photo is not an approved academy photo.
Route: `/`, homepage, MVP. Product/route truth: `docs/product/mvp.md` and `docs/architecture/public-page-structure.md`.

OWNER-SELECTED:
- Statement-first rather than category-first opening.
- Photo on the left, typography on the right, asymmetrical ~40–45/55–60 desktop split.
- One integrated professional beauty-procedure photo.
- Monumental short typography with occasional controlled interaction at section boundary.
- Off-white/light statement field, charcoal and plum type, minimal high-contrast composition.
- Far LESS copy and information than older generated reference.

BORROW FROM IMAGE:
- Emotional close-up of technique, art-directed shadow and sharp photographic crop.
- Massive two-line headline, one dominant CTA under it.
- Architectural border between photo and typography; strong visual breathing space.
- Restrained plum layer may cross the split when it adds depth but does not cover a CTA or make essential text unreadable.

REJECT FROM IMAGE:
- Unverified exact Cyrillic font forms/weight and generated spacing. Real Unbounded + Manrope must be used.
- Nonfunctional '01–06' hero navigation, artificial countdown, six course steps, ornamental vertical side label; OMIT by default.
- Extra menu links not in public sitemap (teachers/shop), fabricated brand/logo and unverified data.
- Unnecessarily tall, overflowing giant letters on smaller screens; never crop meaningful heading characters.
- Production use of AI-generated beauty model as real student/educator work without correct usage review.

CONTENT CONTRACT:
- Required: concise audience/value statement indicating these are online courses for beauty professionals, primary CTA to `/courses`, a truthful indicator of the supported practical/curator format where applicable (can be unobtrusive, but cannot mislead).
- Working statement: `УЧИСЬ. СОЗДАВАЙ.` Not final approved slogan.
- Primary CTA label candidate: `Выбрать курс`; destination `/courses`.
- Secondary CTA optional only if a clearly valid destination is selected; default omit. No mandatory stats row, carousel, feature list, categories ribbon or mini-course sales block inside the hero.
- 'Two weeks' is business requirement for supported courses but start/expiry policies unresolved; do not make unsupported time promises on hero.
- Academy name is pending product OQ-006.

DESKTOP CONSTRAINTS (design proposals pending screenshot):
- Full-width editorial composition, photo left approximately 40–45%, off-white statement field right approximately 55–60%; header compact and readable.
- Main headline can extend slightly toward seam but may not overlap navigation/CTA or become unreadable over photo.
- One primary rectangular plum CTA, no shadow stack. Use actual font and breakpoints driven by text size.
- Prefer one screen opening without requiring a decorative lower feature rail.

MOBILE (UNAPPROVED DESIGN PROPOSAL):
- Maintain accessible logical order: identity/navigation, statement and CTA, image or image integrated with statement after layout review. Test alternative photo-first arrangement before approving.
- Reduce/turn off collision if it damages legibility. Cropping must keep technique visible. Target functional tap size >=44px.
- Final mobile screenshot and owner approval required.

IMPLEMENTATION/QA:
- Implement only after Unbounded sourcing is verified, licensed photo selected and required copy confirmed or explicitly labeled placeholder in a demo branch.
- Compare at 1440×900, 390×844, and narrow 320–360px using `QA.md`.
- Record image crop, heading line breaks, overlap safety, CTA location, nav focus, responsive layout, real link behavior, reduced motion.
- Completion requires visual human sign-off of actual browser screenshots; this generated reference alone is not approval.
