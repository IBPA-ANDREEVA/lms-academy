# CatalogResults

Generated; canonical: [catalog-results.json](../registry/catalog-results.json). Stable ID: catalog-results. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: feature. Priority: P1.

## description

Сравнить факты и выбрать продукт.

## purpose

Сравнить факты и выбрать продукт.

## ownership

catalog

## implementationPath

src/features/catalog/catalog-results.tsx

## requiredData

Реальные названия, изображения, преподаватели, язык, длительность, формат, цена; состояния владения и доступности.

## interactions

Открыть описание; добавить разрешённый продукт. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Первичная загрузка; обновление фильтра; нет совпадений со сбросом; нет опубликованного каталога; ошибка с повтором; неверный query; offer устарел; продукт уже в корзине или принадлежит пользователю.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Course / mini-course context; do not imply curator support for mini-courses.

## openQuestions

OQ-009, OQ-017, OQ-018, OQ-088, PA-01
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [courses / courses--results](../../section-planning/pages/courses.json): Сравнить факты и выбрать продукт.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [mini-courses / mini-courses--results](../../section-planning/pages/mini-courses.json): Сравнить факты и выбрать продукт.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

- [course-card](course-card.md)

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
