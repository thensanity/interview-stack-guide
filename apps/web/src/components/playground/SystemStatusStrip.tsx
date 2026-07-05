"use client";

import { useSystemStatus } from "@/hooks/useSystemStatus";

export function SystemStatusStrip() {
  const { health, metrics, error, refresh } = useSystemStatus();

  return (
    <div className="status-bar playground-status">
      <div><span>API: </span><strong style={{ color: health?.status === "ok" ? "var(--success)" : "#f59e0b" }}>{health?.status ?? error ?? "…"}</strong></div>
      <div><span>DB: </span><strong>{health?.provider ?? "—"}</strong></div>
      <div><span>Deploy: </span><strong>{health?.deployTarget ?? "—"}</strong></div>
      <div><span>Cache: </span><strong>{health?.cache ? "Redis ON" : "off"}</strong></div>
      <div><span>Auth enforce: </span><strong>{health?.auth ? "ON" : "off"}</strong></div>
      <div><span>Scenarios: </span><strong>{health?.activeScenarios?.length ? health.activeScenarios.join(", ") : "none"}</strong></div>
      <div><span>Requests: </span><strong>{metrics?.requestCount ?? 0}</strong></div>
      <button type="button" className="pg-btn-sm" onClick={() => refresh()}>Refresh</button>
    </div>
  );
}
