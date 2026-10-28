# UsaOffer

Generated; canonical: [usa-offer.json](../registry/usa-offer.json). Stable ID: usa-offer. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P3.

## description

Разделить самостоятельную покупку и включение в пакет.

## purpose

Разделить самостоятельную покупку и включение в пакет.

## ownership

catalog

## implementationPath

src/features/catalog/usa-offer.tsx

## requiredData

Только утверждённая цена и условия; ссылки на опубликованные пакеты.

## interactions

Добавить в корзину после допуска продажи. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Загрузка опубликованного содержания; нет предложений с переходом в доступный каталог; неизвестный или снятый продукт; неверная конфигурация; нет утверждённой цены/условий; ошибка preview с повтором; already-owned/in-cart; добавление подтверждено или отклонено без потери контекста.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

PA-04, OQ-019, OQ-053
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [start-usa / start-usa--offer](../../section-planning/pages/start-usa.json): Разделить самостоятельную покупку и включение в пакет.. Evidence revision 3; current 3; Unresolved / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
