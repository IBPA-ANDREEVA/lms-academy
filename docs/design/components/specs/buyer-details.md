# BuyerDetails

Generated; canonical: [buyer-details.json](../registry/buyer-details.json). Stable ID: buyer-details. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P1.

## description

Collect approved buyer fields with optional sign-in and safe continuation.

## purpose

Collect approved buyer fields with optional sign-in and safe continuation.

## ownership

commerce

## implementationPath

src/features/commerce/buyer-details.tsx

## requiredData

Только утверждённые обязательные поля; необязательный вход; безопасное продолжение.

## interactions

Чтение в логическом порядке; доступные переходы при наличии.

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

- [checkout / checkout--buyer](../../section-planning/pages/checkout.json): Collect approved buyer fields with optional sign-in and safe continuation.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

- [form-controls](form-controls.md)
- [button](button.md)

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
