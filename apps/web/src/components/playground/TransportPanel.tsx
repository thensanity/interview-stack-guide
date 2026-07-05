"use client";

import { useEventStream } from "@/hooks/useEventStream";
import { useEventWebSocket } from "@/hooks/useEventWebSocket";

function EventList({ events, severity }: { events: ReturnType<typeof useEventStream>["events"]; severity: (t: string) => string }) {
  return (
    <div className="event-feed" style={{ maxHeight: 220 }}>
      {events.length === 0 && <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No events yet</p>}
      {events.map((e) => (
        <div key={e.id} className={`event-item event-${severity(e.type)}`}>
          <span className="event-type">{e.type}</span>
          <span className="event-msg">{e.message}</span>
          <span className="event-time">{new Date(e.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
}

export function TransportPanel() {
  const sse = useEventStream();
  const ws = useEventWebSocket();

  return (
    <div className="pg-panel">
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Side-by-side: SSE is server→client only. WebSocket supports bidirectional ping/pong.
      </p>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <h3>
            SSE <span className={`badge ${sse.connected ? "badge-green" : "badge-purple"}`}>{sse.connected ? "connected" : "off"}</span>
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>GET /api/events/stream</p>
          <EventList events={sse.events} severity={sse.eventSeverity} />
        </div>
        <div className="card">
          <h3>
            WebSocket <span className={`badge ${ws.connected ? "badge-green" : "badge-purple"}`}>{ws.connected ? "connected" : "off"}</span>
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>ws://…/api/events/ws</p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <button type="button" className="pg-btn-sm" onClick={ws.ping}>Ping</button>
            <button type="button" className="pg-btn-sm" onClick={ws.connect}>Reconnect</button>
            {ws.lastPong && <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Pong: {ws.lastPong}</span>}
          </div>
          <EventList events={ws.events} severity={ws.eventSeverity} />
        </div>
      </div>
    </div>
  );
}
