import { useTranslations } from "next-intl";

const CARDS = [
  { key: "swim", icon: "🏊" },
  { key: "nature", icon: "🥾" },
  { key: "villages", icon: "⛵" },
  { key: "food", icon: "🦐" },
] as const;

export default function AreaGuide() {
  const t = useTranslations("area");

  return (
    <section id="area" className="bg-sand-100 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-sea-900 sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sea-800/90">
            {t("intro")}
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ key, icon }) => (
            <article
              key={key}
              className="rounded-2xl border border-sea-100 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl" aria-hidden="true">
                {icon}
              </span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-sea-900">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-sea-700">
                {t(`${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
