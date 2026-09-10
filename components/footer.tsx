import { localTimeZone } from "@/lib/format";
import type { FeedSource } from "@/lib/types";
import styles from "./footer.module.css";

/** Closing note: where the data comes from and which clock times are shown in. */
export function Footer({ source }: { source: FeedSource }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>
          Fixtures from{" "}
          <a
            className={styles.link}
            href="https://www.football-data.org"
            target="_blank"
            rel="noreferrer noopener"
          >
            football-data.org
          </a>
          . Kickoff times are shown in your own timezone
          <span className={styles.zone}> ({localTimeZone()})</span>.
        </p>

        {source === "demo" ? (
          <p className={styles.note}>
            Running on demo fixtures — set <code className={styles.code}>FOOTBALL_DATA_TOKEN</code> to
            switch to the live feed.
          </p>
        ) : null}
      </div>
    </footer>
  );
}
