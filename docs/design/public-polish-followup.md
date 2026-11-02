# Public polish follow-up

Owner request: lighter offers navigation attached directly to the header, biography disclosure layout, fewer placeholder explanations and broader motion. This is a bounded proposal using the existing fonts, palette and stationary seam geometry; no new raster reference supplied. Desktop/mobile review remains required.

1. HOME-06–09 retains its existing owner and `panels` contract. Sticky navigation shares header gutters and touches its lower edge, with plum text/underline selection, quiet hover and longer cancellable GSAP panel movement. Header merges its lower corners while the group is docked. No black hover surface.

2. HOME-03 loses its founder CTA. HOME-04 keeps all supplied biography text in `components/founder-story.tsx` (`children`, local to FounderSection): expanded introduction, ruled narrative paragraphs, staggered GSAP disclosure and a reversible height transition. Closed content is inert; live reduced motion and rapid toggling are supported. Milestones remain separate.

3. Owner explicitly supersedes the prior visible fixture-label requirement: public pages remove demo badges, future-content explanations, raster placeholder captions and duplicated pending metadata. No prices, testimonials or credentials are invented; missing trainer/curriculum data is omitted, media is neutral, payment and submission availability stays enforced. Development controls remain only in `/preview/components`. Course/example data and server boundaries remain unchanged internally.
