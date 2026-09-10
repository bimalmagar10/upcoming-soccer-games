"use client";

import { useState } from "react";
import styles from "./crest.module.css";

interface CrestProps {
  src: string | null;
  /** Full club name, used as the image's accessible label. */
  alt: string;
  /** Three-letter abbreviation shown when no crest image is available. */
  tla: string;
  size?: "sm" | "md" | "lg";
}

/**
 * A club crest that degrades to a lettered monogram.
 *
 * Crest URLs come from a third-party CDN and occasionally 404, so a broken image
 * icon is a real possibility — the monogram keeps every row looking deliberate.
 */
export function Crest({ src, alt, tla, size = "md" }: CrestProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = src === null || failedSrc === src;

  if (showFallback) {
    return (
      <span className={`${styles.crest} ${styles[size]} ${styles.monogram}`} role="img" aria-label={alt}>
        {tla.slice(0, 3)}
      </span>
    );
  }

  return (
    <span className={`${styles.crest} ${styles[size]}`}>
      {/* Crests are ~4KB third-party icons rendered at 28-76px; next/image would add
          a remote-pattern config and per-image optimisation cost for no benefit. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={styles.image}
        onError={() => setFailedSrc(src)}
      />
    </span>
  );
}
