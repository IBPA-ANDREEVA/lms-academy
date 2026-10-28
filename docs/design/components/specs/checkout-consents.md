# CheckoutConsents

Generated; canonical: [checkout-consents.json](../registry/checkout-consents.json). Stable ID: checkout-consents. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P1.

## description

Present approved versioned legal agreements; no invented fourth checkbox.

## purpose

Present approved versioned legal agreements; no invented fourth checkbox.

## ownership

commerce

## implementationPath

src/features/commerce/checkout-consents.tsx

## requiredData

Оферта, возвраты, disclaimer; privacy доступна; не выдумывать четвёртый checkbox.

## interactions

Подтвердить соглашения. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Пустая корзина; неверные поля или непринятые соглашения; новая цена/версия условий; cap/eligibility rejection; сессия истекла; провайдер недоступен; отправка/повторный клик; processing/failure/cancel; безопасное продолжение без потери выбора.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-001, OQ-007, OQ-029, OQ-030, OQ-031, OQ-032, OQ-082, OQ-083, PA-05, PA-07
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [checkout / checkout--consents](../../section-planning/pages/checkout.json): Present approved versioned legal agreements; no invented fourth checkbox.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

- [form-controls](form-controls.md)
- [button](button.md)

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
