import type { CSSProperties } from "react";
import styles from "./ripple.module.css";

interface RippleProps {
  numCircles?: number;
  /** Diameter of the innermost ring, as a multiple of `--ripple-base`. */
  startScale?: number;
  /** Added to that multiple for each ring outward. */
  scaleStep?: number;
  /** Opacity of the innermost ring; each ring outward loses `OPACITY_STEP`. */
  mainCircleOpacity?: number;
}

const OPACITY_STEP = 0.08;

/**
 * Concentric rings breathing outward behind an element — adapted from Magic UI's
 * Ripple, which sizes its rings in fixed pixels. Here they are multiples of
 * `--ripple-base` (the crest size) instead, so the whole set scales down with
 * the crest on narrow screens rather than spilling out of its column.
 *
 * Purely decorative, so it is hidden from assistive technology.
 */
export function Ripple({
  numCircles = 5,
  startScale = 1.2,
  scaleStep = 0.38,
  mainCircleOpacity = 0.5,
}: RippleProps) {
  return (
    <span className={styles.ripple} aria-hidden="true">
      {Array.from({ length: numCircles }, (_, i) => {
        const size = `calc(var(--ripple-base) * ${(startScale + i * scaleStep).toFixed(3)})`;

        return (
          <span
            key={i}
            className={styles.circle}
            style={
              {
                "--i": i,
                width: size,
                height: size,
                // Rounded, or float arithmetic leaks 0.33999999999999997 into the markup.
                opacity: Math.max(0, mainCircleOpacity - i * OPACITY_STEP).toFixed(2),
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}
