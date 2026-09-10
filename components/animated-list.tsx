"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  /** Position within its list, which drives the stagger. */
  index: number;
}

/** Seconds added to the delay for each successive item. */
const STAGGER_SECONDS = 0.06;

/** Beyond this many items the delay stops growing, so long lists never crawl. */
const MAX_STAGGER_STEPS = 8;

/**
 * A list row that springs into place on mount — Magic UI's
 * AnimatedList motion, adapted.
 *
 * Two deliberate departures from the original: it keeps document order (Magic
 * UI reverses, since it is built for notification feeds where the newest item
 * belongs on top), and every row animates on mount rather than waiting on a
 * one-second-per-item timer, which would take minutes to walk a full fixture
 * list and leave most of the board blank in the meantime.
 */
export function AnimatedListItem({ children, className, index }: AnimatedListItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <li className={className}>{children}</li>;
  }

  return (
    <motion.li
      className={className}
      style={{ transformOrigin: "top center" }}
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 40,
        delay: Math.min(index, MAX_STAGGER_STEPS) * STAGGER_SECONDS,
      }}
    >
      {children}
    </motion.li>
  );
}
