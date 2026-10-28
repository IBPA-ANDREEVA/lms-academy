# HomeCourseSelection

Generated; canonical: [home-course-selection.json](../registry/home-course-selection.json). Stable ID: home-course-selection. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P1.

## description

Compose an editorial selection of actual published products and catalog links.

## purpose

Compose an editorial selection of actual published products and catalog links.

## ownership

public-home

## implementationPath

src/features/public-home/home-course-selection.tsx

## requiredData

Реальная редакционная подборка; направление, уровень, язык, преподаватель, формат и цена. Категории и объяснение обучения можно интегрировать.

Записанные курсы без куратора и проверки; реальные факты и ссылки.

## interactions

Открыть каталог или курс. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

Открыть /mini-courses. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Загрузка опубликованного содержания; нет предложений с переходом в доступный каталог; неизвестный или снятый продукт; неверная конфигурация; нет утверждённой цены/условий; ошибка preview с повтором; already-owned/in-cart; добавление подтверждено или отклонено без потери контекста.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Supported courses / mini-courses; not separate card implementations.

## openQuestions

OQ-006, OQ-009, OQ-017, PA-04, PA-13, OD-003, OD-004, OD-005
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [home / home--course-discovery](../../section-planning/pages/home.json): Compose an editorial selection of actual published products and catalog links.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [home / home--mini-discovery](../../section-planning/pages/home.json): Compose an editorial selection of actual published products and catalog links.. Evidence revision 8; current 8; MVP / included. Approved structure only.

## Dependencies

- [course-card](course-card.md)

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
