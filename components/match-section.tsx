"use client";

import type { CSSProperties } from "react";
import { MatchRow } from "@/components/match-row";
import type { MatchGroup } from "@/lib/grouping";
import styles from "./match-section.module.css";

interface MatchSectionProps {
  group: MatchGroup;
  now: number;
  /** Day-grouped sections already state the date in their heading. */
  showDate: boolean;
}

/** A titled block of fixtures — one competition, or one calendar day. */
export function MatchSection({ group, now, showDate }: MatchSectionProps) {
  const count = group.matches.length;

  return (
    <section
      className={styles.section}
      style={{ "--section-accent": group.accent } as CSSProperties}
      aria-labelledby={`section-${group.key}`}
    >
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.marker} aria-hidden="true" />
          <h3 id={`section-${group.key}`} className={styles.title}>
            {group.title}
          </h3>
          {group.subtitle ? <span className={styles.subtitle}>{group.subtitle}</span> : null}
        </div>

        <span className={`${styles.count} tabular`}>
          {count} {count === 1 ? "match" : "matches"}
        </span>
      </header>

      <ul className={styles.list}>
        {group.matches.map((match, index) => (
          <MatchRow key={match.id} match={match} now={now} index={index} showDate={showDate} />
        ))}
      </ul>
    </section>
  );
}
