/**
 * Date helpers shared by the availability API, the calendar and the booking
 * form. All "date-only" values use the `YYYY-MM-DD` string format so they are
 * timezone-safe between the server and the browser.
 */

export interface DateRange {
  /** Inclusive check-in date, `YYYY-MM-DD`. */
  start: string;
  /** Exclusive check-out date, `YYYY-MM-DD` (the guest leaves this morning). */
  end: string;
}

/** Format a Date as a local `YYYY-MM-DD` string (no timezone shift). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a `YYYY-MM-DD` string into a local Date at midnight. */
export function fromISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Number of nights between two `YYYY-MM-DD` dates (end exclusive). */
export function nightsBetween(start: string, end: string): number {
  const ms = fromISODate(end).getTime() - fromISODate(start).getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * Expand booked ranges into a Set of every occupied NIGHT (`YYYY-MM-DD`).
 * A range start..end (end exclusive) occupies the nights start .. end-1.
 */
export function expandBlockedNights(ranges: DateRange[]): Set<string> {
  const nights = new Set<string>();
  for (const { start, end } of ranges) {
    const cursor = fromISODate(start);
    const last = fromISODate(end);
    while (cursor < last) {
      nights.add(toISODate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return nights;
}

/**
 * Does the requested stay (check-in..check-out, check-out exclusive) overlap
 * any blocked night? Used to validate a booking request server-side.
 */
export function rangeOverlapsBlocked(
  checkIn: string,
  checkOut: string,
  blockedNights: Set<string>,
): boolean {
  const cursor = fromISODate(checkIn);
  const last = fromISODate(checkOut);
  while (cursor < last) {
    if (blockedNights.has(toISODate(cursor))) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}
