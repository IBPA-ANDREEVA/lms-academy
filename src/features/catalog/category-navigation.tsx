import Link from "next/link";
import styles from "./category-navigation.module.css";

export type CategoryNavigationProps = {
  items: readonly { id: string; label: string; href: string }[];
  resetHref: string;
  selectedId?: string;
  label?: string;
  pending?: boolean;
  onSelect?: (id?: string) => void;
  resetLabel?: string;
};

/** URLs come from the owning catalog query contract, including other committed filters. */
export function CategoryNavigation({
  items,
  resetHref,
  selectedId,
  label = "Направления обучения",
  pending = false,
  onSelect,
  resetLabel = "Все направления",
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
          {onSelect ? <button type="button" onClick={() => onSelect()} aria-pressed={!selectedId}>{resetLabel}</button> : <Link href={resetHref} aria-current={!selectedId ? "page" : undefined}>{resetLabel}</Link>}
        </li>
        {items.map((item) => (
          <li key={item.id}>
            {onSelect ? <button type="button" onClick={() => onSelect(item.id)} aria-pressed={selectedId === item.id}>{item.label}</button> : <Link href={item.href} aria-current={selectedId === item.id ? "page" : undefined}>{item.label}</Link>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
