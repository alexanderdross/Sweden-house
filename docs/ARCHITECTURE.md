# Architecture

## Overview

```
Browser
  │
  ▼
src/middleware.ts  ── next-intl locale routing (/ → /sv, enforces locale prefix)
  │
  ▼
src/app/[locale]/layout.tsx   ── <html lang>, metadata + hreflang, NextIntlClientProvider
src/app/[locale]/page.tsx     ── assembles the landing sections (server components)
  │
  ├── Header ─ LanguageSwitcher (client)
  ├── Hero, About, Gallery, Amenities, Location, Faq, Footer (server)
  └── BookingSection (client)
        ├── Availability (react-day-picker calendar)
        └── BookingForm  (react-hook-form)
              │ fetch
              ▼
        /api/availability        ── GET  Airbnb iCal + manual blocks
        /api/booking-request     ── POST validate + send SMTP emails
```

## Internationalization (next-intl, v3.26)

- `i18n/routing.ts`, `defineRouting` with `locales = [en, sv, da, fi, de]`,
  `defaultLocale = en`, `localePrefix = "always"`. Also exports `localeNames`,
  `localeFlags`, and the typed navigation helpers (`Link`, `useRouter`,
  `usePathname`).
- `i18n/request.ts`, `getRequestConfig` loads `messages/<locale>.json`.
- `src/middleware.ts`, wires routing into the request pipeline. **Must be under
  `src/`** because the app uses a `src/` directory.
- Messages are namespaced JSON (`hero`, `about`, `amenities`, `booking`,
  `faq`, `email`, …). Components read them with `useTranslations(namespace)`.
- `setRequestLocale(locale)` is called in the layout and page so static
  rendering works per locale (`generateStaticParams` returns all 5).

## Content layer

- `content/property.ts`, a typed `Property` object: capacity, price, currency,
  min nights, coordinates, Airbnb/Maps URLs, amenity keys, manual blocked
  ranges, contact email. The single source of factual truth.
- `content/gallery.ts`, static `import`s of the WebP photos so Next infers
  dimensions and generates blur placeholders. Each entry has a `captionKey`
  resolved against `gallery.captions.*` for localized alt text.

Components never hard-code facts or copy: facts come from `content/*`, copy from
`messages/*`.

## Availability & booking

- `src/lib/dates.ts`, timezone-safe `YYYY-MM-DD` helpers: `toISODate`,
  `fromISODate`, `nightsBetween`, `expandBlockedNights`, `rangeOverlapsBlocked`.
  Ranges use **exclusive check-out** (a stay of nights `start … end-1`).
- `src/lib/ical.ts`, pure parsing: `eventsToRanges` / `parseIcsToRanges` /
  `fetchIcsRanges`. Skips `STATUS:CANCELLED`, defaults a missing `DTEND` to one
  night, and is timezone-safe (see the note in the file). Covered by
  `test/ical.test.ts`.
- `src/lib/availability.ts`, `getAvailability()` merges the Airbnb iCal feed
  (`AIRBNB_ICAL_URL`) with `property.manualBlockedRanges` and returns
  `{ ranges, updatedAt, airbnbSynced }`. A failing/missing feed degrades
  gracefully to manual ranges only.
- `src/app/api/availability/route.ts`, `GET` returns that payload with
  `revalidate = 3600` + cache headers, so Airbnb is polled at most hourly. The
  client shows a "synced with Airbnb · updated HH:MM" badge and a refresh button.
- **Verify sync** with `npm run sync:check -- <ical-url-or-file>`, which prints
  the exact blocked ranges the site computes for comparison against Airbnb.
- `src/app/api/booking-request/route.ts`, `POST`:
  1. Zod-validates the payload (incl. a honeypot `company` field).
  2. Enforces min nights and re-checks availability server-side (defense in
     depth; the calendar already blocks booked nights client-side).
  3. If SMTP isn't configured → `503` (the form shows a friendly notice).
  4. Sends two emails via `src/lib/email.ts`: an owner notification (reply-to =
     guest) and a localized guest acknowledgement. Email copy is localized with
     `getTranslations({ locale, namespace: "email" })`.

## Styling

Tailwind CSS with a small Bohuslän palette (`sea`, `sand`) defined in
`tailwind.config.ts`. System font stacks (no web-font fetch) via CSS variables
in `globals.css`. `react-day-picker/style.css` is imported and themed with CSS
variables.

## Images / performance

- Self-hosted **WebP** under `public/images/`.
- Static imports → automatic width/height (no CLS) + `placeholder="blur"`.
- `next/image` lazy-loads by default; only the hero uses `priority`.
- `next.config.ts` sets `images.formats = ["image/avif", "image/webp"]` so
  Next can serve AVIF where supported.
- All `alt` text is localized.

## Notable decisions

- **Request-to-book, not instant book**: no payment integration; the owner
  confirms by email. Keeps it simple and fee-free.
- **One-way Airbnb sync**: importing Airbnb's iCal avoids double bookings
  without a paid channel manager. Direct bookings must be added back to Airbnb
  (or `manualBlockedRanges`) by the owner.
- **No database**: all state is the content files + the live Airbnb feed.
