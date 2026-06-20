import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing, locales, defaultLocale, type Locale } from "@i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Maps our short locale codes to og:locale values (language_REGION).
const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB",
  sv: "sv_SE",
  da: "da_DK",
  fi: "fi_FI",
  de: "de_DE",
};

export const viewport: Viewport = {
  themeColor: "#2a4d68",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  // hreflang alternates so search engines serve the right language, plus an
  // x-default pointing at the default locale.
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}/${l}/`]),
  );
  languages["x-default"] = `${siteUrl}/${defaultLocale}/`;

  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: "Flatön Coastal House",
    alternates: {
      canonical: `${siteUrl}/${locale}/`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/`,
      siteName: "Flatön Coastal House",
      type: "website",
      locale: OG_LOCALE[locale as Locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      images: [
        { url: "/og.jpg", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale as Locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
