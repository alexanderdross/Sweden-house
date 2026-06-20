import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const t = useTranslations();
  const nav = useTranslations("nav");

  const links = [
    { href: "#about", label: nav("about") },
    { href: "#gallery", label: nav("gallery") },
    { href: "#amenities", label: nav("amenities") },
    { href: "#location", label: nav("location") },
    { href: "#area", label: nav("area") },
    { href: "#booking", label: nav("availability") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-sea-100 bg-sand-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#top"
          title={`${t("brand")}, Flatön, Bohuslän`}
          className="font-serif text-lg font-semibold text-sea-800"
        >
          {t("brand")}
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              title={`${link.label}, ${t("brand")}`}
              className="text-sm font-medium text-sea-700 transition hover:text-sea-900"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#booking"
            title={`${nav("book")}, ${t("brand")}`}
            className="hidden rounded-full bg-sea-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sea-800 md:inline-block"
          >
            {nav("bookNow")}
          </a>
          <LanguageSwitcher />
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}
