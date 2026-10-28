export type NavigationLink = { label: string; href: string };
export type NavigationItem = NavigationLink & {
  children?: readonly NavigationLink[];
};
export type NavigationGroup = {
  label: string;
  links: readonly NavigationLink[];
};

// Only implemented, published destinations. Release planning is not publication.
// Add catalog/cart/account/legal destinations here when their real routes ship.
export const publicSite = {
  brand: { label: "LMS Academy", href: "/" },
  navigation: [{ label: "Главная", href: "/" }] satisfies NavigationItem[],
  footerGroups: [] satisfies NavigationGroup[],
  legalLinks: [] satisfies NavigationLink[],
};
