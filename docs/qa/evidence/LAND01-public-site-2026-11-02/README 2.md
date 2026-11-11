# LAND01 evidence · November 2, 2026

Branch `refactor/landing`, HEAD `eb3665d1d6ec7441c462ba9ad7d20b6944d506f1`. 336 PNG captures plus review contact sheets, logs and structured measurements. No historical evidence folder was overwritten. The main [audit report](../../LAND01-public-site-audit-2026-11-02.md) explains defects, status and limits.

## Default viewport matrix

| Surface | 1920 | 1440 | 1280 | 1024 | 768 | 430 | 390 | 360 | 320 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| home | [1920](home-1920.png) | [1440](home-1440.png) | [1280](home-1280.png) | [1024](home-1024.png) | [768](home-768.png) | [430](home-430.png) | [390](home-390.png) | [360](home-360.png) | [320](home-320.png) |
| courses | [1920](courses-1920.png) | [1440](courses-1440.png) | [1280](courses-1280.png) | [1024](courses-1024.png) | [768](courses-768.png) | [430](courses-430.png) | [390](courses-390.png) | [360](courses-360.png) | [320](courses-320.png) |
| mini-courses | [1920](mini-courses-1920.png) | [1440](mini-courses-1440.png) | [1280](mini-courses-1280.png) | [1024](mini-courses-1024.png) | [768](mini-courses-768.png) | [430](mini-courses-430.png) | [390](mini-courses-390.png) | [360](mini-courses-360.png) | [320](mini-courses-320.png) |
| course-lashes | [1920](course-lashes-1920.png) | [1440](course-lashes-1440.png) | [1280](course-lashes-1280.png) | [1024](course-lashes-1024.png) | [768](course-lashes-768.png) | [430](course-lashes-430.png) | [390](course-lashes-390.png) | [360](course-lashes-360.png) | [320](course-lashes-320.png) |
| mini-lashes | [1920](mini-lashes-1920.png) | [1440](mini-lashes-1440.png) | [1280](mini-lashes-1280.png) | [1024](mini-lashes-1024.png) | [768](mini-lashes-768.png) | [430](mini-lashes-430.png) | [390](mini-lashes-390.png) | [360](mini-lashes-360.png) | [320](mini-lashes-320.png) |
| cart-empty | [1920](cart-empty-1920.png) | [1440](cart-empty-1440.png) | [1280](cart-empty-1280.png) | [1024](cart-empty-1024.png) | [768](cart-empty-768.png) | [430](cart-empty-430.png) | [390](cart-empty-390.png) | [360](cart-empty-360.png) | [320](cart-empty-320.png) |
| checkout-empty | [1920](checkout-empty-1920.png) | [1440](checkout-empty-1440.png) | [1280](checkout-empty-1280.png) | [1024](checkout-empty-1024.png) | [768](checkout-empty-768.png) | [430](checkout-empty-430.png) | [390](checkout-empty-390.png) | [360](checkout-empty-360.png) | [320](checkout-empty-320.png) |
| component-preview | [1920](component-preview-1920.png) | [1440](component-preview-1440.png) | [1280](component-preview-1280.png) | [1024](component-preview-1024.png) | [768](component-preview-768.png) | [430](component-preview-430.png) | [390](component-preview-390.png) | [360](component-preview-360.png) | [320](component-preview-320.png) |

1440/desktop/tablet captures use 900px viewport height; 430/390/360/320 captures use 844px. Full-page images extend below the viewport. Every concrete detail variant was additionally captured at both required baseline widths.

## Concrete detail variants

| Example | 1440 | 390 |
| --- | --- | --- |
| course-lashes | [Desktop](course-lashes-1440.png) | [Mobile](course-lashes-390.png) |
| course-nails | [Desktop](course-nails-1440.png) | [Mobile](course-nails-390.png) |
| course-lamination | [Desktop](course-lamination-1440.png) | [Mobile](course-lamination-390.png) |
| course-brows | [Desktop](course-brows-1440.png) | [Mobile](course-brows-390.png) |
| mini-lashes | [Desktop](mini-lashes-1440.png) | [Mobile](mini-lashes-390.png) |
| mini-nails | [Desktop](mini-nails-1440.png) | [Mobile](mini-nails-390.png) |
| mini-brows | [Desktop](mini-brows-1440.png) | [Mobile](mini-brows-390.png) |
| mini-makeup | [Desktop](mini-makeup-1440.png) | [Mobile](mini-makeup-390.png) |

## Measurement and execution evidence

- [Route matrix](route-matrix.json): 90 default/not-found cases, rendered text, local fonts, links, geometry, small targets and console/network events.
- [Interactive probes](interactive-results.json): 30 recorded probes; “WORKING” labels mean the probe executed, so inspect details (e.g. scroll-lock probe reports `locked:false`). Three harness failures are retained, with follow-up evidence below.
- [Follow-up](followup-results.json): popup open-state overflow/Escape, reliable keyboard focus/selection/history, rapid reduced-motion switching, shared preview states, clipped-detail/founder bounds and production not-found. Initial/second JSONs retain interrupted pre-follow-up probes; they are not additional passing coverage.
- [Touch and control probes](extra-results.json): native menu/cart tap, nested carousel touch isolation, single-card controls and Escape.
- [Final storage-failure/cross-tab probes](final-state-results.json): local-storage write failure preserves memory state with a warning; cross-tab fixture removal verified at 1440/390.
- [Integrity checks](verification-integrity.json): application/test/config diff empty, out-of-scope initial dirty files unchanged, local documentation links resolve.
- [Source interfaces and direct consumers](source-inventory.json).
- [Manifest with image dimensions and SHA-256](manifest.json).
- [Initial dirty-file hashes](baseline.json); current-source unchanged checks and execution logs under [logs](logs/).
- [Premium strict static scan](premium-audit.json): zero findings; does not imply runtime correctness.
- Harness source and exact output-path-only copies of existing suites: [harness](harness/). `.txt` suffix prevents treating evidence scripts as application source.

## State screenshots

Significant states are captured at 1440×900 and 390×844. Some section captures are taller crops; state screenshots retain viewport size unless marked full-page in the structured capture data.

- [course-404-1440.png](course-404-1440.png)
- [course-404-390.png](course-404-390.png)
- [finding-detail-preview-1024.png](finding-detail-preview-1024.png)
- [finding-detail-preview-1440.png](finding-detail-preview-1440.png)
- [finding-detail-preview-320.png](finding-detail-preview-320.png)
- [finding-detail-preview-360.png](finding-detail-preview-360.png)
- [finding-detail-preview-390.png](finding-detail-preview-390.png)
- [finding-detail-preview-430.png](finding-detail-preview-430.png)
- [finding-detail-preview-768.png](finding-detail-preview-768.png)
- [finding-filter-escape-1440.png](finding-filter-escape-1440.png)
- [finding-filter-escape-320.png](finding-filter-escape-320.png)
- [finding-filter-escape-390.png](finding-filter-escape-390.png)
- [finding-filter-Направление-1024.png](finding-filter-Направление-1024.png)
- [finding-filter-Направление-1440.png](finding-filter-Направление-1440.png)
- [finding-filter-Направление-320.png](finding-filter-Направление-320.png)
- [finding-filter-Направление-360.png](finding-filter-Направление-360.png)
- [finding-filter-Направление-390.png](finding-filter-Направление-390.png)
- [finding-filter-Направление-430.png](finding-filter-Направление-430.png)
- [finding-filter-Направление-768.png](finding-filter-Направление-768.png)
- [finding-filter-Уровень-1024.png](finding-filter-Уровень-1024.png)
- [finding-filter-Уровень-1440.png](finding-filter-Уровень-1440.png)
- [finding-filter-Уровень-320.png](finding-filter-Уровень-320.png)
- [finding-filter-Уровень-360.png](finding-filter-Уровень-360.png)
- [finding-filter-Уровень-390.png](finding-filter-Уровень-390.png)
- [finding-filter-Уровень-430.png](finding-filter-Уровень-430.png)
- [finding-filter-Уровень-768.png](finding-filter-Уровень-768.png)
- [finding-filter-Язык-1024.png](finding-filter-Язык-1024.png)
- [finding-filter-Язык-1440.png](finding-filter-Язык-1440.png)
- [finding-filter-Язык-320.png](finding-filter-Язык-320.png)
- [finding-filter-Язык-360.png](finding-filter-Язык-360.png)
- [finding-filter-Язык-390.png](finding-filter-Язык-390.png)
- [finding-filter-Язык-430.png](finding-filter-Язык-430.png)
- [finding-filter-Язык-768.png](finding-filter-Язык-768.png)
- [finding-founder-title-320.png](finding-founder-title-320.png)
- [finding-founder-title-360.png](finding-founder-title-360.png)
- [finding-founder-title-390.png](finding-founder-title-390.png)
- [finding-home-filtered-controls-390.png](finding-home-filtered-controls-390.png)
- [finding-learning-media-320.png](finding-learning-media-320.png)
- [finding-learning-media-360.png](finding-learning-media-360.png)
- [finding-learning-media-390.png](finding-learning-media-390.png)
- [generic-404-1440.png](generic-404-1440.png)
- [generic-404-390.png](generic-404-390.png)
- [mini-404-1440.png](mini-404-1440.png)
- [mini-404-390.png](mini-404-390.png)
- [production--courses-not-a-product.png](production--courses-not-a-product.png)
- [production--mini-courses-not-a-product.png](production--mini-courses-not-a-product.png)
- [production--not-a-route.png](production--not-a-route.png)
- [state-auth-background-scroll-1440.png](state-auth-background-scroll-1440.png)
- [state-auth-background-scroll-390.png](state-auth-background-scroll-390.png)
- [state-button-loading-1440.png](state-button-loading-1440.png)
- [state-button-loading-390.png](state-button-loading-390.png)
- [state-cart-error-1440.png](state-cart-error-1440.png)
- [state-cart-error-390.png](state-cart-error-390.png)
- [state-cart-filled-1440.png](state-cart-filled-1440.png)
- [state-cart-filled-390.png](state-cart-filled-390.png)
- [state-cart-preview-empty-1440.png](state-cart-preview-empty-1440.png)
- [state-cart-preview-empty-390.png](state-cart-preview-empty-390.png)
- [state-cart-preview-filled-1440.png](state-cart-preview-filled-1440.png)
- [state-cart-preview-filled-390.png](state-cart-preview-filled-390.png)
- [state-cart-price-changed-1440.png](state-cart-price-changed-1440.png)
- [state-cart-price-changed-390.png](state-cart-price-changed-390.png)
- [state-cart-recalculating-1440.png](state-cart-recalculating-1440.png)
- [state-cart-recalculating-390.png](state-cart-recalculating-390.png)
- [state-cart-removed-1440.png](state-cart-removed-1440.png)
- [state-cart-removed-390.png](state-cart-removed-390.png)
- [state-cart-storage-error-1440.png](state-cart-storage-error-1440.png)
- [state-cart-storage-error-390.png](state-cart-storage-error-390.png)
- [state-cart-storage-warning-1440.png](state-cart-storage-warning-1440.png)
- [state-cart-storage-warning-390.png](state-cart-storage-warning-390.png)
- [state-cart-unavailable-1440.png](state-cart-unavailable-1440.png)
- [state-cart-unavailable-390.png](state-cart-unavailable-390.png)
- [state-catalog-brows-1440.png](state-catalog-brows-1440.png)
- [state-catalog-brows-390.png](state-catalog-brows-390.png)
- [state-catalog-direction-open-1440.png](state-catalog-direction-open-1440.png)
- [state-catalog-direction-open-390.png](state-catalog-direction-open-390.png)
- [state-catalog-language-keyboard-1440.png](state-catalog-language-keyboard-1440.png)
- [state-catalog-language-keyboard-390.png](state-catalog-language-keyboard-390.png)
- [state-checkout-email-error-1440.png](state-checkout-email-error-1440.png)
- [state-checkout-email-error-390.png](state-checkout-email-error-390.png)
- [state-checkout-filled-1440.png](state-checkout-filled-1440.png)
- [state-checkout-filled-390.png](state-checkout-filled-390.png)
- [state-checkout-login-1440.png](state-checkout-login-1440.png)
- [state-checkout-login-390.png](state-checkout-login-390.png)
- [state-contact-errors-1440.png](state-contact-errors-1440.png)
- [state-contact-errors-390.png](state-contact-errors-390.png)
- [state-course-card-hover-1440.png](state-course-card-hover-1440.png)
- [state-course-card-hover-390.png](state-course-card-hover-390.png)
- [state-course-card-keyboard-focus-1440.png](state-course-card-keyboard-focus-1440.png)
- [state-course-card-keyboard-focus-390.png](state-course-card-keyboard-focus-390.png)
- [state-founder-open-1440.png](state-founder-open-1440.png)
- [state-founder-open-390.png](state-founder-open-390.png)
- [state-home-mini-filter-1440.png](state-home-mini-filter-1440.png)
- [state-home-mini-filter-390.png](state-home-mini-filter-390.png)
- [state-learning-assignment-empty-1440.png](state-learning-assignment-empty-1440.png)
- [state-learning-assignment-empty-390.png](state-learning-assignment-empty-390.png)
- [state-learning-feedback-1440.png](state-learning-feedback-1440.png)
- [state-learning-feedback-390.png](state-learning-feedback-390.png)
- [state-learning-file-error-1440.png](state-learning-file-error-1440.png)
- [state-learning-file-error-390.png](state-learning-file-error-390.png)
- [state-learning-photo-1440.png](state-learning-photo-1440.png)
- [state-learning-photo-390.png](state-learning-photo-390.png)
- [state-learning-revision-1440.png](state-learning-revision-1440.png)
- [state-learning-revision-390.png](state-learning-revision-390.png)
- [state-login-1440.png](state-login-1440.png)
- [state-login-390.png](state-login-390.png)
- [state-login-unavailable-1440.png](state-login-unavailable-1440.png)
- [state-login-unavailable-390.png](state-login-unavailable-390.png)
- [state-navigation-open-1440.png](state-navigation-open-1440.png)
- [state-navigation-open-390.png](state-navigation-open-390.png)
- [state-offers-0-1440.png](state-offers-0-1440.png)
- [state-offers-0-390.png](state-offers-0-390.png)
- [state-offers-1-1440.png](state-offers-1-1440.png)
- [state-offers-1-390.png](state-offers-1-390.png)
- [state-offers-2-1440.png](state-offers-2-1440.png)
- [state-offers-2-390.png](state-offers-2-390.png)
- [state-offers-3-1440.png](state-offers-3-1440.png)
- [state-offers-3-390.png](state-offers-3-390.png)
- [state-package-builder-empty-1440.png](state-package-builder-empty-1440.png)
- [state-package-builder-empty-390.png](state-package-builder-empty-390.png)
- [state-package-builder-selected-1440.png](state-package-builder-selected-1440.png)
- [state-package-builder-selected-390.png](state-package-builder-selected-390.png)
- [state-package-over-limit-1440.png](state-package-over-limit-1440.png)
- [state-package-over-limit-390.png](state-package-over-limit-390.png)
- [state-package-summary-1440.png](state-package-summary-1440.png)
- [state-package-summary-390.png](state-package-summary-390.png)
- [state-preview-card-available-1440.png](state-preview-card-available-1440.png)
- [state-preview-card-available-390.png](state-preview-card-available-390.png)
- [state-preview-card-in-cart-1440.png](state-preview-card-in-cart-1440.png)
- [state-preview-card-in-cart-390.png](state-preview-card-in-cart-390.png)
- [state-preview-card-owned-1440.png](state-preview-card-owned-1440.png)
- [state-preview-card-owned-390.png](state-preview-card-owned-390.png)
- [state-preview-card-stale-1440.png](state-preview-card-stale-1440.png)
- [state-preview-card-stale-390.png](state-preview-card-stale-390.png)
- [state-preview-card-unavailable-1440.png](state-preview-card-unavailable-1440.png)
- [state-preview-card-unavailable-390.png](state-preview-card-unavailable-390.png)
- [state-preview-form-error-1440.png](state-preview-form-error-1440.png)
- [state-preview-form-error-390.png](state-preview-form-error-390.png)
- [state-preview-form-success-1440.png](state-preview-form-success-1440.png)
- [state-preview-form-success-390.png](state-preview-form-success-390.png)
- [state-recovery-1440.png](state-recovery-1440.png)
- [state-recovery-390.png](state-recovery-390.png)
- [state-recovery-unavailable-1440.png](state-recovery-unavailable-1440.png)
- [state-recovery-unavailable-390.png](state-recovery-unavailable-390.png)
- [state-reduced-motion-1440.png](state-reduced-motion-1440.png)
- [state-register-1440.png](state-register-1440.png)
- [state-register-390.png](state-register-390.png)
- [state-register-unavailable-1440.png](state-register-unavailable-1440.png)
- [state-register-unavailable-390.png](state-register-unavailable-390.png)
- [state-reviews-next-1440.png](state-reviews-next-1440.png)
- [state-reviews-next-390.png](state-reviews-next-390.png)
- [state-touch-carousel-390.png](state-touch-carousel-390.png)
- [state-usa-topics-1440.png](state-usa-topics-1440.png)
- [state-usa-topics-390.png](state-usa-topics-390.png)
- [verified-catalog-no-results-1440.png](verified-catalog-no-results-1440.png)
- [verified-catalog-no-results-390.png](verified-catalog-no-results-390.png)
- [verified-reduced-motion-1440.png](verified-reduced-motion-1440.png)
- [verified-reduced-motion-390.png](verified-reduced-motion-390.png)

## Full-page review sheets

These are overview aids; full-resolution PNGs, source copy and focused viewport evidence control findings.
- [1920px overview](matrix-review-1920.jpg)
- [1440px overview](matrix-review-1440.jpg)
- [1280px overview](matrix-review-1280.jpg)
- [1024px overview](matrix-review-1024.jpg)
- [768px overview](matrix-review-768.jpg)
- [430px overview](matrix-review-430.jpg)
- [390px overview](matrix-review-390.jpg)
- [360px overview](matrix-review-360.jpg)
- [320px overview](matrix-review-320.jpg)
- [All eight detail examples, 1440px](detail-variants-review-1440.jpg)
- [All eight detail examples, 390px](detail-variants-review-390.jpg)

## Limits

Chrome emulation, local fixtures and explicitly recorded states only. No real payments/authentication/uploads/contact delivery were enabled. Real virtual keyboards, other engines/hardware, assistive technology, unavailable original reference images and final human approval remain unverified. Development indicators and expected 404 diagnostics are not product content.
