import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["sv", "en", "da", "fi", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sv";

// Human-readable names shown in the language switcher.
export const localeNames: Record<Locale, string> = {
  sv: "Svenska",
  en: "English",
  da: "Dansk",
  fi: "Suomi",
  de: "Deutsch",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always show the locale prefix (/sv, /en, ...) for clean, indexable URLs.
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
