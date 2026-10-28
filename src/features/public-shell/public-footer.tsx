import Link from "next/link";
import { PageContainer } from "./page-container";
import type { NavigationGroup, NavigationLink } from "./navigation";
import styles from "./public-footer.module.css";

export type PublicFooterProps = {
  brand: NavigationLink;
  groups: readonly NavigationGroup[];
  legalLinks: readonly NavigationLink[];
  disclaimer?: string;
  contact?: NavigationLink;
  issuer?: string;
  variant?: "default" | "compact";
  className?: string;
};

export function PublicFooter({
  brand,
  groups,
  legalLinks,
  disclaimer,
  contact,
  issuer,
  variant = "default",
  className = "",
}: PublicFooterProps) {
  return (
    <footer className={`${styles.footer} ${styles[variant]} ${className}`}>
      <PageContainer>
        <div className={styles.top}>
          <div className={styles.identity}>
            <Link className={styles.brand} href={brand.href}>
              {brand.label}
            </Link>
            {contact && <Link href={contact.href}>{contact.label}</Link>}
            {issuer && <p>{issuer}</p>}
          </div>
          {variant === "default" && groups.length > 0 && (
            <nav aria-label="Разделы сайта" className={styles.groups}>
              {groups.map((group) => (
                <div key={group.label} className={styles.group}>
                  <h2>{group.label}</h2>
                  <ul>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>
        {(legalLinks.length > 0 || disclaimer) && (
          <div className={styles.bottom}>
            {legalLinks.length > 0 && (
              <nav aria-label="Правовая информация">
                <ul className={styles.legal}>
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
          </div>
        )}
      </PageContainer>
    </footer>
  );
}
