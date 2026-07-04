export interface AppEvent {
  id: string;
  type: string;
  category: "domain" | "operational" | "scenario";
  message: string;
  payload?: Record<string, unknown>;
  scenarioId?: string;
  timestamp: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  interviewScenario: string;
  durationMs: number;
  active: boolean;
  expiresAt: number | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function fetchEvents(): Promise<AppEvent[]> {
  const res = await fetch(`${API_URL}/api/events`, { cache: "no-store" });
  const json = await res.json();
  return json.data;
}

export async function fetchScenarios(): Promise<Scenario[]> {
  const res = await fetch(`${API_URL}/api/scenarios`, { cache: "no-store" });
  const json = await res.json();
  return json.data;
}

export async function triggerScenario(id: string): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${API_URL}/api/scenarios/${id}/trigger`, { method: "POST" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to trigger scenario");
  return json.data;
}

export function getEventStreamUrl(): string {
  return `${API_URL}/api/events/stream`;
}

/** Retry with exponential backoff — interview: resilience pattern */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 500
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export function eventSeverity(type: string): "info" | "warn" | "error" | "success" {
  if (type.includes("ERROR") || type === "RATE_LIMITED" || type === "AUTH_REQUIRED") return "error";
  if (type.includes("DEGRADED") || type === "DB_SLOW" || type === "TRAFFIC_SPIKE") return "warn";
  if (type.includes("RECOVERED") || type.includes("COMPLETED") || type.includes("CREATED")) return "success";
  return "info";
}
