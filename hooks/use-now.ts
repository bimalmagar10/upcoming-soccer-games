"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

/**
 * A timestamp that advances on an interval, for countdowns and relative labels.
 *
 * The ticking clock is an external store: `initial` — usually the payload's
 * `fetchedAt` — is the server snapshot, so the markup matches during hydration,
 * and the real clock takes over the moment the subscription runs on the client.
 */
export function useNow(initial: number, intervalMs = 1000): number {
  const nowRef = useRef(initial);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const tick = () => {
        nowRef.current = Date.now();
        onStoreChange();
      };

      // Correct the seeded value straight away, then keep it moving.
      tick();
      const id = window.setInterval(tick, intervalMs);

      return () => window.clearInterval(id);
    },
    [intervalMs],
  );

  return useSyncExternalStore(
    subscribe,
    () => nowRef.current,
    () => initial,
  );
}
