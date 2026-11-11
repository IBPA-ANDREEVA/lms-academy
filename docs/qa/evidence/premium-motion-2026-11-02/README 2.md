# Premium motion evidence

Current implementation and command outcomes: [verification report](../../premium-motion-2026-11-02.md).

- `results.json`: responsive motion, history, focus, cleanup, interruption, reduced motion and no-JS home.
- `circle-results.json`: actual loading-boundary integration through a test-only delayed Next response.
- `lifecycle-results.json`: CPU throttling, storage denial, utility entry and delayed hydration.
- `frontend-audit.json`: strict design audit.
- `home-*`, `story-*`, `featured-*`, `offers-*`, `catalog-*`, `detail-*`: 1440/768/390/360px views (story/featured desktop only).
- `switch-midpoint-1440.png`, `switch-complete-1440.png`, `wipe-cover-1440.png`: real animation frames; intermediate cropping is the intended horizontal transition, not a settled layout.
- `circle-*`: explicitly manual component preview; `cold-circle-*`: actual pending detail boundary in the test-only response proxy.

Images verify rendering and behavior, not human visual approval. Approved course photography is still absent. Prior LAND02 evidence remains historical and has not been overwritten.
