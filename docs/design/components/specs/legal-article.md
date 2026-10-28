# LegalArticle

Generated; canonical: [legal-article.json](../registry/legal-article.json). Stable ID: legal-article. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: shared. Priority: P1.

## description

Render approved legal content without inventing policy or consent.

## purpose

Render approved legal content without inventing policy or consent.

## ownership

legal-content

## implementationPath

src/features/legal-content/legal-article.tsx

## requiredData

Утверждённое разграничение обучения и права профессиональной деятельности.

Утверждённые условия продажи и доступа.

Утверждённые правила обработки, хранения и прав субъектов.

Утверждённые условия и реальный канал запроса; без выдуманной формы.

## interactions

Читать / перейти к разделу. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

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

- [license-disclaimer / license-disclaimer--article](../../section-planning/pages/license-disclaimer.json): Render approved legal content without inventing policy or consent.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [offer / offer--article](../../section-planning/pages/offer.json): Render approved legal content without inventing policy or consent.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [privacy / privacy--article](../../section-planning/pages/privacy.json): Render approved legal content without inventing policy or consent.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [refunds / refunds--article](../../section-planning/pages/refunds.json): Render approved legal content without inventing policy or consent.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
