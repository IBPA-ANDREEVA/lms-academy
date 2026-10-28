# AuthInstruction

Generated; canonical: [auth-instruction.json](../registry/auth-instruction.json). Stable ID: auth-instruction. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: shared. Priority: P1.

## description

Explain the current account task without conflating its security policy.

## purpose

Explain the current account task without conflating its security policy.

## ownership

identity

## implementationPath

src/features/identity/auth-instruction.tsx

## requiredData

Получить безопасную ссылку.

Войти и продолжить разрешённый сценарий.

Создать аккаунт без автоматического платного доступа.

Восстановить учётные данные.

Подтвердить владение адресом.

## interactions

Чтение в логическом порядке; доступные переходы при наличии.

## states

Исходное состояние; ввод/проверка; отправка без повторов; успех с безопасным продолжением; неверные учётные данные; блокировка; proof отсутствует, истёк или использован; ограничение повторов; сбой доставки. Применять только состояния текущего auth-сценария.

## responsive

Desktop: Ясная иерархия; связанные данные рядом; основной сценарий без декоративных отвлечений.

Mobile: Одна колонка в порядке чтения; перенос длинных названий; действия от 44px; без горизонтальной прокрутки.

Exact component-level composition is unapproved.

## variants

Unspecified — human review required.

## openQuestions

OQ-069, PA-05, OQ-013, OQ-016, OQ-032, OQ-051
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [forgot-password / forgot-password--instruction](../../section-planning/pages/forgot-password.json): Explain the current account task without conflating its security policy.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [login / login--instruction](../../section-planning/pages/login.json): Explain the current account task without conflating its security policy.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [register / register--instruction](../../section-planning/pages/register.json): Explain the current account task without conflating its security policy.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [reset-password / reset-password--instruction](../../section-planning/pages/reset-password.json): Explain the current account task without conflating its security policy.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [verify-email / verify-email--instruction](../../section-planning/pages/verify-email.json): Explain the current account task without conflating its security policy.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
