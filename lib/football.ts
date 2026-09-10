import { buildDemoMatches } from "@/lib/demo";
import type { Match, MatchesPayload, MatchStatus, Score, Team } from "@/lib/types";

const API_BASE = "https://api.football-data.org/v4";

/**
 * Upstream responses are cached for a minute in Next's Data Cache. The free tier
 * allows 10 requests/minute in total, so this keeps every visitor served from one
 * shared fetch no matter how often their browser polls.
 */
const REVALIDATE_SECONDS = 60;

const DEFAULT_WINDOW_DAYS = 10;
const MAX_WINDOW_DAYS = 30;
const REQUEST_TIMEOUT_MS = 8_000;

/** Shape of the subset of football-data.org's v4 match payload that we consume. */
interface ApiTeam {
  id?: number | null;
  name?: string | null;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
}

interface ApiMatch {
  id?: number | null;
  utcDate?: string | null;
  status?: string | null;
  matchday?: number | null;
  stage?: string | null;
  venue?: string | null;
  competition?: { code?: string | null; name?: string | null; emblem?: string | null } | null;
  homeTeam?: ApiTeam | null;
  awayTeam?: ApiTeam | null;
  score?: { fullTime?: { home?: number | null; away?: number | null } | null } | null;
}

interface ApiMatchesResponse {
  matches?: ApiMatch[] | null;
}

const KNOWN_STATUSES: readonly MatchStatus[] = [
  "SCHEDULED",
  "TIMED",
  "IN_PLAY",
  "PAUSED",
  "FINISHED",
  "SUSPENDED",
  "POSTPONED",
  "CANCELLED",
  "AWARDED",
];

function normaliseStatus(status: string | null | undefined): MatchStatus {
  const match = KNOWN_STATUSES.find((known) => known === status);
  return match ?? "SCHEDULED";
}

function normaliseTeam(team: ApiTeam | null | undefined, fallbackName: string): Team {
  const name = team?.name?.trim() || fallbackName;

  return {
    id: team?.id ?? 0,
    name,
    shortName: team?.shortName?.trim() || name,
    // A TLA is missing for some lower-profile clubs; derive one so the crest
    // fallback monogram always has something to show.
    tla: team?.tla?.trim() || name.slice(0, 3).toUpperCase(),
    crest: team?.crest?.trim() || null,
  };
}

function normaliseScore(score: ApiMatch["score"]): Score {
  return {
    home: score?.fullTime?.home ?? null,
    away: score?.fullTime?.away ?? null,
  };
}

/**
 * Convert one upstream match, discarding entries too malformed to render
 * (no id or no kickoff time) by returning null.
 */
function normaliseMatch(raw: ApiMatch): Match | null {
  if (typeof raw.id !== "number" || !raw.utcDate) return null;
  if (Number.isNaN(Date.parse(raw.utcDate))) return null;

  return {
    id: raw.id,
    utcDate: raw.utcDate,
    status: normaliseStatus(raw.status),
    matchday: raw.matchday ?? null,
    stage: raw.stage ?? null,
    venue: raw.venue?.trim() || null,
    competition: {
      code: raw.competition?.code?.trim() || "OTHER",
      name: raw.competition?.name?.trim() || "Football",
      emblem: raw.competition?.emblem?.trim() || null,
    },
    homeTeam: normaliseTeam(raw.homeTeam, "Home"),
    awayTeam: normaliseTeam(raw.awayTeam, "Away"),
    score: normaliseScore(raw.score),
  };
}

/** `yyyy-MM-dd` in UTC, the format football-data.org expects for date filters. */
function toApiDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function demoPayload(notice: string | null, now: number): MatchesPayload {
  return {
    matches: buildDemoMatches(now),
    source: "demo",
    fetchedAt: new Date(now).toISOString(),
    notice,
  };
}

export interface FetchOptions {
  /** Size of the forward-looking window, in days. Clamped to 1–30. */
  days?: number;
}

/**
 * Fetch the fixture list for the next `days` days.
 *
 * Never throws: any missing key, upstream outage, or rate-limit response falls
 * back to clearly-labelled demo fixtures so the page always renders something.
 */
export async function fetchUpcomingMatches(options: FetchOptions = {}): Promise<MatchesPayload> {
  const now = Date.now();
  const days = clampDays(options.days ?? DEFAULT_WINDOW_DAYS);
  const token = process.env.FOOTBALL_DATA_TOKEN?.trim();

  if (!token) {
    return demoPayload(
      "Showing demo fixtures. Add a free FOOTBALL_DATA_TOKEN to see live data.",
      now,
    );
  }

  const params = new URLSearchParams({
    dateFrom: toApiDate(new Date(now)),
    dateTo: toApiDate(new Date(now + days * 86_400_000)),
  });

  try {
    const response = await fetch(`${API_BASE}/matches?${params}`, {
      headers: { "X-Auth-Token": token },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return demoPayload(upstreamNotice(response.status, await readErrorMessage(response)), now);
    }

    const body = (await response.json()) as ApiMatchesResponse;
    const matches = (body.matches ?? [])
      .map(normaliseMatch)
      .filter((match): match is Match => match !== null)
      .sort((a, b) => Date.parse(a.utcDate) - Date.parse(b.utcDate));

    if (matches.length === 0) {
      return demoPayload("No fixtures scheduled in this window — showing demo data.", now);
    }

    return { matches, source: "live", fetchedAt: new Date(now).toISOString(), notice: null };
  } catch {
    return demoPayload("Live feed unreachable — showing demo fixtures.", now);
  }
}

function clampDays(days: number): number {
  if (!Number.isFinite(days)) return DEFAULT_WINDOW_DAYS;
  return Math.min(MAX_WINDOW_DAYS, Math.max(1, Math.trunc(days)));
}

/** Longest upstream error text we will repeat back to the visitor. */
const MAX_DETAIL_LENGTH = 120;

/**
 * football-data.org explains failures in a `message` field — "Your API token is
 * invalid." is far more actionable than the status code, so prefer it when present.
 */
async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const body = (await response.json()) as { message?: unknown };
    if (typeof body.message !== "string") return null;

    const message = body.message.trim();
    if (message.length === 0) return null;

    return message.length > MAX_DETAIL_LENGTH
      ? `${message.slice(0, MAX_DETAIL_LENGTH).trimEnd()}…`
      : message;
  } catch {
    return null;
  }
}

function upstreamNotice(status: number, detail: string | null): string {
  if (status === 429) return "Rate limit reached — showing demo fixtures for now.";
  if (detail) return `${detail} Showing demo fixtures.`;
  if (status === 403 || status === 401) return "API key rejected — showing demo fixtures.";
  return `Live feed returned ${status} — showing demo fixtures.`;
}
