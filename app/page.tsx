import { Board } from "@/components/board";
import { fetchUpcomingMatches } from "@/lib/football";

/**
 * Fixtures move constantly, so the page is rendered per request. The upstream
 * fetch is still cached for a minute, so this costs one API call per minute at
 * most however much traffic arrives.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const payload = await fetchUpcomingMatches();

  return <Board initial={payload} />;
}
