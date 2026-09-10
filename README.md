# Matchday

A single-page board of upcoming football fixtures across the world's major
competitions — the Champions League, Premier League, La Liga, Serie A,
Bundesliga, Ligue 1, Copa Libertadores, Brasileirão, Eredivisie, Primeira Liga,
the Championship, the World Cup and the Euros.

Kickoff times are rendered in the visitor's own timezone, the next fixture (or
whatever is live right now) is pulled into an animated spotlight, and the board
refreshes itself while the tab is open.

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

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import it at <https://vercel.com/new> — the framework is detected
   automatically, and no build settings need changing.
3. Add `FOOTBALL_DATA_TOKEN` under **Settings → Environment Variables**, for the
   Production, Preview and Development environments.
4. Deploy.

Without the environment variable the deployment still succeeds and serves demo
fixtures.

## How it is put together

```
app/
  layout.tsx            fonts, metadata, the document shell
  page.tsx              server component; fetches the first payload
  globals.css           design tokens, reset, surface utilities
  api/matches/route.ts  server-side proxy to football-data.org
components/             presentational units, each with a CSS module
  animated-list.tsx     spring entrance for list rows (Magic UI, adapted)
  ripple.tsx            concentric rings behind the spotlight crests (Magic UI)
  shimmer-tag.tsx       competition badge with a travelling border highlight
hooks/
  use-matches.ts        polling, visibility handling, abort on unmount
  use-now.ts            the ticking clock, as an external store
lib/
  competitions.ts       per-competition display metadata
  demo.ts               fallback fixtures, generated relative to now
  football.ts           upstream client, normalisation, graceful degradation
  format.ts             timezone-aware dates, countdowns, status labels
  grouping.ts           bucketing fixtures by competition or by day
  types.ts              the domain model
```

The page is server-rendered per request so the first paint already contains
fixtures, then hydrates and keeps itself current on the client.

## Design

The palette is taken from [greenboard.com](https://www.greenboard.com):
midnight-green (`#003738`) cards on a cream `#eeefd2` ground, with lemon-lime
(`#d8d958`) and emerald (`#4dbd97`) accents and pistachio (`#eeefd3`) type
inside the cards.

Card treatment and list structure follow
[pi.website/blog](https://www.pi.website/blog): a hairline border with a hard,
blur-free offset shadow that steps from `3px` to `5px` on hover, and fixtures
hung off a vertical timeline rail, each pinned by a small square dot that
punches a gap in the line behind it.

Because the page is light but the cards are dark, a single `.onDark` utility
remaps the semantic colour tokens (`--text`, `--border`, …) for anything inside
a card, so components never need to know which ground they are on.

Type is Outfit for the interface and JetBrains Mono for anything numeric, so
countdowns and kickoff times sit on tabular figures and never jitter.

Motion is limited to a slow light sweep across the spotlight, ripple rings
behind the two crests, a shimmer travelling the competition badge borders, a
pulse on live indicators, and a staggered spring entrance on fixture rows — all of it disabled under `prefers-reduced-motion`.

Three motion pieces are adapted from [Magic UI](https://magicui.design):

- **Ripple** keeps the original keyframe (each ring easing between full size
  and 90%, staggered by index) but is centred on a point rather than using
  `inset: 0` with a fading mask, which erased the rings at crest scale. Ring
  diameters are multiples of `--crest-lg` rather than fixed pixels, so the set
  shrinks with the crest instead of spilling out of its column on a phone.
- **AnimatedList** keeps the spring (`stiffness: 350`, `damping: 40`) but holds
  document order and animates on mount. The original reverses its children and
  reveals one per second, which suits a notification feed but would show
  fixtures backwards and leave most of the board blank for minutes.
- **ShimmerButton** becomes the competition badge on each fixture: same spinning
  conic gradient revealed through a `--cut`-wide ring at the border, rendered as
  a non-interactive label rather than a button. `--cut` is set in pixels rather
  than Magic UI's `0.05em`, which at this badge's 0.66rem type resolves to under
  a pixel and makes the shimmer invisible. The competition's accent tints the
  border while the shimmer itself stays cream, so it reads on every card.

### A note on keyframes

`@keyframes` live in the CSS module that uses them, never in `globals.css`.
CSS Modules scope `animation-name`, so a module writing `animation: fadeIn ...`
compiles to a hashed name that will not match a globally-declared `fadeIn` — the
rule is silently inert, with no build error and no console warning. Co-locating
them keeps each module self-contained and the reference resolvable. Two small
keyframes are duplicated across modules for this reason; that is deliberate.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## Notes and limitations

- Domestic cups (Copa del Rey, the FA Cup) are not part of the feed. To add a
  competition your plan covers, give it an entry in `lib/competitions.ts` — that
  is the only file involved; the board picks it up automatically.
- Scores and statuses are delayed by roughly a minute on the free tier. A
  fixture can therefore be past its kickoff while still reported as scheduled;
  the spotlight says "Awaiting the first whistle" rather than counting down
  past zero.
