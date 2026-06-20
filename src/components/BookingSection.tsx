"use client";

import { useEffect, useState } from "react";
import { type DateRange as RdpRange } from "react-day-picker";
import { useTranslations } from "next-intl";
import Availability from "./Availability";
import BookingForm from "./BookingForm";
import { expandBlockedNights, type DateRange } from "@/lib/dates";

export default function BookingSection() {
  const t = useTranslations("booking");
  const [range, setRange] = useState<RdpRange | undefined>();
  const [blockedNights, setBlockedNights] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/availability")
      .then((res) => {
        if (!res.ok) throw new Error("availability");
        return res.json();
      })
      .then((data: { ranges: DateRange[] }) => {
        if (!active) return;
        setBlockedNights(expandBlockedNights(data.ranges));
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="booking" className="bg-sea-950 py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-3 text-white/80">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-8 rounded-3xl bg-sand-50 p-5 text-sea-900 shadow-xl sm:p-8 lg:grid-cols-2">
          <Availability
            range={range}
            onSelect={setRange}
            blockedNights={blockedNights}
            loading={loading}
            error={error}
          />
          <BookingForm range={range} />
        </div>
      </div>
    </section>
  );
}
