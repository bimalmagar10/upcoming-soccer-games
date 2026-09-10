"use client";

import type { CSSProperties } from "react";
import { AnimatedListItem } from "@/components/animated-list";
import { Crest } from "@/components/crest";
import { ShimmerTag } from "@/components/shimmer-tag";
import { StatusPill } from "@/components/status-pill";
import { resolveCompetition } from "@/lib/competitions";
import {
  cupStage,
  formatShortDate,
  isFinished,
  isLive,
  isUpcoming,
  relativeKickoff,
} from "@/lib/format";
import type { Match } from "@/lib/types";
import styles from "./match-row.module.css";

interface MatchRowProps {
  match: Match;
  now: number;
  /** Position within its section, used to stagger the reveal animation. */
  index: number;
  /** Show the date alongside the kickoff time — off inside day-grouped sections. */
  showDate: boolean;
}

/**
 * One fixture, as a card pinned to the section's timeline: a dot on the rail,
 * then state on the left, the tie in the middle and timing on the right.
 */
export function MatchRow({ match, now, index, showDate }: MatchRowProps) {
  const live = isLive(match);
  const finished = isFinished(match);
  const hasScore = match.score.home !== null && match.score.away !== null;

  // Live fixtures invert to the dark surface so they stand out from the emerald run.
  const surface = live ? "onDark" : "onEmerald";

  // Named on every row: which competition this is, plus the round when the tie
  // is a cup fixture rather than ordinary league football.
  const competition = resolveCompetition(match.competition);
  const tag = [competition.shortName, cupStage(match)].filter(Boolean).join(" · ");

  return (
    <AnimatedListItem index={index} className={styles.item}>
      <span
        className={`${styles.dot} ${live ? styles.dotLive : ""}`}
        // Cycles so the rail reads as a wave rather than one long ramp.
        style={{ "--dot-index": `${index % 9}` } as CSSProperties}
        aria-hidden="true"
      />

      <div className={`${styles.card} ${surface} ${live ? styles.isLive : ""}`}>
        <div className={styles.state}>
          <StatusPill match={match} />
          {showDate ? <span className={styles.date}>{formatShortDate(match.utcDate)}</span> : null}
        </div>

        <div className={styles.center}>
          <div className={styles.tie}>
            <div className={`${styles.team} ${styles.home}`}>
              <span className={styles.teamName}>{match.homeTeam.shortName}</span>
              <Crest
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                tla={match.homeTeam.tla}
                size="sm"
              />
            </div>

            <div className={styles.result}>
              {hasScore ? (
                <span className={`${styles.score} ${finished ? styles.scoreDone : ""} tabular`}>
                  {match.score.home}–{match.score.away}
                </span>
              ) : (
                <span className={styles.versus}>v</span>
              )}
            </div>

            <div className={`${styles.team} ${styles.awayTeam}`}>
              <Crest
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                tla={match.awayTeam.tla}
                size="sm"
              />
              <span className={styles.teamName}>{match.awayTeam.shortName}</span>
            </div>
          </div>

          <ShimmerTag accent={competition.accent}>{tag}</ShimmerTag>
        </div>

        <div className={styles.meta}>
          {isUpcoming(match) ? (
            <span className={styles.relative}>{relativeKickoff(match.utcDate, now)}</span>
          ) : null}
          {match.venue ? (
            <span className={styles.venue} title={match.venue}>
              {match.venue}
            </span>
          ) : null}
        </div>
      </div>
    </AnimatedListItem>
  );
}
