# PriceSummary

Generated; canonical: [price-summary.json](../registry/price-summary.json). Stable ID: price-summary. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: feature. Priority: P1.

## description

Present server-authoritative totals, currency and applicable fees; no client pricing rules.

## purpose

Present server-authoritative totals, currency and applicable fees; no client pricing rules.

## ownership

commerce

## implementationPath

src/features/commerce/price-summary.tsx

## requiredData

Промежуточный и полный итог, применимые сборы; ошибки цены и eligibility; legal links.

Серверная цена, валюта, сборы; cap по утверждённой политике.

## interactions

Перейти к /checkout. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

Чтение в логическом порядке; доступные переходы при наличии.

## states

Загрузка/перерасчёт; пустая корзина со ссылкой на каталог; цена изменилась; продукт снят; владение или eligibility конфликтуют; удаление/восстановление корзины не удалось; повтор без скрытой замены выбора.

Пустая корзина; неверные поля или непринятые соглашения; новая цена/версия условий; cap/eligibility rejection; сессия истекла; провайдер недоступен; отправка/повторный клик; processing/failure/cancel; безопасное продолжение без потери выбора.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Cart estimate / final checkout: different authority and eligibility context, common presentation only.

## openQuestions

OQ-029, OQ-030, OQ-033, PA-06, PA-10, OQ-001, OQ-007, OQ-031, OQ-032, OQ-082, OQ-083, PA-05, PA-07
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [cart / cart--summary](../../section-planning/pages/cart.json): Present server-authoritative totals, currency and applicable fees; no client pricing rules.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [checkout / checkout--price](../../section-planning/pages/checkout.json): Present server-authoritative totals, currency and applicable fees; no client pricing rules.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
