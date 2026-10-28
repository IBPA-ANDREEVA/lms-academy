# RoleContext

Generated; canonical: [role-context.json](../registry/role-context.json). Stable ID: role-context. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: section. Priority: P1.

## description

Show current authorized task context; proposed inline surface, not a new public route.

## purpose

Show current authorized task context; proposed inline surface, not a new public route.

## ownership

identity

## implementationPath

src/features/identity/role-context.tsx

## requiredData

Текущий контекст и разрешённые назначения.

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

OQ-011, OQ-013, OQ-014, PA-03
MISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.

## implementationNotes

Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.

## notes

Unspecified — human review required.

## Exact source relationships

- [role-context / role-context--context](../../section-planning/pages/role-context.json): Show current authorized task context; proposed inline surface, not a new public route.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
