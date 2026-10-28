# LegalReturnLinks

Generated; canonical: [legal-return.json](../registry/legal-return.json). Stable ID: legal-return. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: shared. Priority: P1.

## description

Offer related documents and safe return to checkout or catalog.

## purpose

Offer related documents and safe return to checkout or catalog.

## ownership

legal-content

## implementationPath

src/features/legal-content/legal-return.tsx

## requiredData

Правовые ссылки и возврат к оформлению только при валидном контексте; иначе каталог.

## interactions

Вернуться. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Утверждённый текст доступен; загрузка при динамическом получении; ошибка с повтором; отсутствие или неутверждённая версия явно обозначены и блокируют оплату. Чтение статического текста не требует искусственной загрузки.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-006, OQ-007, OQ-008, OQ-037, OQ-083, PA-07
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [license-disclaimer / license-disclaimer--return](../../section-planning/pages/license-disclaimer.json): Offer related documents and safe return to checkout or catalog.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [offer / offer--return](../../section-planning/pages/offer.json): Offer related documents and safe return to checkout or catalog.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [privacy / privacy--return](../../section-planning/pages/privacy.json): Offer related documents and safe return to checkout or catalog.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [refunds / refunds--return](../../section-planning/pages/refunds.json): Offer related documents and safe return to checkout or catalog.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
