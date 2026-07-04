"use client";

import { useEventStream } from "@/hooks/useEventStream";

export function EventFeed() {
  const { events, connected, eventSeverity } = useEventStream();

  return (
    <div className="card">
      <h3>
        Live Event Feed{" "}
        <span className={`badge ${connected ? "badge-green" : "badge-purple"}`}>
          {connected ? "SSE connected" : "disconnected"}
        </span>
      </h3>
      <div className="event-feed">
        {events.length === 0 && <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Waiting for events...</p>}
        {events.map((e) => (
          <div key={e.id} className={`event-item event-${eventSeverity(e.type)}`}>
            <span className="event-type">{e.type}</span>
            <span className="event-msg">{e.message}</span>
            <span className="event-time">{new Date(e.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
