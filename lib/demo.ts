import type { Match, MatchStatus, Team } from "@/lib/types";

/**
 * Demo fixtures let the app run — and look right — before an API key exists.
 * Team ids are genuine football-data.org ids so the real crest CDN resolves.
 */
interface TeamSeed {
  id: number;
  name: string;
  shortName: string;
  tla: string;
}

const TEAMS = {
  ars: { id: 57, name: "Arsenal FC", shortName: "Arsenal", tla: "ARS" },
  che: { id: 61, name: "Chelsea FC", shortName: "Chelsea", tla: "CHE" },
  liv: { id: 64, name: "Liverpool FC", shortName: "Liverpool", tla: "LIV" },
  mci: { id: 65, name: "Manchester City FC", shortName: "Man City", tla: "MCI" },
  mun: { id: 66, name: "Manchester United FC", shortName: "Man United", tla: "MUN" },
  tot: { id: 73, name: "Tottenham Hotspur FC", shortName: "Tottenham", tla: "TOT" },
  new: { id: 67, name: "Newcastle United FC", shortName: "Newcastle", tla: "NEW" },
  avl: { id: 58, name: "Aston Villa FC", shortName: "Aston Villa", tla: "AVL" },
  bar: { id: 81, name: "FC Barcelona", shortName: "Barcelona", tla: "BAR" },
  rma: { id: 86, name: "Real Madrid CF", shortName: "Real Madrid", tla: "RMA" },
  atm: { id: 78, name: "Club Atlético de Madrid", shortName: "Atlético", tla: "ATM" },
  sev: { id: 559, name: "Sevilla FC", shortName: "Sevilla", tla: "SEV" },
  vil: { id: 94, name: "Villarreal CF", shortName: "Villarreal", tla: "VIL" },
  ath: { id: 77, name: "Athletic Club", shortName: "Athletic", tla: "ATH" },
  rso: { id: 92, name: "Real Sociedad de Fútbol", shortName: "Real Sociedad", tla: "RSO" },
  bet: { id: 90, name: "Real Betis Balompié", shortName: "Real Betis", tla: "BET" },
  int: { id: 108, name: "FC Internazionale Milano", shortName: "Inter", tla: "INT" },
  mil: { id: 98, name: "AC Milan", shortName: "AC Milan", tla: "MIL" },
  juv: { id: 109, name: "Juventus FC", shortName: "Juventus", tla: "JUV" },
  nap: { id: 113, name: "SSC Napoli", shortName: "Napoli", tla: "NAP" },
  rom: { id: 100, name: "AS Roma", shortName: "Roma", tla: "ROM" },
  fcb: { id: 5, name: "FC Bayern München", shortName: "Bayern", tla: "FCB" },
  bvb: { id: 4, name: "Borussia Dortmund", shortName: "Dortmund", tla: "BVB" },
  b04: { id: 3, name: "Bayer 04 Leverkusen", shortName: "Leverkusen", tla: "B04" },
  rbl: { id: 721, name: "RB Leipzig", shortName: "RB Leipzig", tla: "RBL" },
  psg: { id: 524, name: "Paris Saint-Germain FC", shortName: "PSG", tla: "PSG" },
  mar: { id: 516, name: "Olympique de Marseille", shortName: "Marseille", tla: "OM" },
  mon: { id: 548, name: "AS Monaco FC", shortName: "Monaco", tla: "ASM" },
  lyo: { id: 523, name: "Olympique Lyonnais", shortName: "Lyon", tla: "OL" },
  fla: { id: 1783, name: "CR Flamengo", shortName: "Flamengo", tla: "FLA" },
  pal: { id: 1769, name: "SE Palmeiras", shortName: "Palmeiras", tla: "PAL" },
  cor: { id: 1779, name: "SC Corinthians Paulista", shortName: "Corinthians", tla: "COR" },
  sao: { id: 1776, name: "São Paulo FC", shortName: "São Paulo", tla: "SAO" },
  aja: { id: 678, name: "AFC Ajax", shortName: "Ajax", tla: "AJA" },
  psv: { id: 674, name: "PSV", shortName: "PSV", tla: "PSV" },
  fey: { id: 675, name: "Feyenoord Rotterdam", shortName: "Feyenoord", tla: "FEY" },
  ben: { id: 1903, name: "SL Benfica", shortName: "Benfica", tla: "BEN" },
  por: { id: 503, name: "FC Porto", shortName: "Porto", tla: "POR" },
  spo: { id: 498, name: "Sporting CP", shortName: "Sporting", tla: "SPO" },
} as const satisfies Record<string, TeamSeed>;

type TeamKey = keyof typeof TEAMS;

interface FixtureSeed {
  home: TeamKey;
  away: TeamKey;
  competition: string;
  competitionName: string;
  venue: string;
  /** Hours from "now" at which this fixture kicks off. */
  offsetHours: number;
  matchday: number;
  stage?: string;
  status?: MatchStatus;
  score?: { home: number; away: number };
}

const FIXTURES: readonly FixtureSeed[] = [
  { home: "int", away: "mil", competition: "SA", competitionName: "Serie A", venue: "Stadio Giuseppe Meazza", offsetHours: -0.9, matchday: 12, status: "IN_PLAY", score: { home: 1, away: 1 } },
  { home: "ars", away: "liv", competition: "PL", competitionName: "Premier League", venue: "Emirates Stadium", offsetHours: 0.62, matchday: 14 },
  { home: "rma", away: "atm", competition: "PD", competitionName: "La Liga", venue: "Estadio Santiago Bernabéu", offsetHours: 2.8, matchday: 15 },
  { home: "fcb", away: "bvb", competition: "BL1", competitionName: "Bundesliga", venue: "Allianz Arena", offsetHours: 4.5, matchday: 11 },
  { home: "psg", away: "mar", competition: "FL1", competitionName: "Ligue 1", venue: "Parc des Princes", offsetHours: 6.2, matchday: 13 },
  { home: "bar", away: "psg", competition: "CL", competitionName: "UEFA Champions League", venue: "Estadi Olímpic Lluís Companys", offsetHours: 25, matchday: 5, stage: "LEAGUE_STAGE" },
  { home: "mci", away: "int", competition: "CL", competitionName: "UEFA Champions League", venue: "Etihad Stadium", offsetHours: 25, matchday: 5, stage: "LEAGUE_STAGE" },
  { home: "b04", away: "ben", competition: "CL", competitionName: "UEFA Champions League", venue: "BayArena", offsetHours: 27.5, matchday: 5, stage: "LEAGUE_STAGE" },
  { home: "mun", away: "che", competition: "PL", competitionName: "Premier League", venue: "Old Trafford", offsetHours: 32, matchday: 14 },
  { home: "tot", away: "new", competition: "PL", competitionName: "Premier League", venue: "Tottenham Hotspur Stadium", offsetHours: 34.5, matchday: 14 },
  { home: "sev", away: "bar", competition: "PD", competitionName: "La Liga", venue: "Ramón Sánchez-Pizjuán", offsetHours: 38, matchday: 15 },
  { home: "juv", away: "nap", competition: "SA", competitionName: "Serie A", venue: "Allianz Stadium", offsetHours: 40, matchday: 12 },
  { home: "aja", away: "psv", competition: "DED", competitionName: "Eredivisie", venue: "Johan Cruijff ArenA", offsetHours: 44, matchday: 14 },
  { home: "fla", away: "pal", competition: "BSA", competitionName: "Campeonato Brasileiro Série A", venue: "Estádio do Maracanã", offsetHours: 47, matchday: 33 },
  { home: "liv", away: "mci", competition: "PL", competitionName: "Premier League", venue: "Anfield", offsetHours: 56, matchday: 15 },
  { home: "ath", away: "rso", competition: "PD", competitionName: "La Liga", venue: "San Mamés", offsetHours: 58, matchday: 16 },
  { home: "rbl", away: "b04", competition: "BL1", competitionName: "Bundesliga", venue: "Red Bull Arena", offsetHours: 61, matchday: 12 },
  { home: "por", away: "spo", competition: "PPL", competitionName: "Primeira Liga", venue: "Estádio do Dragão", offsetHours: 64, matchday: 13 },
  { home: "rom", away: "mil", competition: "SA", competitionName: "Serie A", venue: "Stadio Olimpico", offsetHours: 68, matchday: 13 },
  { home: "avl", away: "ars", competition: "PL", competitionName: "Premier League", venue: "Villa Park", offsetHours: 80, matchday: 15 },
  { home: "bar", away: "vil", competition: "PD", competitionName: "La Liga", venue: "Estadi Olímpic Lluís Companys", offsetHours: 82, matchday: 16 },
  { home: "mon", away: "lyo", competition: "FL1", competitionName: "Ligue 1", venue: "Stade Louis II", offsetHours: 86, matchday: 14 },
  { home: "cor", away: "sao", competition: "BSA", competitionName: "Campeonato Brasileiro Série A", venue: "Neo Química Arena", offsetHours: 92, matchday: 34 },
  { home: "fey", away: "aja", competition: "DED", competitionName: "Eredivisie", venue: "De Kuip", offsetHours: 104, matchday: 15 },
  { home: "bvb", away: "rbl", competition: "BL1", competitionName: "Bundesliga", venue: "Signal Iduna Park", offsetHours: 128, matchday: 13 },
  { home: "atm", away: "bet", competition: "PD", competitionName: "La Liga", venue: "Riyadh Air Metropolitano", offsetHours: 150, matchday: 17 },
  { home: "che", away: "tot", competition: "PL", competitionName: "Premier League", venue: "Stamford Bridge", offsetHours: 176, matchday: 16 },
  { home: "nap", away: "juv", competition: "SA", competitionName: "Serie A", venue: "Stadio Diego Armando Maradona", offsetHours: 200, matchday: 14 },
] as const;

const HOUR = 3_600_000;

/**
 * Plausible local kickoff times. Fixtures more than half a day out are snapped
 * onto one of these so demo data does not advertise a 3am Premier League match
 * to whoever happens to be looking.
 */
const KICKOFF_SLOTS: readonly (readonly [number, number])[] = [
  [13, 0],
  [15, 30],
  [18, 0],
  [20, 45],
];

/** Fixtures nearer than this keep their exact offset, which drives the countdown. */
const SNAP_AFTER_HOURS = 12;

function toTeam(seed: TeamSeed): Team {
  return {
    id: seed.id,
    name: seed.name,
    shortName: seed.shortName,
    tla: seed.tla,
    crest: `https://crests.football-data.org/${seed.id}.png`,
  };
}

/**
 * Build the demo fixture list relative to `now`, so the board always shows a
 * live match, an imminent kickoff, and a realistic spread of future fixtures.
 */
export function buildDemoMatches(now: number = Date.now()): Match[] {
  const matches = FIXTURES.map((seed, index) => {
    const home = TEAMS[seed.home];
    const away = TEAMS[seed.away];
    const kickoff = new Date(now + seed.offsetHours * HOUR);

    if (seed.offsetHours >= SNAP_AFTER_HOURS) {
      const slot = KICKOFF_SLOTS[index % KICKOFF_SLOTS.length]!;
      kickoff.setHours(slot[0], slot[1], 0, 0);
    } else {
      // Round to the nearest 5 minutes so demo kickoff times read like real ones.
      kickoff.setSeconds(0, 0);
      kickoff.setMinutes(Math.round(kickoff.getMinutes() / 5) * 5);
    }

    return {
      id: 900_000 + index,
      utcDate: kickoff.toISOString(),
      status: seed.status ?? "TIMED",
      matchday: seed.matchday,
      stage: seed.stage ?? "REGULAR_SEASON",
      venue: seed.venue,
      competition: {
        code: seed.competition,
        name: seed.competitionName,
        emblem: null,
      },
      homeTeam: toTeam(home),
      awayTeam: toTeam(away),
      score: {
        home: seed.score?.home ?? null,
        away: seed.score?.away ?? null,
      },
    } satisfies Match;
  });

  // Snapping to slot times can reorder fixtures, and the board assumes chronological input.
  return matches.sort((a, b) => Date.parse(a.utcDate) - Date.parse(b.utcDate));
}
