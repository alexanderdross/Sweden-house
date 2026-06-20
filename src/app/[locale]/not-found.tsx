import { useTranslations } from "next-intl";
import { Link } from "@i18n/routing";

export default function NotFound() {
  const t = useTranslations("nav");
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-6xl font-semibold text-sea-300">404</p>
      <Link
        href="/"
        title={t("about")}
        className="mt-6 rounded-full bg-sea-700 px-6 py-3 font-semibold text-white transition hover:bg-sea-800"
      >
        {t("about")}
      </Link>
    </main>
  );
}
