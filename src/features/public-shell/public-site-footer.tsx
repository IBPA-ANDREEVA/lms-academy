"use client";

import { usePathname } from "next/navigation";
import { PublicFooter } from "./public-footer";
import { publicSite } from "./navigation";

/** Root composition selects the existing focused footer for purchase review. */
export function PublicSiteFooter() {
  const pathname = usePathname();
  return <PublicFooter brand={publicSite.brand} groups={publicSite.footerGroups}
    legalLinks={publicSite.legalLinks} variant={pathname === "/cart" || pathname === "/checkout" ? "compact" : "default"} />;
}
