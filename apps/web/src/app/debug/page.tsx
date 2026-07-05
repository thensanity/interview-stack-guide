import { fetchHealth } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  let health: Record<string, unknown> = {};
  let scenarios: unknown[] = [];
  let events: unknown[] = [];

  try {
    const [h, s, e] = await Promise.all([
      fetchHealth(),
      fetch(`${API_URL}/api/scenarios`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`${API_URL}/api/events`, { cache: "no-store" }).then((r) => r.json()),
    ]);
    health = h;
    scenarios = s.data ?? [];
    events = e.data ?? [];
  } catch {
    health = { status: "unreachable" };
  }

  return (
    <>
      <h2>Debug Dashboard</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Scenario 8 talking point — inspect health, active scenarios, and recent events during incident demos.
      </p>

      <div className="arch-section">
        <h2>Health</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </div>

      <div className="arch-section">
        <h2>Scenarios ({Array.isArray(scenarios) ? scenarios.length : 0})</h2>
        <pre>{JSON.stringify(scenarios, null, 2)}</pre>
      </div>

      <div className="arch-section">
        <h2>Recent Events</h2>
        <pre>{JSON.stringify(events.slice(0, 10), null, 2)}</pre>
      </div>
    </>
  );
}
