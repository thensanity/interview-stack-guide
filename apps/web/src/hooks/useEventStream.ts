"use client";

import { useEffect, useState, useCallback } from "react";
import type { AppEvent } from "@/lib/events";
import { fetchEvents, getEventStreamUrl, eventSeverity } from "@/lib/events";

/** SSE hook — real-time situational events (interview: compare with WebSockets, polling) */
export function useEventStream() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const prepend = useCallback((event: AppEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => {});

    const source = new EventSource(getEventStreamUrl());
    source.onopen = () => setConnected(true);
    source.onmessage = (e) => {
      try {
        prepend(JSON.parse(e.data));
      } catch {
        /* ignore parse errors */
      }
    };
    source.onerror = () => setConnected(false);

    return () => source.close();
  }, [prepend]);

  return { events, connected, eventSeverity };
}
