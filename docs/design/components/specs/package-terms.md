# PackageTerms

Generated; canonical: [package-terms.json](../registry/package-terms.json). Stable ID: package-terms. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: feature. Priority: P2.

## description

Разделить условия продуктов.

## purpose

Разделить условия продуктов.

## ownership

catalog

## implementationPath

src/features/catalog/package-terms.tsx

## requiredData

Поддержка и доступ по курсам, требования; не обещать общий сертификат.

Доступ, поддержка, критерии завершения, правовые ссылки.

## interactions

Чтение в логическом порядке; доступные переходы при наличии.

## states

Загрузка опубликованного содержания; нет предложений с переходом в доступный каталог; неизвестный или снятый продукт; неверная конфигурация; нет утверждённой цены/условий; ошибка preview с повтором; already-owned/in-cart; добавление подтверждено или отклонено без потери контекста.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-025, OQ-026, OQ-028, OQ-029, OQ-053, OQ-027, PA-09
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [package-detail / package-detail--terms](../../section-planning/pages/package-detail.json): Разделить условия продуктов.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.
- [packages / packages--terms](../../section-planning/pages/packages.json): Не смешивать поддержку и сертификаты разных курсов.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
