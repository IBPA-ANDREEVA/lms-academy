# PublicPreview

Generated; canonical: [public-preview.json](../registry/public-preview.json). Stable ID: public-preview. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: feature. Priority: P1.

## description

Оценить обучение по разрешённому видео.

## purpose

Оценить обучение по разрешённому видео.

## ownership

catalog

## implementationPath

src/features/catalog/public-preview.tsx

## requiredData

Рабочее превью, язык и доступные субтитры; ошибка и повтор.

## interactions

Смотреть превью. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Загрузка опубликованного содержания; нет предложений с переходом в доступный каталог; неизвестный или снятый продукт; неверная конфигурация; нет утверждённой цены/условий; ошибка preview с повтором; already-owned/in-cart; добавление подтверждено или отклонено без потери контекста.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Supported course: distinguish teacher from assigned curator and access from support.

## openQuestions

OQ-003, OQ-009, OQ-018, OQ-021, OQ-024, OQ-029, OQ-050, PA-10
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [course-detail / course-detail--preview](../../section-planning/pages/course-detail.json): Оценить обучение по разрешённому видео.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [mini-detail / mini-detail--preview](../../section-planning/pages/mini-detail.json): Оценить обучение по разрешённому видео.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
