import ical from "node-ical";
import { property } from "@content/property";
import { toISODate, type DateRange } from "./dates";

/**
 * Build the list of unavailable date ranges for the house by combining:
 *   1. The Airbnb iCal feed (if AIRBNB_ICAL_URL is set) — one-way sync.
 *   2. Manual blocked ranges configured in content/property.ts.
 *
 * Each range is `{ start, end }` with `end` exclusive (hotel-night convention),
 * matching how Airbnb exports reservations.
 */
export async function getBlockedRanges(): Promise<DateRange[]> {
  const ranges: DateRange[] = [...property.manualBlockedRanges];

  const url = process.env.AIRBNB_ICAL_URL;
  if (url) {
    try {
      const data = await ical.async.fromURL(url);
      for (const event of Object.values(data)) {
        if (event.type !== "VEVENT" || !event.start || !event.end) continue;
        ranges.push({
          start: toISODate(new Date(event.start)),
          end: toISODate(new Date(event.end)),
        });
      }
    } catch (err) {
      // Don't let a flaky Airbnb feed break the page — log and fall back to
      // manual ranges only.
      console.error("Failed to fetch Airbnb iCal feed:", err);
    }
  }

  return ranges;
}
