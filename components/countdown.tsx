"use client";

import { countdownTo } from "@/lib/format";
import styles from "./countdown.module.css";

interface CountdownProps {
  /** ISO-8601 kickoff instant. */
  target: string;
  /** Current time, supplied by the parent so one clock drives the whole page. */
  now: number;
}

interface Unit {
  label: string;
  value: number;
  /** Days are dropped once the fixture is inside 24 hours. */
  optional?: boolean;
}

/**
 * Ticking time-to-kickoff, in tabular numerals so the digits never shift.
 * Each cell is keyed by its value, which replays the flip animation on change.
 */
export function Countdown({ target, now }: CountdownProps) {
  const { days, hours, minutes, seconds, total } = countdownTo(target, now);

  if (total <= 0) {
    return <p className={styles.underway}>Kicking off</p>;
  }

  const units: Unit[] = [
    { label: days === 1 ? "day" : "days", value: days, optional: true },
    { label: "hrs", value: hours },
    { label: "min", value: minutes },
    { label: "sec", value: seconds },
  ];

  const visible = units.filter((unit) => !unit.optional || unit.value > 0);

  return (
    <div className={styles.grid} role="timer" aria-live="off">
      <span className="srOnly">
        Kickoff in {days} days, {hours} hours, {minutes} minutes
      </span>

      {visible.map((unit) => (
        <div key={unit.label} className={styles.cell} aria-hidden="true">
          <span key={unit.value} className={`${styles.value} tabular`}>
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className={styles.label}>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
