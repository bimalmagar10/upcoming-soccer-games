/** Match lifecycle states, mirroring the football-data.org v4 `status` enum. */
export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "SUSPENDED"
  | "POSTPONED"
  | "CANCELLED"
  | "AWARDED";

export interface Team {
  id: number;
  name: string;
  /** Short display name, e.g. "Man City". Falls back to `name` upstream. */
  shortName: string;
  /** Three-letter abbreviation used for the crest fallback monogram. */
  tla: string;
  crest: string | null;
}

export interface MatchCompetition {
  /** Stable short code, e.g. "PL", "PD", "CL". */
  code: string;
  name: string;
  emblem: string | null;
}

export interface Score {
  home: number | null;
  away: number | null;
}

export interface Match {
  id: number;
  /** ISO-8601 kickoff instant in UTC. Rendered in the visitor's local zone. */
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  stage: string | null;
  venue: string | null;
  competition: MatchCompetition;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
}

/** Where the payload came from — surfaced in the UI so demo data is never mistaken for live data. */
export type FeedSource = "live" | "demo";

export interface MatchesPayload {
  matches: Match[];
  source: FeedSource;
  /** ISO-8601 instant the payload was assembled. */
  fetchedAt: string;
  /** Human-readable explanation when `source` falls back to "demo". */
  notice: string | null;
}
