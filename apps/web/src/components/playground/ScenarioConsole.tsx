"use client";

import { useEffect, useState } from "react";
import { ScenarioPanel } from "@/components/ScenarioPanel";
import { triggerScenario } from "@/lib/events";
import { INTERVIEW_DEMO_SCRIPT } from "@/lib/playground";

export function ScenarioConsole() {
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!demoRunning) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const step of INTERVIEW_DEMO_SCRIPT) {
      timers.push(
        setTimeout(async () => {
          setDemoStep(step.label);
          setLog((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${step.label}`]);
          try {
            await triggerScenario(step.scenario);
          } catch (e) {
            setLog((prev) => [...prev, `Error: ${e instanceof Error ? e.message : "failed"}`]);
          }
        }, step.delay)
      );
    }
    timers.push(setTimeout(() => {
      setDemoRunning(false);
      setDemoStep(null);
      setLog((prev) => [...prev, "Demo script complete"]);
    }, 28000));
    return () => timers.forEach(clearTimeout);
  }, [demoRunning]);

  return (
    <div className="pg-panel">
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Interview Demo Script</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0.5rem 0 1rem" }}>
          One-click 28s walkthrough: traffic spike → db slow → db error → recover
        </p>
        <button
          type="button"
          className="scenario-btn"
          disabled={demoRunning}
          onClick={() => { setLog([]); setDemoRunning(true); }}
        >
          {demoRunning ? `Running… ${demoStep ?? ""}` : "▶ Run Interview Demo"}
        </button>
        {log.length > 0 && (
          <pre style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--muted)" }}>{log.join("\n")}</pre>
        )}
      </div>

      <h3 style={{ marginBottom: "1rem" }}>All Scenarios</h3>
      <ScenarioPanel />
    </div>
  );
}
