# Flatön Coastal House — direct booking website

A multilingual landing page for a weekend house on **Flatön, Orust** in
Bohuslän's archipelago, Sweden. Guests can browse the house, check availability
(synced one-way from Airbnb) and **request a booking by email** — no platform
fees, no online payment.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**, deployed on
**Vercel**.

## Features

- 🌍 **5 languages** — Swedish (default), English, Danish, Finnish, German, with
  locale-prefixed URLs (`/sv`, `/en`, `/da`, `/fi`, `/de`) and `hreflang` SEO.
- 📅 **Availability calendar** that imports the **Airbnb iCal feed** (one-way
  sync) plus optional manual blocked dates.
- ✉️ **Request-to-book form** that emails the host and sends the guest a
  localized acknowledgement via SMTP.
- 🖼️ **Optimized images** — self-hosted WebP, static imports (no layout shift),
  blur placeholders, lazy loading, localized `alt` text.
- 🐶 Content tailored to the real listing (sleeps up to 8, dog-friendly,
  terrace with gas pizza oven, wood-burning fire, sea swimming nearby).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values you have
npm run dev                  # http://localhost:3000  → redirects to /sv
```

The site runs fine with no env vars set: the calendar simply shows only manual
blocked dates, and the booking form reports that email isn't configured yet.

## Environment variables

See [`.env.example`](./.env.example). Add the same variables in Vercel under
**Project → Settings → Environment Variables**.

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP mailbox used to send mail |
| `SMTP_FROM` | "From" address on outgoing mail |
| `BOOKING_RECIPIENT` | Where booking requests are delivered (owner inbox) |
| `AIRBNB_ICAL_URL` | Airbnb calendar export URL (one-way availability sync) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO/canonical/OG tags |

### Getting the Airbnb iCal URL

Airbnb → your listing → **Calendar** → **Availability** → **Connect calendars**
→ **Export calendar** → copy the `.ics` link into `AIRBNB_ICAL_URL`. The site
re-reads it at most once an hour.

> Sync is one-way (Airbnb → website). When you accept a direct request, add the
> dates on Airbnb (or to `manualBlockedRanges` in `content/property.ts`) so both
> calendars stay consistent.

## Editing content

Everything the owner is likely to change lives in two places — no need to touch
components:

- **`content/property.ts`** — capacity, bedrooms, price, currency, minimum
  nights, coordinates, Airbnb/Maps links, amenities, manual blocked dates,
  contact email. Set `pricePerNight` to a real number to show a "from … / night"
  price (it's `0` by default, which shows "minimum nights" only).
- **`messages/<locale>.json`** — all text in each language (headings,
  descriptions, FAQ, amenity labels, photo captions/alt text, emails).

### Replacing photos

Photos are self-hosted WebP files in `public/images/`, imported in
`content/gallery.ts`. To swap one, drop in a new WebP with the same filename (or
add an entry to `gallery.ts`). To convert a JPG/PNG to WebP:

```bash
npx sharp-cli -i input.jpg -o public/images/name.webp --format webp
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel (framework auto-detected as Next.js).
3. Add the environment variables above.
4. Deploy. Attach a custom domain later under **Settings → Domains**, and set
   `NEXT_PUBLIC_SITE_URL` to the final URL.

## Project structure

```
content/        property facts (property.ts) + photo gallery (gallery.ts)
i18n/           next-intl routing + request config
messages/       sv / en / da / fi / de translations
public/images/  self-hosted WebP photos
src/app/        [locale] pages + /api/availability + /api/booking-request
src/components/ Header, Hero, Gallery, Amenities, Location, BookingSection, …
src/lib/        dates, Airbnb iCal availability, SMTP email helpers
```
