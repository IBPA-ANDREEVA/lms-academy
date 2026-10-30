export type NavigationLink = { label: string; href: string };
export type NavigationEntry = { label: string; href?: string; preview?: boolean };
export type NavigationItem = NavigationEntry & {
  children?: readonly NavigationEntry[];
};
export type NavigationGroup = {
  label: string;
  links: readonly NavigationEntry[];
};

// Owner-authorized shell preview. Anchors reach existing homepage sections;
// entries without href are visibly unavailable and never publish a new route.
export const publicSite = {
  brand: { label: "LMS Academy", href: "/" },
  navigation: [
    { label: "Об академии", href: "/#about" },
    { label: "Обучение", href: "/courses", children: [
      { label: "Основные курсы", href: "/courses" },
      { label: "Пакеты", href: "/#packages", preview: true },
      { label: "Мини-курсы", href: "/mini-courses" },
      { label: "Старт в США", href: "/#start-usa", preview: true },
    ] },
    { label: "Отзывы", href: "/#reviews", preview: true },
    { label: "Контакты", href: "/#contact" },
  ] satisfies NavigationItem[],
  footerGroups: [
    { label: "Обучение", links: [
      { label: "Основные курсы", href: "/courses" },
      { label: "Мини-курсы", href: "/mini-courses" },
      { label: "Пакеты", href: "/#packages", preview: true },
      { label: "Старт в США", href: "/#start-usa", preview: true },
    ] },
    { label: "Академия", links: [
      { label: "Об академии", href: "/#about" },
      { label: "Основатель", href: "/#founder" },
      { label: "Как проходит обучение", href: "/#learning-preview" },
      { label: "Напишите нам", href: "/#contact" },
    ] },
    { label: "Личный кабинет", links: [
      { label: "Войти", preview: true },
      { label: "Регистрация", preview: true },
      { label: "Корзина", href: "/cart" },
    ] },
  ] satisfies NavigationGroup[],
  legalLinks: [
    { label: "Публичная оферта", preview: true },
    { label: "Политика конфиденциальности", preview: true },
    { label: "Условия возврата", preview: true },
    { label: "Правовая информация о сертификатах", preview: true },
  ] satisfies NavigationEntry[],
};
