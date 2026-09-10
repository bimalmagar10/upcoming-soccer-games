import type { CSSProperties, ReactNode } from "react";
import styles from "./shimmer-tag.module.css";

interface ShimmerTagProps {
  children: ReactNode;
  /** Competition colour, used to tint the border. */
  accent?: string;
}

/**
 * A label whose border carries a travelling shimmer — Magic UI's ShimmerButton
 * technique, as a non-interactive tag.
 *
 * A conic gradient spins behind the tag while sliding side to side; an opaque
 * backdrop inset by `--cut` covers all of it except a ring at the edge, so only
 * the border appears to catch the light.
 */
export function ShimmerTag({ children, accent }: ShimmerTagProps) {
  return (
    <span
      className={styles.tag}
      style={accent ? ({ "--tag-accent": accent } as CSSProperties) : undefined}
    >
      <span className={styles.sparkArea} aria-hidden="true">
        <span className={styles.spark}>
          <span className={styles.sparkGradient} />
        </span>
      </span>

      <span className={styles.backdrop} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </span>
  );
}
