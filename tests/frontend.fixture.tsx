// Isolated browser-test content. Never imported by an application route.
import { createRoot } from "react-dom/client";
import { useState } from "react";
import {
  PublicHeader,
  PublicFooter,
  PageContainer,
} from "@/features/public-shell";
import { Button } from "@/components/ui/button";
import {
  TextField,
  PasswordField,
  Checkbox,
  SelectField,
  FormMessage,
} from "@/components/ui/form-controls";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryNavigation, CourseCard } from "@/features/catalog";

const navigation = [
  {
    label: "Курсы",
    href: "#courses",
    children: [
      { label: "Наращивание и ламинирование ресниц", href: "#lashes" },
      { label: "Брови", href: "#brows" },
    ],
  },
  { label: "Пакеты", href: "#packages" },
  { label: "Мини-курсы", href: "#mini" },
  { label: "Старт в США", href: "#usa" },
];
const brand = { label: "Beauty Academy", href: "#home" };
const legalLinks = [
  "Публичная оферта",
  "Политика конфиденциальности",
  "Политика возвратов",
  "Дисклеймер о лицензии",
].map((label, i) => ({ label, href: `#legal-${i}` }));

function Fixture() {
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <>
      <PublicHeader
        brand={brand}
        navigation={navigation}
        account={{ label: "Войти", href: "#login" }}
        cart={{ label: "Корзина", href: "#cart", count: 2 }}
        locales={[
          { label: "RU", href: "#ru", current: true },
          { label: "EN", href: "#en" },
        ]}
      />
      <main style={{ paddingBlock: 60 }}>
        <PageContainer size="content">
          <SectionHeading display>Проверка компонентов</SectionHeading>
          <CategoryNavigation
            items={[
              {
                id: "lashes",
                label: "Наращивание и ламинирование ресниц",
                href: "#lashes",
              },
            ]}
            resetHref="#courses"
            selectedId="lashes"
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              marginBlock: 32,
            }}
          >
            {(["minimal", "cut", "neoBrutalist"] as const).map((appearance) => (
              <div key={appearance} style={{ display: "grid", gap: 16 }}>
                {(["primary", "secondary", "destructive"] as const).map(
                  (intent) => (
                    <Button
                      key={intent}
                      appearance={appearance}
                      intent={intent}
                    >
                      {appearance} {intent}
                    </Button>
                  ),
                )}
                <Button appearance={appearance} disabled>
                  Недоступно
                </Button>
              </div>
            ))}
          </div>
          <Button
            loading={busy}
            onClick={() => {
              setCount(count + 1);
              setBusy(true);
            }}
          >
            Отправить
          </Button>
          <output aria-label="Отправок">{count}</output>
          <form
            noValidate
            style={{ maxWidth: 480, display: "grid", gap: 16, marginBlock: 32 }}
            onSubmit={(event) => event.preventDefault()}
          >
            <TextField
              label="Email"
              type="email"
              error="Укажите корректный email"
              hint="Адрес для входа"
              defaultValue="test"
            />
            <TextField
              label="Готовое поле"
              success="Сохранено"
              defaultValue="Данные"
            />
            <PasswordField
              label="Пароль"
              autoComplete="current-password"
              defaultValue="sample-test-password"
            />
            <Checkbox label="Тестовый выбор" />
            <SelectField label="Формат">
              <option>Все форматы</option>
              <option>В записи</option>
            </SelectField>
            <FormMessage tone="error">
              Тестовая ошибка. Повторите действие.
            </FormMessage>
          </form>
          <div style={{ maxWidth: 360 }}>
            <CourseCard
              course={{
                href: "#course",
                kind: "mini-course",
                title:
                  "Очень длинное русское название учебного курса для проверки переноса текста",
              }}
              status="owned"
              action={<Button>Не должно отображаться</Button>}
            />
          </div>
        </PageContainer>
        {(["wide", "content", "reading", "fullBleed"] as const).map((size) => (
          <PageContainer key={size} size={size} data-container={size}>
            <p>Контейнер {size}</p>
          </PageContainer>
        ))}
      </main>
      <PublicFooter
        brand={brand}
        groups={[
          { label: "Курсы", links: navigation },
          {
            label: "Информация",
            links: [{ label: "Как проходит обучение", href: "#learning" }],
          },
        ]}
        legalLinks={legalLinks}
        disclaimer="Тестовый текст для проверки переноса и читаемости. Не является утверждённым юридическим содержанием."
      />
      <PublicFooter
        variant="compact"
        brand={brand}
        groups={[]}
        legalLinks={legalLinks}
        disclaimer="Тестовый компактный вариант."
      />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Fixture />);
