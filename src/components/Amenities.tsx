import { useTranslations } from "next-intl";
import { property, type AmenityKey } from "@content/property";

const ICONS: Record<AmenityKey, string> = {
  wifi: "📶",
  kitchen: "🍳",
  pizzaOven: "🍕",
  grill: "🍢",
  terrace: "🪑",
  fireplace: "🔥",
  ac: "❄️",
  heating: "🌡️",
  bathtub: "🛁",
  washer: "🧺",
  tv: "📺",
  workspace: "💻",
  gym: "🏋️",
  parking: "🅿️",
  seaNearby: "🌊",
  natureView: "🌲",
  pets: "🐾",
  selfCheckIn: "🔑",
};

export default function Amenities() {
  const t = useTranslations("amenities");

  return (
    <section id="amenities" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2 className="font-serif text-3xl font-semibold text-sea-900 sm:text-4xl">
        {t("heading")}
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {property.amenities.map((key) => (
          <li
            key={key}
            className="flex items-center gap-3 rounded-xl border border-sea-100 bg-white px-4 py-3 shadow-sm"
          >
            <span className="text-2xl" aria-hidden="true">
              {ICONS[key]}
            </span>
            <span className="font-medium text-sea-800">{t(key)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
