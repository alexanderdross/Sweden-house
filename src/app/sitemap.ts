import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}/${l}/`]),
  );

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
