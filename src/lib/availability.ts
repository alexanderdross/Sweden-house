import { property } from "@content/property";
import { fetchIcsRanges } from "./ical";
import type { DateRange } from "./dates";

export interface AvailabilityResult {
  /** Unavailable date ranges, `end` exclusive. */
  ranges: DateRange[];
  /** When the data was assembled (ISO timestamp). */
  updatedAt: string;
  /** Whether the live Airbnb feed contributed (vs. manual blocks only). */
  airbnbSynced: boolean;
}

/**
 * Build the list of unavailable date ranges by combining:
 *   1. The Airbnb iCal feed (if AIRBNB_ICAL_URL is set), one-way sync.
 *   2. Manual blocked ranges configured in content/property.ts.
 *
 * A missing or failing Airbnb feed degrades gracefully to manual ranges only,
 * so the calendar never breaks the page.
 */
export async function getAvailability(): Promise<AvailabilityResult> {
  const ranges: DateRange[] = [...property.manualBlockedRanges];
  let airbnbSynced = false;

  const url = process.env.AIRBNB_ICAL_URL;
  if (url) {
    try {
      ranges.push(...(await fetchIcsRanges(url)));
      airbnbSynced = true;
    } catch (err) {
      console.error("Failed to fetch Airbnb iCal feed:", err);
    }
  }

  return { ranges, updatedAt: new Date().toISOString(), airbnbSynced };
}

/** Convenience accessor used by the booking API for server-side validation. */
export async function getBlockedRanges(): Promise<DateRange[]> {
  return (await getAvailability()).ranges;
}
