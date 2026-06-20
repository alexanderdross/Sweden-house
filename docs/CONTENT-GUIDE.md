# Content guide

How to update the site without touching React components. Everything below is
plain data/text. After any change, run `npm run build` to confirm it still
compiles, then commit.

## 1. Facts (price, capacity, links, blocked dates)

Edit **`content/property.ts`**:

| Field | Meaning |
| --- | --- |
| `maxGuests`, `comfortGuests` | Max sleeping capacity / comfortable number |
| `bedrooms`, `beds`, `bathrooms` | Shown in the "facts" grid |
| `pricePerNight`, `currency` | Set a real number to show "from X / night". Leave `0` to hide price and show only the minimum-nights note |
| `minNights` | Minimum stay; enforced in the form and API |
| `coordinates` | `{ lat, lng }`, drives the map and Maps link |
| `googleMapsUrl`, `airbnbUrl` | Buttons in Location / Footer |
| `amenities` | Array of amenity keys (see below) |
| `manualBlockedRanges` | Extra blocked dates on top of Airbnb. `{ start, end }`, `end` exclusive |
| `contactEmail` | Shown in the footer |

### Blocking dates manually

```ts
manualBlockedRanges: [
  { start: "2026-07-10", end: "2026-07-14" }, // blocks nights 10,11,12,13
],
```

## 2. Photos

Photos are self-hosted WebP in `public/images/`, listed in
**`content/gallery.ts`**.

To replace a photo, keep the same filename and drop in a new WebP, or add a new
entry. Convert any image to optimized WebP with:

```bash
npx sharp-cli -i original.jpg -o public/images/new-name.webp --format webp --width 1600
```

Then (if it's a new file) add it to `content/gallery.ts`:

```ts
import newName from "../public/images/new-name.webp";
// …
{ src: newName, captionKey: "newName" },
```

…and add a localized caption under `gallery.captions.newName` in **every**
`messages/<locale>.json`. The caption is also the image's `alt` text.

The first gallery entry is the large hero / Open Graph image
(`export const heroImage`).

## 3. Text (any language)

All copy lives in **`messages/<locale>.json`**, one file per language
(`sv`, `en`, `da`, `fi`, `de`). The files share the same key structure; change
the same key in each language. Key groups:

- `brand`, `meta`, site name + SEO title/description
- `nav`, `hero`, `about`, `gallery.captions`, `amenities`, `location`, `faq`,
  `footer`
- `booking`, form labels, validation, success/error states
- `email`, owner notification + guest acknowledgement text

Placeholders like `{count}`, `{name}`, `{house}`, `{checkIn}` must be kept
intact. Plurals use ICU syntax, e.g.
`"nights": "{count, plural, =1 {# night} other {# nights}}"`.

## 4. Amenities

1. Add the key to the `AmenityKey` union and the `amenities` array in
   `content/property.ts`.
2. Add an icon (emoji) for it in `ICONS` in `src/components/Amenities.tsx`.
3. Add a label under `amenities.<key>` in every `messages/<locale>.json`.

## 5. Add or remove a language

1. Update `locales` and `localeNames` in `i18n/routing.ts`.
2. Add the matcher locale in `src/middleware.ts`.
3. Create `messages/<new>.json` (copy `en.json` and translate).
4. Add the date-fns locale mapping in `src/components/Availability.tsx`.
