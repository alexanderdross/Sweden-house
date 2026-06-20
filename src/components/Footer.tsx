import { useTranslations } from "next-intl";
import { property } from "@content/property";

export default function Footer() {
  const t = useTranslations();
  const tf = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-sea-100 bg-sand-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold text-sea-800">
            {t("brand")}
          </p>
          <p className="mt-2 text-sm text-sea-600">{tf("tagline")}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-sea-500">
            {tf("contact")}
          </h3>
          <a
            href={`mailto:${property.contactEmail}`}
            title={`${tf("contact")}: ${property.contactEmail}`}
            className="mt-2 block text-sea-700 hover:text-sea-900"
          >
            {property.contactEmail}
          </a>
        </div>
        <div>
          <a
            href={property.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${tf("viewOnAirbnb")}, ${t("brand")}`}
            className="inline-flex items-center gap-2 rounded-full border border-sea-200 px-4 py-2 text-sm font-medium text-sea-700 transition hover:border-sea-400 hover:text-sea-900"
          >
            {tf("viewOnAirbnb")}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="border-t border-sea-100 py-4">
        <p className="text-center text-xs text-sea-500">
          © {year} {t("brand")}. {tf("rights")}
        </p>
      </div>
    </footer>
  );
}
