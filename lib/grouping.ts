import { resolveCompetition } from "@/lib/competitions";
import { dayLabel, isFinished, localDayKey } from "@/lib/format";
import type { Match } from "@/lib/types";

/** How the board is sliced: by competition, or by calendar day. */
export type GroupMode = "league" | "day";

export interface MatchGroup {
  key: string;
  title: string;
  subtitle: string | null;
  accent: string;
  matches: Match[];
}

/**
 * Collect matches into ordered buckets, preserving each bucket's chronological
 * order. Assumes `matches` is already sorted by kickoff.
 */
function bucket<K>(matches: readonly Match[], keyOf: (match: Match) => K): Map<K, Match[]> {
  const groups = new Map<K, Match[]>();

  for (const match of matches) {
    const key = keyOf(match);
    const existing = groups.get(key);

    if (existing) {
      existing.push(match);
    } else {
      groups.set(key, [match]);
    }
  }

  return groups;
}

/**
 * One section per competition, marquee leagues first, then by earliest kickoff
 * so an uncatalogued competition still lands somewhere sensible.
 */
export function groupByLeague(matches: readonly Match[]): MatchGroup[] {
  const groups = bucket(matches, (match) => match.competition.code);

  return [...groups.entries()]
    .map(([code, list]) => {
      const first = list[0]!;
      const meta = resolveCompetition(first.competition);

      return {
        key: code,
        title: meta.name,
        subtitle: meta.country || null,
        accent: meta.accent,
        matches: list,
        rank: meta.rank,
        earliest: Date.parse(first.utcDate),
      };
    })
    .sort((a, b) => a.rank - b.rank || a.earliest - b.earliest)
    .map(({ key, title, subtitle, accent, matches: list }) => ({
      key,
      title,
      subtitle,
      accent,
      matches: list,
    }));
}

/** One section per calendar day in the visitor's timezone. */
export function groupByDay(matches: readonly Match[], now: number): MatchGroup[] {
  const groups = bucket(matches, (match) => localDayKey(match.utcDate));

  return [...groups.entries()].map(([key, list]) => {
    const first = list[0]!;
    const played = list.filter(isFinished).length;
    const remaining = list.length - played;

    return {
      key,
      title: dayLabel(first.utcDate, now),
      // The count beside the heading already gives the total, so only say
      // something here when part of the day is already done.
      subtitle: played === 0 ? null : `${remaining} to play · ${played} played`,
      accent: "var(--accent)",
      matches: list,
    };
  });
}
