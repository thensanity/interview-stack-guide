"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { AppEvent } from "@/lib/events";
import { fetchEvents, eventSeverity } from "@/lib/events";
import { API_URL } from "@/lib/playground";

function wsUrl() {
  return API_URL.replace(/^http/, "ws") + "/api/events/ws";
}

/** WebSocket event hook — interview: compare with SSE in TransportPanel */
export function useEventWebSocket() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const prepend = useCallback((event: AppEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 50));
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const ws = new WebSocket(wsUrl());
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data);
        if (parsed.type === "event") prepend(parsed.data);
        if (parsed.type === "pong") setLastPong(parsed.timestamp);
      } catch {
        /* ignore */
      }
    };
  }, [prepend]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  }, []);

  const ping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "ping" }));
    }
  }, []);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => {});
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { events, connected, lastPong, connect, disconnect, ping, eventSeverity };
}
