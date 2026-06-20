import { NextResponse } from "next/server";
import { getBlockedRanges } from "@/lib/availability";

// Re-fetch the Airbnb feed at most once an hour (ISR for route handlers).
export const revalidate = 3600;

export async function GET() {
  const ranges = await getBlockedRanges();
  return NextResponse.json(
    { ranges },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
