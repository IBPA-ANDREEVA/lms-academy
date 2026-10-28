# SocialSignIn

Generated; canonical: [social-sign-in.json](../registry/social-sign-in.json). Stable ID: social-sign-in. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P3.

## description

Plan Phase 3 provider entry after account-linking policy; no provider implementation now.

## purpose

Plan Phase 3 provider entry after account-linking policy; no provider implementation now.

## ownership

identity

## implementationPath

src/features/identity/social-sign-in.tsx

## requiredData

Google / Apple только после решения account linking.

## interactions

Войти через провайдера. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Исходное состояние; ввод/проверка; отправка без повторов; успех с безопасным продолжением; неверные учётные данные; блокировка; proof отсутствует, истёк или использован; ограничение повторов; сбой доставки. Применять только состояния текущего auth-сценария.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-013, OQ-016, OQ-032
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [login / login--social](../../section-planning/pages/login.json): Plan Phase 3 provider entry after account-linking policy; no provider implementation now.. Evidence revision 3; current 3; Phase 3 / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
