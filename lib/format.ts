import type { Match, MatchStatus } from "@/lib/types";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Statuses where the ball is actually rolling. */
const LIVE_STATUSES = new Set<MatchStatus>(["IN_PLAY", "PAUSED"]);

/** Statuses that mean the fixture will not be played as listed. */
const OFF_STATUSES = new Set<MatchStatus>(["POSTPONED", "CANCELLED", "SUSPENDED"]);

export function isLive(match: Match): boolean {
  return LIVE_STATUSES.has(match.status);
}

export function isFinished(match: Match): boolean {
  return match.status === "FINISHED" || match.status === "AWARDED";
}

export function isCalledOff(match: Match): boolean {
  return OFF_STATUSES.has(match.status);
}

/** True when the fixture is still to be played and has not been called off. */
export function isUpcoming(match: Match): boolean {
  return !isLive(match) && !isFinished(match) && !isCalledOff(match);
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Total milliseconds remaining, clamped at zero. */
  total: number;
}

/** Break the gap between `from` and `target` into calendar-free countdown units. */
export function countdownTo(target: string | number | Date, from: number): CountdownParts {
  const total = Math.max(0, new Date(target).getTime() - from);

  return {
    days: Math.floor(total / DAY),
    hours: Math.floor((total % DAY) / HOUR),
    minutes: Math.floor((total % HOUR) / MINUTE),
    seconds: Math.floor((total % MINUTE) / 1000),
    total,
  };
}

/**
 * Short, human relative label: "in 2h 15m", "in 4 days", "kicking off".
 * Deliberately coarse — the precise clock lives in the countdown component.
 */
export function relativeKickoff(utcDate: string, now: number): string {
  const { days, hours, minutes, total } = countdownTo(utcDate, now);

  if (total <= 0) return "kicking off";
  if (days >= 2) return `in ${days} days`;
  if (days === 1) return hours > 0 ? `in 1d ${hours}h` : "in 1 day";
  if (hours >= 1) return minutes > 0 ? `in ${hours}h ${minutes}m` : `in ${hours}h`;
  if (minutes >= 1) return `in ${minutes}m`;
  return "in under a minute";
}

/**
 * Formatters are created lazily and cached: `Intl` constructors are expensive
 * and these run on every row of a long fixture list.
 */
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatter(key: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const cached = formatterCache.get(key);
  if (cached) return cached;

  const created = new Intl.DateTimeFormat(undefined, options);
  formatterCache.set(key, created);
  return created;
}

/** Kickoff clock time in the visitor's own timezone, e.g. "20:00" or "8:00 PM". */
export function formatKickoffTime(utcDate: string): string {
  return formatter("time", { hour: "numeric", minute: "2-digit" }).format(new Date(utcDate));
}

/** e.g. "Sat 14 Mar" — used for fixture rows beyond today. */
export function formatShortDate(utcDate: string): string {
  return formatter("shortDate", { weekday: "short", day: "numeric", month: "short" }).format(
    new Date(utcDate),
  );
}

/** e.g. "Saturday, 14 March" — used for day-group headings. */
export function formatLongDate(utcDate: string): string {
  return formatter("longDate", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(utcDate),
  );
}

/** The visitor's IANA timezone, e.g. "America/New_York". */
export function localTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Local calendar-day key (`YYYY-MM-DD`) for grouping. Built from local date parts
 * rather than `toISOString`, which would bucket by UTC and split evening fixtures
 * into the wrong day for western timezones.
 */
export function localDayKey(utcDate: string): string {
  const d = new Date(utcDate);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** "Today" / "Tomorrow" / weekday-and-date, relative to the visitor's clock. */
export function dayLabel(utcDate: string, now: number): string {
  const today = localDayKey(new Date(now).toISOString());
  const tomorrow = localDayKey(new Date(now + DAY).toISOString());
  const key = localDayKey(utcDate);

  if (key === today) return "Today";
  if (key === tomorrow) return "Tomorrow";
  return formatLongDate(utcDate);
}

/** Compact status label for the pill on each fixture row. */
export function statusLabel(match: Match): string {
  switch (match.status) {
    case "IN_PLAY":
      return "Live";
    case "PAUSED":
      return "Half time";
    case "FINISHED":
    case "AWARDED":
      return "Full time";
    case "POSTPONED":
      return "Postponed";
    case "CANCELLED":
      return "Cancelled";
    case "SUSPENDED":
      return "Suspended";
    default:
      return formatKickoffTime(match.utcDate);
  }
}

/**
 * Humanised stage for anything that is not ordinary league football —
 * "Quarter Finals", "League Stage" — or null for a regular-season fixture.
 */
export function cupStage(match: Match): string | null {
  if (!match.stage || match.stage === "REGULAR_SEASON") return null;

  return match.stage
    .toLowerCase()
    .split("_")
    .map((word) => (word.length > 0 ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

/** "Matchday 12", a knockout stage name, or null when neither applies. */
export function stageLabel(match: Match): string | null {
  return cupStage(match) ?? (match.matchday === null ? null : `Matchday ${match.matchday}`);
}
