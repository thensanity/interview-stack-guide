import { ScenarioPanel } from "@/components/ScenarioPanel";
import { EventFeed } from "@/components/EventFeed";

export const dynamic = "force-dynamic";

export default function ScenariosPage() {
  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>Situational Event Simulator</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Trigger real operational scenarios from the interview guide. Watch the live event feed respond on both frontends.
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <EventFeed />
      </div>

      <h3 style={{ marginBottom: "1rem" }}>Interview Scenarios</h3>
      <ScenarioPanel />
    </>
  );
}
