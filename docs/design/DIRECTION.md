# Art direction — actionable instructions

GOAL: A visually memorable, minimalist, contemporary beauty-education platform. It should feel like a carefully designed creative-school poster adapted to an actual commerce and LMS product. Think editorial restraint with selective brutalist energy, NOT a brutalist decoration kit. It is not a luxury cosmetics shop, salon, newspaper or generic SaaS template.

COMPOSITION RULES:
- Start each section with its user's task. Decide a single dominant idea. Remove elements that do not serve that idea.
- On high-expression sections, create identity using contrast between monumental short typography, one strong authentic image, intentional empty space and architectural boundaries.
- Use clear grids as the invisible foundation. Break the grid only for controlled intentional overlap; content must remain legible and navigable.
- Experiment with scale and offset selectively. If something overlaps, specify which layer owns stacking, what remains legible and how mobile avoids collision.
- Structural geometry: sharp surfaces and selected clipped edges. A cut corner must have a compositional purpose. Avoid scattered circles, random diagonal slabs, gradients, decorative dotted grids and unexplained geometry.
- Light spaces are not unfinished. Leave them empty when more content would lower hierarchy.
- Use thin lines and restrained edges to support alignment; avoid outlining every card and button.
- Keep one primary commercial CTA per section. Secondary navigation should be quieter.
- Every visual cue that resembles a control must have a real action; no fake carousel counters or fake play buttons.

HERO RULES (HOME-HERO-001):
- Emulate relationships from `references/global/TONI-GUY-01.png` and `references/pages/home/HOME-HERO-001.png` without duplicating copyrighted artwork.
- Editorial photo left, off-white statement field right, asymmetric ratio around 40/60 on desktop. One photographic subject, one strong headline, one CTA.
- Photo represents real professional technique, such as brows, nails or lashes, not a generic glamour model. Crop can be dramatic while preserving recognizability of the craft.
- Headline is short and massive. A cross-boundary overlap is permitted only where contrast remains sufficient and no functional text is obscured.
- Translucent plum band is an optional single compositional layer, never required on other pages. Keep opacity/contrast tested over real image.
- Remove the crowded prior mockup's top-level category strip, stats row, feature icons, repetitive tagline, and 6-item slider unless separately approved as working functionality.
- Exact text, art usage rights, hero heights and mobile order are not finalized. See `references/pages/home/HOME-HERO-001.md`.

COLOR ROLES:
- Off-white `#FAF9FA` = Explore: discovery and breathing space.
- Plum `#782858` = Learn: educational identity and important actions.
- Charcoal `#1D1B1F` = Practice: serious craft and high-contrast structure.
- Pale blush `#F7EFF4` = Progress: learner achievement/support emphasis.
- This mapping is conceptual, not a strict per-route theme or status taxonomy; neutral functional surfaces and semantic feedback colors remain available.
- Use large alternating bands only where page content benefits from change of rhythm. A catalog, checkout or lesson screen may stay light throughout.

TYPOGRAPHY:
- Unbounded is for short expressive headline content. Manrope is for every long sentence, product fact, navigation label, button, price, form, timetable and progress label.
- Prefer solid type. Outlined/offset layers may appear once in a strong art-directed section if readable; do not simulate multiple layers of the same heading everywhere.
- Never introduce a text layer solely because the word 'brutalist' appears in the task.
- Russian line lengths and glyphs are primary. English layouts receive independent fit testing when the phase supports them.

PHOTOGRAPHY:
- Favor permissioned photographs of real technique, hands, equipment, processes or educators. Editorial color treatment: natural skin, nuanced shadow, coherent plum/neutral surroundings. Retain visible craft, not just a face.
- One compelling photograph is better than a collage of unrelated assets. Do not repeat the same photo across card grids.
- Do not treat AI-generated model/photo as proof of real staff, learners or course results. Production image selection remains pending.

INTENSITY BY AREA:
- Homepage hero: strongest composition.
- Home educational statements and sections: expressive but distinct from hero; no repetitive headline collisions.
- Catalog/course detail: calmer, scan-friendly and conversion-friendly.
- Cart/checkout/auth: functional, predictable, unambiguous.
- Student/trainer/admin: quiet working surfaces; no oversized brutalist ornament around homework, payments or review queues.

NEVER INVENT:
- Testimonial cards, statistics, fake course inventory or prices, badges like 'best selling', ratings, trainer portraits/credentials, access-period claims, QR features or 'licensed/accredited' promises.
- Extra route destinations lifted from a reference's navigation.
- Generic icons instead of the existing icon collection without approval.
- Continuous scroll effects, excessive parallax or animated distraction in purchase/learning workflows.

IMPLEMENTATION CHECK: A page passing TypeScript and having our palette is not 'on brand' unless the approved image-to-element relationships are visible at real browser widths. See `QA.md`.
