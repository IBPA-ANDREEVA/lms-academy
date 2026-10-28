# CourseCard

Generated; canonical: [course-card.json](../registry/course-card.json). Stable ID: course-card. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: feature. Priority: P0.

## description

Summarize real course facts and valid product actions; never calculate purchase eligibility locally.

## purpose

Summarize real course facts and valid product actions; never calculate purchase eligibility locally.

## ownership

catalog

## implementationPath

src/features/catalog/course-card.tsx

## requiredData

Реальные названия, изображения, преподаватели, язык, длительность, формат, цена; состояния владения и доступности.

Реальная редакционная подборка; направление, уровень, язык, преподаватель, формат и цена. Категории и объяснение обучения можно интегрировать.

Записанные курсы без куратора и проверки; реальные факты и ссылки.

## interactions

Открыть описание; добавить разрешённый продукт. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

Открыть каталог или курс. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

Открыть /mini-courses. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Первичная загрузка; обновление фильтра; нет совпадений со сбросом; нет опубликованного каталога; ошибка с повтором; неверный query; offer устарел; продукт уже в корзине или принадлежит пользователю.

Загрузка опубликованного содержания; нет предложений с переходом в доступный каталог; неизвестный или снятый продукт; неверная конфигурация; нет утверждённой цены/условий; ошибка preview с повтором; already-owned/in-cart; добавление подтверждено или отклонено без потери контекста.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Supported course / mini-course: data-driven differences, no curator claims for mini-courses.

## openQuestions

OQ-009, OQ-017, OQ-018, OQ-088, PA-01, OQ-006, PA-04, PA-13, OD-003, OD-004, OD-005
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [courses / courses--results](../../section-planning/pages/courses.json): Summarize real course facts and valid product actions; never calculate purchase eligibility locally.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [home / home--course-discovery](../../section-planning/pages/home.json): Summarize real course facts and valid product actions; never calculate purchase eligibility locally.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [home / home--mini-discovery](../../section-planning/pages/home.json): Summarize real course facts and valid product actions; never calculate purchase eligibility locally.. Evidence revision 8; current 8; MVP / included. Approved structure only.
- [mini-courses / mini-courses--results](../../section-planning/pages/mini-courses.json): Summarize real course facts and valid product actions; never calculate purchase eligibility locally.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

- [button](button.md)

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
