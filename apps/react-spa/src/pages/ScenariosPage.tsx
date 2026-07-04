import EventFeed from "../components/EventFeed";
import ScenarioPanel from "../components/ScenarioPanel";

export default function ScenariosPage() {
  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}>Situational Event Simulator (React CSR)</h2>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Same scenarios as Next.js — compare how CSR handles SSE, errors, and retries client-side.
      </p>
      <div style={{ marginBottom: "2rem" }}><EventFeed /></div>
      <h3 style={{ marginBottom: "1rem" }}>Interview Scenarios</h3>
      <ScenarioPanel />
    </>
  );
}
