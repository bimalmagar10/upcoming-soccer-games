import type { Match } from "@/lib/types";

/** Presentation metadata for a competition we surface on the board. */
export interface CompetitionMeta {
  code: string;
  name: string;
  /** Compact label for filter chips on narrow screens. */
  shortName: string;
  country: string;
  /** Accent colour used for the section rule and chip highlight. */
  accent: string;
  /** Lower sorts first, so the marquee leagues lead the board. */
  rank: number;
}

/**
 * Competitions we style explicitly, ordered by how prominently they should
 * appear on the board. Which of them actually carry fixtures depends on the
 * football-data.org plan the key belongs to; anything the API returns that is
 * not listed here still renders, via `resolveCompetition`'s neutral fallback.
 */
export const COMPETITIONS: readonly CompetitionMeta[] = [
  { code: "CL", name: "UEFA Champions League", shortName: "Champions Lg", country: "Europe", accent: "#4dbd97", rank: 0 },
  { code: "PL", name: "Premier League", shortName: "Premier Lg", country: "England", accent: "#d8d958", rank: 1 },
  { code: "PD", name: "La Liga", shortName: "La Liga", country: "Spain", accent: "#f0a35e", rank: 2 },
  { code: "SA", name: "Serie A", shortName: "Serie A", country: "Italy", accent: "#68b7e8", rank: 3 },
  { code: "BL1", name: "Bundesliga", shortName: "Bundesliga", country: "Germany", accent: "#e8746a", rank: 4 },
  { code: "FL1", name: "Ligue 1", shortName: "Ligue 1", country: "France", accent: "#9d8cf0", rank: 5 },
  { code: "CLI", name: "Copa Libertadores", shortName: "Libertadores", country: "South America", accent: "#e0899f", rank: 6 },
  { code: "BSA", name: "Brasileirão Série A", shortName: "Brasileirão", country: "Brazil", accent: "#5cc98a", rank: 7 },
  { code: "DED", name: "Eredivisie", shortName: "Eredivisie", country: "Netherlands", accent: "#f08a5e", rank: 8 },
  { code: "PPL", name: "Primeira Liga", shortName: "Primeira Lg", country: "Portugal", accent: "#7fd4c1", rank: 9 },
  { code: "ELC", name: "EFL Championship", shortName: "Championship", country: "England", accent: "#b8c46a", rank: 10 },
  { code: "WC", name: "FIFA World Cup", shortName: "World Cup", country: "International", accent: "#e8c95e", rank: 11 },
  { code: "EC", name: "UEFA European Championship", shortName: "Euros", country: "Europe", accent: "#8fb8f0", rank: 12 },
] as const;

const BY_CODE = new Map(COMPETITIONS.map((c) => [c.code, c]));

const FALLBACK_ACCENT = "#9fb3ad";

/**
 * Look up presentation metadata for a match's competition, synthesising a
 * neutral entry for competitions we have not catalogued.
 */
export function resolveCompetition(competition: Match["competition"]): CompetitionMeta {
  const known = BY_CODE.get(competition.code);
  if (known) return known;

  return {
    code: competition.code,
    name: competition.name,
    shortName: competition.name,
    country: "",
    accent: FALLBACK_ACCENT,
    rank: COMPETITIONS.length,
  };
}
