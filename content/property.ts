/**
 * Single source of truth for everything factual about the house.
 *
 * The OWNER can safely edit this file to update prices, capacity, amenities,
 * photos and blocked dates without touching any React components. All
 * translatable marketing/UI text lives separately in `messages/<locale>.json`.
 */

export type AmenityKey =
  | "wifi"
  | "kitchen"
  | "pizzaOven"
  | "grill"
  | "terrace"
  | "fireplace"
  | "ac"
  | "heating"
  | "bathtub"
  | "washer"
  | "tv"
  | "workspace"
  | "gym"
  | "parking"
  | "seaNearby"
  | "natureView"
  | "pets"
  | "selfCheckIn";

export interface Property {
  /** Internal name; the public display name comes from i18n `brand`. */
  slug: string;
  maxGuests: number;
  /** Comfortable capacity (listing: "optimal for 6, up to 8"). */
  comfortGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  /**
   * Nightly price as a number, plus ISO currency code. Set to 0 to hide the
   * price and show "price on request" instead (Airbnb pricing is dynamic).
   */
  pricePerNight: number;
  currency: string;
  /** Minimum nights per booking. */
  minNights: number;
  /** Decimal coordinates (from 58°12'52.8"N 11°29'37.9"E). */
  coordinates: { lat: number; lng: number };
  /** Short, language-neutral place label shown near the map. */
  area: string;
  /** Deep links. */
  googleMapsUrl: string;
  airbnbUrl: string;
  /** Amenities to render with icons; copy comes from i18n `amenities.<key>`. */
  amenities: AmenityKey[];
  /**
   * Dates the owner wants to block manually, on top of the Airbnb iCal feed.
   * Use ISO ranges (inclusive start, exclusive end — like hotel nights).
   */
  manualBlockedRanges: { start: string; end: string }[];
  /** Public contact details shown in the footer. */
  contactEmail: string;
}

export const property: Property = {
  slug: "flaton-coastal-house",
  maxGuests: 8,
  comfortGuests: 6,
  bedrooms: 3,
  beds: 8,
  bathrooms: 1,
  // Airbnb pricing is dynamic; keep 0 to show "price on request" until the
  // owner sets a real nightly rate here.
  pricePerNight: 0,
  currency: "SEK",
  minNights: 2,
  coordinates: { lat: 58.2147, lng: 11.493861 },
  area: "Flatön, Orust — Bohuslän, Sweden",
  googleMapsUrl: "https://goo.gl/maps/M34vSaGaJzbz5EU36",
  airbnbUrl:
    "https://www.airbnb.de/rooms/956609902841163645?unique_share_id=186e9b77-fe80-4103-8d39-aa56807588a7",
  amenities: [
    "wifi",
    "kitchen",
    "pizzaOven",
    "grill",
    "terrace",
    "fireplace",
    "ac",
    "heating",
    "bathtub",
    "washer",
    "tv",
    "workspace",
    "gym",
    "parking",
    "seaNearby",
    "natureView",
    "pets",
    "selfCheckIn",
  ],
  manualBlockedRanges: [],
  contactEmail: "owner@example.com",
};
