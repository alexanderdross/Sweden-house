"use client";

import { DayPicker, type DateRange as RdpRange } from "react-day-picker";
import { sv, enGB, da, fi, de } from "react-day-picker/locale";
import { useLocale, useTranslations } from "next-intl";
import "react-day-picker/style.css";
import { toISODate } from "@/lib/dates";

const LOCALES = { sv, en: enGB, da, fi, de } as const;

export default function Availability({
  range,
  onSelect,
  blockedNights,
  loading,
  error,
}: {
  range: RdpRange | undefined;
  onSelect: (range: RdpRange | undefined) => void;
  blockedNights: Set<string>;
  loading: boolean;
  error: boolean;
}) {
  const t = useTranslations("availability");
  const locale = useLocale() as keyof typeof LOCALES;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <h3 className="font-serif text-xl font-semibold text-sea-900">
        {t("heading")}
      </h3>
      <p className="mt-2 text-sm text-sea-600">{t("subtitle")}</p>

      {error && (
        <p className="mt-3 rounded-lg bg-sand-100 px-3 py-2 text-sm text-sea-700">
          {t("error")}
        </p>
      )}

      <div className="mt-4 rounded-2xl border border-sea-100 bg-white p-3 shadow-sm">
        {loading ? (
          <p className="px-2 py-10 text-center text-sm text-sea-500">
            {t("loading")}
          </p>
        ) : (
          <DayPicker
            mode="range"
            selected={range}
            onSelect={onSelect}
            locale={LOCALES[locale] ?? enGB}
            weekStartsOn={1}
            numberOfMonths={1}
            excludeDisabled
            disabled={[
              { before: today },
              (day: Date) => blockedNights.has(toISODate(day)),
            ]}
            modifiersClassNames={{
              selected: "rdp-selected",
            }}
          />
        )}
      </div>

      <ul className="mt-3 flex flex-wrap gap-4 text-xs text-sea-600">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-sea-300 bg-white" />
          {t("available")}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-sea-600" />
          {t("selected")}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-sand-200 line-through" />
          {t("booked")}
        </li>
      </ul>
    </div>
  );
}
