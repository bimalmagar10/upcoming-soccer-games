# Matchday

A single-page board of upcoming football fixtures across the world's major
competitions — the Champions League, Premier League, La Liga, Serie A,
Bundesliga, Ligue 1, Copa Libertadores, Brasileirão, Eredivisie, Primeira Liga,
the Championship, the World Cup and the Euros.

Kickoff times are rendered in the visitor's own timezone, the next fixture (or
whatever is live right now) is pulled into an animated spotlight, and the board
refreshes itself while the tab is open.

**Live:** <https://matchday-soccer-game.vercel.app/>

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — see "Live data" below
npm run dev
```

Open <http://localhost:3000>.

The app runs immediately without any configuration: with no API key it serves a
clearly-labelled set of demo fixtures, so nothing is ever a blank page.

## Live data

Fixtures come from [football-data.org](https://www.football-data.org). Which
competitions carry fixtures depends on the plan your key belongs to. The
competitions listed above are styled explicitly in `lib/competitions.ts`;
anything else the API returns still renders, with a neutral accent.

1. Register for a free key at <https://www.football-data.org/client/register>.
2. Put it in `.env.local`:

   ```
   FOOTBALL_DATA_TOKEN=your_key_here
   ```

3. Restart the dev server.

The key is only ever read on the server. The browser talks to this app's own
`/api/matches` route, never to football-data.org directly, so the key is not
exposed to clients.

### Staying inside the rate limit

The free tier allows **10 requests per minute in total**, not per visitor. Two
things keep the app comfortably under it:

- The upstream request is cached in Next's Data Cache for 60 seconds, so any
  number of concurrent visitors collapse into one call per minute.
- The browser polls once a minute and stops entirely while the tab is hidden,
  catching up as soon as it becomes visible again.

If the limit is hit anyway, or the API is unreachable, the board falls back to
demo fixtures with a visible notice rather than erroring.
