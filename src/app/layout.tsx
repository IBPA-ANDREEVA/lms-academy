import { PublicMotion } from "@/features/public-shell/public-motion";
import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  PublicSiteFooter,
  PublicHeader,
  publicSite,
} from "@/features/public-shell";
import "./globals.css";
import { CatalogProvider } from "@/features/catalog/catalog-provider";
import { PreviewControl } from "@/features/catalog/preview/preview-control";
import { fetchPublishedCatalog } from "@/server/catalog";
import { pageMetadata, siteName } from "@/lib/seo/metadata";
import { testPreview, siteOrigin } from "@/lib/site-environment";
import { CartProvider } from "@/features/commerce";

const manrope = localFont({
  src: "../assets/fonts/Manrope.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});
const unbounded = localFont({
  src: "../assets/fonts/Unbounded.ttf",
  variable: "--font-unbounded",
  weight: "200 900",
  display: "swap",
});

export const metadata: Metadata = {
  ...pageMetadata("Обучение в сфере красоты", "Обучение в сфере красоты в Beauty Business Academy."),
  metadataBase: siteOrigin() ? new URL(siteOrigin()!) : undefined,
  applicationName: siteName,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const catalog = testPreview ? { status: "empty" as const, products: [] as [] } : await fetchPublishedCatalog();
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Перейти к содержанию
        </a>
        <CatalogProvider enabled={testPreview} initial={catalog}><CartProvider>
          <PublicHeader
            brand={publicSite.brand}
            navigation={publicSite.navigation}
            showAuth
            showCartPreview
          />
          <PublicMotion>{children}</PublicMotion>
          <PublicSiteFooter />
        {testPreview && <PreviewControl />}
        </CartProvider></CatalogProvider>
      </body>
    </html>
  );
}
