import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "sv", "da", "fi", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Human-readable names shown in the language switcher.
export const localeNames: Record<Locale, string> = {
  en: "English",
  sv: "Svenska",
  da: "Dansk",
  fi: "Suomi",
  de: "Deutsch",
};

// Flag emoji shown alongside each language in the switcher.
export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  sv: "🇸🇪",
  da: "🇩🇰",
  fi: "🇫🇮",
  de: "🇩🇪",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always show the locale prefix (/en, /sv, ...) for clean, indexable URLs.
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
