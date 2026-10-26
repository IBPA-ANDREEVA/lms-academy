# Visual QA & Acceptance

## Before implementation
- Confirm docs read and relevant references inspected.
- Verify requirements and actual app state, not inferred features.
- Identify applicable signatures; none is a valid choice.
- For substantial design tasks, attempt to invoke `uncodixfy` if installed; report unavailable skill honestly. The project design direction and system override generic aesthetic advice.

## Visual test matrix
- Desktop 1440×900; tablet 768×1024; mobile 390×844 (also examine content-dependent breakpoints).
- Russian-first, with long course names and labels; repeat core checks in English.
- Check authentic font loading for Cyrillic, image crops, active controls, keyboard focus and reduced-motion behavior.
- Inspect all important states: empty, loading, error, success, disabled, overdue, accepted, revision requested.
- Verify no horizontal overflow, clipped text, concealed CTA or fake interactions.

## Anti-template review
Reject unapproved serif headings, fake metrics, meaningless decorative icons, unmotivated gradients, nested card patterns, repeated three-column layouts, miniature captions, gratuitous section numbering, and gratuitous signature motifs. Evaluate context rather than applying blanket bans.

## Functional review
- Every visual control must do what its label suggests.
- Demo uses sample data, never mutates real learner records.
- Progress and assignment statuses are legible with text/icons as well as color.
- Confirm relevant privacy, accessibility and policy content stays accessible.

## Completion report
Document: affected screens, exact viewports, screenshot paths, checked criteria, known limitations, and explicit human approval status.
A passing build is not proof of visual approval; screenshot baselines must be reviewed by a person before becoming canonical.
