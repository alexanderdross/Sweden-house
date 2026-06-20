import { useTranslations } from "next-intl";

export default function Faq() {
  const t = useTranslations("faq");
  const keys = ["1", "2", "3", "4", "5"];

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h2 className="font-serif text-3xl font-semibold text-sea-900 sm:text-4xl">
        {t("heading")}
      </h2>
      <div className="mt-8 divide-y divide-sea-100 rounded-2xl border border-sea-100 bg-white shadow-sm">
        {keys.map((k) => (
          <details key={k} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-sea-900">
              {t(`q${k}`)}
              <span className="text-sea-400 transition group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-sea-700">{t(`a${k}`)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
