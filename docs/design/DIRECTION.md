# Design Direction

## Identity

We are designing a contemporary beauty education platform for beauty experts and learners around the world. It is **not** a beauty salon, luxury cosmetics store, traditional university, newspaper-style publication, or generic SaaS application.

The academy should feel:

- Creative and contemporary.
- Confident and professional.
- Graphic, distinctive, and recognizable.
- Precise but approachable.
- Focused on practical learning.
- Minimalist, spacious, and intentional.
- **Visual-first:** communicate through color, shapes, forms, iconography, imagery, and interaction rather than unnecessary text.

**Principle:** Reduce reading effort, not useful information. Essential labels, learning instructions, prices, accessibility cues, and legal disclosures must remain clear.

## Core Visual Language

Our visual identity is built around:

1. **Unbounded** for strong, geometric display typography and short, expressive headlines.
2. **Manrope** for clean, readable functional typography and interface text.
3. A restrained **plum and neutral palette**, with color used deliberately rather than everywhere.
4. Shapes, open space, minimal text, and clear visual hierarchy.
5. Custom geometric iconography with a recognizable family resemblance.
6. Precise grids with controlled asymmetry.

Russian is the **first design and implementation language**; English is also supported. Design for natural Cyrillic line breaks and longer Russian labels from the beginning. Exact colors, typography sizes, spacing, and component tokens are defined in `SYSTEM.md`.

## Composition Principles

These are techniques available to the design, **not mandatory features of every section**:

- Bold, short Cyrillic headlines with clear contrasts in typographic scale.
- Large photographic compositions where photography adds meaning.
- Full-bleed imagery or sections when they strengthen the composition.
- Large, intentional empty areas and generous negative space.
- Minimal, purposeful geometric details.
- Open layouts that do not depend on enclosing every element in a card.
- Distinctive proportions, precise alignment, and selective asymmetry.

Typography, imagery, geometry, and whitespace should work together. A section may be visually expressive, quiet, or entirely functional depending on its purpose.

## What We Are Not

We are **not** creating:

- A traditional luxury beauty magazine.
- A generic startup or SaaS landing page.
- A newspaper-inspired editorial site.
- A collection of identical rounded dashboard cards.

Avoid:

- Serif headlines, tiny editorial labels, and excessively small supporting text.
- Fake statistics, testimonials, or unsupported claims.
- Excessive dividers, nested boxes, and repetitive three-column feature grids.
- Decorative UI without a functional or branding purpose.
- Huge text blocks or long descriptions where a clearer visual explanation would work.
- Repeating, over-explaining, or spreading the same information across multiple blocks.
- Filling empty space with arbitrary illustrations, shapes, or content.

Favor a free, clean layout with concise text and strong visual guidance. **Visual expression does not mean adding more unrelated colors:** use the established palette, with semantic status colors only where needed.

# Design Signatures

Our identity uses three distinctive signatures to make the Beauty Academy recognizable, modern, and memorable.

> **Use signatures selectively.** They are not requirements for every page, section, or component. A section may use one, several, or none. Never add a signature merely to fill space; each use must serve a visual or functional purpose.

## 01. Modular Brand Geometry

A recognizable visual language built from custom geometric shapes.

**Direction**

- Combine precise straight edges with soft curves.
- Use simple, distinctive forms and repeat a coherent underlying geometry.
- Apply the approved plum and neutral palette.
- Keep shapes contemporary, creative, and intentional.
- Allow geometry to complement typography, photography, and layout without dominating them.

**Where to use**

- Selected homepage compositions.
- Course category illustrations.
- Occasional section transitions and branded details.

**Avoid:** Random decorative shapes, repetitive geometric backgrounds, and placing shapes behind every heading.

## 02. Interactive Learning Preview

Let visitors **experience how the academy works before purchasing** instead of relying only on explanations.

**Direction**

- Build functional previews using real or representative LMS components.
- Demonstrate the journey: **lesson → assignment → curator feedback → progress**.
- Let visitors explore sample lessons, submissions, feedback, and learning stages.
- Use smooth, purposeful transitions and intuitive controls.
- Make demonstrations accessible without registration.
- Use isolated, predefined sample data; never change real student records or imply demo progress belongs to the visitor.
- Label examples clearly and protect student privacy.

**Where to use**

- One dedicated interactive section on the homepage.
- Selected course detail pages when a course-specific preview helps a purchase decision.
- An optional full learning demo page.

**Avoid:** Fake interactions, purely decorative animations, complex onboarding, unrealistic demonstrations, and repeating the same preview throughout the site.

## 03. Custom Geometric Iconography

Create a distinctive, consistent icon family that complements the academy's visual identity.

**Direction**

- Use custom SVG icons built from shared geometric principles.
- Keep them slightly playful but professional.
- Combine solid shapes with clean outlines.
- Use plum, charcoal, white, and subtle neutral backgrounds.
- Maintain consistent proportions, stroke weights, corner treatment, and optical alignment.
- Make beauty-category illustrations expressive and functional UI icons simpler and immediately recognizable.
- Pair ambiguous icons with text labels; never rely on icons or color alone to convey critical meaning.

**Where to use**

- Course categories and educational directions.
- Selected feature highlights.
- Dashboard navigation and meaningful actions.
- Learning progress and achievements.

**Avoid:** Generic emoji, inconsistent icon families, excessive decoration, and complex symbols that reduce usability.

## Signature Usage Principles

1. **Purpose over decoration:** Signatures must improve recognition, understanding, or interaction.
2. **Selective implementation:** Never force a signature into a page to meet an arbitrary quota.
3. **Visual restraint:** Keep functional workflows free of unnecessary branding elements.
4. **Consistency:** Follow the same approved typography, color, and component systems.
5. **Functional priority:** Student, trainer, and admin dashboards prioritize clarity and task completion.
6. **Reference-driven design:** Use approved visual references; do not invent unrelated signature styles without review.

**The objective is a recognizable identity, not the maximum number of branded elements per screen.**

## Visual Communication

Prioritize visual communication over lengthy text.

- Use icons, illustrations, progress indicators, shapes, and interactive previews to communicate concepts.
- Show how something works rather than explaining it in multiple paragraphs when a real demonstration is possible.
- Reveal complex or secondary information progressively when users need it.
- Reinforce meaning with color, but never use color as the only signal.
- Preserve necessary labels, instructions, prices, accessibility information, and legal notices.
- Remove visuals that communicate nothing.

**Goal:** Minimal reading effort, not minimal useful information.

## Composition & Visual Rhythm

Pages should feel intentionally composed, not assembled from repeated templates.

- Alternate spacious, expressive sections with compact informational sections.
- Establish hierarchy through scale, positioning, contrast, and negative space.
- Use asymmetry selectively and preserve logical reading order.
- Combine full-bleed sections with contained layouts where appropriate.
- Avoid repeating the same card arrangement, image position, or alignment across consecutive sections.
- Allow quiet sections to make expressive moments more effective.
- Never introduce asymmetry that harms navigation, scanning, or accessibility.

**Goal:** Distinctive visual rhythm without sacrificing consistency.

## Content Hierarchy & Density

Every screen must have one clear primary purpose.

- Identify the primary information or action **before** designing its layout.
- Give primary content clear visual priority.
- Keep secondary information accessible but visually quieter.
- Avoid repeating information across blocks or screens without a user need.
- Use progressive disclosure for secondary details.
- Replace lengthy explanations with concise copy when meaning is preserved.
- Prefer real content and useful states over decorative statistics or generic feature descriptions.

**Goal:** Users should quickly understand what matters and what to do next.

## Imagery & Art Direction

Photography and illustration must be intentional and consistent with the identity.

- Prioritize authentic professional beauty work, techniques, tools, educators, and student results.
- Use carefully chosen compositions, crops, natural textures, and controlled lighting.
- Maintain a coherent treatment across images.
- Use large or full-bleed imagery when it strengthens the composition; it is **not** required in every section.
- Combine photography with geometry only when the relationship is intentional.
- Let some sections rely entirely on typography, icons, geometry, or interaction.

**Avoid:** Generic stock models, unrelated lifestyle photography, random AI illustrations, inconsistent imagery, and using student work without proper permission.

## Interaction & Motion

Interactions should make the platform responsive, understandable, and alive.

- Prefer meaningful interaction over purely decorative animation.
- Use motion to clarify navigation, transitions, progress, and feedback.
- Interactive learning previews must demonstrate genuine product behavior, even when powered by sample data.
- Keep motion restrained, smooth, and purposeful.
- Avoid repeating entrance animations on every scroll.
- Respect reduced-motion preferences and keyboard accessibility.
- Keep learning, trainer, and admin workflows fast and predictable.

**Goal:** Engage users through functionality, not visual effects alone.

## Public Website vs. LMS Workspaces

The product has **one visual identity** but different levels of expression.

- **Public website:** More expressive; can use ambitious composition, branded geometry, large imagery, and interactive learning previews. The goal is to communicate value and help visitors choose courses.
- **Student workspace:** Calm and focused; prioritize continuing lessons, assignments, curator feedback, and progress.
- **Trainer and admin workspaces:** Efficient and structured; prioritize scanning, review queues, deadlines, forms, and clear system states.

Do not apply marketing-page decoration indiscriminately to functional dashboards.

## Design Quality Criteria

Before approving a design, evaluate:

1. **Identity:** Does it feel recognizable rather than generic?
2. **Clarity:** Can the user immediately identify the primary information and next action?
3. **Composition:** Is the layout intentional, balanced, and appropriately spacious?
4. **Restraint:** Does each decorative element contribute something meaningful?
5. **Consistency:** Does it follow the approved type, palette, icons, components, and geometry?
6. **Usability:** Is it responsive, accessible, and understandable in Russian and English?
7. **Interaction:** Do interactive elements work, communicate state, and match user expectations?
8. **Content integrity:** Is important information accurate, nonduplicated, and not hidden for aesthetic reasons?

A technically correct interface is **not automatically an approved design**. Compare implemented screens with approved and rejected references, inspect actual browser renders at desktop and mobile sizes, and address visible mismatches before sign-off. Detailed checks belong in `QA.md`.
