# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this is

A multilingual **direct-booking landing page** for a private holiday house on
**Flatön, Orust** in Bohuslän's archipelago, Sweden. It complements the owner's
Airbnb listing by taking **booking requests via email** (no online payment) and
showing availability synced one-way from Airbnb's iCal feed.

Stack: **Next.js 15 (App Router) + TypeScript + Tailwind CSS + next-intl**,
deployed on **Vercel**.

## Commands

```bash
npm install        # install deps
npm run dev        # dev server at http://localhost:3000 (redirects to /sv)
npm run build      # production build (run this to verify before committing)
npm run start      # serve the production build
npm run lint       # eslint
```

There is no test suite. **Verify changes with `npm run build`** and a manual
smoke test of `/sv`, `/en`, `/da`, `/fi`, `/de`, `/api/availability`, and a
POST to `/api/booking-request`.

## Architecture (one-paragraph map)

Requests hit `src/middleware.ts` (next-intl) which enforces a locale prefix and
redirects `/` → `/sv`. Pages live under `src/app/[locale]/` and are assembled in
`page.tsx` from server components in `src/components/`. The booking UI
(`BookingSection.tsx`) is the only client-heavy area: it fetches
`/api/availability` (Airbnb iCal + manual blocks, parsed in
`src/lib/availability.ts`), drives a `react-day-picker` calendar, and POSTs to
`/api/booking-request`, which validates with Zod, re-checks availability, and
sends localized SMTP emails via `src/lib/email.ts`.

## Conventions & gotchas

- **Middleware must be at `src/middleware.ts`** (this project uses a `src/`
  dir). A root-level `middleware.ts` is silently ignored → `/` 404s.
- **next-intl is v3.26**: `hasLocale` is NOT exported. Use
  `routing.locales.includes(x as Locale)`. `NextIntlClientProvider` is passed
  `locale` + `messages` explicitly in the layout.
- **Path aliases** (see `tsconfig.json`): `@/*` → `src/*`, `@content/*` →
  `content/*`, `@i18n/*` → `i18n/*`.
- **Dates** are timezone-safe `YYYY-MM-DD` strings everywhere; helpers in
  `src/lib/dates.ts`. iCal/booking ranges use an **exclusive check-out** date
  (hotel-night convention).
- **Images**: self-hosted WebP in `public/images/`, imported statically in
  `content/gallery.ts` (gives automatic dimensions + blur placeholder). Use
  `next/image` with `placeholder="blur"` and a `sizes` prop; only the hero is
  `priority`. Alt text is always localized via `gallery.captions.*`.
- **Secrets never in code** — all SMTP/iCal config is env-only. The app builds
  and runs with no env vars (form returns a friendly "not configured" notice,
  calendar shows only manual blocks).
- Keep all user-facing strings in `messages/<locale>.json`; never hard-code
  copy in components.

## Where to change things

| Want to change… | Edit |
| --- | --- |
| Capacity, price, min nights, coords, links, amenities, blocked dates | `content/property.ts` |
| Photos / gallery order | `content/gallery.ts` (+ files in `public/images/`) |
| Any text, in any language | `messages/<locale>.json` |
| Add a language | `i18n/routing.ts` (`locales`, `localeNames`) + new `messages/<x>.json` + middleware matcher |
| Availability logic | `src/lib/availability.ts`, `src/app/api/availability/route.ts` |
| Booking email content/flow | `src/app/api/booking-request/route.ts`, `messages/*.json` → `email.*` |

## Property facts (source of truth = `content/property.ts`)

- Location: Flatön, Orust, Bohuslän, Sweden. Coords 58.2147, 11.493861
  (58°12′52.8″N 11°29′37.9″E). ~1.5 h north of Gothenburg.
- Capacity: sleeps up to 8 (comfortable for 6); 3 bedrooms, 8 beds, 1 bathroom.
- Modern black-timber house; wood-burning fire, AC, central heating, terrace
  with grill + gas pizza oven, freestanding bathtub, washing machine, TV,
  workspace, exercise equipment, free on-site parking.
- Dog-friendly. Self check-in via keypad/code lock. Host: Malin.
- Airbnb: https://www.airbnb.de/rooms/956609902841163645
- Languages: Swedish (default), English, Danish, Finnish, German.

## More docs

- [`README.md`](./README.md) — setup & deploy quickstart
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — detailed architecture
- [`docs/CONTENT-GUIDE.md`](./docs/CONTENT-GUIDE.md) — editing content, photos, languages
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — Vercel, env vars, Airbnb iCal
