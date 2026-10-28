# CartLines

Generated; canonical: [cart-lines.json](../registry/cart-lines.json). Stable ID: cart-lines. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P1.

## description

Review selected products and remove lines without inventing quantities.

## purpose

Review selected products and remove lines without inventing quantities.

## ownership

commerce

## implementationPath

src/features/commerce/cart-lines.tsx

## requiredData

Названия и canonical links; версия/язык, цена, доступность; без количества мест.

## interactions

Удалить продукт. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Загрузка/перерасчёт; пустая корзина со ссылкой на каталог; цена изменилась; продукт снят; владение или eligibility конфликтуют; удаление/восстановление корзины не удалось; повтор без скрытой замены выбора.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-029, OQ-030, OQ-033, PA-06, PA-10
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [cart / cart--lines](../../section-planning/pages/cart.json): Review selected products and remove lines without inventing quantities.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
