"use client";

import type { CSSProperties } from "react";
import type { CompetitionMeta } from "@/lib/competitions";
import type { GroupMode } from "@/lib/grouping";
import styles from "./filter-bar.module.css";

interface FilterBarProps {
  /** Competitions actually present in the current feed. */
  competitions: readonly CompetitionMeta[];
  /** Selected competition code, or null for "all competitions". */
  selected: string | null;
  onSelect: (code: string | null) => void;
  mode: GroupMode;
  onModeChange: (mode: GroupMode) => void;
}

const MODES: readonly { value: GroupMode; label: string }[] = [
  { value: "league", label: "By league" },
  { value: "day", label: "By day" },
];

/** Competition chips plus the league/day grouping switch. */
export function FilterBar({ competitions, selected, onSelect, mode, onModeChange }: FilterBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.chips} role="group" aria-label="Filter by competition">
        <button
          type="button"
          className={styles.chip}
          aria-pressed={selected === null}
          onClick={() => onSelect(null)}
        >
          All
        </button>

        {competitions.map((competition) => (
          <button
            key={competition.code}
            type="button"
            className={styles.chip}
            style={{ "--chip-accent": competition.accent } as CSSProperties}
            aria-pressed={selected === competition.code}
            onClick={() => onSelect(selected === competition.code ? null : competition.code)}
          >
            <span className={styles.chipDot} aria-hidden="true" />
            {competition.shortName}
          </button>
        ))}
      </div>

      <div className={styles.modes} role="group" aria-label="Group fixtures">
        {MODES.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.mode}
            aria-pressed={mode === option.value}
            onClick={() => onModeChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
