# CatalogIntro

Generated; canonical: [catalog-intro.json](../registry/catalog-intro.json). Stable ID: catalog-intro. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: feature. Priority: P1.

## description

Обозначить границы каталога.

## purpose

Обозначить границы каталога.

## ownership

catalog

## implementationPath

src/features/catalog/catalog-intro.tsx

## requiredData

Основные и продвинутые курсы; условия уровня; переход к мини-курсам.

Записи без куратора; сертификат по завершению уроков; переход к поддерживаемым курсам.

## interactions

Чтение в логическом порядке; доступные переходы при наличии.

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

- [courses / courses--intro](../../section-planning/pages/courses.json): Обозначить границы каталога.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [mini-courses / mini-courses--intro](../../section-planning/pages/mini-courses.json): Обозначить границы каталога.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
