import ical from "node-ical";
import { toISODate, addDaysISO, type DateRange } from "./dates";

/**
 * Convert parsed iCal data into a list of blocked `{ start, end }` ranges
 * (end exclusive, hotel-night convention).
 *
 * Airbnb exports each reservation / host-blocked period as an all-day VEVENT
 * with `DTSTART;VALUE=DATE` (check-in) and `DTEND;VALUE=DATE` (check-out, which
 * is exclusive, the guest leaves that morning). node-ical builds these
 * date-only values at LOCAL midnight, and `toISODate` reads local components,
 * so the calendar date is correct in any server timezone. Do NOT switch this to
 * UTC getters, that reintroduces an off-by-one in zones behind UTC.
 */
export function eventsToRanges(
  data: Record<string, ical.CalendarComponent>,
): DateRange[] {
  const ranges: DateRange[] = [];

  for (const component of Object.values(data)) {
    if (component.type !== "VEVENT") continue;
    // Skip cancelled reservations, those nights are free again.
    if (component.status === "CANCELLED") continue;
    if (!component.start) continue;

    const start = toISODate(component.start as Date);
    // A missing DTEND means a single-day block; default to one night.
    const end = component.end
      ? toISODate(component.end as Date)
      : addDaysISO(start, 1);

    if (end <= start) continue;
    ranges.push({ start, end });
  }

  return ranges;
}

/** Parse a raw `.ics` string into blocked ranges (used in tests). */
export function parseIcsToRanges(ics: string): DateRange[] {
  return eventsToRanges(ical.sync.parseICS(ics));
}

/** Fetch and parse an iCal feed by URL into blocked ranges. */
export async function fetchIcsRanges(url: string): Promise<DateRange[]> {
  const data = await ical.async.fromURL(url);
  return eventsToRanges(data);
}
