import { NextResponse } from "next/server";
import { fetchUpcomingMatches } from "@/lib/football";

/**
 * The browser polls this route rather than football-data.org directly: it keeps
 * the API key server-side and lets Next's Data Cache collapse many visitors into
 * one upstream request per minute.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const raw = new URL(request.url).searchParams.get("days")?.trim();
  const days = raw ? Number(raw) : Number.NaN;

  const payload = await fetchUpcomingMatches({
    days: Number.isFinite(days) ? days : undefined,
  });

  return NextResponse.json(payload, {
    headers: {
      // Let shared caches serve a slightly stale board while revalidating.
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
