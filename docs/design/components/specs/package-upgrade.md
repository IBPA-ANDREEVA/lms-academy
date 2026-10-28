# PackageUpgrade

Generated; canonical: [package-upgrade.json](../registry/package-upgrade.json). Stable ID: package-upgrade. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P2.

## description

Present a Phase 2 package alternative and explicit consent; never replace automatically.

## purpose

Present a Phase 2 package alternative and explicit consent; never replace automatically.

## ownership

commerce

## implementationPath

src/features/commerce/package-upgrade.tsx

## requiredData

Состав до/после, итог и явное подтверждение; без автоматической замены.

## interactions

Согласиться на замену. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

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

- [cart / cart--upgrade](../../section-planning/pages/cart.json): Present a Phase 2 package alternative and explicit consent; never replace automatically.. Evidence revision 3; current 3; Phase 2 / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
