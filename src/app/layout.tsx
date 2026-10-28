import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  PublicFooter,
  PublicHeader,
  publicSite,
} from "@/features/public-shell";
import "./globals.css";

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
  title: { default: "LMS Academy", template: "%s — LMS Academy" },
  description: "Обучение в сфере красоты.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Перейти к содержанию
        </a>
        <PublicHeader
          brand={publicSite.brand}
          navigation={publicSite.navigation}
        />
        {children}
        <PublicFooter
          brand={publicSite.brand}
          groups={publicSite.footerGroups}
          legalLinks={publicSite.legalLinks}
        />
      </body>
    </html>
  );
}
