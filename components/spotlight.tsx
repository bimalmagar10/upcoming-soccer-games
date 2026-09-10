"use client";

import type { CSSProperties } from "react";
import { Countdown } from "@/components/countdown";
import { Crest } from "@/components/crest";
import { Ripple } from "@/components/ripple";
import { resolveCompetition } from "@/lib/competitions";
import { formatKickoffTime, formatShortDate, isLive, localTimeZone, stageLabel } from "@/lib/format";
import type { Match } from "@/lib/types";
import styles from "./spotlight.module.css";

interface SpotlightProps {
  match: Match;
  now: number;
}

/**
 * The hero fixture: whatever is happening right now, or the very next kickoff.
 * Carries the page's only large-scale motion — a slow light sweep across the
 * card, echoing floodlights moving over a pitch.
 */
export function Spotlight({ match, now }: SpotlightProps) {
  const live = isLive(match);
  // Free-tier status updates lag by about a minute, so a fixture can be past its
  // kickoff while still reported as scheduled. Say so rather than counting down.
  const kickedOff = Date.parse(match.utcDate) <= now;
  const meta = resolveCompetition(match.competition);
  const stage = stageLabel(match);
  const hasScore = match.score.home !== null && match.score.away !== null;

  return (
    <section
      className={`${styles.spotlight} onDark ${live ? styles.isLive : ""}`}
      style={{ "--section-accent": meta.accent } as CSSProperties}
      aria-labelledby="spotlight-heading"
    >
      <span className={styles.sweep} aria-hidden="true" />

      <header className={styles.eyebrow}>
        <span className={live ? styles.liveFlag : styles.nextFlag}>
          {live ? <span className={styles.liveDot} aria-hidden="true" /> : null}
          {live ? "Live now" : kickedOff ? "Kicking off" : "Next up"}
        </span>

        <span className={styles.competition}>
          {meta.name}
          {stage ? <span className={styles.stage}> · {stage}</span> : null}
        </span>
      </header>

      <h2 id="spotlight-heading" className="srOnly">
        {live ? "Match in progress" : "Next match"}: {match.homeTeam.name} versus {match.awayTeam.name}
      </h2>

      <div className={styles.fixture}>
        <div className={styles.side}>
          <span className={styles.crestStage}>
            <Ripple />
            <Crest src={match.homeTeam.crest} alt={match.homeTeam.name} tla={match.homeTeam.tla} size="lg" />
          </span>
          <p className={styles.team}>{match.homeTeam.shortName}</p>
          <p className={styles.role}>Home</p>
        </div>

        <div className={styles.middle}>
          {hasScore ? (
            <p className={`${styles.score} tabular`}>
              {match.score.home}
              <span className={styles.scoreDash}>–</span>
              {match.score.away}
            </p>
          ) : (
            <p className={styles.versus}>vs</p>
          )}
        </div>

        <div className={styles.side}>
          <span className={styles.crestStage}>
            <Ripple />
            <Crest src={match.awayTeam.crest} alt={match.awayTeam.name} tla={match.awayTeam.tla} size="lg" />
          </span>
          <p className={styles.team}>{match.awayTeam.shortName}</p>
          <p className={styles.role}>Away</p>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.timer}>
          {live ? (
            <p className={styles.underway}>Match under way</p>
          ) : kickedOff ? (
            <p className={styles.underway}>Awaiting the first whistle</p>
          ) : (
            <Countdown target={match.utcDate} now={now} />
          )}
        </div>

        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt>Kickoff</dt>
            <dd className="tabular">
              {formatKickoffTime(match.utcDate)} · {formatShortDate(match.utcDate)}
            </dd>
          </div>

          {match.venue ? (
            <div className={styles.detail}>
              <dt>Venue</dt>
              <dd>{match.venue}</dd>
            </div>
          ) : null}

          <div className={styles.detail}>
            <dt>Your timezone</dt>
            <dd>{localTimeZone()}</dd>
          </div>
        </dl>
      </footer>
    </section>
  );
}
