# CertificateStatus

Generated; canonical: [certificate-status.json](../registry/certificate-status.json). Stable ID: certificate-status. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P3.

## description

Distinguish valid, revoked, missing and service error; Phase 3 only.

## purpose

Distinguish valid, revoked, missing and service error; Phase 3 only.

## ownership

certificates

## implementationPath

src/features/certificates/certificate-status.tsx

## requiredData

Valid/revoked/not found/service error; superseded pending policy; ошибка загрузки не равна недействительности.

## interactions

Чтение в логическом порядке; доступные переходы при наличии.

## states

Загрузка; действителен; отозван; не найден; сервис недоступен с повтором; superseded/restored только после политики. Ошибка запроса не означает недействительность.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-055, OQ-056, OQ-054, PA-15
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [certificate-verification / certificate-verification--status](../../section-planning/pages/certificate-verification.json): Distinguish valid, revoked, missing and service error; Phase 3 only.. Evidence revision 3; current 3; Phase 3 / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
