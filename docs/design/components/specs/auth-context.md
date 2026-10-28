# AuthContext

Generated; canonical: [auth-context.json](../registry/auth-context.json). Stable ID: auth-context. Revision: 1. Active proposal.

Definition: draft. Approval: None.

Visual: no-reference. Approval: None. MISSING REFERENCE — no approved component visual reference.

Implementation: not-started; definition/visual approval does not approve React implementation.

Category: shared. Priority: P1.

## description

Orient focused account flows and preserve safe continuation.

## purpose

Orient focused account flows and preserve safe continuation.

## ownership

public-shell

## implementationPath

src/features/public-shell/auth-context.tsx

## requiredData

Название страницы; текущий контекст; возврат; доступные для роли и фазы направления.

## interactions

Перейти в нужный раздел. Поддержать клавиатуру; сохранить контекст при возврате и ошибке.

## states

Текущий маршрут; гость/разрешённая роль; меню открыто/закрыто при необходимости; видимый focus; неопубликованные направления отсутствуют. Без искусственной загрузки статических ссылок.

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

- [forgot-password / forgot-password--navigation](../../section-planning/pages/forgot-password.json): Orient focused account flows and preserve safe continuation.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [login / login--navigation](../../section-planning/pages/login.json): Orient focused account flows and preserve safe continuation.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [register / register--navigation](../../section-planning/pages/register.json): Orient focused account flows and preserve safe continuation.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [reset-password / reset-password--navigation](../../section-planning/pages/reset-password.json): Orient focused account flows and preserve safe continuation.. Evidence revision 3; current 3; MVP / included. Approved structure only.
- [verify-email / verify-email--navigation](../../section-planning/pages/verify-email.json): Orient focused account flows and preserve safe continuation.. Evidence revision 3; current 3; MVP / included. Approved structure only.

## Dependencies

None proposed.

## Visual references


## Implementation workflow

Read approved specification → inspect exact reference images → read Borrow/Reject and responsive explanations → implement within release scope → verify visually. Missing reference or unresolved product questions block affected implementation decisions.
