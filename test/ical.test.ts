import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseIcsToRanges } from "../src/lib/ical";

const fixture = readFileSync(
  fileURLToPath(new URL("./fixtures/airbnb-sample.ics", import.meta.url)),
  "utf8",
);

test("parses Airbnb reservations into blocked ranges", () => {
  const ranges = parseIcsToRanges(fixture);
  assert.deepEqual(ranges, [
    { start: "2026-08-01", end: "2026-08-05" },
    { start: "2026-08-12", end: "2026-08-15" },
  ]);
});

test("date conversion is timezone-stable", () => {
  // node-ical builds all-day events at local midnight; toISODate reads local
  // components, so the calendar date must be correct regardless of TZ. This
  // test is also run under TZ=Europe/Stockholm in CI / the verify step.
  const ranges = parseIcsToRanges(fixture);
  assert.equal(ranges[0].start, "2026-08-01");
});

test("skips cancelled events", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "DTSTART;VALUE=DATE:20260901",
    "DTEND;VALUE=DATE:20260905",
    "STATUS:CANCELLED",
    "UID:cancelled@airbnb.com",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  assert.deepEqual(parseIcsToRanges(ics), []);
});

test("defaults a missing DTEND to a single night", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "DTSTART;VALUE=DATE:20260901",
    "UID:noend@airbnb.com",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  assert.deepEqual(parseIcsToRanges(ics), [
    { start: "2026-09-01", end: "2026-09-02" },
  ]);
});
