"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/playground";

export interface SystemHealth {
  status: string;
  provider: string;
  deployTarget: string;
  activeScenarios?: string[];
  cache?: boolean;
  auth?: boolean;
}

export interface MetricsSummary {
  requestCount: number;
  raw: string;
}

export function useSystemStatus(pollMs = 5000) {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [hRes, mRes] = await Promise.all([
        fetch(`${API_URL}/health`, { cache: "no-store" }),
        fetch(`${API_URL}/metrics`, { cache: "no-store" }),
      ]);
      if (hRes.ok) setHealth(await hRes.json());
      if (mRes.ok) {
        const raw = await mRes.text();
        const match = raw.match(/http_requests_total\{[^}]*\} (\d+)/g);
        const requestCount = match
          ? match.reduce((sum, line) => sum + parseInt(line.split(" ").pop() ?? "0", 10), 0)
          : 0;
        setMetrics({ requestCount, raw });
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "API unreachable");
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return { health, metrics, error, refresh };
}
