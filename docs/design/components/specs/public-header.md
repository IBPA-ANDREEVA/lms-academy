# PublicHeader

Generated; canonical: [public-header.json](../registry/public-header.json). Stable ID: public-header. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: shared. Priority: P0.

## description

Expose only phase-valid public navigation and current context.

## purpose

Expose only phase-valid public navigation and current context.

## ownership

public-shell

## implementationPath

src/features/public-shell/public-header.tsx

## requiredData

Название страницы; текущий контекст; возврат; доступные для роли и фазы направления.

## interactions

Перейти в нужный раздел. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Текущий маршрут; гость/разрешённая роль; меню открыто/закрыто при необходимости; видимый focus; неопубликованные направления отсутствуют. Без искусственной загрузки статических ссылок.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Public discovery; focused commerce/legal context. Confirm actual shared anatomy before extracting variants.

## openQuestions

OQ-029, OQ-030, OQ-033, PA-06, PA-10, OQ-055, OQ-056, OQ-054, PA-15, OQ-031, OQ-032, OQ-069, OQ-080, PA-08, PA-12, OQ-001, OQ-007, OQ-082, OQ-083, PA-05, PA-07, OQ-003, OQ-009, OQ-018, OQ-021, OQ-024, OQ-050, OQ-017, OQ-088, PA-01, OQ-006, PA-04, PA-13, OD-003, OD-004, OD-005, OQ-008, OQ-037, OQ-025, OQ-026, OQ-028, OQ-053, OQ-027, PA-09, OQ-019
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [cart / cart--navigation](../../section-planning/pages/cart.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [certificate-verification / certificate-verification--navigation](../../section-planning/pages/certificate-verification.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; Phase 3 / included. Approved structure only.
- [checkout-result / checkout-result--navigation](../../section-planning/pages/checkout-result.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [checkout / checkout--navigation](../../section-planning/pages/checkout.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [course-detail / course-detail--navigation](../../section-planning/pages/course-detail.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [courses / courses--navigation](../../section-planning/pages/courses.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [home / home--navigation](../../section-planning/pages/home.json): Expose only phase-valid public navigation and current context.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [license-disclaimer / license-disclaimer--navigation](../../section-planning/pages/license-disclaimer.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [mini-courses / mini-courses--navigation](../../section-planning/pages/mini-courses.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [mini-detail / mini-detail--navigation](../../section-planning/pages/mini-detail.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [offer / offer--navigation](../../section-planning/pages/offer.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [package-detail / package-detail--navigation](../../section-planning/pages/package-detail.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.
- [packages / packages--navigation](../../section-planning/pages/packages.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.
- [privacy / privacy--navigation](../../section-planning/pages/privacy.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [refunds / refunds--navigation](../../section-planning/pages/refunds.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [start-usa / start-usa--navigation](../../section-planning/pages/start-usa.json): Expose only phase-valid public navigation and current context.. Evidence revision 3; current 3; Unresolved / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
