# LegalDocumentIdentity

Generated; canonical: [legal-identity.json](../registry/legal-identity.json). Stable ID: legal-identity. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: shared. Priority: P1.

## description

Identify approved issuer, version and date.

## purpose

Identify approved issuer, version and date.

## ownership

legal-content

## implementationPath

src/features/legal-content/legal-identity.tsx

## requiredData

Название, issuer, дата и версия; содержание для длинного текста.

## interactions

Чтение в логическом порядке; доступные переходы при наличии.

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

- [license-disclaimer / license-disclaimer--identity](../../section-planning/pages/license-disclaimer.json): Identify approved issuer, version and date.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [offer / offer--identity](../../section-planning/pages/offer.json): Identify approved issuer, version and date.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [privacy / privacy--identity](../../section-planning/pages/privacy.json): Identify approved issuer, version and date.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [refunds / refunds--identity](../../section-planning/pages/refunds.json): Identify approved issuer, version and date.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
