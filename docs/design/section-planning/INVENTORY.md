# Initial section review inventory

Generated from the JSON documents. This is a review snapshot; the workspace and JSON files are authoritative after edits. No URL or structure approval is implied. Rebuild this summary with `node scripts/report-section-plans.mjs`.

60 pages/screens; 270 meaningful sections. 0 approved.

All non-root URL spellings are proposals. `/` is implemented only as the starter. Required screens with no URL may become nested screens or in-page surfaces after structure review, rather than separate routes.

## Public

| Page / source specification | URL status | Phase | Ordered sections |
| --- | --- | --- | --- |
| [Публичная проверка сертификата](pages/certificate-verification.json) | `/certificates/verify/[verificationId]` · proposed | Phase 3 | Навигация и контекст → Статус сертификата → Сведения о выдаче → Ограничение назначения → Правовая информация и завершение страницы |
| [Описание основного / продвинутого курса](pages/course-detail.json) | `/courses/[slug]` · proposed | MVP | Навигация и контекст → Название и основные факты → Преподаватель → Результаты и условия обучения → Программа → Публичное превью → Отзывы [Phase 3] → Покупка и условия → Правовая информация и завершение страницы |
| [Каталог курсов](pages/courses.json) | `/courses` · proposed | MVP | Навигация и контекст → Введение и формат → Направления → Язык и уровень → Результаты → Правовая информация и завершение страницы |
| [Главная](pages/home.json) | `/` · implemented-starter | MVP | Навигация и контекст → Первый экран → Основные курсы → Пакеты [Phase 2] → Мини-курсы → Старт в США [Unresolved] → Как проходит обучение — опционально [Conditional] → Отзывы и рекомендации [Phase 3] → Правовая информация и завершение страницы |
| [Каталог мини-курсов](pages/mini-courses.json) | `/mini-courses` · proposed | MVP | Навигация и контекст → Введение и формат → Направления → Язык и уровень → Результаты → Правовая информация и завершение страницы |
| [Описание мини-курса](pages/mini-detail.json) | `/mini-courses/[slug]` · proposed | MVP | Навигация и контекст → Название и основные факты → Преподаватель → Результаты и условия обучения → Программа → Публичное превью → Отзывы [Phase 3] → Покупка и условия → Правовая информация и завершение страницы |
| [Описание пакета](pages/package-detail.json) | `/packages/[slug]` · proposed | Phase 2 | Навигация и контекст → Название и предложение → Состав и содержание → Доступ и завершение → Сравнение цены и покупка → Правовая информация и завершение страницы |
| [Каталог и выбор пакетов](pages/packages.json) | `/packages` · proposed | Phase 2 | Навигация и контекст → Введение → Выбор конфигурации → Сравнение предложений → Условия по каждому продукту → Правовая информация и завершение страницы |
| [Старт в США](pages/start-usa.json) | `/start-in-usa` · proposed | Unresolved | Навигация и контекст → Введение → Темы → Автор и программа → Доступ и завершение → Предложение → Правовая информация и завершение страницы |

## Commerce

| Page / source specification | URL status | Phase | Ordered sections |
| --- | --- | --- | --- |
| [Корзина](pages/cart.json) | `/cart` · proposed | MVP | Навигация и контекст → Выбранные продукты → Предложение пакета [Phase 2] → Промокод [Phase 2] → Итог и продолжение → Правовая информация и завершение страницы |
| [Результат покупки](pages/checkout-result.json) | `/checkout/result` · proposed | MVP | Навигация и контекст → Статус покупки → Разрешённые детали заказа → Следующее действие → Письмо и восстановление → Правовая информация и завершение страницы |
| [Оформление покупки](pages/checkout.json) | `/checkout` · proposed | MVP | Навигация и контекст → Состав заказа → Покупатель → Окончательный расчёт → Обязательные соглашения → Оплата и состояние попытки → Правовая информация и завершение страницы |

## Authentication

| Page / source specification | URL status | Phase | Ordered sections |
| --- | --- | --- | --- |
| [Запрос восстановления](pages/forgot-password.json) | `/forgot-password` · proposed | MVP | Навигация и контекст → Задача и инструкция → Форма и результат → Связанные действия → Правовая информация и завершение страницы |
| [Вход](pages/login.json) | `/login` · proposed | MVP | Навигация и контекст → Задача и инструкция → Форма и результат → Связанные действия → Социальный вход [Phase 3] → Правовая информация и завершение страницы |
| [Регистрация](pages/register.json) | `/register` · proposed | MVP | Навигация и контекст → Задача и инструкция → Форма и результат → Связанные действия → Правовая информация и завершение страницы |
| [Новый пароль](pages/reset-password.json) | `/reset-password` · proposed | MVP | Навигация и контекст → Задача и инструкция → Форма и результат → Связанные действия → Правовая информация и завершение страницы |
| [Контекст роли](pages/role-context.json) | Unresolved URL | MVP | Текущая задача и роль → Разрешённые роли |
| [Подтверждение email](pages/verify-email.json) | `/verify-email` · proposed | MVP | Навигация и контекст → Задача и инструкция → Форма и результат → Связанные действия → Правовая информация и завершение страницы |

## Legal

| Page / source specification | URL status | Phase | Ordered sections |
| --- | --- | --- | --- |
| [Лицензионный disclaimer](pages/license-disclaimer.json) | `/license-disclaimer` · proposed | MVP | Навигация и контекст → Документ и версия → Полный текст → Связанные документы и возврат → Правовая информация и завершение страницы |
| [Оферта](pages/offer.json) | `/offer` · proposed | MVP | Навигация и контекст → Документ и версия → Полный текст → Связанные документы и возврат → Правовая информация и завершение страницы |
| [Политика конфиденциальности](pages/privacy.json) | `/privacy` · proposed | MVP | Навигация и контекст → Документ и версия → Полный текст → Связанные документы и возврат → Правовая информация и завершение страницы |
| [Правила возврата](pages/refunds.json) | `/refunds` · proposed | MVP | Навигация и контекст → Документ и версия → Полный текст → Связанные документы и возврат → Правовая информация и завершение страницы |

## Student

| Page / source specification | URL status | Phase | Ordered sections |
| --- | --- | --- | --- |
| [Настройки уведомлений — условная поверхность](pages/notification-preferences.json) | Unresolved URL | Conditional | Предпочтения доставки → Разрешения push [Phase 3] |
| [Практическая работа и история](pages/student-assignment.json) | Unresolved URL | MVP | Навигация и контекст → Задание и доступность → Медиа и комментарий → Статус, отзыв и история |
| [Доступ к сертификату](pages/student-certificates.json) | Unresolved URL | MVP | Навигация и контекст → Готовность к выдаче → Выданный документ → Назначение сертификата |
| [Обучение: обзор курса](pages/student-course.json) | `/account/courses/[enrollmentId]` · proposed | MVP | Навигация и контекст → Контекст и прогресс → Уроки и доступность → Практика и завершение |
| [Кабинет ученика](pages/student-dashboard.json) | `/account` · proposed | MVP | Навигация и контекст → Мои курсы → Домашние работы и ответы → Сертификаты → Срок поддержки и сообщения [Phase 2] → Рекомендации [Phase 3] |
| [Урок](pages/student-lesson.json) | Unresolved URL | MVP | Навигация и контекст → Видео урока → Порядок и прогресс → Материалы и практика → Язык медиа [Phase 2] → Защита воспроизведения [Phase 3] |
| [Сообщения курса](pages/student-messages.json) | Unresolved URL | Phase 2 | Навигация и контекст → Курс и поддержка → Переписка → Новое сообщение |
| [Профиль ученика](pages/student-profile.json) | Unresolved URL | Phase 2 | Навигация и контекст → Имена для сертификатов → Контакт и язык → Пароль и доступ к аккаунту |
| [Покупки и квитанции](pages/student-purchases.json) | Unresolved URL | Phase 2 | Навигация и контекст → История покупок → Детали и квитанция |
| [Отзыв после курса](pages/student-review.json) | Unresolved URL | Phase 3 | Навигация и контекст → Право оставить отзыв → Оценка и текст → Результат модерации |

## Trainer

| Page / source specification | URL status | Phase | Ordered sections |
| --- | --- | --- | --- |
| [Курсы тренера](pages/trainer-courses.json) | Unresolved URL | Phase 2 | Навигация и контекст → Свои курсы → Статус согласования |
| [Черновик курса и уроков](pages/trainer-editor.json) | Unresolved URL | Phase 2 | Навигация и контекст → Данные курса → Уроки и материалы → Проверка и передача |
| [Начисления и выплаты тренера](pages/trainer-finance.json) | Unresolved URL | Phase 2 | Навигация и контекст → Период и итог → Детали начислений → История выплат |
| [Ответы на вопросы курса](pages/trainer-messages.json) | Unresolved URL | Phase 2 | Навигация и контекст → Диалоги курса → История и ответ |
| [Кабинет куратора: очередь работ](pages/trainer-queue.json) | Unresolved URL | MVP | Навигация и контекст → Назначенные работы → Сроки и просрочки [Phase 2] |
| [Проверка работы](pages/trainer-review.json) | Unresolved URL | MVP | Навигация и контекст → Работа и история → Текстовый отзыв и решение → Голосовой отзыв [Phase 2] |

## Manager

| Page / source specification | URL status | Phase | Ordered sections |
| --- | --- | --- | --- |
| [Комиссии и сверка](pages/manager-commission.json) | Unresolved URL | Phase 2 | Навигация и контекст → Период и итог → Ведомость → Выплаты |
| [Ручное зачисление](pages/manager-enrollment.json) | Unresolved URL | Phase 2 | Навигация и контекст → Ученик и продукт → Основание оплаты → Проверка и зачисление |
| [Лиды и брошенные корзины](pages/manager-leads.json) | Unresolved URL | Phase 2 | Навигация и контекст → Назначенные лиды → Контекст и статус лида |
| [Промокоды и реферальная ссылка](pages/manager-promotions.json) | Unresolved URL | Phase 2 | Навигация и контекст → Мои коды → Реферальная ссылка |
| [Продажи менеджера](pages/manager-sales.json) | Unresolved URL | Phase 2 | Навигация и контекст → Период и итоги → Заказы и детали |

## Administration

| Page / source specification | URL status | Phase | Ordered sections |
| --- | --- | --- | --- |
| [Операционная поддержка доступа](pages/admin-access.json) | Unresolved URL | Conditional | Навигация и контекст → Контекст доступа → Коррекция и основание |
| [Назначения кураторов и качество проверки](pages/admin-assignments.json) | Unresolved URL | Phase 2 | Навигация и контекст → Сроки и просроченные работы → Назначение и история |
| [Аудит операций](pages/admin-audit.json) | Unresolved URL | MVP | Навигация и контекст → События аудита → Детали события |
| [Реестр сертификатов](pages/admin-certificates.json) | Unresolved URL | Phase 2 | Навигация и контекст → Выданные сертификаты → Детали и поддержка → Отзыв и публичный статус [Phase 3] |
| [Направления каталога](pages/admin-directions.json) | Unresolved URL | Phase 2 | Навигация и контекст → Направления → Создание и изменение |
| [Уроки, материалы и порядок](pages/admin-lessons.json) | Unresolved URL | Phase 2 | Навигация и контекст → Структура курса → Урок и медиа → Версия и публикация |
| [Заказы и коммерческие операции](pages/admin-orders.json) | Unresolved URL | Phase 2 | Навигация и контекст → Заказы → Детали, доказательства и доступ → Операции |
| [Управление пакетами](pages/admin-packages.json) | Unresolved URL | Phase 2 | Навигация и контекст → Пакеты → Состав и цена → Публикация |
| [Сверка и выплаты](pages/admin-payouts.json) | Unresolved URL | Phase 2 | Навигация и контекст → Период и получатели → Начисления и корректировки → Оплата и экспорт |
| [Курсы и мини-курсы: управление](pages/admin-products.json) | Unresolved URL | Phase 2 | Навигация и контекст → Каталог управления → Содержание и предложение → Согласование и публикация |
| [Управление промокодами](pages/admin-promos.json) | Unresolved URL | Phase 2 | Навигация и контекст → Промокоды → Правило скидки |
| [Ставки и проценты](pages/admin-rates.json) | Unresolved URL | Phase 2 | Навигация и контекст → Получатели → Ставки и действие во времени |
| [Возврат и отзыв доступа](pages/admin-refund.json) | Unresolved URL | Conditional | Навигация и контекст → Заказ и подтверждение возврата → Результат отзыва доступа → Возврат через провайдера [Phase 2] |
| [Отчёты](pages/admin-reports.json) | Unresolved URL | Phase 2 | Навигация и контекст → Период и измерения → Выручка и продажи → Ученики, тренеры и менеджеры → Источники привлечения |
| [Модерация отзывов](pages/admin-review-moderation.json) | Unresolved URL | Phase 3 | Навигация и контекст → Отзывы на проверке → Решение и причина |
| [Шаблоны сертификатов](pages/admin-templates.json) | Unresolved URL | Phase 2 | Навигация и контекст → Шаблоны и языки → Состав и проверка |
| [Пользователи и роли](pages/admin-users.json) | Unresolved URL | MVP | Навигация и контекст → Пользователи → Роли и состояние аккаунта → История операций |

