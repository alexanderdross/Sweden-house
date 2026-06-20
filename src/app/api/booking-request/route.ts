import { NextResponse } from "next/server";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { property } from "@content/property";
import { getBlockedRanges } from "@/lib/availability";
import { isEmailConfigured, sendMail } from "@/lib/email";
import {
  expandBlockedNights,
  nightsBetween,
  rangeOverlapsBlocked,
} from "@/lib/dates";
import { locales } from "@i18n/routing";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

const schema = z.object({
  checkIn: isoDate,
  checkOut: isoDate,
  guests: z.coerce.number().int().min(1).max(property.maxGuests),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  locale: z.enum(locales),
  // Honeypot: real users never fill this hidden field.
  company: z.string().max(0).optional().or(z.literal("")),
});

function formatRange(checkIn: string, checkOut: string) {
  return `${checkIn} → ${checkOut}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Silently accept honeypot hits so bots don't learn they were caught.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  // Server-side date sanity + availability checks.
  const nights = nightsBetween(data.checkIn, data.checkOut);
  if (nights < 1) {
    return NextResponse.json({ error: "checkout_after" }, { status: 400 });
  }
  if (nights < property.minNights) {
    return NextResponse.json({ error: "min_nights" }, { status: 400 });
  }

  const blockedNights = expandBlockedNights(await getBlockedRanges());
  if (rangeOverlapsBlocked(data.checkIn, data.checkOut, blockedNights)) {
    return NextResponse.json({ error: "dates_unavailable" }, { status: 409 });
  }

  if (!isEmailConfigured()) {
    // The form is still usable; tell the client to show a friendly notice.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const t = await getTranslations({ locale: data.locale, namespace: "email" });
  const tEmail = (key: string, values?: Record<string, string | number>) =>
    t(key, values);
  const house = (await getTranslations({ locale: data.locale }))("brand");

  const estimate = `${(nights * property.pricePerNight).toLocaleString(
    data.locale,
  )} ${property.currency}`;

  // ---- Owner notification ----
  const ownerLines = [
    tEmail("ownerIntro"),
    "",
    `${tEmail("labelDates")}: ${formatRange(data.checkIn, data.checkOut)}`,
    `${tEmail("labelNights")}: ${nights}`,
    `${tEmail("labelGuests")}: ${data.guests}`,
    `${tEmail("labelName")}: ${data.name}`,
    `${tEmail("labelEmail")}: ${data.email}`,
    `${tEmail("labelPhone")}: ${data.phone || "—"}`,
    `${tEmail("labelEstimate")}: ${estimate}`,
    `${tEmail("labelLanguage")}: ${data.locale}`,
    "",
    `${tEmail("labelMessage")}:`,
    data.message || "—",
  ];

  // ---- Guest acknowledgement ----
  const guestLines = [
    tEmail("guestGreeting", { name: data.name }),
    "",
    tEmail("guestIntro", { house }),
    "",
    `${tEmail("labelDates")}: ${formatRange(data.checkIn, data.checkOut)}`,
    `${tEmail("labelNights")}: ${nights}`,
    `${tEmail("labelGuests")}: ${data.guests}`,
    `${tEmail("labelEstimate")}: ${estimate}`,
    "",
    tEmail("guestOutro"),
    "",
    tEmail("signature", { house }),
  ];

  try {
    await Promise.all([
      sendMail({
        to: process.env.BOOKING_RECIPIENT!,
        replyTo: data.email,
        subject: tEmail("ownerSubject", {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: data.guests,
        }),
        text: ownerLines.join("\n"),
      }),
      sendMail({
        to: data.email,
        subject: tEmail("guestSubject", { house }),
        text: guestLines.join("\n"),
      }),
    ]);
  } catch (err) {
    console.error("Failed to send booking emails:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
