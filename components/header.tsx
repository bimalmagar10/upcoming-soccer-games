"use client";

import { localTimeZone } from "@/lib/format";
import styles from "./header.module.css";

/** Sticky masthead: wordmark and the visitor's local clock. */
export function Header({ now }: { now: number }) {
  const clock = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(now));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top">
          <span className={styles.mark} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor">
              <circle cx="12" cy="12" r="9.25" />
              <path d="M12 6.4l3.6 2.6-1.4 4.2H9.8L8.4 9z" fill="currentColor" stroke="none" />
              <path d="M12 2.75v3.65M4.1 9.4l4.3-.4M19.9 9.4l-4.3-.4M7.4 20.1l2.4-3.9M16.6 20.1l-2.4-3.9" />
            </svg>
          </span>
          <span className={styles.wordmark}>Matchday</span>
        </a>

        <p className={`${styles.clock} tabular`} title={localTimeZone()}>
          {clock}
        </p>
      </div>
    </header>
  );
}
