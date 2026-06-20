import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations();
  const nav = useTranslations("nav");

  const links = [
    { href: "#about", label: nav("about") },
    { href: "#gallery", label: nav("gallery") },
    { href: "#amenities", label: nav("amenities") },
    { href: "#location", label: nav("location") },
    { href: "#booking", label: nav("availability") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-sea-100 bg-sand-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="font-serif text-lg font-semibold text-sea-800">
          {t("brand")}
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-sea-700 transition hover:text-sea-900"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#booking"
            className="hidden rounded-full bg-sea-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sea-800 sm:inline-block"
          >
            {nav("bookNow")}
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
