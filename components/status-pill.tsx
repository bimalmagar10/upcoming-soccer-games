import { isCalledOff, isFinished, isLive, statusLabel } from "@/lib/format";
import type { Match } from "@/lib/types";
import styles from "./status-pill.module.css";

/** Colour treatment for the match's current state. */
function toneFor(match: Match): string | undefined {
  if (isLive(match)) return styles.live;
  if (isFinished(match)) return styles.done;
  if (isCalledOff(match)) return styles.off;
  return styles.scheduled;
}

/**
 * Compact match-state badge: a clock time for fixtures still to be played, and a
 * word — "Live", "Full time", "Postponed" — for everything else. Only the times
 * get tabular figures, so a column of pills stays aligned.
 */
export function StatusPill({ match }: { match: Match }) {
  const showsTime = match.status === "SCHEDULED" || match.status === "TIMED";
  const className = [styles.pill, toneFor(match), showsTime ? "tabular" : null]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className}>
      {isLive(match) ? <span className={styles.dot} aria-hidden="true" /> : null}
      {statusLabel(match)}
    </span>
  );
}
