# Frontend pages

Maintained inventory, 2026-10-28. Read this with [sections](frontend-sections.md), [shared components](frontend-components.md), and [backlog](frontend-backlog.md) before UI work. The public homepage `/` and the user-authorized `/preview/components` review route are implemented. Planned URL spellings remain subject to the sitemap and PA-02/PA-03; this registry does not approve routes or release policy. `—` means no implementation file exists, not an invitation to create a placeholder route.

| Route / proposal | Page / purpose | Implementation path | Status / phase |
| --- | --- | --- | --- |
| `/preview/components` | Component preview — inspect all shared components and their states | `src/app/preview/components/page.tsx` → `src/features/component-preview/component-preview-page.tsx` | Implemented; review utility, noindex |
| `None` | admin-access — Обеспечить безопасную поддержку запуска. | — | Not implemented; Conditional |
| `None` | admin-assignments — Контролировать очередь и назначения. | — | Not implemented; Phase 2 |
| `None` | admin-audit — Проверить необходимые операции запуска. | — | Not implemented; MVP |
| `None` | admin-certificates — Проверить выдачу и разрешённую поддержку. | — | Not implemented; Phase 2 |
| `None` | admin-directions — Управлять таксономией без правки кода. | — | Not implemented; Phase 2 |
| `None` | admin-lessons — Управлять содержанием и доступной последовательностью. | — | Not implemented; Phase 2 |
| `None` | admin-orders — Проверить все разрешённые продажи. | — | Not implemented; Phase 2 |
| `None` | admin-packages — Управлять утверждёнными наборами. | — | Not implemented; Phase 2 |
| `None` | admin-payouts — Сверить расчёты и зарегистрировать выплаты. | — | Not implemented; Phase 2 |
| `None` | admin-products — Управлять продуктами и продажей. | — | Not implemented; Phase 2 |
| `None` | admin-promos — Настроить разрешённые скидки. | — | Not implemented; Phase 2 |
| `None` | admin-rates — Управлять утверждёнными финансовыми условиями. | — | Not implemented; Phase 2 |
| `None` | admin-refund — Зафиксировать подтверждённый возврат с audit и access reversal. | — | Not implemented; Conditional |
| `None` | admin-reports — Анализировать согласованные финансовые и учебные показатели. | — | Not implemented; Phase 2 |
| `None` | admin-review-moderation — Публиковать только допустимые отзывы. | — | Not implemented; Phase 3 |
| `None` | admin-templates — Управлять утверждёнными RU/EN шаблонами. | — | Not implemented; Phase 2 |
| `None` | admin-users — Поддержать доступ и роли запуска. | — | Not implemented; MVP |
| `/cart` | cart — Проверить выбранные продукты и точную стоимость. | — | Not implemented; MVP |
| `/certificates/verify/[verificationId]` | certificate-verification — Проверить выдачу по QR без публичного поиска. | — | Not implemented; Phase 3 |
| `/checkout/result` | checkout-result — Показать авторитетный результат и безопасный доступ. | — | Not implemented; MVP |
| `/checkout` | checkout — Подтвердить покупателя, стоимость, соглашения и оплатить один раз. | — | Not implemented; MVP |
| `/courses/[slug]` | course-detail — Оценить содержание, пригодность и условия до покупки. | — | Not implemented; MVP |
| `/courses` | courses — Найти продукт по направлению, языку и уровню. | — | Not implemented; MVP |
| `/forgot-password` | forgot-password — Получить безопасную ссылку. | — | Not implemented; MVP |
| `/` | home — Помочь выбрать формат обучения и перейти к реальному предложению. | `src/app/page.tsx` → `src/features/home/home-page.tsx` → `src/features/home/sections/{hero,about,founder,learning-preview,courses,packages,mini-courses,start-usa,reviews,contact}/*-section.tsx + learning-offers/learning-offers-showcase.tsx` | HOME-02/03/05 implemented; HOME-06–09 are connected through a sticky horizontal showcase. Courses/mini-courses use labeled placeholder inventory. Packages are a Phase 2 preview with a local demo builder; Start in USA is an unresolved-release preview. HOME-10 is an explicitly labeled Phase 3 testimonial/recommendation layout preview, not published endorsements. HOME-11 is a visual, client-validated contact form with delivery disabled until backend and abuse controls exist. No live offers, testimonial records, contact submissions or catalog routes added. |
| `/license-disclaimer` | license-disclaimer — Прочесть действующую утверждённую версию. | — | Not implemented; MVP |
| `/login` | login — Войти и продолжить разрешённый сценарий. | — | Not implemented; MVP |
| `None` | manager-commission — Проверить личную ведомость. | — | Not implemented; Phase 2 |
| `None` | manager-enrollment — Зачислить после проверенной офлайн-оплаты. | — | Not implemented; Phase 2 |
| `None` | manager-leads — Вести только разрешённые контакты. | — | Not implemented; Phase 2 |
| `None` | manager-promotions — Использовать собственную атрибуцию. | — | Not implemented; Phase 2 |
| `None` | manager-sales — Увидеть свои продажи за период. | — | Not implemented; Phase 2 |
| `/mini-courses` | mini-courses — Найти продукт по направлению, языку и уровню. | — | Not implemented; MVP |
| `/mini-courses/[slug]` | mini-detail — Оценить содержание, пригодность и условия до покупки. | — | Not implemented; MVP |
| `None` | notification-preferences — Управлять уведомлениями только после утверждения настроек. | — | Not implemented; Conditional |
| `/offer` | offer — Прочесть действующую утверждённую версию. | — | Not implemented; MVP |
| `/packages/[slug]` | package-detail — Понять точный состав и итог покупки. | — | Not implemented; Phase 2 |
| `/packages` | packages — Сравнить разрешённые наборы без предположений о произвольной сборке. | — | Not implemented; Phase 2 |
| `/privacy` | privacy — Прочесть действующую утверждённую версию. | — | Not implemented; MVP |
| `/refunds` | refunds — Прочесть действующую утверждённую версию. | — | Not implemented; MVP |
| `/register` | register — Создать аккаунт без автоматического платного доступа. | — | Not implemented; MVP |
| `/reset-password` | reset-password — Восстановить учётные данные. | — | Not implemented; MVP |
| `None` | role-context — Выбрать разрешённый рабочий контекст без нового аккаунта. | — | Not implemented; MVP |
| `/start-in-usa` | start-usa — Объяснить модуль, сохранив открытый вопрос публикации и продажи. | — | Not implemented; Unresolved |
| `None` | student-assignment — Отправить или исправить работу и прочесть отзыв. | — | Not implemented; MVP |
| `None` | student-certificates — Проверить завершение и скачать документ. | — | Not implemented; MVP |
| `/account/courses/[enrollmentId]` | student-course — Понять прогресс и перейти к доступному уроку. | — | Not implemented; MVP |
| `/account` | student-dashboard — Продолжить обучение и увидеть состояние работ. | — | Not implemented; MVP |
| `None` | student-lesson — Посмотреть разрешённый урок и выполнить практику. | — | Not implemented; MVP |
| `None` | student-messages — Обсудить обучение с назначенным куратором. | — | Not implemented; Phase 2 |
| `None` | student-profile — Изменить согласованные профильные данные. | — | Not implemented; Phase 2 |
| `None` | student-purchases — Прочесть собственную историю покупок. | — | Not implemented; Phase 2 |
| `None` | student-review — Оставить отзыв по утверждённым правилам. | — | Not implemented; Phase 3 |
| `None` | trainer-courses — Управлять своими черновиками. | — | Not implemented; Phase 2 |
| `None` | trainer-editor — Подготовить материалы к согласованию. | — | Not implemented; Phase 2 |
| `None` | trainer-finance — Проверить собственные начисления и выплаты. | — | Not implemented; Phase 2 |
| `None` | trainer-messages — Ответить назначенному ученику внутри платформы. | — | Not implemented; Phase 2 |
| `None` | trainer-queue — Найти назначенную работу для проверки. | — | Not implemented; MVP |
| `None` | trainer-review — Изучить работу и дать безопасное решение. | — | Not implemented; MVP |
| `/verify-email` | verify-email — Подтвердить владение адресом. | — | Not implemented; MVP |

Public navigation publication is maintained in `src/features/public-shell/navigation.ts`. Auth, commerce, protected workspaces and legal documents do not exist yet. Do not link to their proposed URLs until implemented and released. The existing project name is a working identity, not a final logo approval.

### Homepage refinement — 2026-10-28

`/` continues to compose shared HOME-01/12 and numbered home-owned HOME-02–11. `home-page.tsx` now inserts shared decorative seams between the vertical sections and the state-preserving, natural-height 06–09 showcase. Hero is viewport-height; navigation, learning-stage motion, compact offer layouts and cross-section geometry are implemented within the existing release constraints. `/preview/components` reflects the revised Cut button and unavailable navigation entries. See the latest verification entry for browser evidence and remaining publication blockers.
