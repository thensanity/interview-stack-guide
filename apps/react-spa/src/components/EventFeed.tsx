import { useEventStream } from "../hooks/useEventStream";

export default function EventFeed() {
  const { events, connected, eventSeverity } = useEventStream();

  return (
    <div className="card">
      <h3>
        Live Event Feed{" "}
        <span className="badge badge-react">{connected ? "SSE connected" : "disconnected"}</span>
      </h3>
      <div className="event-feed">
        {events.length === 0 && <p className="loading">Waiting for events...</p>}
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
