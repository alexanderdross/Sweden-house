import { useTranslations } from "next-intl";
import { property } from "@content/property";

export default function About() {
  const t = useTranslations("about");

  const facts = [
    { value: property.maxGuests, label: t("guests") },
    { value: property.bedrooms, label: t("bedrooms") },
    { value: property.beds, label: t("beds") },
    { value: property.bathrooms, label: t("bathrooms") },
  ];

  const hasPrice = property.pricePerNight > 0;
  const price = `${property.pricePerNight.toLocaleString()} ${property.currency}`;

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-sea-900 sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-sea-800/90">
            {t("body")}
          </p>
          <p className="mt-6 text-sea-700">
            {hasPrice && (
              <>
                <span className="text-sm uppercase tracking-wide text-sea-500">
                  {t("from")}
                </span>{" "}
                <span className="text-2xl font-semibold text-sea-900">
                  {price}
                </span>{" "}
                <span className="text-sea-600">{t("perNight")}</span>
              </>
            )}
            <span className="mt-1 block text-sm text-sea-500">
              {t("minNights", { count: property.minNights })}
            </span>
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-sea-100 bg-white p-6 text-center shadow-sm"
            >
              <dt className="order-2 mt-1 text-sm text-sea-600">
                {fact.label}
              </dt>
              <dd className="order-1 font-serif text-3xl font-semibold text-sea-800">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
