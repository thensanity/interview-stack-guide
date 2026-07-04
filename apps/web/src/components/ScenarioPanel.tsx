"use client";

import { useEffect, useState } from "react";
import { fetchScenarios, triggerScenario, type Scenario } from "@/lib/events";

export function ScenarioPanel() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  function load() {
    fetchScenarios().then(setScenarios).catch(() => setStatus("Could not load scenarios — is API running?"));
  }

  useEffect(() => { load(); }, []);

  async function handleTrigger(id: string) {
    setLoading(id);
    setStatus(null);
    try {
      const result = await triggerScenario(id);
      setStatus(result.message);
      load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Trigger failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="grid">
        {scenarios.map((s) => (
          <div key={s.id} className="card" style={s.active ? { borderColor: "#f59e0b" } : undefined}>
            <h3>{s.name} {s.active && <span className="badge badge-green">ACTIVE</span>}</h3>
            <p>{s.description}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>{s.interviewScenario}</p>
            <button
              className="scenario-btn"
              onClick={() => handleTrigger(s.id)}
              disabled={loading === s.id}
              style={{ marginTop: "0.75rem" }}
            >
              {loading === s.id ? "Triggering..." : s.id === "recover" ? "Recover All" : "Trigger Scenario"}
            </button>
          </div>
        ))}
      </div>
      {status && <p style={{ marginTop: "1rem", color: "var(--success)", fontSize: "0.9rem" }}>{status}</p>}
    </div>
  );
}
