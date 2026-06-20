"use client";

import { useCallback, useEffect, useState } from "react";
import { type DateRange as RdpRange } from "react-day-picker";
import { useTranslations } from "next-intl";
import Availability from "./Availability";
import BookingForm from "./BookingForm";
import { expandBlockedNights, type DateRange } from "@/lib/dates";

interface SyncState {
  blockedNights: Set<string>;
  updatedAt?: string;
  airbnbSynced: boolean;
}

export default function BookingSection() {
  const t = useTranslations("booking");
  const [range, setRange] = useState<RdpRange | undefined>();
  const [sync, setSync] = useState<SyncState>({
    blockedNights: new Set(),
    airbnbSynced: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        "/api/availability",
        force ? { cache: "no-store" } : undefined,
      );
      if (!res.ok) throw new Error("availability");
      const data: {
        ranges: DateRange[];
        updatedAt?: string;
        airbnbSynced?: boolean;
      } = await res.json();
      setSync({
        blockedNights: expandBlockedNights(data.ranges),
        updatedAt: data.updatedAt,
        airbnbSynced: Boolean(data.airbnbSynced),
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
            blockedNights={sync.blockedNights}
            loading={loading}
            error={error}
            airbnbSynced={sync.airbnbSynced}
            updatedAt={sync.updatedAt}
            onRefresh={() => load(true)}
          />
          <BookingForm range={range} />
        </div>
      </div>
    </section>
  );
}
