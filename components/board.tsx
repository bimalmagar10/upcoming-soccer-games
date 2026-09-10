"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MatchSection } from "@/components/match-section";
import { Spotlight } from "@/components/spotlight";
import { useMatches } from "@/hooks/use-matches";
import { useNow } from "@/hooks/use-now";
import { resolveCompetition } from "@/lib/competitions";
import { isFinished, isLive } from "@/lib/format";
import { groupByDay, groupByLeague, type GroupMode } from "@/lib/grouping";
import type { Match, MatchesPayload } from "@/lib/types";
import styles from "./board.module.css";

/**
 * How long a finished match lingers on the board. Recent results are useful
 * context; older ones are noise on a page about what is coming next.
 */
const RESULT_GRACE_MS = 3 * 60 * 60 * 1000;

/** Live matches take the spotlight; otherwise the earliest fixture still to come. */
function pickSpotlight(matches: readonly Match[]): Match | null {
  return (
    matches.find(isLive) ??
    matches.find((match) => !isFinished(match)) ??
    matches[0] ??
    null
  );
}

export function Board({ initial }: { initial: MatchesPayload }) {
  const payload = useMatches(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<GroupMode>("league");

  // Ticks every second, driving the header clock and the spotlight countdown.
  const now = useNow(Date.parse(payload.fetchedAt));

  /**
   * Section headings and staleness are keyed to when the feed was assembled, not
   * to the ticking clock — otherwise every grouping recomputes once a second.
   */
  const feedTime = Date.parse(payload.fetchedAt);

  const visible = useMemo(
    () =>
      payload.matches.filter(
        (match) =>
          !isFinished(match) ||
          Date.parse(match.utcDate) > feedTime - RESULT_GRACE_MS,
      ),
    [payload.matches, feedTime],
  );

  const leagueGroups = useMemo(() => groupByLeague(visible), [visible]);

  const competitions = useMemo(
    () =>
      leagueGroups.map((group) =>
        resolveCompetition(group.matches[0]!.competition),
      ),
    [leagueGroups],
  );

  const filtered = useMemo(
    () =>
      selected === null
        ? visible
        : visible.filter((m) => m.competition.code === selected),
    [visible, selected],
  );

  const groups = useMemo(
    () =>
      mode === "league"
        ? groupByLeague(filtered)
        : groupByDay(filtered, feedTime),
    [filtered, mode, feedTime],
  );

  const spotlight = pickSpotlight(visible);

  return (
    <>
      <Header now={now} />

      <main className={styles.main} id="top">
        <section className={styles.intro}>
          <p className={styles.kicker}>Upcoming football</p>
          <h1 className={styles.headline}>
            Every kickoff that matters,{" "}
            <em className={styles.em}>see what&apos;s next</em>.
          </h1>
          <p className={styles.lede}>
            The Champions League, Premier League, La Liga, Serie A, Bundesliga
            and more. Know the upcoming <strong>game</strong> you don&apos;t
            wanna miss.
          </p>
        </section>

        {payload.notice ? (
          <p className={styles.notice} role="status">
            {payload.notice}
          </p>
        ) : null}

        {spotlight ? <Spotlight match={spotlight} now={now} /> : null}

        <section className={styles.board} aria-label="Fixture list">
          <FilterBar
            competitions={competitions}
            selected={selected}
            onSelect={setSelected}
            mode={mode}
            onModeChange={setMode}
          />

          {groups.length > 0 ? (
            <div className={styles.groups}>
              {groups.map((group) => (
                <MatchSection
                  key={group.key}
                  group={group}
                  now={now}
                  showDate={mode === "league"}
                />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              No fixtures scheduled in this window. Try clearing the competition
              filter.
            </p>
          )}
        </section>
      </main>

      <Footer source={payload.source} />
    </>
  );
}
