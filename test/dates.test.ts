import { test } from "node:test";
import assert from "node:assert/strict";
import {
  nightsBetween,
  addDaysISO,
  expandBlockedNights,
  rangeOverlapsBlocked,
} from "../src/lib/dates";

test("nightsBetween counts nights (end exclusive)", () => {
  assert.equal(nightsBetween("2026-08-01", "2026-08-05"), 4);
  assert.equal(nightsBetween("2026-08-01", "2026-08-02"), 1);
  assert.equal(nightsBetween("2026-08-01", "2026-08-01"), 0);
});

test("addDaysISO adds and crosses month boundaries", () => {
  assert.equal(addDaysISO("2026-08-01", 1), "2026-08-02");
  assert.equal(addDaysISO("2026-08-31", 1), "2026-09-01");
  assert.equal(addDaysISO("2026-12-31", 1), "2027-01-01");
});

test("expandBlockedNights yields nights start..end-1", () => {
  const nights = expandBlockedNights([{ start: "2026-08-01", end: "2026-08-04" }]);
  assert.deepEqual(
    [...nights].sort(),
    ["2026-08-01", "2026-08-02", "2026-08-03"],
  );
  // The check-out day itself is NOT blocked (turnover day is bookable).
  assert.ok(!nights.has("2026-08-04"));
});

test("rangeOverlapsBlocked detects overlaps but allows turnover days", () => {
  const blocked = expandBlockedNights([
    { start: "2026-08-10", end: "2026-08-14" }, // nights 10,11,12,13
  ]);
  // Overlapping stays
  assert.ok(rangeOverlapsBlocked("2026-08-12", "2026-08-16", blocked));
  assert.ok(rangeOverlapsBlocked("2026-08-08", "2026-08-11", blocked));
  // Checking out on the 10th (blocked check-in day) is fine
  assert.ok(!rangeOverlapsBlocked("2026-08-07", "2026-08-10", blocked));
  // Checking in on the 14th (the previous booking's check-out) is fine
  assert.ok(!rangeOverlapsBlocked("2026-08-14", "2026-08-18", blocked));
});
