"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { type DateRange as RdpRange } from "react-day-picker";
import { useLocale, useTranslations } from "next-intl";
import { property } from "@content/property";
import { toISODate, nightsBetween } from "@/lib/dates";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  guests: number;
  message: string;
  company: string; // honeypot
}

type Status = "idle" | "submitting" | "success" | "error" | "not_configured";

export default function BookingForm({ range }: { range: RdpRange | undefined }) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [dateError, setDateError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { guests: 2 } });

  const checkIn = range?.from ? toISODate(range.from) : null;
  const checkOut = range?.to ? toISODate(range.to) : null;
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  async function onSubmit(values: FormValues) {
    setDateError(null);

    if (!checkIn || !checkOut) {
      setDateError(t("validation.datesRequired"));
      return;
    }
    if (nights < 1) {
      setDateError(t("validation.checkoutAfter"));
      return;
    }
    if (nights < property.minNights) {
      setDateError(t("validation.minNights", { count: property.minNights }));
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          checkIn,
          checkOut,
          locale,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else if (res.status === 503) {
        setStatus("not_configured");
      } else if (res.status === 409) {
        setStatus("idle");
        setDateError(t("validation.datesUnavailable"));
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="font-serif text-xl font-semibold text-emerald-900">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-emerald-800">{t("successBody")}</p>
      </div>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-sea-200 bg-white px-3 py-2 text-sea-900 shadow-sm focus:border-sea-400 focus:outline-none focus:ring-2 focus:ring-sea-200";
  const labelClass = "block text-sm font-medium text-sea-800";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <h3 className="font-serif text-xl font-semibold text-sea-900">
          {t("heading")}
        </h3>
        <p className="mt-2 text-sm text-sea-600">{t("subtitle")}</p>
      </div>

      {/* Selected dates summary (chosen on the calendar). */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-sea-100 bg-sand-50 px-3 py-2">
          <span className="block text-xs uppercase tracking-wide text-sea-500">
            {t("checkIn")}
          </span>
          <span className="font-medium text-sea-900">{checkIn ?? "–"}</span>
        </div>
        <div className="rounded-lg border border-sea-100 bg-sand-50 px-3 py-2">
          <span className="block text-xs uppercase tracking-wide text-sea-500">
            {t("checkOut")}
          </span>
          <span className="font-medium text-sea-900">{checkOut ?? "–"}</span>
        </div>
      </div>

      {nights > 0 && (
        <p className="text-sm text-sea-600">{t("nights", { count: nights })}</p>
      )}
      {dateError && <p className="text-sm text-red-600">{dateError}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            {t("name")}
          </label>
          <input
            id="name"
            className={inputClass}
            autoComplete="name"
            {...register("name", { required: true, maxLength: 120 })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {t("validation.nameRequired")}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            autoComplete="email"
            {...register("email", {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {t("validation.emailInvalid")}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            {t("phoneOptional")}
          </label>
          <input
            id="phone"
            type="tel"
            className={inputClass}
            autoComplete="tel"
            {...register("phone")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="guests">
            {t("guests")}
          </label>
          <select
            id="guests"
            className={inputClass}
            {...register("guests", { valueAsNumber: true })}
          >
            {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="message">
          {t("message")}
        </label>
        <textarea
          id="message"
          rows={4}
          className={inputClass}
          placeholder={t("messagePlaceholder")}
          {...register("message", { maxLength: 2000 })}
        />
      </div>

      {/* Honeypot: hidden from real users. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" {...register("company")} />
        </label>
      </div>

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="font-medium text-red-800">{t("errorTitle")}</p>
          <p className="text-sm text-red-700">{t("errorBody")}</p>
        </div>
      )}
      {status === "not_configured" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="font-medium text-amber-900">
            {t("notConfiguredTitle")}
          </p>
          <p className="text-sm text-amber-800">{t("notConfiguredBody")}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-sea-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-sea-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
