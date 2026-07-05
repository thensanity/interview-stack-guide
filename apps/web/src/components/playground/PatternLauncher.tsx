"use client";

import { PATTERN_LAUNCHERS, type PlaygroundTab } from "@/lib/playground";

interface PatternLauncherProps {
  onNavigate: (tab: PlaygroundTab, action?: string) => void;
}

export function PatternLauncher({ onNavigate }: PatternLauncherProps) {
  return (
    <div className="pg-panel">
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Click a pattern to jump to the right playground tab and pre-configure a demo.
      </p>
      <div className="grid">
        {PATTERN_LAUNCHERS.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <button
              type="button"
              className="scenario-btn"
              style={{ marginTop: "0.75rem" }}
              onClick={() => onNavigate(p.tab, p.id)}
            >
              Launch →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
