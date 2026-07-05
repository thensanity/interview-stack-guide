"use client";

import { useEffect, useState } from "react";
import { PlaygroundShell } from "@/components/playground/PlaygroundShell";
import { INTERVIEW_DEMO_SCRIPT } from "@/lib/playground";
import { triggerScenario } from "@/lib/events";

/** Presenter mode — fullscreen auto-demo for live interviews */
export default function PresenterModePage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!started) return;
    const timers = INTERVIEW_DEMO_SCRIPT.map((s, i) =>
      setTimeout(async () => {
        setStep(i + 1);
        setLog((prev) => [...prev, s.label]);
        try {
          await triggerScenario(s.scenario);
        } catch {
          /* API may be offline */
        }
      }, s.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [started]);

  return (
    <div className="presenter-mode">
      <div className="presenter-header">
        <h2>Presenter Mode</h2>
        {!started ? (
          <button type="button" className="scenario-btn" onClick={() => setStarted(true)}>▶ Start Auto-Demo</button>
        ) : (
          <span className="badge badge-green">Step {step}/{INTERVIEW_DEMO_SCRIPT.length}</span>
        )}
        <a href="/playground" className="pg-tab">← Full Playground</a>
      </div>

      {log.length > 0 && (
        <div className="card" style={{ marginBottom: "1rem" }}>
          <strong>Script progress</strong>
          <ul style={{ marginTop: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
            {log.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </div>
      )}

      <PlaygroundShell initialTab="transports" />
    </div>
  );
}
