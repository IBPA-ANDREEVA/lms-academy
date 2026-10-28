"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Checkbox,
  FormMessage,
  PasswordField,
  SelectField,
  TextField,
} from "@/components/ui/form-controls";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  CategoryNavigation,
  CourseCard,
  type CourseCardProps,
} from "@/features/catalog";
import {
  PageContainer,
  PublicFooter,
  PublicHeader,
} from "@/features/public-shell";
import styles from "./component-preview-page.module.css";

const components = [
  ["public-header", "PublicHeader"],
  ["button", "Button"],
  ["form-controls", "FormControls"],
  ["course-card", "CourseCard"],
  ["category-navigation", "CategoryNavigation"],
  ["section-heading", "SectionHeading"],
  ["page-container", "PageContainer"],
  ["public-footer", "PublicFooter"],
] as const;

// Explicitly illustrative, local-only links. No course inventory or business actions.
const brand = { label: "LMS Academy", href: "#main-content" };
const navigation = [
  {
    label: "Курсы",
    href: "#course-card",
    children: [
      { label: "Пример курса", href: "#course-card" },
      { label: "Направления", href: "#category-navigation" },
    ],
  },
  { label: "Пакеты", href: "#navigation-example" },
  { label: "Мини-курсы", href: "#course-card" },
  { label: "Старт в США", href: "#navigation-example" },
];
const legalLinks = [
  "Публичная оферта",
  "Политика конфиденциальности",
  "Политика возвратов",
  "Дисклеймер о лицензии",
].map((label) => ({ label, href: "#footer-note" }));
const courseStates = {
  available: "Доступен",
  owned: "Уже приобретён",
  "in-cart": "В корзине",
  unavailable: "Недоступен",
  stale: "Условия изменились",
} as const;

function PreviewSection({
  id,
  name,
  description,
  children,
  fullWidth = false,
}: {
  id: string;
  name: string;
  description: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={styles.section}>
      <PageContainer size="content">
        <div className={styles.sectionIntro}>
          <SectionHeading id={`${id}-title`}>{name}</SectionHeading>
          <p>{description}</p>
          <Link href="#component-index">К списку компонентов ↑</Link>
        </div>
      </PageContainer>
      {fullWidth ? (
        children
      ) : (
        <PageContainer size="content">{children}</PageContainer>
      )}
    </section>
  );
}

export function ComponentPreviewPage() {
  const [lastAction, setLastAction] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const [courseStatus, setCourseStatus] =
    useState<NonNullable<CourseCardProps["status"]>>("available");
  const [category, setCategory] = useState<string>();

  return (
    <main id="main-content" tabIndex={-1} className={styles.main}>
      <PageContainer size="content">
        <div className={styles.intro}>
          <SectionHeading
            as="h1"
            description="Живые примеры общих компонентов: внешний вид, варианты и взаимодействия."
          >
            Предпросмотр компонентов
          </SectionHeading>
          <p>
            Данные демонстрационные. Формы ничего не отправляют, действия не
            создают покупки и не меняют аккаунт.
          </p>
          <nav
            id="component-index"
            aria-label="Компоненты"
            className={styles.index}
          >
            <ul>
              {components.map(([id, label]) => (
                <li key={id}>
                  <Link href={`#${id}`}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </PageContainer>

      <PreviewSection
        id="public-header"
        name="PublicHeader"
        description="Откройте «Курсы», проверьте Tab и Escape. При ширине до 1024px появляется меню; до 768px навигация скрывается в нём."
        fullWidth
      >
        <div className={styles.headerStage}>
          <PublicHeader
            brand={brand}
            navigation={navigation}
            account={{ label: "Войти", href: "#form-controls" }}
            cart={{ label: "Корзина", href: "#course-card", count: 2 }}
            locales={[
              { label: "RU", href: "#navigation-example", current: true },
              { label: "EN", href: "#navigation-example" },
            ]}
          />
        </div>
        <PageContainer size="content">
          <p id="navigation-example" className={styles.note}>
            Все пункты этого примера ведут к разделам предпросмотра. Пакеты, EN
            и «Старт в США» показаны только для проверки композиции референса.
          </p>
        </PageContainer>
      </PreviewSection>

      <PreviewSection
        id="button"
        name="Button / ButtonLink"
        description="Три внешних вида, независимые назначения, размеры и состояния. Наведите курсор или используйте клавиатуру."
      >
        <div className={styles.buttonFamilies}>
          {(["minimal", "cut", "neoBrutalist"] as const).map((appearance) => (
            <div className={styles.family} key={appearance}>
              <h3>{appearance}</h3>
              {(["primary", "secondary", "destructive"] as const).map(
                (intent) => (
                  <Button
                    key={intent}
                    appearance={appearance}
                    intent={intent}
                    onClick={() => setLastAction(`${appearance} / ${intent}`)}
                  >
                    {intent === "primary"
                      ? "Основное действие"
                      : intent === "secondary"
                        ? "Дополнительное"
                        : "Удалить — демо"}
                  </Button>
                ),
              )}
              <Button appearance={appearance} disabled>
                Недоступно
              </Button>
              <p className={styles.note}>Неактивное состояние для сравнения.</p>
            </div>
          ))}
        </div>
        <div className={styles.row}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button
              key={size}
              size={size}
              onClick={() => setLastAction(`Размер ${size}`)}
            >
              {size}
            </Button>
          ))}
          <ButtonLink href="#form-controls" intent="secondary">
            Перейти к форме
          </ButtonLink>
        </div>
        <div className={styles.inverse}>
          <p>Inverse — на тёмном фоне</p>
          <div className={styles.row}>
            {(["minimal", "cut", "neoBrutalist"] as const).map((appearance) => (
              <Button
                key={appearance}
                appearance={appearance}
                inverse
                onClick={() => setLastAction(`inverse / ${appearance}`)}
              >
                {appearance}
              </Button>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <Button loading={busy} onClick={() => setBusy(true)}>
            Показать загрузку
          </Button>
          <Button
            intent="secondary"
            disabled={!busy}
            onClick={() => setBusy(false)}
          >
            Сбросить загрузку
          </Button>
        </div>
        <p className={styles.note}>
          Загрузка остаётся активной до сброса, чтобы её можно было рассмотреть.
        </p>
        <p role="status" className={styles.feedback}>
          {lastAction
            ? `Нажата кнопка: ${lastAction}`
            : "Нажмите любую доступную кнопку для проверки."}
        </p>
      </PreviewSection>

      <PreviewSection
        id="form-controls"
        name="FormControls"
        description="Подписи, подсказки, ошибки, подтверждение, пароль, checkbox и нативный select. Введённые значения остаются только в памяти этой страницы."
      >
        <form
          noValidate
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            const invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            setError(invalid ? "Введите email в формате name@example.com" : "");
            setSubmitted(!invalid);
            if (invalid) emailRef.current?.focus();
          }}
        >
          <TextField
            ref={emailRef}
            label="Email — демо"
            type="email"
            autoComplete="off"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
              setSubmitted(false);
            }}
            placeholder="demo@example.com"
            hint="Используйте тестовый адрес."
            error={error}
            success={submitted ? "Формат адреса проверен" : undefined}
          />
          <PasswordField
            label="Пароль — демо"
            autoComplete="new-password"
            hint="Не вводите настоящий пароль."
          />
          <TextField
            label="Неактивное поле"
            value="Недоступно для изменения"
            disabled
            hint="Пример отключённого элемента."
          />
          <Checkbox
            label="Тестовый выбор"
            hint="Это пример checkbox, а не юридическое согласие."
          />
          <SelectField label="Формат — демо" defaultValue="all">
            <option value="all">Все форматы</option>
            <option value="recorded">В записи</option>
            <option value="practice">С практикой</option>
          </SelectField>
          <Button type="submit">Проверить форму</Button>
          {submitted && (
            <FormMessage tone="success">
              Проверка пройдена. Данные никуда не отправлены.
            </FormMessage>
          )}
        </form>
        <div className={styles.messages}>
          <FormMessage tone="info">
            Пример информационного сообщения.
          </FormMessage>
          <FormMessage tone="error">
            Пример ошибки с понятным объяснением.
          </FormMessage>
          <FormMessage tone="success">
            Пример подтверждения действия.
          </FormMessage>
        </div>
      </PreviewSection>

      <PreviewSection
        id="course-card"
        name="CourseCard"
        description="Основной курс и мини-курс. Названия демонстрационные; реальные фотографии, цены и преподаватели не подставлены."
      >
        <div className={styles.control}>
          <SelectField
            label="Состояние карточек"
            value={courseStatus}
            onChange={(event) =>
              setCourseStatus(
                event.target.value as NonNullable<CourseCardProps["status"]>,
              )
            }
          >
            {Object.entries(courseStates).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
        </div>
        <div className={styles.cards}>
          <CourseCard
            course={{
              href: "#course-note",
              title: "Пример основного курса",
              kind: "course",
              language: "RU",
            }}
            status={courseStatus}
            action={
              <Button onClick={() => setCourseStatus("in-cart")}>
                Добавить — демо
              </Button>
            }
          />
          <CourseCard
            course={{
              href: "#course-note",
              title:
                "Демонстрационный мини-курс с длинным названием для проверки переноса",
              kind: "mini-course",
              language: "RU",
            }}
            status={courseStatus}
            action={
              <Button onClick={() => setCourseStatus("in-cart")}>
                Добавить — демо
              </Button>
            }
          />
        </div>
        <p id="course-note" className={styles.note}>
          Кнопка меняет только состояние примера. Покупка и добавление в
          реальную корзину не выполняются.
        </p>
      </PreviewSection>

      <PreviewSection
        id="category-navigation"
        name="CategoryNavigation"
        description="Ссылки направлений, активный пункт и сброс. Здесь используются демонстрационные категории."
      >
        <div
          onClickCapture={(event) => {
            const anchor = (event.target as HTMLElement).closest("a");
            if (anchor)
              setCategory(
                anchor.hash === "#category-all"
                  ? undefined
                  : anchor.hash.slice("#category-".length),
              );
          }}
        >
          <CategoryNavigation
            items={[
              {
                id: "practice",
                label: "Практические занятия — пример",
                href: "#category-practice",
              },
              {
                id: "recorded",
                label: "Записанные материалы — пример",
                href: "#category-recorded",
              },
            ]}
            selectedId={category}
            resetHref="#category-all"
          />
        </div>
        <p
          id={`category-${category || "all"}`}
          role="status"
          className={styles.feedback}
        >
          {category
            ? `Выбрано: ${category === "practice" ? "практические занятия" : "записанные материалы"}`
            : "Выбраны все направления."}
        </p>
      </PreviewSection>

      <PreviewSection
        id="section-heading"
        name="SectionHeading"
        description="Функциональная типографика Manrope и выразительный вариант Unbounded. Семантический уровень задаёт страница."
      >
        <div className={styles.headingExamples}>
          <SectionHeading
            as="h3"
            description="Поддерживающий текст остаётся спокойным и читаемым."
          >
            Функциональный заголовок
          </SectionHeading>
          <SectionHeading
            as="h3"
            display
            description="Unbounded используется только для коротких акцентных заголовков."
          >
            Учиться красоте
          </SectionHeading>
        </div>
      </PreviewSection>

      <PreviewSection
        id="page-container"
        name="PageContainer"
        description="Измените ширину окна, чтобы сравнить ограничения. Подсвечена внутренняя область; контейнеры не вложены друг в друга."
        fullWidth
      >
        <div className={styles.containers}>
          {(["wide", "content", "reading", "fullBleed"] as const).map(
            (size) => (
              <PageContainer key={size} size={size}>
                <div className={styles.containerSample}>
                  <strong>{size}</strong>
                  <span>
                    {
                      {
                        wide: "1920px",
                        content: "1440px",
                        reading: "760px",
                        fullBleed: "Без ограничения и отступов",
                      }[size]
                    }
                  </span>
                </div>
              </PageContainer>
            ),
          )}
        </div>
      </PreviewSection>

      <PreviewSection
        id="public-footer"
        name="PublicFooter"
        description="Полный и компактный варианты. Ссылки в примере не являются опубликованными юридическими документами."
        fullWidth
      >
        <PageContainer size="content">
          <p id="footer-note" className={styles.note}>
            Демонстрация структуры. Утверждённые правовые тексты и реквизиты
            пока не предоставлены.
          </p>
          <h3>Default</h3>
        </PageContainer>
        <PublicFooter
          brand={brand}
          groups={[
            {
              label: "Обучение",
              links: [
                { label: "Курсы", href: "#course-card" },
                { label: "Направления", href: "#category-navigation" },
              ],
            },
            {
              label: "Информация",
              links: [{ label: "Компоненты", href: "#component-index" }],
            },
          ]}
          legalLinks={legalLinks}
          disclaimer="Демонстрационный текст: здесь будет утверждённая информация о сертификате."
        />
        <PageContainer size="content">
          <h3 className={styles.compactLabel}>Compact</h3>
        </PageContainer>
        <PublicFooter
          variant="compact"
          brand={brand}
          groups={[]}
          legalLinks={legalLinks}
          disclaimer="Демонстрационный текст для компактного варианта."
        />
      </PreviewSection>
    </main>
  );
}
