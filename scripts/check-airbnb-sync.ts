/**
 * Verify the website calendar is in sync with Airbnb.
 *
 * Reads an Airbnb iCal feed (URL or local .ics file) using the SAME parser the
 * website uses, and prints the blocked date ranges + total nights. Compare the
 * output against your Airbnb calendar to confirm they match.
 *
 * Usage:
 *   npm run sync:check                       # uses AIRBNB_ICAL_URL from env
 *   npm run sync:check -- <ical-url>
 *   npm run sync:check -- ./test/fixtures/airbnb-sample.ics
 */
import { readFileSync } from "node:fs";
import { fetchIcsRanges, parseIcsToRanges } from "../src/lib/ical";
import { nightsBetween } from "../src/lib/dates";

async function main() {
  const arg = process.argv[2] || process.env.AIRBNB_ICAL_URL;
  if (!arg) {
    console.error(
      "No source. Pass an iCal URL or .ics path, or set AIRBNB_ICAL_URL.",
    );
    process.exit(1);
  }

  const isUrl = /^https?:\/\//i.test(arg);
  console.log(`Source: ${arg}${isUrl ? " (URL)" : " (file)"}\n`);

  const ranges = isUrl
    ? await fetchIcsRanges(arg)
    : parseIcsToRanges(readFileSync(arg, "utf8"));

  ranges.sort((a, b) => a.start.localeCompare(b.start));

  if (ranges.length === 0) {
    console.log("No blocked dates found — the whole calendar is available.");
    return;
  }

  let total = 0;
  console.log(`Blocked periods (${ranges.length}):`);
  for (const r of ranges) {
    const nights = nightsBetween(r.start, r.end);
    total += nights;
    console.log(
      `  ${r.start} → ${r.end}  (${nights} night${nights === 1 ? "" : "s"}, check-out ${r.end})`,
    );
  }
  console.log(`\nTotal blocked nights: ${total}`);
}

main().catch((err) => {
  console.error("Failed to read calendar:", err);
  process.exit(1);
});
