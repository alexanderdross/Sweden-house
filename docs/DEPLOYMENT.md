# Deployment

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo. Framework is
   auto-detected as **Next.js**, no build settings needed.
3. Add the environment variables below (**Settings → Environment Variables**),
   for the Production (and Preview) environments.
4. **Deploy.**
5. Optional: attach a custom domain (**Settings → Domains**) and set
   `NEXT_PUBLIC_SITE_URL` to the final URL, then redeploy so SEO tags
   (canonical, hreflang, Open Graph) use it.

## Environment variables

All are optional for the build to succeed, but email and Airbnb sync stay off
until set.

| Variable | Example | Notes |
| --- | --- | --- |
| `SMTP_HOST` | `smtp.gmail.com` | Your provider's SMTP host |
| `SMTP_PORT` | `465` | `465` = implicit TLS; `587` = STARTTLS |
| `SMTP_USER` | `bookings@yourdomain.com` | SMTP login |
| `SMTP_PASS` | `app-password` | Use an **app password**, not your account password |
| `SMTP_FROM` | `Flatön House <bookings@yourdomain.com>` | "From" header |
| `BOOKING_RECIPIENT` | `you@yourdomain.com` | Inbox that receives requests |
| `AIRBNB_ICAL_URL` | `https://www.airbnb.com/calendar/ical/….ics` | One-way availability sync |
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.vercel.app` | Public URL for SEO/OG (no trailing slash) |

Copy `.env.example` → `.env.local` for local development with the same keys.

### SMTP provider notes

- **Gmail**: enable 2-step verification, create an *App Password*, use
  `smtp.gmail.com:465`.
- **iCloud (me.com)**: create an app-specific password at appleid.apple.com,
  use `smtp.mail.me.com:587`.
- **Custom domain mailbox**: use your host's SMTP settings.

If `SMTP_*`/`BOOKING_RECIPIENT` are missing, the booking form returns a friendly
"email not configured" notice instead of failing.

## Airbnb calendar sync (one-way)

1. Airbnb → your listing → **Calendar**.
2. **Availability → Connect calendars → Export calendar**.
3. Copy the `.ics` URL into `AIRBNB_ICAL_URL`.

The site reads the feed at most once per hour (`revalidate = 3600`) and blocks
those nights in the calendar and in server-side booking validation.

> The sync is **one-way (Airbnb → website)**. When you accept a direct request
> from the website, block those dates on Airbnb (or add them to
> `manualBlockedRanges` in `content/property.ts`) so the two calendars don't
> drift and you avoid double bookings.

## Verifying a deployment

- Visit `/` → should redirect to `/en`; check `/sv`, `/da`, `/fi`, `/de`.
- `GET /api/availability` → JSON `{ "ranges": [...] }` (non-empty once the iCal
  URL is set and there are Airbnb bookings).
- Submit the booking form → owner email + guest acknowledgement arrive; an
  overlapping/short stay is rejected.
- Run Lighthouse on mobile for performance/SEO.
