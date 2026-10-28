# Design QA — required for every implemented section/component

BEFORE:
- Identify exact route, feature phase, product source and approved reference scope.
- Open the real reference IMAGE, not only the filename/description.
- Verify font availability and actual RU glyphs. Current starter is Geist/Arial, not selected styling.
- Check that the image has permission for public use. Reference photography may be inspiration only.

SCREENSHOT MATRIX (minimum):
- Desktop 1440×900; mobile 390×844.
- Additional narrow mobile 320–360px and tablet 768px when text, split composition or menus are affected.
- Russian: long course title and long category labels; English when content is approved for the relevant phase.
- Default plus applicable loading, no-data, error/retry, disabled, hover, focus-visible, in-cart, active and selected states.
- Reduced motion and keyboard-only pass.

VISUAL COMPARISON:
- Compare photograph/image placement, focal-point crop, typographic scale and line breaks, negative space, split ratio, overlay placement, CTA location, alignment and actual colors to the scoped approved reference.
- For H-001: verify one strong technique photo left + massive headline right + one prominent CTA; no feature strip, no fake slideshow, no dense copy.
- Do not chase generated mockup's inaccurate raster font shape. Verify selected Unbounded and Manrope and note deviation.
- No overlap hiding words, UI, clickable targets or meaningful photo subject. No horizontal scroll. On mobile, collapse overlap cleanly.
- Check text contrast (normal >=4.5:1, large >=3:1 as WCAG AA target); overlays need real-image testing.
- Readable legal/product facts cannot be removed to improve screenshot similarity.

FUNCTIONAL:
- Links lead only to valid current/approved routes; no placeholder `#` CTA.
- Disabled actions have reasons; loading states have progress and recoverability.
- Filters preserve/rest query state; cart does not add phantom quantities.
- No synthetic metrics, fake testimonials, fabricated inventory or unapproved credential claims.
- No actual payment/learning state claimed for demo assets. Authoritative domain/role checks enforced server-side as relevant.

REPORT FORMAT:
Target / task; reference IDs and approval status; screenshots with paths and viewport; what visually matches; deviations and why; interaction/accessibility/state tests; commands actually run; missing approvals; final human review status. Do not report `approved` without human review of the actual browser screenshots.
