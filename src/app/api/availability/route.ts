import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability";

// Re-fetch the Airbnb feed at most once an hour (ISR for route handlers).
export const revalidate = 3600;

export async function GET() {
  const availability = await getAvailability();
  return NextResponse.json(availability, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
