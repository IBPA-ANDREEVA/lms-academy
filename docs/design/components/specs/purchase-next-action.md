# PurchaseNextAction

Generated; canonical: [purchase-next-action.json](../registry/purchase-next-action.json). Stable ID: purchase-next-action. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P1.

## description

Choose safe next action from server status; activation, learning, refresh or permitted retry.

## purpose

Choose safe next action from server status; activation, learning, refresh or permitted retry.

## ownership

commerce

## implementationPath

src/features/commerce/purchase-next-action.tsx

## requiredData

Перепроверка pending; авторизованное обучение; secure activation для гостя; retry только после допуска сервером.

## interactions

Проверить статус / открыть обучение. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Проверка оплаты; подтверждена, доступ готовится; доступ готов; неуспешно; отменено; неизвестно; доставка письма задержана; отсутствующий/чужой контекст без раскрытия заказа. Не предлагать повторную оплату при pending/unknown.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-031, OQ-032, OQ-069, OQ-080, PA-08, PA-12
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [checkout-result / checkout-result--next](../../section-planning/pages/checkout-result.json): Choose safe next action from server status; activation, learning, refresh or permitted retry.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
