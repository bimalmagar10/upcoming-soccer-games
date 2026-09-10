"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MatchesPayload } from "@/lib/types";

const DEFAULT_POLL_MS = 60_000;

/**
 * Keeps the fixture board current.
 *
 * Polls the internal API route on an interval, pausing while the tab is hidden
 * and catching up as soon as it is visible again — so a backgrounded tab costs
 * nothing and a returning visitor never reads a stale scoreline.
 *
 * A failed poll is deliberately silent: the previous payload stays on screen,
 * which is friendlier than swapping a working board for an error. Problems the
 * server already knows about arrive as `payload.notice` instead.
 */
export function useMatches(initial: MatchesPayload, pollMs = DEFAULT_POLL_MS): MatchesPayload {
  const [payload, setPayload] = useState(initial);

  // Tracks the in-flight request so a new one can supersede it.
  const controllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("/api/matches", {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) return;

      setPayload((await response.json()) as MatchesPayload);
    } catch {
      // Aborts are our own doing; network failures keep the last good payload.
    }
  }, []);

  useEffect(() => {
    let intervalId = 0;

    const start = () => {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(() => void refresh(), pollMs);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        window.clearInterval(intervalId);
        return;
      }

      void refresh();
      start();
    };

    if (!document.hidden) start();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("online", handleVisibility);
      controllerRef.current?.abort();
    };
  }, [pollMs, refresh]);

  return payload;
}
