import Link from "next/link";
import styles from "./category-navigation.module.css";

export type CategoryNavigationProps = {
  items: readonly { id: string; label: string; href: string }[];
  resetHref: string;
  selectedId?: string;
  label?: string;
  pending?: boolean;
};

/** URLs come from the owning catalog query contract, including other committed filters. */
export function CategoryNavigation({
  items,
  resetHref,
  selectedId,
  label = "Направления обучения",
  pending = false,
}: CategoryNavigationProps) {
  if (!items.length) return null;
  return (
    <nav
      aria-label={label}
      aria-busy={pending || undefined}
      className={styles.navigation}
    >
      <ul>
        <li>
          <Link
            href={resetHref}
            aria-current={!selectedId ? "page" : undefined}
          >
            Все направления
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              aria-current={selectedId === item.id ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
