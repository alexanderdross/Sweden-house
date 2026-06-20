import { useTranslations } from "next-intl";
import { property } from "@content/property";

export default function Location() {
  const t = useTranslations("location");
  const { lat, lng } = property.coordinates;

  // OpenStreetMap embed (no API key needed). bbox = left,bottom,right,top.
  const bbox = [lng - 0.18, lat - 0.06, lng + 0.18, lat + 0.06].join("%2C");
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  const coordLabel = `58°12′52.8″N 11°29′37.9″E`;

  return (
    <section id="location" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-sea-900 sm:text-4xl">
              {t("heading")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-sea-800/90">
              {t("body")}
            </p>
            <dl className="mt-6 text-sea-700">
              <dt className="text-sm uppercase tracking-wide text-sea-500">
                {t("coordinates")}
              </dt>
              <dd className="break-words font-mono text-sea-900">
                {coordLabel}
              </dd>
            </dl>
            <a
              href={property.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`${t("openInMaps")}: Flatön, Orust, Bohuslän`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sea-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sea-800"
            >
              {t("openInMaps")}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-sea-100 shadow-sm">
            <iframe
              title={t("mapAlt")}
              src={embedSrc}
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
