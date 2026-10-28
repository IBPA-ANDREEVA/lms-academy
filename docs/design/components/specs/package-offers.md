# PackageOffers

Generated; canonical: [package-offers.json](../registry/package-offers.json). Stable ID: package-offers. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: feature. Priority: P2.

## description

Compare real published Phase 2 package contents and fixed prices.

## purpose

Compare real published Phase 2 package contents and fixed prices.

## ownership

catalog

## implementationPath

src/features/catalog/package-offers.tsx

## requiredData

Только опубликованные составы, фиксированные цены и реальные сравнения.

Продукты, фиксированная цена, сопоставимая отдельная стоимость и экономия.

## interactions

Открыть /packages. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

Открыть пакет. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Загрузка опубликованного содержания; нет предложений с переходом в доступный каталог; неизвестный или снятый продукт; неверная конфигурация; нет утверждённой цены/условий; ошибка preview с повтором; already-owned/in-cart; добавление подтверждено или отклонено без потери контекста.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-006, OQ-009, OQ-017, PA-04, PA-13, OD-003, OD-004, OD-005, OQ-025, OQ-026, OQ-027, OQ-028, OQ-053, PA-09
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [home / home--packages](../../section-planning/pages/home.json): Compare real published Phase 2 package contents and fixed prices.. Evidence revision 8; current 8; Phase 2 / included. Approved structure only.
- [packages / packages--offers](../../section-planning/pages/packages.json): Compare real published Phase 2 package contents and fixed prices.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
